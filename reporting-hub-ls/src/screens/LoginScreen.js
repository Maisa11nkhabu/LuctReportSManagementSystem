import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, StatusBar as RNStatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { CLASSES, FACULTIES, PROGRAMMES } from '../data/seedData';
import { Colors, Spacing, BorderRadius, Typography } from '../theme';
import { Input, Button } from '../components/UI';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, RNStatusBar.currentHeight || 0);
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [faculty, setFaculty] = useState('FICT');
  const [programme, setProgramme] = useState('BSCSMY');
  const [classId, setClassId] = useState('BSCSMY3S2');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    { label: 'Student', email: 'student@luct.ls', pw: 'student123' },
    { label: 'Lecturer', email: 'tsekiso.thokoana@limkokwing.ac.ls', pw: 'luct1234' },
    { label: 'PRL', email: 'mpotla.nthunya@limkokwing.ac.ls', pw: 'luct1234' },
    { label: 'PL', email: 'kapela.morutwa@limkokwing.ac.ls', pw: 'luct1234' },
  ];

  const programmeOptions = useMemo(() => PROGRAMMES[faculty] || [], [faculty]);
  const classOptions = useMemo(
    () => CLASSES.filter(item => item.programme === programme),
    [programme]
  );

  const setRegistrationDefaults = (nextFaculty, nextProgramme) => {
    const programmePool = PROGRAMMES[nextFaculty] || [];
    const resolvedProgramme = nextProgramme || programmePool[0]?.id || '';
    const resolvedClass = CLASSES.find(item => item.programme === resolvedProgramme)?.id || '';
    setFaculty(nextFaculty);
    setProgramme(resolvedProgramme);
    setClassId(resolvedClass);
  };

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all registration fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!classId) {
      setError('Please choose a class');
      return;
    }

    setLoading(true);
    const result = await register({ name, email, password, faculty, programme, classId });
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#0A3556', '#0284C9']} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: Math.max(topInset, Spacing.md) + 20,
              paddingBottom: Math.max(insets.bottom, Spacing.md) + 24,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          >
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Image source={require('../../assets/luct-logo.png')} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Text style={styles.appName}>LUCT</Text>
            <Text style={styles.appSub}>Lecture Reporting and Monitoring System</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.modeSwitch}>
              {['login', 'register'].map(value => (
                <TouchableOpacity
                  key={value}
                  onPress={() => {
                    setMode(value);
                    setError('');
                  }}
                  style={[styles.modeBtn, mode === value && styles.modeBtnActive]}
                >
                  <Text style={[styles.modeBtnText, mode === value && styles.modeBtnTextActive]}>
                    {value === 'login' ? 'Sign In' : 'Register'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.cardTitle}>{mode === 'login' ? 'Sign In' : 'Student Registration'}</Text>
            <Text style={styles.cardSub}>
              {mode === 'login'
                ? 'Use your institutional email or a demo account'
                : 'Create a local student account now, then we will connect real backend auth later'}
            </Text>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={Colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {mode === 'register' && (
              <>
                <Input
                  label="Full Name"
                  icon="person-outline"
                  value={name}
                  onChangeText={setName}
                  placeholder="Student full name"
                />

                <Text style={styles.inputLabel}>Faculty</Text>
                <View style={styles.choiceWrap}>
                  {FACULTIES.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => setRegistrationDefaults(item.id)}
                      style={[styles.choiceChip, faculty === item.id && styles.choiceChipActive]}
                    >
                      <Text style={[styles.choiceChipText, faculty === item.id && styles.choiceChipTextActive]}>
                        {item.shortName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Programme</Text>
                <View style={styles.choiceWrap}>
                  {programmeOptions.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => setRegistrationDefaults(faculty, item.id)}
                      style={[styles.choiceChip, programme === item.id && styles.choiceChipActive]}
                    >
                      <Text style={[styles.choiceChipText, programme === item.id && styles.choiceChipTextActive]}>
                        {item.code}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Class</Text>
                <View style={styles.choiceWrap}>
                  {classOptions.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => setClassId(item.id)}
                      style={[styles.choiceChip, classId === item.id && styles.choiceChipActive]}
                    >
                      <Text style={[styles.choiceChipText, classId === item.id && styles.choiceChipTextActive]}>
                        {item.id}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <Input
              label="Email Address"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              placeholder="you@limkokwing.ac.ls"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <View style={styles.passWrap}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passRow}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.gray} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.passInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor={Colors.gray}
                  secureTextEntry={!showPass}
                />
                <TouchableOpacity onPress={() => setShowPass(value => !value)}>
                  <Ionicons name={showPass ? 'eye-off' : 'eye'} size={20} color={Colors.gray} />
                </TouchableOpacity>
              </View>
            </View>

            {mode === 'register' && (
              <Input
                label="Confirm Password"
                icon="lock-closed-outline"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repeat your password"
                secureTextEntry
              />
            )}

            <Button
              title={mode === 'login' ? 'Sign In' : 'Create Account'}
              onPress={mode === 'login' ? handleLogin : handleRegister}
              loading={loading}
              style={{ marginTop: 8 }}
            />

            {mode === 'login' && (
              <View style={styles.demoSection}>
                <Text style={styles.demoTitle}>Quick Demo Login</Text>
                <View style={styles.demoGrid}>
                  {demoAccounts.map(account => (
                    <TouchableOpacity
                      key={account.label}
                      style={styles.demoBtn}
                      onPress={() => {
                        setEmail(account.email);
                        setPassword(account.pw);
                      }}
                    >
                      <Text style={styles.demoBtnText}>{account.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          <Text style={styles.footer}>Limkokwing University of Creative Technology · Lesotho</Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { padding: Spacing.md },
  logoArea: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  logoImage: { width: 130, height: 130},
  appName: { color: Colors.white, fontSize: 32, fontWeight: '900', letterSpacing: 2 },
  appSub: { color: Colors.steel, fontSize: 12, textAlign: 'center', marginTop: 4 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  modeSwitch: {
    flexDirection: 'row',
    backgroundColor: Colors.lightBlue,
    borderRadius: BorderRadius.full,
    padding: 4,
    marginBottom: 16,
  },
  modeBtn: {
    flex: 1,
    borderRadius: BorderRadius.full,
    paddingVertical: 9,
    alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: Colors.white },
  modeBtnText: { color: Colors.gray, fontSize: 13, fontWeight: '600' },
  modeBtnTextActive: { color: Colors.navy },
  cardTitle: { ...Typography.h2, marginBottom: 4 },
  cardSub: { color: Colors.gray, fontSize: 13, marginBottom: 20 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  errorText: { color: Colors.danger, fontSize: 13, marginLeft: 6, flex: 1 },
  inputLabel: { fontSize: 13, fontWeight: '500', color: Colors.gray, marginBottom: 6 },
  choiceWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.md },
  choiceChip: {
    backgroundColor: Colors.lightBlue,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  choiceChipActive: { backgroundColor: Colors.blue },
  choiceChipText: { color: Colors.navy, fontSize: 12, fontWeight: '600' },
  choiceChipTextActive: { color: Colors.white },
  passWrap: { marginBottom: Spacing.md },
  passRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.lightBlue,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  passInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.black,
    paddingVertical: 0,
  },
  demoSection: { marginTop: 24 },
  demoTitle: { textAlign: 'center', color: Colors.gray, fontSize: 12, marginBottom: 12, fontWeight: '600' },
  demoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  demoBtn: {
    backgroundColor: Colors.lightBlue,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  demoBtnText: { color: Colors.navy, fontSize: 12, fontWeight: '600' },
  footer: { color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'center', marginTop: 24 },
});
