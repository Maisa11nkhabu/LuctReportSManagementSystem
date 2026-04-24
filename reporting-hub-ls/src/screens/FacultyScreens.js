import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FACULTIES, PROGRAMMES, STAFF, CLASSES, getClassDisplayName } from '../data/seedData';
import { Colors, Spacing, BorderRadius, Typography } from '../theme';
import { Card, SearchBar, ScreenHeader, RoleBadge, Badge, EmptyState } from '../components/UI';

//faculties screen
export function FacultiesScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const filtered = FACULTIES.filter(f =>
    f.name.toLowerCase().includes(query.toLowerCase()) ||
    f.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Faculties" subtitle={`${FACULTIES.length} Faculties`} />
      <View style={styles.body}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search faculties…" />
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const staffCount = STAFF.filter(s => s.faculty === item.id).length;
            const classCount = CLASSES.filter(c => c.faculty === item.id).length;
            const progCount  = (PROGRAMMES[item.id] || []).length;
            return (
              <Card onPress={() => navigation.navigate('FacultyDetail', { facultyId: item.id })}>
                <View style={[styles.facultyAccent, { backgroundColor: item.color }]} />
                <View style={styles.facultyBody}>
                  <View style={styles.facultyBadge}>
                    <Text style={[styles.facultyCode, { color: item.color }]}>{item.code}</Text>
                  </View>
                  <Text style={styles.facultyName}>{item.name}</Text>
                  <View style={styles.facultyMeta}>
                    <MetaPill icon="layers-outline" value={`${progCount} Programmes`} />
                    <MetaPill icon="people-outline" value={`${staffCount} Staff`} />
                    <MetaPill icon="school-outline" value={`${classCount} Classes`} />
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.gray} style={styles.chevron} />
              </Card>
            );
          }}
          ListEmptyComponent={<EmptyState message="No faculties found" />}
        />
      </View>
    </View>
  );
}

//faculty detail screen
export function FacultyDetailScreen({ route, navigation }) {
  const { facultyId } = route.params;
  const faculty    = FACULTIES.find(f => f.id === facultyId);
  const staff      = STAFF.filter(s => s.faculty === facultyId);
  const programmes = PROGRAMMES[facultyId] || [];
  const classes    = CLASSES.filter(c => c.faculty === facultyId);

  if (!faculty) return null;

  const pls      = staff.filter(s => s.role === 'PL');
  const prls     = staff.filter(s => s.role === 'PRL');
  const lecturers = staff.filter(s => s.role === 'Lecturer');

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={faculty.code}
        subtitle={faculty.name}
        onBack={() => navigation.goBack()}
      />
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.row4}>
          {[
            { label: 'Programmes', count: programmes.length, icon: 'layers-outline' },
            { label: 'Staff',      count: staff.length,      icon: 'people-outline' },
            { label: 'Classes',    count: classes.length,    icon: 'school-outline' },
          ].map(i => (
            <View key={i.label} style={[styles.miniCard, { borderTopColor: faculty.color }]}>
              <Ionicons name={i.icon} size={20} color={faculty.color} />
              <Text style={styles.miniCount}>{i.count}</Text>
              <Text style={styles.miniLabel}>{i.label}</Text>
            </View>
          ))}
        </View>
        <SectionTitle title="Leadership" />
        {pls.map(p => <StaffRow key={p.id} person={p} />)}
        {prls.map(p => <StaffRow key={p.id} person={p} />)}
        <SectionTitle title="Programmes" action={() => navigation.navigate('ProgrammeList', { facultyId })} />
        {programmes.slice(0, 4).map(p => (
          <Card key={p.id} onPress={() => navigation.navigate('ProgrammeDetail', { programmeId: p.id, facultyId })}>
            <View style={styles.progRow}>
              <View style={[styles.progIcon, { backgroundColor: faculty.color + '20' }]}>
                <Ionicons name="layers-outline" size={18} color={faculty.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.progName}>{p.name}</Text>
                <Text style={styles.progMeta}>{p.level} · {p.years} year(s)</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
            </View>
          </Card>
        ))}
        <SectionTitle title={`Lecturers (${lecturers.length})`} action={() => navigation.navigate('StaffList', { facultyId })} />
        {lecturers.slice(0, 5).map(l => <StaffRow key={l.id} person={l} />)}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

