import React, { createContext, useContext, useEffect, useState } from 'react';
import { STAFF, TIMETABLE as SEED_TIMETABLE } from '../data/seedData';
import { firebaseDb, hasFirebaseConfig } from '../config/firebase';
import {
  loadRatings,
  loadTimetable,
  saveRatings,
  saveTimetable,
} from '../utils/storage';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [timetable, setTimetable] = useState(SEED_TIMETABLE);
  const [ratings, setRatings] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (hasFirebaseConfig() && firebaseDb) {
      const assignmentsQuery = query(collection(firebaseDb, 'assignments'), orderBy('createdAt', 'desc'));
      const ratingsQuery = query(collection(firebaseDb, 'ratings'), orderBy('updatedAt', 'desc'));

      let assignmentsLoaded = false;
      let ratingsLoaded = false;

      const markLoaded = () => {
        if (assignmentsLoaded && ratingsLoaded) {
          setLoaded(true);
        }
      };

      const unsubscribeAssignments = onSnapshot(assignmentsQuery, (snapshot) => {
        const remoteAssignments = snapshot.docs.map(item => ({
          id: item.id,
          type: 'Lecture',
          ...item.data(),
        }));

        setTimetable(remoteAssignments.length > 0 ? remoteAssignments : SEED_TIMETABLE);
        assignmentsLoaded = true;
        markLoaded();
      });

      const unsubscribeRatings = onSnapshot(ratingsQuery, (snapshot) => {
        const remoteRatings = snapshot.docs.map(item => ({
          id: item.id,
          ...item.data(),
          createdAt: item.data().createdAt?.toDate?.()?.toISOString?.() || item.data().createdAt || new Date().toISOString(),
          updatedAt: item.data().updatedAt?.toDate?.()?.toISOString?.() || item.data().updatedAt || new Date().toISOString(),
        }));

        setRatings(remoteRatings);
        ratingsLoaded = true;
        markLoaded();
      });

      return () => {
        unsubscribeAssignments();
        unsubscribeRatings();
      };
    }

    (async () => {
      const savedTimetable = await loadTimetable([]);
      const savedRatings = await loadRatings();

      setTimetable(Array.isArray(savedTimetable) && savedTimetable.length > 0 ? savedTimetable : SEED_TIMETABLE);
      setRatings(Array.isArray(savedRatings) ? savedRatings : []);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (hasFirebaseConfig()) return;
    if (!loaded) return;
    saveTimetable(timetable);
  }, [loaded, timetable]);

  useEffect(() => {
    if (hasFirebaseConfig()) return;
    if (!loaded) return;
    saveRatings(ratings);
  }, [loaded, ratings]);

  const addTimetableSlot = async (slot) => {
    const newSlot = {
      id: `slot-${Date.now()}`,
      type: 'Lecture',
      createdAt: new Date().toISOString(),
      ...slot,
    };

    if (hasFirebaseConfig() && firebaseDb) {
      const { id, createdAt, ...payload } = newSlot;
      await setDoc(doc(firebaseDb, 'assignments', newSlot.id), {
        ...payload,
        createdAt: serverTimestamp(),
      });
      return newSlot;
    }

    setTimetable(prev => [newSlot, ...prev]);
    return newSlot;
  };

  const removeTimetableSlot = async (slotId) => {
    if (hasFirebaseConfig() && firebaseDb) {
      await deleteDoc(doc(firebaseDb, 'assignments', slotId));
      return;
    }

    setTimetable(prev => prev.filter(slot => (slot.id || `${slot.classId}-${slot.courseId}-${slot.lecturerId}-${slot.day}-${slot.time}`) !== slotId));
  };

  const saveRating = async (rating) => {
    const lecturer = STAFF.find(member => member.id === rating.lecturerId);
    const entryId = `${rating.studentId}_${rating.lecturerId}`;
    const entry = {
      id: entryId,
      lecturerName: lecturer?.name || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...rating,
    };

    if (hasFirebaseConfig() && firebaseDb) {
      const { id, createdAt, updatedAt, ...payload } = entry;
      await setDoc(doc(firebaseDb, 'ratings', entryId), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      return entry;
    }

    setRatings(prev => {
      const remaining = prev.filter(item => !(item.studentId === entry.studentId && item.lecturerId === entry.lecturerId));
      return [entry, ...remaining];
    });
    return entry;
  };

  const deleteRating = async (ratingId) => {
    if (!ratingId) return;

    if (hasFirebaseConfig() && firebaseDb) {
      await deleteDoc(doc(firebaseDb, 'ratings', ratingId));
      return;
    }

    setRatings(prev => prev.filter(item => item.id !== ratingId));
  };

  return (
    <AppDataContext.Provider
      value={{
        loaded,
        ratings,
        timetable,
        addTimetableSlot,
        removeTimetableSlot,
        saveRating,
        deleteRating,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export const useAppData = () => useContext(AppDataContext);
