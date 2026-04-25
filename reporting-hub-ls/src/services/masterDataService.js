import {
  FACULTIES,
  PROGRAMMES,
  STAFF,
  CLASSES,
  COURSES,
} from '../data/seedData';
import { firebaseDb, hasFirebaseConfig } from '../config/firebase';
import { FIRESTORE_COLLECTIONS } from './firestoreCollections';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

export const seedMasterData = {
  faculties: FACULTIES,
  programmes: Object.entries(PROGRAMMES).flatMap(([facultyId, items]) =>
    items.map(item => ({ ...item, facultyId }))
  ),
  staff: STAFF,
  classes: CLASSES,
  courses: COURSES,
};

export function subscribeToMasterCollection(collectionName, onData, fallback = []) {
  if (!(hasFirebaseConfig() && firebaseDb)) {
    onData(fallback);
    return () => {};
  }

  const collectionRef = collection(firebaseDb, collectionName);
  const orderedQuery = query(collectionRef, orderBy('createdAt', 'asc'));

  return onSnapshot(orderedQuery, snapshot => {
    const items = snapshot.docs.map(item => ({
      id: item.id,
      ...item.data(),
    }));

    onData(items.length > 0 ? items : fallback);
  });
}

export async function createCourse(payload) {
  if (!(hasFirebaseConfig() && firebaseDb)) {
    return {
      id: payload.id || payload.code,
      ...payload,
    };
  }

  const docRef = await addDoc(collection(firebaseDb, FIRESTORE_COLLECTIONS.courses), {
    ...payload,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    ...payload,
  };
}

export async function seedFirestoreMasterDataIfEmpty() {
  if (!(hasFirebaseConfig() && firebaseDb)) return { success: false, reason: 'missing-config' };

  const collectionsToSeed = [
    { name: FIRESTORE_COLLECTIONS.staff, items: seedMasterData.staff },
    { name: FIRESTORE_COLLECTIONS.classes, items: seedMasterData.classes },
    { name: FIRESTORE_COLLECTIONS.courses, items: seedMasterData.courses },
    { name: FIRESTORE_COLLECTIONS.programmes, items: seedMasterData.programmes },
    { name: FIRESTORE_COLLECTIONS.faculties, items: seedMasterData.faculties },
  ];

  for (const entry of collectionsToSeed) {
    const snap = await getDocs(collection(firebaseDb, entry.name));
    if (!snap.empty) continue;

    for (const item of entry.items) {
      const itemId = item.id || `${entry.name}-${Math.random().toString(36).slice(2, 8)}`;
      await setDoc(doc(firebaseDb, entry.name, itemId), {
        ...item,
        createdAt: serverTimestamp(),
      });
    }
  }

  return { success: true };
}
