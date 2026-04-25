import React, { createContext, useContext, useState, useEffect } from 'react';
import { REPORTS } from '../data/seedData';
import { firebaseDb, hasFirebaseConfig } from '../config/firebase';
import { FIRESTORE_COLLECTIONS } from '../services/firestoreCollections';
import { saveReports, loadReports } from '../utils/storage';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

const ReportsContext = createContext(null);

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState([]);
  const [loaded, setLoaded]   = useState(false);

  useEffect(() => {
    if (hasFirebaseConfig() && firebaseDb) {
      const reportsQuery = query(collection(firebaseDb, FIRESTORE_COLLECTIONS.reports), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(reportsQuery, (snapshot) => {
        const remoteReports = snapshot.docs.map(item => {
          const data = item.data();
          return {
            id: item.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt || new Date().toISOString(),
          };
        });
        setReports(remoteReports);
        setLoaded(true);
      });

      return unsubscribe;
    }

    (async () => {
      const saved = await loadReports([]);
      const savedReports = Array.isArray(saved) ? saved : [];
      const seedIds = REPORTS.map(r => r.id);
      const extra = savedReports.filter(r => r && !seedIds.includes(r.id));
      setReports([...REPORTS, ...extra]);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (hasFirebaseConfig()) return;
    if (loaded) saveReports(reports);
  }, [reports, loaded]);

  const addReport = async (report) => {
    const newReport = {
      ...report,
      id: `r${Date.now()}`,
      status: 'Submitted',
      createdAt: new Date().toISOString(),
    };

    if (hasFirebaseConfig() && firebaseDb) {
      const { id, ...payload } = newReport;
      const docRef = await addDoc(collection(firebaseDb, FIRESTORE_COLLECTIONS.reports), {
        ...payload,
        createdAt: serverTimestamp(),
      });
      return { ...newReport, id: docRef.id };
    }

    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  const updateReportFeedback = async (reportId, feedback) => {
    if (hasFirebaseConfig() && firebaseDb) {
      await updateDoc(doc(firebaseDb, FIRESTORE_COLLECTIONS.reports, reportId), {
        prlFeedback: feedback,
        status: 'Reviewed',
      });
      return;
    }

    setReports(prev =>
      prev.map(r => r.id === reportId
        ? { ...r, prlFeedback: feedback, status: 'Reviewed' }
        : r
      )
    );
  };

  const deleteReport = async (reportId) => {
    if (hasFirebaseConfig() && firebaseDb) {
      await deleteDoc(doc(firebaseDb, FIRESTORE_COLLECTIONS.reports, reportId));
      return;
    }

    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  const getReportsByClass   = (classId)     => reports.filter(r => r.className    === classId);
  const getReportsByFaculty = (facultyName) => reports.filter(r => r.facultyName  === facultyName);
  const getReportsByLecturer= (name)        => reports.filter(r => r.lecturerName === name);

  return (
    <ReportsContext.Provider value={{
      reports, addReport, updateReportFeedback, deleteReport,
      getReportsByClass, getReportsByFaculty, getReportsByLecturer,
    }}>
      {children}
    </ReportsContext.Provider>
  );
}

export const useReports = () => useContext(ReportsContext);
