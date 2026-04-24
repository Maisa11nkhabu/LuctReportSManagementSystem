import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView,
  TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useReports } from '../context/ReportsContext';
import {
  STAFF, CLASSES, COURSES, FACULTIES,
  getClassDisplayName,
} from '../data/seedData';
import { Colors, Spacing, BorderRadius, Typography } from '../theme';
import { Card, SearchBar, ScreenHeader, Button, EmptyState, StatCard } from '../components/UI';
import { exportExcel, REPORT_COLUMNS, ATTENDANCE_COLUMNS } from '../utils/exportUtils';

async function exportWithFeedback(rows, columns, filename, title, emptyMessage = 'There is nothing to export yet.') {
  if (!rows?.length) {
    Alert.alert('No data', emptyMessage);
    return { success: false, error: 'No rows to export.' };
  }

  const result = await exportExcel(rows, columns, filename, title);
  if (!result.success) {
    Alert.alert('Export failed', result.error || 'The file could not be exported.');
  }
  return result;
}

//reports screen
export function ReportsScreen({ navigation }) {
  const { user } = useAuth();
  const { reports, deleteReport } = useReports();
  const [query,  setQuery]  = useState('');
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [exporting, setExporting] = useState(false);

  const staff = STAFF.find(s => s.id === user?.staffId);

  let scoped = reports;
  if (user?.role === 'Lecturer') {
    scoped = reports.filter(r => staff && r.lecturerName === staff.name);
  } else if (user?.role === 'PRL' || user?.role === 'PL') {
    const fac = FACULTIES.find(f => f.id === user?.faculty);
    if (fac) scoped = reports.filter(r => r.facultyName === fac.name);
  }

  let filtered = scoped.filter(r => {
    const q = query.toLowerCase();
    const matchQ =
      r.courseName.toLowerCase().includes(q) ||
      r.lecturerName.toLowerCase().includes(q) ||
      r.className.toLowerCase().includes(q) ||
      r.courseCode.toLowerCase().includes(q) ||
      (r.week || '').toLowerCase().includes(q);
    const matchF = filter === 'All' || r.status === filter;
    return matchQ && matchF;
  });

  if (sortBy === 'newest') filtered = [...filtered].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (sortBy === 'oldest') filtered = [...filtered].sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
  if (sortBy === 'class')  filtered = [...filtered].sort((a,b) => a.className.localeCompare(b.className));

  const doExport = async () => {
    setExporting(true);
    try {
      await exportWithFeedback(filtered, REPORT_COLUMNS, 'LUCT_Reports', 'LUCT Reports', 'No reports match the current filters.');
    } finally {
      setExporting(false);
    }
  };

  const confirmDelete = (id) => {
    Alert.alert('Delete Report', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteReport(id) },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Reports"
        subtitle={filtered.length + ' results'}
        onBack={() => navigation.goBack()}
        right={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {user?.role === 'Lecturer' && (
              <TouchableOpacity onPress={() => navigation.navigate('ReportForm')} style={styles.headerBtn}>
                <Ionicons name="add" size={20} color={Colors.white} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={doExport} style={styles.headerBtn}>
              <Ionicons name={exporting ? 'hourglass-outline' : 'download-outline'} size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        }
      />
      <View style={styles.body}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search by course, class, lecturer..." />
        <View style={styles.chipRow}>
          {['All','Submitted','Reviewed'].map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.chip, filter===f && styles.chipActive]}>
              <Text style={[styles.chipText, filter===f && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.sortBtn} onPress={() => {
            const opts = ['newest','oldest','class'];
            setSortBy(opts[(opts.indexOf(sortBy)+1)%opts.length]);
          }}>
            <Ionicons name="swap-vertical-outline" size={13} color={Colors.blue} />
            <Text style={styles.sortText}>{sortBy}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const rate = item.registeredStudents > 0
              ? Math.round((item.studentsPresent/item.registeredStudents)*100) : 0;
            const barColor = rate >= 75 ? Colors.success : rate >= 50 ? Colors.warning : Colors.danger;
            return (
              <Card onPress={() => navigation.navigate('ReportDetail', { reportId: item.id })}>
                <View style={[styles.statusStrip, { backgroundColor: item.status==='Reviewed' ? Colors.success : Colors.warning }]} />
                <View style={styles.reportHeader}>
                  <View style={{ flex:1, paddingLeft:10 }}>
                    <Text style={styles.reportTitle} numberOfLines={1}>{item.courseName}</Text>
                    <Text style={styles.reportCode}>{item.courseCode}</Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: item.status==='Reviewed' ? '#DCFCE7':'#FEF3C7' }]}>
                    <Text style={[styles.statusText, { color: item.status==='Reviewed' ? Colors.success : Colors.warning }]}>{item.status}</Text>
                  </View>
                </View>
                <View style={styles.metaRow}>
                  <MetaTag icon="school-outline"   text={item.className} />
                  <MetaTag icon="person-outline"   text={item.lecturerName.replace(/Mr\.|Ms\.|Mrs\./,'').trim()} />
                  <MetaTag icon="calendar-outline" text={item.dateOfLecture} />
                  <MetaTag icon="bookmark-outline" text={item.week} />
                </View>
                <View style={styles.barWrap}>
                  <View style={[styles.barFill, { width: rate+'%', backgroundColor: barColor }]} />
                </View>
                <Text style={styles.barLabel}>{item.studentsPresent}/{item.registeredStudents} present · {rate}%</Text>
                {item.prlFeedback && (
                  <View style={styles.feedbackRow}>
                    <Ionicons name="chatbubble-outline" size={12} color={Colors.blue} />
                    <Text style={styles.feedbackSnip} numberOfLines={1}> {item.prlFeedback}</Text>
                  </View>
                )}
                {user?.role==='Lecturer' && (
                  <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={13} color={Colors.danger} />
                    <Text style={styles.deleteBtnText}> Delete</Text>
                  </TouchableOpacity>
                )}
              </Card>
            );
          }}
          ListEmptyComponent={<EmptyState icon="document-text-outline" message={query ? 'No reports match your search' : 'No reports yet'} />}
        />
      </View>
    </View>
  );
}