//programme list screen
export function ProgrammeListScreen({ route, navigation }) {
  const { facultyId } = route.params || {};
  const [query, setQuery] = useState('');
  const faculty = FACULTIES.find(f => f.id === facultyId);
  const all = facultyId
    ? (PROGRAMMES[facultyId] || []).map(item => ({ ...item, facultyId }))
    : Object.entries(PROGRAMMES).flatMap(([facultyKey, items]) =>
        items.map(item => ({ ...item, facultyId: facultyKey }))
      );
  const filtered = all.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={faculty ? `${faculty.code} Programmes` : 'All Programmes'}
        onBack={facultyId ? () => navigation.goBack() : undefined}
      />
      <View style={styles.body}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search programmes…" />
        <FlatList
          data={filtered}
          keyExtractor={item => `${item.facultyId}-${item.id}`}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const fac = FACULTIES.find(f => f.id === item.facultyId);
            return (
              <Card onPress={() => navigation.navigate('ProgrammeDetail', { programmeId: item.id, facultyId: item.facultyId || fac?.id })}>
                <View style={styles.progRow}>
                  <View style={[styles.progIcon, { backgroundColor: Colors.lightBlue }]}>
                    <Ionicons name="layers-outline" size={18} color={Colors.blue} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.progName}>{item.name}</Text>
                    <Text style={styles.progMeta}>{item.level} · {item.years} year(s) · {item.code} · {fac?.shortName || item.facultyId}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
                </View>
              </Card>
            );
          }}
          ListEmptyComponent={<EmptyState message="No programmes found" />}
        />
      </View>
    </View>
  );
}

//programme detail screen
export function ProgrammeDetailScreen({ route, navigation }) {
  const { programmeId, facultyId } = route.params;
  const programmes = PROGRAMMES[facultyId] || [];
  const programme = programmes.find(p => p.id === programmeId);
  const progClasses = CLASSES.filter(c => c.programme === programmeId);

  if (!programme) return null;

  return (
    <View style={styles.screen}>
      <ScreenHeader title={programme.code} subtitle={programme.name} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Programme Name</Text><Text style={styles.detailValue}>{programme.name}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Code</Text><Text style={styles.detailValue}>{programme.code}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Level</Text><Text style={styles.detailValue}>{programme.level}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Duration</Text><Text style={styles.detailValue}>{programme.years} year(s)</Text></View>
        </Card>

        <SectionTitle title={`Classes (${progClasses.length})`} />
        {progClasses.length === 0
          ? <EmptyState icon="school-outline" message="No classes found for this programme" />
          : progClasses.map(c => (
            <Card key={c.id} onPress={() => navigation.navigate('ClassDetail', { classId: c.id })}>
              <View style={styles.progRow}>
                <View style={[styles.progIcon, { backgroundColor: Colors.lightBlue }]}>
                  <Ionicons name="school-outline" size={18} color={Colors.blue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.progName}>{c.id}</Text>
                  <Text style={styles.progMeta}>Year {c.year} · Semester {c.semester} · {c.studentCount} students</Text>
                </View>
              </View>
            </Card>
          ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

//helpers
function SectionTitle({ title, action }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <Text onPress={action} style={styles.sectionAction}>See all →</Text>
      )}
    </View>
  );
}

function StaffRow({ person }) {
  return (
    <View style={styles.staffRow}>
      <View style={styles.staffAvatar}>
        <Text style={styles.staffInitial}>{person.name.split(' ').slice(-1)[0][0]}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.staffName}>{person.name}</Text>
        <Text style={styles.staffEmail}>{person.email}</Text>
      </View>
      <RoleBadge role={person.role} />
    </View>
  );
}

function MetaPill({ icon, value }) {
  return (
    <View style={styles.metaPill}>
      <Ionicons name={icon} size={12} color={Colors.gray} />
      <Text style={styles.metaText}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.screenBg },
  body: { flex: 1, padding: Spacing.md },
  row4: { flexDirection: 'row', gap: 8, marginBottom: Spacing.md },
  miniCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: Spacing.md, alignItems: 'center', borderTopWidth: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  miniCount: { fontSize: 20, fontWeight: '800', color: Colors.navy, marginTop: 6 },
  miniLabel: { fontSize: 11, color: Colors.gray, marginTop: 2 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md, marginBottom: Spacing.sm },
  sectionTitle: { ...Typography.h4 },
  sectionAction: { color: Colors.blue, fontSize: 13 },
  facultyAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, borderTopLeftRadius: BorderRadius.md, borderBottomLeftRadius: BorderRadius.md },
  facultyBody: { paddingLeft: 12 },
  facultyBadge: { marginBottom: 4 },
  facultyCode: { fontSize: 13, fontWeight: '800' },
  facultyName: { fontSize: 15, fontWeight: '600', color: Colors.navy, marginBottom: 8 },
  facultyMeta: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  chevron: { position: 'absolute', right: Spacing.md, top: '50%' },
  metaPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.lightBlue, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, gap: 4 },
  metaText: { fontSize: 11, color: Colors.gray },
  progRow: { flexDirection: 'row', alignItems: 'center' },
  progIcon: { borderRadius: BorderRadius.sm, padding: 8, marginRight: 12 },
  progName: { fontSize: 14, fontWeight: '600', color: Colors.navy },
  progMeta: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  staffRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.md, padding: Spacing.sm, marginBottom: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  staffAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.lightBlue, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  staffInitial: { fontSize: 14, fontWeight: '700', color: Colors.blue },
  staffName: { fontSize: 14, fontWeight: '600', color: Colors.navy },
  staffEmail: { fontSize: 11, color: Colors.gray },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  detailLabel: { fontSize: 13, color: Colors.gray },
  detailValue: { fontSize: 13, fontWeight: '600', color: Colors.navy, flex: 1, textAlign: 'right' },
});
