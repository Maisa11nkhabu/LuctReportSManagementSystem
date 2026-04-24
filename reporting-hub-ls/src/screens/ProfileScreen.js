import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar as RNStatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useReports } from '../context/ReportsContext';
import { STAFF, FACULTIES } from '../data/seedData';
import { Colors, Spacing, BorderRadius, Typography } from '../theme';
import { Card, RoleBadge, StatCard } from '../components/UI';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, RNStatusBar.currentHeight || 0);
  const { user, logout } = useAuth();
  const { timetable } = useAppData();
  const { reports } = useReports();

  const staff = STAFF.find(item => item.id === user?.staffId);
  const faculty = FACULTIES.find(item => item.id === (staff?.faculty || user?.faculty));
  const myReports = user?.role === 'Lecturer' && staff
    ? reports.filter(item => item.lecturerName === staff.name)
    : reports.filter(item => faculty && item.facultyName === faculty.name);
  const mySlots = timetable.filter(item => item.lecturerId === user?.staffId);
  const initial = (user?.name || 'U').split(' ').slice(-1)[0][0].toUpperCase();
  const quickLinks = [
    ...(user?.role !== 'Student' ? [{ icon: 'document-text-outline', label: 'My Reports', screen: 'Reports' }] : []),
    ...(user?.role !== 'Student' ? [{ icon: 'school-outline', label: 'My Classes', screen: 'Classes' }] : []),
    ...(user?.role !== 'Student' ? [{ icon: 'star-outline', label: 'Ratings', screen: 'Rating' }] : []),
    ...(user?.role === 'PL' ? [{ icon: 'mic-outline', label: 'Lectures', screen: 'Lectures' }] : []),
    ...(user?.role === 'Lecturer' ? [{ icon: 'add-circle-outline', label: 'Add Report', screen: 'ReportForm' }] : []),
    ...(user?.role === 'Student'
      ? [
          { icon: 'checkmark-done-outline', label: 'Attendance', screen: 'Attendance' },
          { icon: 'star-outline', label: 'Rating', screen: 'Rating' },
          { icon: 'pulse-outline', label: 'Monitoring', screen: 'Monitoring' },
        ]
      : [{ icon: 'pulse-outline', label: 'Monitoring', screen: 'Monitoring' }]),
  ];

  const confirmLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#0A3556', '#0284C9']} style={[styles.hero, { paddingTop: Math.max(topInset, Spacing.md) + 12 }]}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.heroName}>{user?.name}</Text>
        <View style={styles.heroBadge}>
          <RoleBadge role={user?.role || 'Student'} />
        </View>
        {faculty && <Text style={styles.heroFaculty}>{faculty.shortName} · {faculty.name}</Text>}
      </LinearGradient>

      <View style={styles.body}>
        {user?.role !== 'Student' && (
          <>
            <Text style={styles.sectionTitle}>Activity</Text>
            <View style={styles.statsRow}>
              <View style={{ flex: 1 }}>
                <StatCard label="My Reports" value={myReports.length} icon="document-text-outline" color={Colors.blue} />
              </View>
              <View style={{ flex: 1 }}>
                <StatCard label="My Classes" value={mySlots.length} icon="school-outline" color={Colors.navy} />
              </View>
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Account Details</Text>
        <Card>
          {[
            ['Name', user?.name, 'person-outline'],
            ['Email', staff?.email || user?.email || '-', 'mail-outline'],
            ['Role', user?.role, 'shield-outline'],
            ['Faculty', faculty?.shortName || user?.faculty || '-', 'business-outline'],
          ].map(([label, value, icon]) => (
            <View key={label} style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name={icon} size={16} color={Colors.blue} />
              </View>
              <Text style={styles.detailLabel}>{label}</Text>
              <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.sectionTitle}>Quick Links</Text>
        <Card>
          {quickLinks.map(link => (
            <QuickLink
              key={link.label}
              icon={link.icon}
              label={link.label}
              onPress={() => navigation.navigate(link.screen)}
            />
          ))}
        </Card>

        <TouchableOpacity style={styles.logoutCard} onPress={confirmLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Reporting Hub LS v1.0</Text>
        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

function QuickLink({ icon, label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.linkRow}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={16} color={Colors.blue} />
      </View>
      <Text style={styles.linkLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.screenBg },
  hero: { paddingBottom: 28, alignItems: 'center' },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: '900', color: Colors.white },
  heroName: { color: Colors.white, fontSize: 20, fontWeight: '800', marginBottom: 8 },
  heroBadge: { marginBottom: 8 },
  heroFaculty: { color: Colors.steel, fontSize: 12, textAlign: 'center', marginTop: 4 },
  body: { padding: Spacing.md },
  sectionTitle: { ...Typography.h4, marginTop: Spacing.md, marginBottom: Spacing.sm },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  detailIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.lightBlue, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  detailLabel: { fontSize: 13, color: Colors.gray, width: 70 },
  detailValue: { flex: 1, fontSize: 13, fontWeight: '600', color: Colors.navy, textAlign: 'right' },
  linkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  linkLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: Colors.navy },
  logoutCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEE2E2', borderRadius: BorderRadius.md, padding: 16, marginTop: Spacing.md, gap: 10 },
  logoutText: { color: Colors.danger, fontWeight: '700', fontSize: 15 },
  version: { textAlign: 'center', color: Colors.gray, fontSize: 11, marginTop: Spacing.md },
});
