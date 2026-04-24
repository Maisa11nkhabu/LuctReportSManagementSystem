import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { STAFF, CLASSES, COURSES, FACULTIES, getClassDisplayName } from '../data/seedData';
import { Colors, Spacing, BorderRadius, Typography } from '../theme';
import { Card, SearchBar, ScreenHeader, RoleBadge, EmptyState, Button } from '../components/UI';

export function StaffListScreen({ route, navigation }) {
  const { facultyId } = route?.params || {};
  const [query, setQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const { user } = useAuth();

  const baseStaff = facultyId
    ? STAFF.filter(item => item.faculty === facultyId)
    : STAFF.filter(item => item.faculty === user?.faculty);

  const roles = ['All', 'PL', 'PRL', 'Lecturer'];
  const filtered = baseStaff.filter(item => {
    const matchQuery = item.name.toLowerCase().includes(query.toLowerCase()) || item.role.toLowerCase().includes(query.toLowerCase());
    const matchRole = filterRole === 'All' || item.role === filterRole;
    return matchQuery && matchRole;
  });

  const faculty = FACULTIES.find(item => item.id === (facultyId || user?.faculty));

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Staff" subtitle={faculty ? faculty.shortName : 'All Faculties'} onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search staff..." />
        <View style={styles.chipRow}>
          {roles.map(role => (
            <Text key={role} onPress={() => setFilterRole(role)} style={[styles.chip, filterRole === role && styles.chipActive]}>
              {role}
            </Text>
          ))}
        </View>
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card onPress={() => navigation.navigate('StaffDetail', { staffId: item.id })}>
              <View style={styles.staffRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.name.split(' ').slice(-1)[0][0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.staffName}>{item.name}</Text>
                  <Text style={styles.staffEmail}>{item.email}</Text>
                  <Text style={styles.staffFaculty}>{item.faculty}</Text>
                </View>
                <RoleBadge role={item.role} />
              </View>
            </Card>
          )}
          ListEmptyComponent={<EmptyState icon="people-outline" message="No staff found" />}
        />
      </View>
    </View>
  );
}

export function StaffDetailScreen({ route, navigation }) {
  const { staffId } = route.params;
  const { timetable } = useAppData();
  const person = STAFF.find(item => item.id === staffId);
  if (!person) return null;

  const myClasses = timetable.filter(slot => slot.lecturerId === staffId);

  return (
    <View style={styles.screen}>
      <ScreenHeader title={person.name} subtitle={person.role} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={styles.profileHeader}>
            <View style={styles.bigAvatar}>
              <Text style={styles.bigAvatarText}>{person.name.split(' ').slice(-1)[0][0]}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.profileName}>{person.name}</Text>
              <RoleBadge role={person.role} />
              <Text style={styles.profileEmail}>{person.email}</Text>
            </View>
          </View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Faculty</Text><Text style={styles.detailValue}>{person.faculty}</Text></View>
        </Card>

        {myClasses.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Assigned Classes ({myClasses.length})</Text>
            {myClasses.map((slot, index) => (
              <Card key={slot.id || index}>
                <Text style={styles.classCode}>{slot.classId}</Text>
                <Text style={styles.classMeta}>{slot.day} · {slot.time} · {slot.venue}</Text>
              </Card>
            ))}
          </>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

export function ClassesScreen({ navigation }) {
  const { user } = useAuth();
  const { timetable } = useAppData();
  const [query, setQuery] = useState('');

  const myClasses = CLASSES.filter(item => item.faculty === user?.faculty);

  const filtered = myClasses.filter(item =>
    item.id.toLowerCase().includes(query.toLowerCase()) ||
    item.programme.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Classes" subtitle={`${filtered.length} classes`} onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search classes..." />
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const slots = timetable.filter(slot => slot.classId === item.id);
            return (
              <Card onPress={() => navigation.navigate('ClassDetail', { classId: item.id })}>
                <View style={styles.classRow}>
                  <View style={[styles.classIcon, { backgroundColor: Colors.lightBlue }]}>
                    <Ionicons name="school-outline" size={20} color={Colors.blue} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.classCode}>{item.id}</Text>
                    <Text style={styles.classMeta}>{getClassDisplayName(item.id)}</Text>
                    <View style={styles.chipRowSmall}>
                      <Text style={styles.smallChip}>Year {item.year}</Text>
                      <Text style={styles.smallChip}>Sem {item.semester}</Text>
                      <Text style={styles.smallChip}>{item.studentCount} students</Text>
                      <Text style={styles.smallChip}>{slots.length} slots</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
                </View>
              </Card>
            );
          }}
          ListEmptyComponent={<EmptyState icon="school-outline" message="No classes found" />}
        />
      </View>
    </View>
  );
}

