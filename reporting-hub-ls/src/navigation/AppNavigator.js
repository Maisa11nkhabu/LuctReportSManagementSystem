import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import {
  StudentDashboard,
  LecturerDashboard,
  PRLDashboard,
  PLDashboard,
  LecturerQuickActionsScreen,
  PLQuickActionsScreen,
} from '../screens/DashboardScreens';
import {
  FacultiesScreen,
  FacultyDetailScreen,
  ProgrammeListScreen,
  ProgrammeDetailScreen,
} from '../screens/FacultyScreens';
import {
  StaffListScreen,
  StaffDetailScreen,
  ClassesScreen,
  ClassDetailScreen,
  CoursesScreen,
  CourseFormScreen,
  LecturesScreen,
  AssignLectureScreen,
} from '../screens/StaffClassesScreens';
import {
  ReportsScreen,
  ReportDetailScreen,
  ReportFormScreen,
  AttendanceScreen,
  RatingScreen,
  MonitoringScreen,
} from '../screens/ReportScreens';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const NO_HEADER = { headerShown: false };

function ReportsStack() {
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
      <Stack.Screen name="ReportForm" component={ReportFormScreen} />
    </Stack.Navigator>
  );
}

function ClassesStack() {
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      <Stack.Screen name="Classes" component={ClassesScreen} />
      <Stack.Screen name="ClassDetail" component={ClassDetailScreen} />
    </Stack.Navigator>
  );
}

function StaffStack() {
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      <Stack.Screen name="StaffList" component={StaffListScreen} />
      <Stack.Screen name="StaffDetail" component={StaffDetailScreen} />
    </Stack.Navigator>
  );
}

function LecturerProfileStack() {
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Reports" component={ReportsStack} />
      <Stack.Screen name="Classes" component={ClassesStack} />
      <Stack.Screen name="Rating" component={RatingScreen} />
      <Stack.Screen name="Monitoring" component={MonitoringScreen} />
      <Stack.Screen name="ReportForm" component={ReportFormScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}

function PLProfileStack() {
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Reports" component={ReportsStack} />
      <Stack.Screen name="Classes" component={ClassesStack} />
      <Stack.Screen name="ClassDetail" component={ClassDetailScreen} />
      <Stack.Screen name="Rating" component={RatingScreen} />
      <Stack.Screen name="Monitoring" component={MonitoringScreen} />
      <Stack.Screen name="Lectures" component={LecturesScreen} />
      <Stack.Screen name="AssignLecture" component={AssignLectureScreen} />
      <Stack.Screen name="ProgrammeList" component={ProgrammeListScreen} />
      <Stack.Screen name="ProgrammeDetail" component={ProgrammeDetailScreen} />
      <Stack.Screen name="Courses" component={CoursesScreen} />
      <Stack.Screen name="CourseForm" component={CourseFormScreen} />
    </Stack.Navigator>
  );
}

function PRLProfileStack() {
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Reports" component={ReportsStack} />
      <Stack.Screen name="Classes" component={ClassesStack} />
      <Stack.Screen name="Courses" component={CoursesScreen} />
      <Stack.Screen name="Monitoring" component={MonitoringScreen} />
      <Stack.Screen name="Rating" component={RatingScreen} />
    </Stack.Navigator>
  );
}

function LecturerCreateStack() {
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      <Stack.Screen name="QuickActions" component={LecturerQuickActionsScreen} />
      <Stack.Screen name="ReportForm" component={ReportFormScreen} />
      <Stack.Screen name="Reports" component={ReportsStack} />
      <Stack.Screen name="Classes" component={ClassesStack} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}

function PLCreateStack() {
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      <Stack.Screen name="QuickActions" component={PLQuickActionsScreen} />
      <Stack.Screen name="AssignLecture" component={AssignLectureScreen} />
      <Stack.Screen name="Lectures" component={LecturesScreen} />
      <Stack.Screen name="Reports" component={ReportsStack} />
      <Stack.Screen name="ProgrammeList" component={ProgrammeListScreen} />
      <Stack.Screen name="ProgrammeDetail" component={ProgrammeDetailScreen} />
      <Stack.Screen name="ClassDetail" component={ClassDetailScreen} />
      <Stack.Screen name="Courses" component={CoursesScreen} />
      <Stack.Screen name="CourseForm" component={CourseFormScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}

function useTabBarOptions() {
  const insets = useSafeAreaInsets();

  return {
    tabBarActiveTintColor: Colors.blue,
    tabBarInactiveTintColor: Colors.gray,
    tabBarHideOnKeyboard: true,
    tabBarStyle: {
      backgroundColor: Colors.white,
      borderTopColor: Colors.lightBlue,
      height: 58 + insets.bottom,
      paddingBottom: Math.max(insets.bottom, 10),
      paddingTop: 8,
    },
    tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    headerShown: false,
  };
}

function StudentHome() {
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      <Stack.Screen name="Dashboard" component={StudentDashboard} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="Rating" component={RatingScreen} />
      <Stack.Screen name="Monitoring" component={MonitoringScreen} />
    </Stack.Navigator>
  );
}