//report detail screen
export function ReportDetailScreen({ route, navigation }) {
  const { reportId } = route.params;
  const { reports, updateReportFeedback } = useReports();
  const { user } = useAuth();
  const report = reports.find(r => r.id === reportId);
  const [feedback, setFeedback] = useState('');
  const [saving,   setSaving]   = useState(false);

  useEffect(() => { if (report?.prlFeedback) setFeedback(report.prlFeedback); }, [report]);

  if (!report) return (
    <View style={styles.screen}>
      <ScreenHeader title="Report" onBack={() => navigation.goBack()} />
      <EmptyState icon="alert-circle-outline" message="Report not found" />
    </View>
  );

  const canReview = ['PRL','PL'].includes(user?.role);
  const rate = report.registeredStudents > 0
    ? Math.round((report.studentsPresent/report.registeredStudents)*100) : 0;

  const saveFeedback = () => {
    if (!feedback.trim()) { Alert.alert('Empty','Please enter feedback'); return; }
    setSaving(true);
    setTimeout(() => {
      updateReportFeedback(reportId, feedback.trim());
      setSaving(false);
      Alert.alert('Saved','Feedback saved successfully');
    }, 500);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Report Detail"
        subtitle={report.courseCode + ' · ' + report.week}
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => exportWithFeedback([report], REPORT_COLUMNS, 'Report_'+report.courseCode, `Report ${report.courseCode}`)} style={styles.headerBtn}>
            <Ionicons name="download-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        }
      />
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <Card style={{ marginBottom: Spacing.sm }}>
          <View style={{ flexDirection:'row', alignItems:'center' }}>
            <View style={[styles.bigCircle, { borderColor: rate>=75 ? Colors.success : Colors.warning }]}>
              <Text style={[styles.bigPct, { color: rate>=75 ? Colors.success : Colors.warning }]}>{rate}%</Text>
              <Text style={styles.bigPctLbl}>Present</Text>
            </View>
            <View style={{ flex:1, marginLeft:16 }}>
              <Text style={styles.reportTitle}>{report.courseName}</Text>
              <Text style={styles.reportCode}>{report.courseCode}</Text>
              <View style={[styles.statusPill, { backgroundColor: report.status==='Reviewed'?'#DCFCE7':'#FEF3C7', marginTop:8, alignSelf:'flex-start' }]}>
                <Text style={[styles.statusText, { color: report.status==='Reviewed'?Colors.success:Colors.warning }]}>{report.status}</Text>
              </View>
            </View>
          </View>
        </Card>
        <Card>
          <Text style={styles.sectionTitle}>Lecture Details</Text>
          {[['Faculty',report.facultyName],['Class',report.className],['Lecturer',report.lecturerName],
            ['Week',report.week],['Date',report.dateOfLecture],['Venue',report.venue],
            ['Time',report.scheduledTime],['Present',report.studentsPresent+' / '+report.registeredStudents]
          ].map(([l,v]) => (
            <View key={l} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{l}</Text>
              <Text style={styles.detailValue}>{v}</Text>
            </View>
          ))}
        </Card>
        <Card>
          <Text style={styles.sectionTitle}>Academic Content</Text>
          <ContentBlock label="Topic Taught"       text={report.topicTaught} />
          <ContentBlock label="Learning Outcomes"  text={report.learningOutcomes} />
          <ContentBlock label="Recommendations"    text={report.recommendations} />
        </Card>
        {canReview ? (
          <Card>
            <Text style={styles.sectionTitle}>PRL Feedback</Text>
            <TextInput value={feedback} onChangeText={setFeedback} placeholder="Type feedback..."
              multiline numberOfLines={4}
              style={styles.feedbackInput} placeholderTextColor={Colors.gray} />
            <Button title={saving ? 'Saving...' : 'Save Feedback'} onPress={saveFeedback} loading={saving} style={{ marginTop:8 }} />
          </Card>
        ) : report.prlFeedback ? (
          <Card>
            <Text style={styles.sectionTitle}>PRL Feedback</Text>
            <Text style={styles.bodyText}>{report.prlFeedback}</Text>
          </Card>
        ) : null}
        <View style={{ height:40 }} />
      </ScrollView>
    </View>
  );
}