export function ClassDetailScreen({ route, navigation }) {
  const { classId } = route.params;
  const { timetable } = useAppData();
  const item = CLASSES.find(entry => entry.id === classId);
  const slots = timetable.filter(slot => slot.classId === classId);
  if (!item) return null;

  return (
    <View style={styles.screen}>
      <ScreenHeader title={item.id} subtitle={getClassDisplayName(item.id)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Programme</Text><Text style={styles.detailValue}>{item.programme}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Year</Text><Text style={styles.detailValue}>{item.year}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Semester</Text><Text style={styles.detailValue}>{item.semester}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Students</Text><Text style={styles.detailValue}>{item.studentCount}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Faculty</Text><Text style={styles.detailValue}>{item.faculty}</Text></View>
        </Card>

        <Text style={styles.sectionTitle}>Timetable ({slots.length} slots)</Text>
        {slots.length === 0 ? <EmptyState icon="calendar-outline" message="No timetable entries" /> : slots.map((slot, index) => {
          const course = COURSES.find(entry => entry.id === slot.courseId);
          const lecturer = STAFF.find(entry => entry.id === slot.lecturerId);
          return (
            <Card key={slot.id || index}>
              <Text style={styles.classCode}>{course?.name || slot.courseId}</Text>
              <Text style={styles.classMeta}>{slot.day} · {slot.time} · {slot.venue}</Text>
              {lecturer && <Text style={styles.classMeta}>Lecturer: {lecturer.name}</Text>}
            </Card>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

export function CoursesScreen({ navigation }) {
  const { user } = useAuth();
  const { timetable } = useAppData();
  const [query, setQuery] = useState('');
  const myCourses = COURSES.filter(item => item.faculty === user?.faculty);
  const filtered = myCourses.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Courses" subtitle={`${filtered.length} courses`} onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search courses..." />
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const slots = timetable.filter(slot => slot.courseId === item.id);
            return (
              <Card>
                <View style={styles.courseRow}>
                  <View style={[styles.classIcon, { backgroundColor: Colors.lightBlue }]}>
                    <Ionicons name="book-outline" size={18} color={Colors.blue} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.classCode}>{item.name}</Text>
                    <Text style={styles.classMeta}>{item.code} · {item.faculty}</Text>
                    <Text style={styles.classMeta}>{slots.length} class slot(s)</Text>
                  </View>
                </View>
              </Card>
            );
          }}
          ListEmptyComponent={<EmptyState icon="book-outline" message="No courses found" />}
        />
      </View>
    </View>
  );
}

export function LecturesScreen({ navigation }) {
  const { user } = useAuth();
  const { timetable, removeTimetableSlot } = useAppData();
  const [query, setQuery] = useState('');
  const slots = timetable.filter(slot => {
    const cls = CLASSES.find(item => item.id === slot.classId);
    return cls?.faculty === user?.faculty;
  });

  const filtered = slots.filter(slot => {
    const course = COURSES.find(item => item.id === slot.courseId);
    const lecturer = STAFF.find(item => item.id === slot.lecturerId);
    return (
      slot.classId.toLowerCase().includes(query.toLowerCase()) ||
      (course?.name || '').toLowerCase().includes(query.toLowerCase()) ||
      (lecturer?.name || '').toLowerCase().includes(query.toLowerCase())
    );
  });

  const canAssign = user?.role === 'PL';

  const handleDelete = (slot) => {
    Alert.alert('Remove assignment', 'Delete this lecturer-module assignment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeTimetableSlot(slot.id || `${slot.classId}-${slot.courseId}-${slot.lecturerId}-${slot.day}-${slot.time}`);
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Lectures"
        subtitle={`${filtered.length} scheduled`}
        onBack={() => navigation.goBack()}
        right={canAssign ? (
          <TouchableOpacity onPress={() => navigation.navigate('AssignLecture')} style={styles.headerBtn}>
            <Ionicons name="add" size={20} color={Colors.white} />
          </TouchableOpacity>
        ) : null}
      />
      <View style={styles.body}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search lectures..." />
        <FlatList
          data={filtered}
          keyExtractor={(item, index) => item.id || String(index)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const course = COURSES.find(entry => entry.id === item.courseId);
            const lecturer = STAFF.find(entry => entry.id === item.lecturerId);
            return (
              <Card>
                <Text style={styles.classCode}>{course?.name || item.courseId}</Text>
                <Text style={styles.classMeta}>{item.classId} · {item.day} · {item.time}</Text>
                <Text style={styles.classMeta}>Venue: {item.venue} · {item.type}</Text>
                {lecturer && <Text style={styles.classMeta}>Lecturer: {lecturer.name}</Text>}
                {canAssign && (
                  <TouchableOpacity style={styles.deleteLink} onPress={() => handleDelete(item)}>
                    <Ionicons name="trash-outline" size={14} color={Colors.danger} />
                    <Text style={styles.deleteLinkText}>Remove assignment</Text>
                  </TouchableOpacity>
                )}
              </Card>
            );
          }}
          ListEmptyComponent={<EmptyState icon="mic-outline" message="No lectures found" />}
        />
      </View>
    </View>
  );
}

export function AssignLectureScreen({ navigation }) {
  const { user } = useAuth();
  const { addTimetableSlot } = useAppData();
  const classes = CLASSES.filter(item => item.faculty === user?.faculty);
  const facultyCourses = COURSES.filter(item => item.faculty === user?.faculty);
  const lecturers = STAFF.filter(item => item.role === 'Lecturer' && item.faculty === user?.faculty);

  const [courseId, setCourseId] = useState(facultyCourses[0]?.id || '');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [lecturerId, setLecturerId] = useState(lecturers[0]?.id || '');
  const [day, setDay] = useState('Monday');
  const [time, setTime] = useState('08:30-10:30');
  const [venue, setVenue] = useState('Room 1');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['08:30-10:30', '10:30-12:30', '12:30-14:30', '14:30-16:30'];

  const handleSave = async () => {
    if (!courseId || !classId || !lecturerId || !day || !time || !venue.trim()) {
      Alert.alert('Missing details', 'Complete all assignment fields first.');
      return;
    }

    await addTimetableSlot({
      classId,
      courseId,
      lecturerId,
      day,
      time,
      venue: venue.trim(),
      type: 'Lecture',
    });

    Alert.alert('Assignment saved', 'The lecturer has been assigned to the selected module.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Assign Module" subtitle="Programme Leader tools" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.sectionTitle}>Course</Text>
          <ChoiceGroup value={courseId} onChange={setCourseId} options={facultyCourses.map(item => ({ value: item.id, label: item.code }))} />

          <Text style={styles.sectionTitle}>Class</Text>
          <ChoiceGroup value={classId} onChange={setClassId} options={classes.map(item => ({ value: item.id, label: item.id }))} />

          <Text style={styles.sectionTitle}>Lecturer</Text>
          <ChoiceGroup value={lecturerId} onChange={setLecturerId} options={lecturers.map(item => ({ value: item.id, label: item.name }))} />

          <Text style={styles.sectionTitle}>Day</Text>
          <ChoiceGroup value={day} onChange={setDay} options={days.map(item => ({ value: item, label: item }))} />

          <Text style={styles.sectionTitle}>Time</Text>
          <ChoiceGroup value={time} onChange={setTime} options={times.map(item => ({ value: item, label: item }))} />

          <Text style={styles.sectionTitle}>Venue</Text>
          <TextInput
            value={venue}
            onChangeText={setVenue}
            placeholder="Room or lab"
            placeholderTextColor={Colors.gray}
            style={styles.input}
          />

          <Button title="Save Assignment" onPress={handleSave} style={{ marginTop: 12 }} />
        </Card>
      </ScrollView>
    </View>
  );
}

function ChoiceGroup({ value, onChange, options }) {
  return (
    <View style={styles.choiceWrap}>
      {options.map(option => (
        <TouchableOpacity
          key={option.value}
          onPress={() => onChange(option.value)}
          style={[styles.choiceChip, value === option.value && styles.choiceChipActive]}
        >
          <Text style={[styles.choiceChipText, value === option.value && styles.choiceChipTextActive]}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.screenBg },
  body: { flex: 1, padding: Spacing.md },
  headerBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 18, padding: 6 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.sm },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.lightBlue, fontSize: 13, color: Colors.gray, fontWeight: '500' },
  chipActive: { backgroundColor: Colors.navy, color: Colors.white },
  staffRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.lightBlue, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 16, fontWeight: '700', color: Colors.blue },
  staffName: { fontSize: 14, fontWeight: '600', color: Colors.navy },
  staffEmail: { fontSize: 11, color: Colors.gray, marginTop: 1 },
  staffFaculty: { fontSize: 11, color: Colors.blue, marginTop: 1 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  bigAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.lightBlue, alignItems: 'center', justifyContent: 'center' },
  bigAvatarText: { fontSize: 24, fontWeight: '800', color: Colors.blue },
  profileName: { fontSize: 16, fontWeight: '700', color: Colors.navy, marginBottom: 6 },
  profileEmail: { fontSize: 12, color: Colors.gray, marginTop: 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  detailLabel: { fontSize: 13, color: Colors.gray },
  detailValue: { fontSize: 13, fontWeight: '600', color: Colors.navy, flex: 1, textAlign: 'right' },
  sectionTitle: { ...Typography.h4, marginTop: Spacing.md, marginBottom: Spacing.sm },
  classRow: { flexDirection: 'row', alignItems: 'center' },
  classIcon: { borderRadius: BorderRadius.sm, padding: 10, marginRight: 12 },
  classCode: { fontSize: 14, fontWeight: '700', color: Colors.navy },
  classMeta: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  chipRowSmall: { flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  smallChip: { fontSize: 11, backgroundColor: Colors.lightBlue, color: Colors.navy, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  courseRow: { flexDirection: 'row', alignItems: 'center' },
  deleteLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, alignSelf: 'flex-end' },
  deleteLinkText: { color: Colors.danger, fontSize: 12, fontWeight: '600' },
  choiceWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choiceChip: {
    backgroundColor: Colors.lightBlue,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  choiceChipActive: { backgroundColor: Colors.blue },
  choiceChipText: { color: Colors.navy, fontSize: 12, fontWeight: '600' },
  choiceChipTextActive: { color: Colors.white },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.lightBlue,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    color: Colors.black,
  },
});