export function StudentTabs() {
  const tabBarOptions = useTabBarOptions();

  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen name="HomeTab" component={StudentHome} options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} /> }} />
      <Tab.Screen name="AttendTab" component={AttendanceScreen} options={{ tabBarLabel: 'Attendance', tabBarIcon: ({ color }) => <Ionicons name="checkmark-done-outline" size={22} color={color} /> }} />
      <Tab.Screen name="RateTab" component={RatingScreen} options={{ tabBarLabel: 'Rating', tabBarIcon: ({ color }) => <Ionicons name="star-outline" size={22} color={color} /> }} />
      <Tab.Screen name="MonitorTab" component={MonitoringScreen} options={{ tabBarLabel: 'Monitoring', tabBarIcon: ({ color }) => <Ionicons name="pulse-outline" size={22} color={color} /> }} />
    </Tab.Navigator>
  );
}

function LecturerHome() {
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      <Stack.Screen name="Dashboard" component={LecturerDashboard} />
      <Stack.Screen name="Classes" component={ClassesStack} />
      <Stack.Screen name="Reports" component={ReportsStack} />
      <Stack.Screen name="ReportForm" component={ReportFormScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="Monitoring" component={MonitoringScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export function LecturerTabs() {
  const tabBarOptions = useTabBarOptions();

  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen name="HomeTab" component={LecturerHome} options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} /> }} />
      <Tab.Screen name="CreateTab" component={LecturerCreateStack} options={{ tabBarLabel: 'Create', tabBarIcon: ({ color }) => <Ionicons name="add-circle-outline" size={26} color={color} /> }} />
      <Tab.Screen name="ProfileTab" component={LecturerProfileStack} options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} /> }} />
    </Tab.Navigator>
  );
}

function PRLHome() {
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      <Stack.Screen name="Dashboard" component={PRLDashboard} />
      <Stack.Screen name="Reports" component={ReportsStack} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
      <Stack.Screen name="Classes" component={ClassesStack} />
      <Stack.Screen name="Courses" component={CoursesScreen} />
      <Stack.Screen name="StaffList" component={StaffStack} />
      <Stack.Screen name="StaffDetail" component={StaffDetailScreen} />
      <Stack.Screen name="Monitoring" component={MonitoringScreen} />
      <Stack.Screen name="Rating" component={RatingScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export function PRLTabs() {
  const tabBarOptions = useTabBarOptions();

  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen name="HomeTab" component={PRLHome} options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} /> }} />
      <Tab.Screen name="ReportTab" component={ReportsStack} options={{ tabBarLabel: 'Reports', tabBarIcon: ({ color }) => <Ionicons name="document-text-outline" size={22} color={color} /> }} />
      <Tab.Screen name="ProfileTab" component={PRLProfileStack} options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} /> }} />
    </Tab.Navigator>
  );
}

function PLHome() {
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      <Stack.Screen name="Dashboard" component={PLDashboard} />
      <Stack.Screen name="ProgrammeList" component={ProgrammeListScreen} />
      <Stack.Screen name="ProgrammeDetail" component={ProgrammeDetailScreen} />
      <Stack.Screen name="Faculties" component={FacultiesScreen} />
      <Stack.Screen name="FacultyDetail" component={FacultyDetailScreen} />
      <Stack.Screen name="Classes" component={ClassesStack} />
      <Stack.Screen name="ClassDetail" component={ClassDetailScreen} />
      <Stack.Screen name="Courses" component={CoursesScreen} />
      <Stack.Screen name="CourseForm" component={CourseFormScreen} />
      <Stack.Screen name="Lectures" component={LecturesScreen} />
      <Stack.Screen name="AssignLecture" component={AssignLectureScreen} />
      <Stack.Screen name="Reports" component={ReportsStack} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
      <Stack.Screen name="StaffList" component={StaffStack} />
      <Stack.Screen name="StaffDetail" component={StaffDetailScreen} />
      <Stack.Screen name="Monitoring" component={MonitoringScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export function PLTabs() {
  const tabBarOptions = useTabBarOptions();

  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen name="HomeTab" component={PLHome} options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} /> }} />
      <Tab.Screen name="CreateTab" component={PLCreateStack} options={{ tabBarLabel: 'Create', tabBarIcon: ({ color }) => <Ionicons name="add-circle-outline" size={26} color={color} /> }} />
      <Tab.Screen name="ProfileTab" component={PLProfileStack} options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} /> }} />
    </Tab.Navigator>
  );
}
