# Backend Setup

This app can keep using the current frontend while the backend is added in phases.

## What You Need

- A Google account of your choice
- A Firebase project created with that account
- Email/Password Authentication enabled
- Firestore Database enabled
- Cloud Messaging enabled

## Browser Step You Will Do

1. Sign in to [Firebase Console](https://console.firebase.google.com/) with the Google account you want to use.
2. Create a new Firebase project.
3. Add a Web app to the Firebase project.
4. Copy the Firebase config values.
5. Turn on:
   - Authentication > Email/Password
   - Firestore Database
   - Cloud Messaging

## Project Values To Paste Back

After creating the project, send back:

- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

Then copy `.env.example` to `.env` and fill in those values.

## Suggested Firestore Collections

- `users`
- `classes`
- `courses`
- `assignments`
- `reports`
- `ratings`
- `notifications`

## Suggested Role Model

- `Student`
- `Lecturer`
- `PRL`
- `PL`

## Frontend Can Continue In Parallel

Yes. While backend is being set up, frontend work can continue on:

- forms
- validation
- navigation
- layout
- usability

Later, the local state in these files will be replaced with Firebase calls:

- `src/context/AuthContext.js`
- `src/context/ReportsContext.js`
- `src/context/AppDataContext.js`
