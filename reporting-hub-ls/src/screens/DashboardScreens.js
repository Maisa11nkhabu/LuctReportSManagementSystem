import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar as RNStatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useReports } from '../context/ReportsContext';
import { CLASSES, PROGRAMMES, STAFF } from '../data/seedData';
import { Colors, Spacing, BorderRadius, Typography } from '../theme';
import { StatCard, Card, RoleBadge, ScreenHeader } from '../components/UI';

const HERO_BODY_GAP = 8;

export function StudentDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const myClass = CLASSES.find(item => item.id === user?.classId);

  return (
    <DashboardShell title={user?.name} subtitle="Student Dashboard" role="Student" onLogout={logout}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <StatCard label="Class" value={myClass?.id || '-'} icon="school-outline" color={Colors.blue} />
        <StatCard label="Faculty" value={user?.faculty || '-'} icon="business-outline" color={Colors.navy} />

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {[
          { label: 'Attendance', icon: 'checkmark-done-outline', screen: 'Attendance', color: Colors.blue },
          { label: 'Rating', icon: 'star-outline', screen: 'Rating', color: Colors.warning },
        ].map(item => (
          <ActionCard key={item.label} {...item} navigation={navigation} />
        ))}
      </View>
    </DashboardShell>
  );
}

export function LecturerDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const { timetable } = useAppData();
  const { reports } = useReports();
  const staff = STAFF.find(item => item.id === user?.staffId);
  const myTimetable = timetable.filter(item => item.lecturerId === user?.staffId);
  const myReports = reports.filter(item => staff && item.lecturerName === staff.name);

  return (
    <DashboardShell title={user?.name} subtitle="Lecturer Dashboard" role="Lecturer" onLogout={logout}>
      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statHalf}>
            <StatCard label="Assigned Classes" value={myTimetable.length} icon="school-outline" color={Colors.blue} />
          </View>
          <View style={styles.statHalf}>
            <StatCard label="Submitted Reports" value={myReports.length} icon="document-text-outline" color={Colors.navy} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {[
          { label: 'My Classes', icon: 'calendar-outline', screen: 'Classes', color: Colors.blue },
          { label: 'Submit Report', icon: 'add-circle-outline', screen: 'ReportForm', color: Colors.success },
          { label: 'Reports', icon: 'document-text-outline', screen: 'Reports', color: Colors.navy },
          { label: 'Attendance', icon: 'people-outline', screen: 'Attendance', color: Colors.steel },
          { label: 'Monitoring', icon: 'pulse-outline', screen: 'Monitoring', color: Colors.warning },
          { label: 'Profile', icon: 'person-outline', screen: 'Profile', color: Colors.blue },
        ].map(item => (
          <ActionCard key={item.label} {...item} navigation={navigation} />
        ))}
      </View>
    </DashboardShell>
  );
}

export function PRLDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const { reports } = useReports();
  const staff = STAFF.find(item => item.id === user?.staffId);
  const myFacultyClasses = CLASSES.filter(item => item.faculty === staff?.faculty);
  const pendingReports = reports.filter(item => item.status === 'Submitted');

  return (
    <DashboardShell title={user?.name} subtitle="Principal Lecturer Dashboard" role="PRL" onLogout={logout}>
      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statHalf}>
            <StatCard label="Classes" value={myFacultyClasses.length} icon="school-outline" color={Colors.blue} />
          </View>
          <View style={styles.statHalf}>
            <StatCard label="Pending Reviews" value={pendingReports.length} icon="time-outline" color={Colors.warning} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {[
          { label: 'Courses', icon: 'book-outline', screen: 'Courses', color: Colors.navy },
          { label: 'Reports', icon: 'document-text-outline', screen: 'Reports', color: Colors.blue },
          { label: 'Monitoring', icon: 'pulse-outline', screen: 'Monitoring', color: Colors.warning },
          { label: 'Classes', icon: 'calendar-outline', screen: 'Classes', color: Colors.blue },
          { label: 'Rating', icon: 'star-outline', screen: 'Rating', color: Colors.steel },
        ].map(item => (
          <ActionCard key={item.label} {...item} navigation={navigation} />
        ))}
      </View>
    </DashboardShell>
  );
}

export function PLDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const { timetable } = useAppData();
  const { reports } = useReports();
  const staff = STAFF.find(item => item.id === user?.staffId);
  const facultyProgrammes = staff ? (PROGRAMMES[staff.faculty] || []) : [];
  const facultyLectures = timetable.filter(slot => {
    const klass = CLASSES.find(item => item.id === slot.classId);
    return klass?.faculty === staff?.faculty;
  });

  return (
    <DashboardShell title={user?.name} subtitle="Programme Leader Dashboard" role="PL" onLogout={logout}>
      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statHalf}>
            <StatCard label="Programmes" value={facultyProgrammes.length} icon="layers-outline" color={Colors.blue} />
          </View>
          <View style={styles.statHalf}>
            <StatCard label="Assigned Lectures" value={facultyLectures.length} icon="mic-outline" color={Colors.navy} />
          </View>
        </View>
        <StatCard label="PRL Reports" value={reports.length} icon="document-text-outline" color={Colors.warning} />

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {[
          { label: 'Assign Classes', icon: 'add-circle-outline', screen: 'AssignLecture', color: Colors.success },
          { label: 'View Lectures', icon: 'mic-outline', screen: 'Lectures', color: Colors.blue },
          { label: 'Programmes', icon: 'layers-outline', screen: 'ProgrammeList', color: Colors.navy },
          { label: 'Courses', icon: 'book-outline', screen: 'Courses', color: Colors.steel },
          { label: 'Reports', icon: 'document-text-outline', screen: 'Reports', color: Colors.warning },
          { label: 'Profile', icon: 'person-outline', screen: 'Profile', color: Colors.blue },
        ].map(item => (
          <ActionCard key={item.label} {...item} navigation={navigation} />
        ))}
      </View>
    </DashboardShell>
  );
}

