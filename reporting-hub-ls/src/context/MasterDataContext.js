import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { FIRESTORE_COLLECTIONS } from '../services/firestoreCollections';
import { createCourse, seedFirestoreMasterDataIfEmpty, seedMasterData, subscribeToMasterCollection } from '../services/masterDataService';

const MasterDataContext = createContext(null);

export function MasterDataProvider({ children }) {
  const [faculties, setFaculties] = useState(seedMasterData.faculties);
  const [programmes, setProgrammes] = useState(seedMasterData.programmes);
  const [staff, setStaff] = useState(seedMasterData.staff);
  const [classes, setClasses] = useState(seedMasterData.classes);
  const [courses, setCourses] = useState(seedMasterData.courses);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    seedFirestoreMasterDataIfEmpty().catch(() => {});

    const unsubscribers = [
      subscribeToMasterCollection(FIRESTORE_COLLECTIONS.faculties, data => {
        if (!active) return;
        setFaculties(data);
      }, seedMasterData.faculties),
      subscribeToMasterCollection(FIRESTORE_COLLECTIONS.programmes, data => {
        if (!active) return;
        setProgrammes(data);
      }, seedMasterData.programmes),
      subscribeToMasterCollection(FIRESTORE_COLLECTIONS.staff, data => {
        if (!active) return;
        setStaff(data);
      }, seedMasterData.staff),
      subscribeToMasterCollection(FIRESTORE_COLLECTIONS.classes, data => {
        if (!active) return;
        setClasses(data);
      }, seedMasterData.classes),
      subscribeToMasterCollection(FIRESTORE_COLLECTIONS.courses, data => {
        if (!active) return;
        setCourses(data);
        setLoaded(true);
      }, seedMasterData.courses),
    ];

    setLoaded(true);

    return () => {
      active = false;
      unsubscribers.forEach(unsubscribe => unsubscribe?.());
    };
  }, []);

  const programmesByFaculty = useMemo(
    () => programmes.reduce((acc, item) => {
      const key = item.facultyId || item.faculty;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {}),
    [programmes]
  );

  return (
    <MasterDataContext.Provider
      value={{
        loaded,
        faculties,
        programmes,
        programmesByFaculty,
        staff,
        classes,
        courses,
        createCourse,
      }}
    >
      {children}
    </MasterDataContext.Provider>
  );
}

export const useMasterData = () => useContext(MasterDataContext);
