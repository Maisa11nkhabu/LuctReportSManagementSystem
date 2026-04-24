import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USERS:    'reportinghub:users',
  SESSION:  'reportinghub:session',
  TIMETABLE:'reportinghub:timetable',
  REPORTS:  'reportinghub:reports',
  RATINGS:  'reportinghub:ratings',
  SETTINGS: 'reportinghub:settings',
};

async function setJSON(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function getJSON(key, fallback) {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

export async function saveUsers(users) {
  try {
    await setJSON(KEYS.USERS, users);
  } catch (e) { console.error('saveUsers:', e); }
}

export async function loadUsers(fallback = []) {
  try {
    return await getJSON(KEYS.USERS, fallback);
  } catch (e) { return fallback; }
}

export async function saveSession(user) {
  try {
    await setJSON(KEYS.SESSION, user);
  } catch (e) { console.error('saveSession:', e); }
}

export async function loadSession() {
  try {
    return await getJSON(KEYS.SESSION, null);
  } catch (e) { return null; }
}

export async function clearSession() {
  try {
    await AsyncStorage.removeItem(KEYS.SESSION);
  } catch (e) { console.error('clearSession:', e); }
}

export async function saveTimetable(timetable) {
  try {
    await setJSON(KEYS.TIMETABLE, timetable);
  } catch (e) { console.error('saveTimetable:', e); }
}

export async function loadTimetable(fallback = []) {
  try {
    return await getJSON(KEYS.TIMETABLE, fallback);
  } catch (e) { return fallback; }
}

export async function saveReports(reports) {
  try {
    await setJSON(KEYS.REPORTS, reports);
  } catch (e) { console.error('saveReports:', e); }
}

export async function loadReports(fallback = []) {
  try {
    return await getJSON(KEYS.REPORTS, fallback);
  } catch (e) { return fallback; }
}

export async function saveRatings(ratings) {
  try {
    await setJSON(KEYS.RATINGS, ratings);
  } catch (e) { console.error('saveRatings:', e); }
}

export async function loadRatings() {
  try {
    return await getJSON(KEYS.RATINGS, []);
  } catch (e) { return []; }
}

export async function clearAll() {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (e) { console.error('clearAll:', e); }
}
