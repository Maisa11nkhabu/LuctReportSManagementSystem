export const FIREBASE_COLLECTIONS = {
  users: 'users',
  classes: 'classes',
  courses: 'courses',
  assignments: 'assignments',
  reports: 'reports',
  ratings: 'ratings',
  notifications: 'notifications',
};

export const FIREBASE_AUTH_PHASES = [
  'Enable Email/Password sign-in',
  'Create user profile documents in Firestore',
  'Map each auth user to a role: Student, Lecturer, PRL, or PL',
];

export const FRONTEND_SWAP_PLAN = [
  {
    feature: 'Authentication',
    currentSource: 'src/context/AuthContext.js',
    backendTarget: 'Firebase Authentication + users collection',
  },
  {
    feature: 'Reports',
    currentSource: 'src/context/ReportsContext.js',
    backendTarget: 'reports collection',
  },
  {
    feature: 'Assignments and timetable',
    currentSource: 'src/context/AppDataContext.js',
    backendTarget: 'assignments collection',
  },
  {
    feature: 'Ratings',
    currentSource: 'src/context/AppDataContext.js',
    backendTarget: 'ratings collection',
  },
];
