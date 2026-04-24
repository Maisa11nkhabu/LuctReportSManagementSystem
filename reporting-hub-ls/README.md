# Reporting Hub LS
### Mobile Application — Expo SDK 51 / React Native

---

## 📱 Overview

A fully functional mobile reporting app for Limkokwing University of Creative Technology (LUCT), Lesotho. Built for **Assignment 2** of Mobile Device Programming (BIMP2210).

**System:** Lecture Reporting and Academic Monitoring System
**Stack:** React Native + Expo + React Navigation + Context API

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (iOS or Android)

### Install & Run
```bash
# 1. Unzip the project
unzip reporting-hub-ls.zip
cd reporting-hub-ls

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start

# 4. Scan the QR code with Expo Go on your phone
```

---

## 🔑 Demo Login Accounts

| Role     | Email                                     | Password    |
|----------|-------------------------------------------|-------------|
| Student  | student@luct.ls                           | student123  |
| Lecturer | tsekiso.thokoana@limkokwing.ac.ls         | luct1234    |
| PRL      | mpotla.nthunya@limkokwing.ac.ls           | luct1234    |
| PL       | kapela.morutwa@limkokwing.ac.ls           | luct1234    |
| FMG      | diana.moopisa@limkokwing.ac.ls            | luct1234    |

> **Tip:** Use the quick-login buttons on the Login screen!

---

## 🏗️ Architecture

```
reporting-hub-ls/
├── App.js                          # Root navigator
├── src/
│   ├── theme.js                    # LUCT color palette + typography
│   ├── context/
│   │   ├── AuthContext.js          # Role-based auth
│   │   └── ReportsContext.js       # Reports state management
│   ├── data/
│   │   └── seedData.js             # All seeded data (staff, classes, timetable)
│   ├── components/
│   │   └── UI.js                   # Shared UI components
│   ├── navigation/
│   │   └── AppNavigator.js         # Role-specific tab + stack navigators
│   └── screens/
│       ├── LoginScreen.js
│       ├── DashboardScreens.js     # Student / Lecturer / PRL / PL / FMG dashboards
│       ├── FacultyScreens.js       # Faculties / Faculty Detail / Programmes
│       ├── StaffClassesScreens.js  # Staff / Classes / Courses / Lectures
│       └── ReportScreens.js        # Reports / Report Form / Attendance / Rating / Monitoring
```

---

## 👥 Role Hierarchy

```
FMG → PL → PRL → Lecturer → Student
```

Each role sees only what's relevant to their scope:
- **FMG**: Full system overview, all faculties, all staff, all reports
- **PL**: Programme management, assign lecturers, view PRL reports
- **PRL**: Classes under their stream, lecturer reports, feedback
- **Lecturer**: Own classes, submit reports, attendance, ratings
- **Student**: Own class, attendance, rating, monitoring

---

## 📋 Screens Implemented

| Screen            | Route               |
|-------------------|---------------------|
| Login             | Login               |
| Dashboard         | HomeTab             |
| Faculties         | Faculties           |
| Faculty Detail    | FacultyDetail       |
| Programme List    | ProgrammeList       |
| Programme Detail  | ProgrammeDetail     |
| Staff List        | StaffList           |
| Staff Detail      | StaffDetail         |
| Classes           | Classes             |
| Class Detail      | ClassDetail         |
| Courses           | Courses             |
| Lectures          | Lectures            |
| Reports           | Reports             |
| Report Detail     | ReportDetail        |
| Report Form       | ReportForm          |
| Attendance        | Attendance          |
| Rating            | Rating              |
| Monitoring        | Monitoring          |

---

## 🎨 Colour Palette

| Name       | Hex       | Usage               |
|------------|-----------|---------------------|
| Navy       | `#0A3556` | Headers, primary    |
| Blue       | `#0284C9` | Actions, buttons    |
| Light Blue | `#D7E5EE` | Cards, backgrounds  |
| Off White  | `#F8F6F2` | Screen backgrounds  |
| Steel      | `#79BBD9` | Secondary elements  |

---

## 📊 Data Sources

All data seeded from official LUCT documents:
- **LUCT Faculty Structures** → staff hierarchy, roles
- **2023 LUCT Prospectus** → programme names
- **Timetable 2026-02** → lecturers, classes, schedules

---

## ✨ Features

- [x] Role-based navigation (5 roles)
- [x] Lecture reporting form with all required fields
- [x] Real timetable data from official schedule
- [x] Search in all modules
- [x] Attendance tracking with visual bars
- [x] Rating system (5-star)
- [x] PRL feedback on reports
- [x] Monitoring dashboard with stats
- [x] Faculty → Programme → Class drill-down
- [x] Staff directory with role filtering

---

## 📌 Assignment Info

- **Course:** Mobile Device Programming (BIMP2210)
- **Programme:** BSc Software Engineering with Multimedia
- **Semester:** 2
- **Lecturer:** Mr. Tsekiso Thokoana
- **Weight:** 25%