export function LecturerQuickActionsScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <ScreenHeader title="Create" subtitle="Lecturer actions" />
      <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.panelCard}>
          <Text style={styles.panelTitle}>Quick Actions</Text>
          <Text style={styles.panelText}>
            Use this space to create a report fast or jump into your class and report screens.
          </Text>
        </Card>

        {[
          { label: 'Add Report', icon: 'document-text-outline', screen: 'ReportForm', color: Colors.success },
          { label: 'Open My Classes', icon: 'school-outline', screen: 'Classes', color: Colors.blue },
          { label: 'View Reports', icon: 'reader-outline', screen: 'Reports', color: Colors.navy },
        ].map(item => (
          <ActionCard key={item.label} {...item} navigation={navigation} />
        ))}
      </ScrollView>
    </View>
  );
}

export function PLQuickActionsScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <ScreenHeader title="Create" subtitle="Programme Leader actions" />
      <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.panelCard}>
          <Text style={styles.panelTitle}>Management Actions</Text>
          <Text style={styles.panelText}>
            Use this space to assign classes, manage lecture schedules, and move into reports quickly.
          </Text>
        </Card>

        {[
          { label: 'Assign Classes', icon: 'add-circle-outline', screen: 'AssignLecture', color: Colors.success },
          { label: 'View Lectures', icon: 'mic-outline', screen: 'Lectures', color: Colors.blue },
          { label: 'Open Reports', icon: 'reader-outline', screen: 'Reports', color: Colors.navy },
          { label: 'Open Programmes', icon: 'layers-outline', screen: 'ProgrammeList', color: Colors.warning },
        ].map(item => (
          <ActionCard key={item.label} {...item} navigation={navigation} />
        ))}
      </ScrollView>
    </View>
  );
}

function DashboardShell({ title, subtitle, role, onLogout, children }) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, RNStatusBar.currentHeight || 0);
  const heroHeight = 128 + topInset;

  return (
    <View style={styles.screen}>
      <View style={[styles.heroContainer, { height: heroHeight }]}>
        <Hero title={title} subtitle={subtitle} role={role} onLogout={onLogout} topInset={topInset} />
      </View>
      <ScrollView
        style={styles.scrollLayer}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: heroHeight + 8, paddingBottom: 32 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bodyCard}>{children}</View>
      </ScrollView>
    </View>
  );
}

function Hero({ title, subtitle, role, onLogout, topInset }) {
  return (
    <LinearGradient colors={['#0A3556', '#0284C9']} style={[styles.hero, { paddingTop: topInset + 16 }]}>
      <View style={styles.heroRow}>
        <View>
          <Text style={styles.heroSub}>{subtitle}</Text>
          <Text style={styles.heroName}>{title}</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.heroBadgeRow}>
        <RoleBadge role={role} />
      </View>
    </LinearGradient>
  );
}

function ActionCard({ label, icon, screen, color, navigation }) {
  return (
    <Card onPress={() => navigation.navigate(screen)} style={styles.actionCard}>
      <View style={styles.actionRow}>
        <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
        <Ionicons name="chevron-forward" size={18} color={Colors.gray} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.screenBg },
  heroContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 },
  hero: { flex: 1, paddingHorizontal: Spacing.md, paddingBottom: 28 },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  heroSub: { color: Colors.steel, fontSize: 13 },
  heroName: { color: Colors.white, fontSize: 22, fontWeight: '800', marginTop: 2 },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 8 },
  heroBadgeRow: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  scrollLayer: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  bodyCard: {
    marginTop: 0,
    backgroundColor: Colors.screenBg,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    minHeight: '100%',
    paddingTop: HERO_BODY_GAP,
  },
  content: { padding: Spacing.md },
  sectionTitle: { ...Typography.h4, marginTop: Spacing.md, marginBottom: Spacing.sm },
  statsRow: { flexDirection: 'row', gap: 8 },
  statHalf: { flex: 1 },
  bodyScroll: { flex: 1 },
  bodyContent: { padding: Spacing.md, paddingBottom: 32 },
  actionCard: { marginBottom: Spacing.sm },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  actionIcon: { borderRadius: BorderRadius.sm, padding: 10, marginRight: 14 },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.navy },
  panelCard: { marginBottom: Spacing.md },
  panelTitle: { ...Typography.h4, marginBottom: 6 },
  panelText: { color: Colors.gray, fontSize: 13, lineHeight: 20 },
});