//report form screen
export function ReportFormScreen({ navigation }) {
  const { user }      = useAuth();
  const { timetable } = useAppData();
  const { addReport } = useReports();
  const staff   = STAFF.find(s => s.id === user?.staffId);
  const faculty = FACULTIES.find(f => f.id === staff?.faculty);
  const mySlots = timetable.filter(t => t.lecturerId === user?.staffId);
  const WEEKS   = Array.from({ length:14 }, (_,i) => 'Week '+(i+1));

  const [form, setForm] = useState({
    facultyName:'', className:'', week:'Week 8', dateOfLecture: new Date().toISOString().slice(0,10),
    courseName:'', courseCode:'', lecturerName: staff?.name||'', studentsPresent:'',
    registeredStudents:'', venue:'', scheduledTime:'', topicTaught:'', learningOutcomes:'', recommendations:'',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep]       = useState(0);

  useEffect(() => {
    if (faculty) setForm(f => ({ ...f, facultyName: faculty.name }));
  }, []);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }));
  };

  const handleSlot = (slot) => {
    const course = COURSES.find(c => c.id === slot.courseId);
    const cls    = CLASSES.find(c => c.id === slot.classId);
    setForm(f => ({
      ...f,
      className:          slot.classId,
      venue:              slot.venue,
      scheduledTime:      slot.time,
      courseName:         course?.name || '',
      courseCode:         course?.code || '',
      registeredStudents: String(cls?.studentCount || ''),
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.facultyName?.trim())   e.facultyName = 'Required';
    if (!form.lecturerName?.trim())  e.lecturerName = 'Required';
    if (!form.className?.trim())     e.className = 'Required';
    if (!form.courseName?.trim())    e.courseName = 'Required';
    if (!form.courseCode?.trim())    e.courseCode = 'Required';
    if (!form.venue?.trim())         e.venue = 'Required';
    if (!form.scheduledTime?.trim()) e.scheduledTime = 'Required';
    if (!form.topicTaught?.trim())   e.topicTaught = 'Required';
    if (!form.studentsPresent?.trim()) e.studentsPresent  = 'Required';
    if (!form.dateOfLecture?.trim()) e.dateOfLecture = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const getFirstInvalidStep = () => {
    if (!form.className?.trim() || !form.courseName?.trim() || !form.courseCode?.trim() || !form.venue?.trim() || !form.scheduledTime?.trim()) return 0;
    if (!form.dateOfLecture?.trim() || !form.studentsPresent?.trim()) return 1;
    if (!form.topicTaught?.trim()) return 2;
    return 0;
  };

  const submit = async () => {
    if (!validate()) {
      setStep(getFirstInvalidStep());
      Alert.alert('Incomplete','Fill in every required field before submitting.');
      return;
    }
    setLoading(true);
    try {
      await addReport({ ...form, studentsPresent: parseInt(form.studentsPresent)||0, registeredStudents: parseInt(form.registeredStudents)||0 });
      setLoading(false);
      Alert.alert('Submitted','Report submitted successfully',[{ text:'OK', onPress:()=>navigation.goBack() }]);
    } catch (error) {
      setLoading(false);
      Alert.alert('Submission failed', error?.message || 'Could not save the report.');
    }
  };

  const STEPS = ['Setup','Details','Content'];

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Submit Report" subtitle="Lecture Reporting Form" onBack={() => navigation.goBack()} />
      <View style={styles.stepBar}>
        {STEPS.map((s,i) => (
          <TouchableOpacity key={s} onPress={() => setStep(i)} style={styles.stepItem}>
            <View style={[styles.stepDot, i===step&&styles.stepDotActive, i<step&&styles.stepDotDone]}>
              {i < step
                ? <Ionicons name="checkmark" size={12} color={Colors.white} />
                : <Text style={[styles.stepNum, i===step&&{color:Colors.white}]}>{i+1}</Text>}
            </View>
            <Text style={[styles.stepLabel, i===step&&styles.stepLabelActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {step===0 && (
          <Card>
            <Text style={styles.sectionTitle}>Step 1: Class Setup</Text>
            <FF label="Faculty Name *"   value={form.facultyName}  onChangeText={v=>set('facultyName',v)} error={errors.facultyName} />
            <FF label="Lecturer Name *"  value={form.lecturerName} onChangeText={v=>set('lecturerName',v)} error={errors.lecturerName} />
            <Text style={styles.formLabel}>Select Class *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:12 }}>
              {mySlots.length===0
                ? <Text style={styles.hintText}>No timetable entries found.</Text>
                : mySlots.map((slot,idx) => {
                    const course = COURSES.find(c => c.id===slot.courseId);
                    const active = form.className===slot.classId && form.scheduledTime===slot.time;
                    return (
                      <TouchableOpacity key={idx} onPress={() => handleSlot(slot)}
                        style={[styles.slotCard, active&&styles.slotCardActive]}>
                        <Text style={[styles.slotClass, active&&{color:Colors.white}]}>{slot.classId}</Text>
                        <Text style={[styles.slotCourse, active&&{color:'#D7E5EE'}]} numberOfLines={2}>{course?.name||slot.courseId}</Text>
                        <Text style={[styles.slotTime,  active&&{color:'#D7E5EE'}]}>{slot.day} {slot.time}</Text>
                        <Text style={[styles.slotVenue, active&&{color:'#D7E5EE'}]}>📍 {slot.venue}</Text>
                      </TouchableOpacity>
                    );
                  })}
            </ScrollView>
            {errors.className && <Text style={styles.errorText}>{errors.className}</Text>}
            <FF label="Class Name *"  value={form.className} onChangeText={v=>set('className',v)} error={errors.className} />
            <FF label="Course Name *" value={form.courseName} onChangeText={v=>set('courseName',v)} error={errors.courseName} />
            <FF label="Course Code *" value={form.courseCode} onChangeText={v=>set('courseCode',v)} error={errors.courseCode} />
            <FF label="Venue *" value={form.venue} onChangeText={v=>set('venue',v)} error={errors.venue} />
            <FF label="Scheduled Time *" value={form.scheduledTime} onChangeText={v=>set('scheduledTime',v)} error={errors.scheduledTime} />
            <Button title="Next →" onPress={() => setStep(1)} style={{ marginTop:8 }} />
          </Card>
        )}

        {step===1 && (
          <Card>
            <Text style={styles.sectionTitle}>Step 2: Reporting Details</Text>
            <Text style={styles.formLabel}>Week of Reporting *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:12 }}>
              {WEEKS.map(w => (
                <TouchableOpacity key={w} onPress={() => set('week',w)} style={[styles.weekChip, form.week===w&&styles.weekChipActive]}>
                  <Text style={[styles.weekChipText, form.week===w&&{color:Colors.white}]}>{w}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <FF label="Date of Lecture *"      value={form.dateOfLecture}      onChangeText={v=>set('dateOfLecture',v)}      error={errors.dateOfLecture} />
            <FF label="Students Present *"      value={form.studentsPresent}    onChangeText={v=>set('studentsPresent',v)}    keyboardType="numeric" error={errors.studentsPresent} />
            <FF label="Registered Students"     value={form.registeredStudents} onChangeText={v=>set('registeredStudents',v)} keyboardType="numeric" />
            {form.studentsPresent && form.registeredStudents ? (
              <View style={styles.attendPreview}>
                <Text style={styles.attendPreviewLabel}>Attendance Preview</Text>
                <View style={styles.barWrap}>
                  <View style={[styles.barFill, { width: Math.min(100,(parseInt(form.studentsPresent)/parseInt(form.registeredStudents))*100)+'%', backgroundColor: Colors.blue }]} />
                </View>
                <Text style={styles.barLabel}>{Math.round((parseInt(form.studentsPresent)/parseInt(form.registeredStudents))*100)}%</Text>
              </View>
            ) : null}
            <View style={styles.navRow}>
              <Button title="← Back" onPress={()=>setStep(0)} variant="outline" style={{ flex:1, marginRight:8 }} />
              <Button title="Next →" onPress={()=>setStep(2)} style={{ flex:1 }} />
            </View>
          </Card>
        )}

        {step===2 && (
          <Card>
            <Text style={styles.sectionTitle}>Step 3: Academic Content</Text>
            <FF label="Topic Taught *"     value={form.topicTaught}      onChangeText={v=>set('topicTaught',v)}      multiline error={errors.topicTaught} />
            <FF label="Learning Outcomes"  value={form.learningOutcomes} onChangeText={v=>set('learningOutcomes',v)} multiline />
            <FF label="Recommendations"    value={form.recommendations}  onChangeText={v=>set('recommendations',v)}  multiline />
            <View style={styles.navRow}>
              <Button title="← Back"        onPress={()=>setStep(1)} variant="outline" style={{ flex:1, marginRight:8 }} />
              <Button title="Submit Report"  onPress={submit} loading={loading} style={{ flex:1 }} />
            </View>
          </Card>
        )}

        <View style={{ height:60 }} />
      </ScrollView>
    </View>
  );
}

//attendance screen
export function AttendanceScreen({ navigation }) {
  const { user }    = useAuth();
  const { reports } = useReports();
  const [query, setQuery] = useState('');

  const staff = STAFF.find(s => s.id === user?.staffId);
  let myReports = user?.role === 'Lecturer'
    ? reports.filter(r => staff && r.lecturerName === staff.name)
    : reports.filter(r => { const fac=FACULTIES.find(f=>f.id===user?.faculty); return fac&&r.facultyName===fac.name; });

  const enriched = myReports.map(r => ({
    ...r,
    attendanceRate: r.registeredStudents>0 ? Math.round((r.studentsPresent/r.registeredStudents)*100) : 0,
  }));
  const filtered = enriched.filter(r =>
    r.courseName.toLowerCase().includes(query.toLowerCase()) ||
    r.className.toLowerCase().includes(query.toLowerCase())
  );
  const avgRate = enriched.length>0
    ? Math.round(enriched.reduce((a,r)=>a+r.attendanceRate,0)/enriched.length) : 0;
  const below75 = enriched.filter(r=>r.attendanceRate<75).length;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Attendance" subtitle="Session tracking" onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => exportWithFeedback(filtered.map(r=>({...r,attendanceRate:r.attendanceRate+'%'})), ATTENDANCE_COLUMNS,'LUCT_Attendance', 'LUCT Attendance', 'No attendance records are available to export.')} style={styles.headerBtn}>
            <Ionicons name="download-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        }
      />
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={{ flex:1 }}><StatCard label="Avg Rate" value={avgRate+'%'} icon="stats-chart-outline" color={avgRate>=75?Colors.success:Colors.warning} /></View>
          <View style={{ flex:1 }}><StatCard label="Below 75%" value={below75} icon="alert-circle-outline" color={Colors.danger} /></View>
        </View>
        <StatCard label="Sessions Tracked" value={enriched.length} icon="calendar-outline" color={Colors.blue} />
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search sessions..." />
        {filtered.map(r => {
          const color = r.attendanceRate>=75 ? Colors.success : r.attendanceRate>=50 ? Colors.warning : Colors.danger;
          return (
            <Card key={r.id} onPress={() => navigation.navigate('ReportDetail', { reportId: r.id })}>
              <View style={{ flexDirection:'row', alignItems:'center' }}>
                <View style={[styles.attendCircle, { borderColor: color }]}>
                  <Text style={[styles.attendPct, { color }]}>{r.attendanceRate}%</Text>
                </View>
                <View style={{ flex:1, marginLeft:12 }}>
                  <Text style={styles.reportTitle}>{r.courseName}</Text>
                  <Text style={styles.classMeta}>{r.className} · {r.dateOfLecture} · {r.week}</Text>
                  <View style={styles.barWrap}>
                    <View style={[styles.barFill, { width: r.attendanceRate+'%', backgroundColor: color }]} />
                  </View>
                  <Text style={styles.barLabel}>{r.studentsPresent} / {r.registeredStudents} students</Text>
                </View>
              </View>
            </Card>
          );
        })}
        {filtered.length===0 && <EmptyState icon="people-outline" message="No attendance data yet" />}
        <View style={{ height:32 }} />
      </ScrollView>
    </View>
  );
}

//rating screen
export function RatingScreen({ navigation }) {
  const { user } = useAuth();
  const { ratings: savedRatings, saveRating: persistRating, deleteRating: removeRating } = useAppData();
  const staff = STAFF.find(item => item.id === user?.staffId);
  const facultyId = staff?.faculty || user?.faculty;
  const [ratings,  setRatings]  = useState(() =>
    savedRatings
      .filter(item => item.studentId === user?.id)
      .reduce((acc, item) => ({ ...acc, [item.lecturerId]: item.rating }), {})
  );
  const [comments, setComments] = useState({});
  const [saved,    setSaved]    = useState(() =>
    savedRatings
      .filter(item => item.studentId === user?.id)
      .reduce((acc, item) => ({ ...acc, [item.lecturerId]: true }), {})
  );

  const lecturers = STAFF.filter(s => s.role==='Lecturer' && s.faculty===user?.faculty).slice(0,12);
  const avgRating = Object.values(ratings).length>0
    ? (Object.values(ratings).reduce((a,v)=>a+v,0)/Object.values(ratings).length).toFixed(1) : '—';

  useEffect(() => {
    const mySavedRatings = savedRatings.filter(item => item.studentId === user?.id);
    setRatings(mySavedRatings.reduce((acc, item) => ({ ...acc, [item.lecturerId]: item.rating }), {}));
    setComments(mySavedRatings.reduce((acc, item) => ({ ...acc, [item.lecturerId]: item.comment || '' }), {}));
    setSaved(mySavedRatings.reduce((acc, item) => ({ ...acc, [item.lecturerId]: true }), {}));
  }, [savedRatings, user?.id]);

  const isStudent = user?.role === 'Student';
  const visibleRatings = isStudent
    ? []
    : savedRatings.filter(item => {
        if (user?.role === 'Lecturer') return item.lecturerId === user?.staffId;
        if (user?.role === 'PRL' || user?.role === 'PL') return item.faculty === facultyId;
        return true;
      });

  const ratingAverage = visibleRatings.length > 0
    ? (visibleRatings.reduce((sum, item) => sum + Number(item.rating || 0), 0) / visibleRatings.length).toFixed(1)
    : '0.0';

  const submitRating = async (id) => {
    if (!ratings[id]) { Alert.alert('No star selected','Please tap a star first'); return; }
    await persistRating({
      studentId: user?.id,
      lecturerId: id,
      rating: ratings[id],
      comment: comments[id] || '',
      faculty: user?.faculty,
    });
    setSaved(s => ({ ...s, [id]: true }));
  };

  const confirmDeleteRating = (item) => {
    Alert.alert('Delete rating', 'Remove this rating from the app?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeRating(item.id);

          if (item.studentId === user?.id) {
            setSaved(prev => ({ ...prev, [item.lecturerId]: false }));
            setRatings(prev => ({ ...prev, [item.lecturerId]: 0 }));
            setComments(prev => ({ ...prev, [item.lecturerId]: '' }));
          }
        },
      },
    ]);
  };

  if (!isStudent) {
    return (
      <View style={styles.screen}>
        <ScreenHeader
          title="Ratings"
          subtitle={user?.role === 'Lecturer' ? 'Ratings received' : 'Submitted ratings'}
          onBack={() => navigation.goBack()}
        />
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.statsRow}>
            <View style={{ flex: 1 }}>
              <StatCard label="Ratings" value={visibleRatings.length} icon="chatbubbles-outline" color={Colors.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <StatCard label="Average Score" value={ratingAverage} icon="star" color={Colors.warning} />
            </View>
          </View>

          {visibleRatings.length === 0 ? (
            <EmptyState icon="star-outline" message="No ratings submitted yet" />
          ) : (
            visibleRatings.map(item => {
              const lecturer = STAFF.find(member => member.id === item.lecturerId);
              return (
                <Card key={item.id}>
                  <View style={{ flexDirection:'row', alignItems:'center', marginBottom:10 }}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{(lecturer?.name || item.lecturerName || 'L').split(' ').slice(-1)[0][0]}</Text>
                    </View>
                    <View style={{ flex:1 }}>
                      <Text style={styles.reportTitle}>{lecturer?.name || item.lecturerName || 'Lecturer'}</Text>
                      <Text style={styles.classMeta}>Student: {item.studentId || '-'}</Text>
                    </View>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={14} color={Colors.warning} />
                    <Text style={styles.ratingBadgeText}>{Number(item.rating || 0).toFixed(1)}</Text>
                  </View>
                </View>
                {item.comment ? (
                  <Text style={styles.feedbackSnip}>{item.comment}</Text>
                ) : (
                  <Text style={styles.classMeta}>No comment provided.</Text>
                )}
                <TouchableOpacity style={styles.deleteLink} onPress={() => confirmDeleteRating(item)}>
                  <Ionicons name="trash-outline" size={14} color={Colors.danger} />
                  <Text style={styles.deleteLinkText}>Delete rating</Text>
                </TouchableOpacity>
              </Card>
            );
          })
        )}
          <View style={{ height:32 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Ratings" subtitle="Rate your lecturers" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <StatCard label="Your Average Rating Given" value={avgRating} icon="star" color={Colors.warning} />
        {lecturers.map(lec => (
          <Card key={lec.id} style={saved[lec.id] ? styles.savedCard : null}>
            <View style={{ flexDirection:'row', alignItems:'center', marginBottom:10 }}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{lec.name.split(' ').slice(-1)[0][0]}</Text>
              </View>
              <View style={{ flex:1 }}>
                <Text style={styles.reportTitle}>{lec.name}</Text>
                <Text style={styles.classMeta}>{lec.faculty}</Text>
              </View>
              {saved[lec.id] && <Ionicons name="checkmark-circle" size={22} color={Colors.success} />}
            </View>
            <View style={styles.starsRow}>
              {[1,2,3,4,5].map(star => (
                <TouchableOpacity key={star} onPress={() => setRatings(r=>({...r,[lec.id]:star}))} disabled={saved[lec.id]}>
                  <Ionicons
                    name={star<=(ratings[lec.id]||0) ? 'star':'star-outline'}
                    size={30}
                    color={star<=(ratings[lec.id]||0) ? Colors.warning : Colors.lightBlue}
                    style={{ marginRight:6 }}
                  />
                </TouchableOpacity>
              ))}
              {ratings[lec.id] && <Text style={styles.ratingValue}>{ratings[lec.id]}.0</Text>}
            </View>
            {saved[lec.id] ? (
              <>
                <Text style={styles.classMeta}>{comments[lec.id] ? comments[lec.id] : 'Rating saved successfully.'}</Text>
                <TouchableOpacity
                  style={styles.deleteLink}
                  onPress={() => confirmDeleteRating({ id: `${user?.id}_${lec.id}`, studentId: user?.id, lecturerId: lec.id })}
                >
                  <Ionicons name="trash-outline" size={14} color={Colors.danger} />
                  <Text style={styles.deleteLinkText}>Delete rating</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput value={comments[lec.id]||''} onChangeText={v=>setComments(c=>({...c,[lec.id]:v}))}
                  placeholder="Optional comment..." style={styles.commentInput} placeholderTextColor={Colors.gray} />
                <TouchableOpacity onPress={() => submitRating(lec.id)} style={styles.rateBtn}>
                  <Text style={styles.rateBtnText}>Submit Rating</Text>
                </TouchableOpacity>
              </>
            )}
          </Card>
        ))}
        {lecturers.length===0 && <EmptyState icon="star-outline" message="No lecturers found" />}
        <View style={{ height:32 }} />
      </ScrollView>
    </View>
  );
}

//monitoring screen
export function MonitoringScreen({ navigation }) {
  const { user }    = useAuth();
  const { reports } = useReports();
  const [tab, setTab] = useState('overview');
  const staff = STAFF.find(s => s.id === user?.staffId);
  const isLecturer = user?.role === 'Lecturer';

  const fac = FACULTIES.find(f => f.id===user?.faculty);
  const myReports = isLecturer
    ? reports.filter(r => staff && r.lecturerName === staff.name)
    : reports.filter(r => fac && r.facultyName===fac.name);
  const tabs = isLecturer ? ['overview','classes'] : ['overview','classes','lecturers'];

  const submitted = myReports.filter(r => r.status==='Submitted').length;
  const reviewed  = myReports.filter(r => r.status==='Reviewed').length;
  const totalPres = myReports.reduce((a,r)=>a+(r.studentsPresent||0),0);
  const totalReg  = myReports.reduce((a,r)=>a+(r.registeredStudents||0),0);
  const avgRate   = totalReg>0 ? Math.round((totalPres/totalReg)*100) : 0;

  const byCoverage = {};
  myReports.forEach(r => {
    if (!byCoverage[r.className]) byCoverage[r.className]={ count:0, present:0, registered:0 };
    byCoverage[r.className].count++;
    byCoverage[r.className].present    += r.studentsPresent    || 0;
    byCoverage[r.className].registered += r.registeredStudents || 0;
  });

  const byLec = {};
  myReports.forEach(r => {
    if (!byLec[r.lecturerName]) byLec[r.lecturerName]={ count:0, pending:0 };
    byLec[r.lecturerName].count++;
    if (r.status==='Submitted') byLec[r.lecturerName].pending++;
  });

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Monitoring" subtitle={isLecturer ? 'My performance overview' : 'Performance overview'} onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => exportWithFeedback(myReports, REPORT_COLUMNS, isLecturer ? 'LUCT_My_Monitoring' : 'LUCT_Monitoring', isLecturer ? 'My Monitoring' : 'LUCT Monitoring', 'No monitoring reports are available to export.')} style={styles.headerBtn}>
            <Ionicons name="download-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        }
      />
      <View style={styles.tabBar}>
        {tabs.map(t => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tabItem, tab===t&&styles.tabItemActive]}>
            <Text style={[styles.tabText, tab===t&&styles.tabTextActive]}>{t.charAt(0).toUpperCase()+t.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {tab==='overview' && (
          <>
            <StatCard
              label="Total Reports"
              value={myReports.length}
              icon="document-text-outline"
              color={Colors.blue}
              onPress={() => navigation.navigate('Reports')}
            />
            <StatCard
              label="Awaiting Review"
              value={submitted}
              icon="time-outline"
              color={Colors.warning}
              onPress={() => navigation.navigate('Reports')}
            />
            <StatCard
              label="Reviewed"
              value={reviewed}
              icon="checkmark-done-outline"
              color={Colors.success}
              onPress={() => navigation.navigate('Reports')}
            />
            <StatCard
              label="Avg Attendance Rate"
              value={avgRate+'%'}
              icon="stats-chart-outline"
              color={avgRate>=75?Colors.success:Colors.warning}
              onPress={() => setTab('classes')}
            />
            {submitted>0 && (
              <View style={styles.alertBox}>
                <Ionicons name="notifications-outline" size={18} color={Colors.warning} />
                <Text style={styles.alertText}>{submitted} report(s) awaiting review</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
                  <Text style={styles.alertLink}>{isLecturer ? 'Open reports ->' : 'Review ->'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        {tab==='classes' && (
          <>
            <Text style={styles.sectionTitle}>{isLecturer ? 'My Class Coverage' : 'Class Coverage'}</Text>
            {Object.entries(byCoverage).length===0
              ? <EmptyState icon="school-outline" message="No class data yet" />
              : Object.entries(byCoverage).map(([classId,data]) => {
                  const r = data.registered>0 ? Math.round((data.present/data.registered)*100) : 0;
                  const color = r>=75 ? Colors.success : Colors.warning;
                  return (
                    <Card key={classId}>
                      <Text style={styles.reportTitle}>{classId}</Text>
                      <Text style={styles.classMeta}>{getClassDisplayName(classId)}</Text>
                      <View style={styles.barWrap}><View style={[styles.barFill,{width:r+'%',backgroundColor:color}]} /></View>
                      <Text style={styles.barLabel}>{data.count} report(s) · avg {r}% attendance</Text>
                    </Card>
                  );
                })}
          </>
        )}
        {tab==='lecturers' && (
          <>
            <Text style={styles.sectionTitle}>Lecturer Submissions</Text>
            {Object.entries(byLec).length===0
              ? <EmptyState icon="person-outline" message="No lecturer data yet" />
              : Object.entries(byLec).map(([name,data]) => (
                  <Card key={name}>
                    <View style={{ flexDirection:'row', alignItems:'center' }}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{name.split(' ').slice(-1)[0][0]}</Text>
                      </View>
                      <View style={{ flex:1 }}>
                        <Text style={styles.reportTitle}>{name}</Text>
                        <Text style={styles.classMeta}>{data.count} report(s)</Text>
                      </View>
                      {data.pending>0 && (
                        <View style={styles.pendingBadge}>
                          <Text style={styles.pendingText}>{data.pending} pending</Text>
                        </View>
                      )}
                    </View>
                  </Card>
                ))}
          </>
        )}
        <View style={{ height:40 }} />
      </ScrollView>
    </View>
  );
}

//small helpers
function MetaTag({ icon, text }) {
  return (
    <View style={{ flexDirection:'row', alignItems:'center', backgroundColor:Colors.lightBlue, borderRadius:10, paddingHorizontal:6, paddingVertical:3, gap:3 }}>
      <Ionicons name={icon} size={11} color={Colors.gray} />
      <Text style={{ fontSize:11, color:Colors.gray }}>{text}</Text>
    </View>
  );
}
function ContentBlock({ label, text }) {
  return (
    <View style={{ marginBottom:14 }}>
      <Text style={{ fontSize:13, fontWeight:'600', color:Colors.navy, marginBottom:4 }}>{label}</Text>
      <Text style={{ fontSize:14, color:Colors.black, lineHeight:20 }}>{text||'—'}</Text>
    </View>
  );
}
function FF({ label, value, onChangeText, editable=true, multiline, keyboardType, error }) {
  return (
    <View style={{ marginBottom:12 }}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} editable={editable} multiline={multiline}
        keyboardType={keyboardType} numberOfLines={multiline?3:1}
        placeholderTextColor={Colors.gray} placeholder={label.replace(' *','')}
        style={[styles.formInput, !editable&&{backgroundColor:Colors.lightGray,color:Colors.gray},
          multiline&&{height:90,textAlignVertical:'top',paddingTop:10},
          error&&{borderColor:Colors.danger}]}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:   { flex:1, backgroundColor: Colors.screenBg },
  body:     { flex:1, padding: Spacing.md },
  headerBtn: { backgroundColor:'rgba(255,255,255,0.2)', borderRadius:18, padding:6, marginLeft:8 },
  chipRow:   { flexDirection:'row', alignItems:'center', gap:8, marginBottom:Spacing.sm, flexWrap:'wrap' },
  chip:      { paddingHorizontal:14, paddingVertical:7, borderRadius:20, backgroundColor:Colors.lightBlue },
  chipActive:{ backgroundColor:Colors.navy },
  chipText:  { fontSize:13, color:Colors.gray, fontWeight:'500' },
  chipTextActive:{ color:Colors.white },
  sortBtn:   { flexDirection:'row', alignItems:'center', gap:4, borderWidth:1, borderColor:Colors.blue, borderRadius:16, paddingHorizontal:10, paddingVertical:5 },
  sortText:  { fontSize:12, color:Colors.blue, textTransform:'capitalize' },
  statusStrip: { position:'absolute', left:0, top:0, bottom:0, width:4, borderTopLeftRadius:BorderRadius.md, borderBottomLeftRadius:BorderRadius.md },
  reportHeader: { flexDirection:'row', alignItems:'flex-start', marginBottom:8 },
  reportTitle:  { fontSize:14, fontWeight:'700', color:Colors.navy },
  reportCode:   { fontSize:12, color:Colors.blue, marginTop:2 },
  statusPill:   { borderRadius:12, paddingHorizontal:10, paddingVertical:3 },
  statusText:   { fontSize:11, fontWeight:'700' },
  metaRow:      { flexDirection:'row', flexWrap:'wrap', gap:6, marginBottom:8 },
  barWrap:      { height:6, backgroundColor:Colors.lightBlue, borderRadius:3 },
  barFill:      { height:6, backgroundColor:Colors.blue, borderRadius:3 },
  barLabel:     { fontSize:11, color:Colors.gray, marginTop:4 },
  feedbackRow:  { flexDirection:'row', alignItems:'center', marginTop:8, backgroundColor:'#EFF6FF', borderRadius:8, padding:8 },
  feedbackSnip: { fontSize:12, color:Colors.blue, flex:1 },
  deleteBtn:    { flexDirection:'row', alignItems:'center', alignSelf:'flex-end', marginTop:8, paddingVertical:4, paddingHorizontal:8 },
  deleteBtnText:{ fontSize:12, color:Colors.danger },
  bigCircle:    { width:72, height:72, borderRadius:36, backgroundColor:Colors.lightBlue, alignItems:'center', justifyContent:'center', borderWidth:3 },
  bigPct:       { fontSize:18, fontWeight:'900' },
  bigPctLbl:    { fontSize:10, color:Colors.gray },
  sectionTitle: { ...Typography.h4, marginTop:Spacing.sm, marginBottom:Spacing.sm },
  detailRow:    { flexDirection:'row', justifyContent:'space-between', paddingVertical:8, borderBottomWidth:1, borderBottomColor:Colors.lightGray },
  detailLabel:  { fontSize:13, color:Colors.gray, flex:1 },
  detailValue:  { fontSize:13, fontWeight:'600', color:Colors.navy, flex:2, textAlign:'right' },
  bodyText:     { fontSize:14, color:Colors.black, lineHeight:20 },
  feedbackInput:{ borderWidth:1.5, borderColor:Colors.lightBlue, borderRadius:BorderRadius.sm, padding:12, fontSize:14, color:Colors.black, height:100, textAlignVertical:'top' },
  stepBar:      { flexDirection:'row', justifyContent:'center', alignItems:'center', backgroundColor:Colors.white, paddingVertical:12, borderBottomWidth:1, borderBottomColor:Colors.lightBlue },
  stepItem:     { alignItems:'center', marginHorizontal:24 },
  stepDot:      { width:28, height:28, borderRadius:14, backgroundColor:Colors.lightBlue, alignItems:'center', justifyContent:'center', marginBottom:4 },
  stepDotActive:{ backgroundColor:Colors.blue },
  stepDotDone:  { backgroundColor:Colors.success },
  stepNum:      { fontSize:12, fontWeight:'700', color:Colors.gray },
  stepLabel:    { fontSize:11, color:Colors.gray },
  stepLabelActive:{ color:Colors.blue, fontWeight:'700' },
  formLabel:    { fontSize:13, fontWeight:'500', color:Colors.gray, marginBottom:6 },
  formInput:    { borderWidth:1.5, borderColor:Colors.lightBlue, borderRadius:BorderRadius.sm, paddingHorizontal:12, paddingVertical:10, fontSize:14, color:Colors.black, backgroundColor:Colors.white },
  errorText:    { color:Colors.danger, fontSize:12, marginTop:4 },
  hintText:     { color:Colors.gray, fontSize:13, fontStyle:'italic', marginBottom:12 },
  slotCard:     { width:160, backgroundColor:Colors.lightBlue, borderRadius:BorderRadius.md, padding:12, marginRight:10 },
  slotCardActive:{ backgroundColor:Colors.blue },
  slotClass:    { fontSize:13, fontWeight:'800', color:Colors.navy },
  slotCourse:   { fontSize:11, color:Colors.gray, marginTop:2 },
  slotTime:     { fontSize:11, color:Colors.gray, marginTop:4 },
  slotVenue:    { fontSize:11, color:Colors.gray, marginTop:2 },
  weekChip:     { backgroundColor:Colors.lightBlue, borderRadius:20, paddingHorizontal:14, paddingVertical:8, marginRight:8 },
  weekChipActive:{ backgroundColor:Colors.blue },
  weekChipText: { fontSize:12, fontWeight:'600', color:Colors.navy },
  attendPreview:{ backgroundColor:'#EFF6FF', borderRadius:BorderRadius.sm, padding:12, marginBottom:12 },
  attendPreviewLabel:{ fontSize:12, color:Colors.blue, fontWeight:'600', marginBottom:6 },
  navRow:       { flexDirection:'row', marginTop:8 },
  statsRow:     { flexDirection:'row', gap:8, marginBottom:4 },
  attendCircle: { width:52, height:52, borderRadius:26, alignItems:'center', justifyContent:'center', borderWidth:2.5, backgroundColor:Colors.white },
  attendPct:    { fontSize:14, fontWeight:'800' },
  classMeta:    { fontSize:12, color:Colors.gray, marginTop:1 },
  avatar:       { width:40, height:40, borderRadius:20, backgroundColor:Colors.lightBlue, alignItems:'center', justifyContent:'center', marginRight:10 },
  avatarText:   { fontSize:14, fontWeight:'700', color:Colors.blue },
  starsRow:     { flexDirection:'row', alignItems:'center', marginBottom:8 },
  ratingValue:  { fontSize:14, fontWeight:'800', color:Colors.warning, marginLeft:8 },
  ratingBadge:  { flexDirection:'row', alignItems:'center', backgroundColor:'#FEF3C7', borderRadius:BorderRadius.full, paddingHorizontal:10, paddingVertical:6 },
  ratingBadgeText:{ fontSize:12, color:Colors.warning, fontWeight:'700', marginLeft:4 },
  commentInput: { borderWidth:1.5, borderColor:Colors.lightBlue, borderRadius:BorderRadius.sm, paddingHorizontal:12, paddingVertical:8, fontSize:13, color:Colors.black, marginBottom:8 },
  rateBtn:      { backgroundColor:Colors.blue, borderRadius:BorderRadius.sm, paddingVertical:10, alignItems:'center' },
  rateBtnText:  { color:Colors.white, fontWeight:'700', fontSize:14 },
  savedCard:    { borderWidth:1.5, borderColor:Colors.success },
  tabBar:       { flexDirection:'row', backgroundColor:Colors.white, borderBottomWidth:1, borderBottomColor:Colors.lightBlue },
  tabItem:      { flex:1, paddingVertical:12, alignItems:'center' },
  tabItemActive:{ borderBottomWidth:2.5, borderBottomColor:Colors.blue },
  tabText:      { fontSize:13, color:Colors.gray, fontWeight:'500', textTransform:'capitalize' },
  tabTextActive:{ color:Colors.blue, fontWeight:'700' },
  alertBox:     { flexDirection:'row', alignItems:'center', backgroundColor:'#FEF3C7', borderRadius:10, padding:12, marginBottom:Spacing.sm, gap:8 },
  alertText:    { flex:1, fontSize:13, color:Colors.warning, fontWeight:'500' },
  alertLink:    { fontSize:13, color:Colors.blue, fontWeight:'700' },
  pendingBadge: { backgroundColor:'#FEF3C7', borderRadius:12, paddingHorizontal:10, paddingVertical:3 },
  pendingText:  { fontSize:11, color:Colors.warning, fontWeight:'700' },
});
