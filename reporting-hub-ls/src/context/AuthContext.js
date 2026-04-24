import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_USERS } from '../data/seedData';
import { firebaseAuth, firebaseDb, hasFirebaseConfig } from '../config/firebase';
import { clearSession, loadSession, loadUsers, saveSession, saveUsers } from '../utils/storage';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(DEMO_USERS);
  const [loaded, setLoaded] = useState(false);

  const loginWithLocalUser = async (email, password, availableUsers = users) => {
    const normalizedEmail = email.trim().toLowerCase();
    const found = availableUsers.find(
      candidate => candidate.email.toLowerCase() === normalizedEmail && candidate.password === password
    );

    if (!found) return null;

    setUser(found);
    await saveSession(found);
    return { success: true, user: found };
  };

  const getFirebaseLoginErrorMessage = (error) => {
    if (!error?.code) return error?.message || 'Firebase sign-in failed';

    switch (error.code) {
      case 'auth/invalid-credential':
        return 'Incorrect email or password, or this account only exists as a demo/local account.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/network-request-failed':
        return 'Network error. Check your internet connection and try again.';
      default:
        return error.message || 'Firebase sign-in failed';
    }
  };

  useEffect(() => {
    (async () => {
      const storedUsers = await loadUsers(DEMO_USERS);
      const safeUsers = Array.isArray(storedUsers) && storedUsers.length > 0 ? storedUsers : DEMO_USERS;
      const storedSession = await loadSession();

      setUsers(safeUsers);

      if (hasFirebaseConfig() && firebaseAuth && firebaseDb) {
        if (!storedSession) {
          setLoaded(true);
        }
        return;
      }

      if (storedSession) {
        const activeUser = safeUsers.find(candidate => candidate.id === storedSession.id) || storedSession;
        setUser(activeUser);
      }
      setLoaded(true);
    })();

    if (hasFirebaseConfig() && firebaseAuth && firebaseDb) {
      return onAuthStateChanged(firebaseAuth, async (authUser) => {
        if (!authUser) {
          setUser(null);
          await clearSession();
          setLoaded(true);
          return;
        }

        const userRef = doc(firebaseDb, 'users', authUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const profile = { id: authUser.uid, email: authUser.email, ...userSnap.data() };
          setUser(profile);
          await saveSession(profile);
        } else {
          setUser(null);
          await clearSession();
        }
        setLoaded(true);
      });
    }
  }, []);

  const login = async (email, password) => {
    if (hasFirebaseConfig() && firebaseAuth && firebaseDb) {
      try {
        const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
        const userRef = doc(firebaseDb, 'users', credential.user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const profile = { id: credential.user.uid, email: credential.user.email, ...userSnap.data() };
          setUser(profile);
          await saveSession(profile);
          return { success: true, user: profile };
        }

        await signOut(firebaseAuth);
        return { success: false, error: 'This Firebase account has no user profile document.' };
      } catch (error) {
        const localResult = await loginWithLocalUser(email, password);
        if (localResult) {
          return localResult;
        }

        return { success: false, error: getFirebaseLoginErrorMessage(error) };
      }
    }

    const localResult = await loginWithLocalUser(email, password);
    if (localResult) {
      return localResult;
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const register = async (payload) => {
    const email = payload.email.trim().toLowerCase();
    if (!hasFirebaseConfig() && users.some(existing => existing.email.toLowerCase() === email)) {
      return { success: false, error: 'That email is already registered' };
    }

    if (hasFirebaseConfig() && firebaseAuth && firebaseDb) {
      try {
        const credential = await createUserWithEmailAndPassword(firebaseAuth, email, payload.password);
        const profile = {
          role: 'Student',
          faculty: payload.faculty,
          programme: payload.programme,
          classId: payload.classId,
          name: payload.name.trim(),
          email,
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(firebaseDb, 'users', credential.user.uid), {
          ...profile,
          createdAt: serverTimestamp(),
        });

        const userProfile = { id: credential.user.uid, ...profile };
        setUser(userProfile);
        await saveSession(userProfile);
        return { success: true, user: userProfile };
      } catch (error) {
        return { success: false, error: error.message || 'Firebase registration failed' };
      }
    }

    const newUser = {
      id: `u${Date.now()}`,
      role: 'Student',
      faculty: payload.faculty,
      programme: payload.programme,
      classId: payload.classId,
      name: payload.name.trim(),
      email,
      password: payload.password,
    };

    const nextUsers = [...users, newUser];
    setUsers(nextUsers);
    setUser(newUser);
    await saveUsers(nextUsers);
    await saveSession(newUser);
    return { success: true, user: newUser };
  };

  const logout = async () => {
    setUser(null);
    if (hasFirebaseConfig() && firebaseAuth && firebaseAuth.currentUser) {
      await signOut(firebaseAuth);
    }
    await clearSession();
  };

  return (
    <AuthContext.Provider value={{ loaded, user, users, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
