import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, TextInput,
  StatusBar as RNStatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

//card
export function Card({ children, style, onPress }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper onPress={onPress} activeOpacity={0.85}
      style={[styles.card, style]}>
      {children}
    </Wrapper>
  );
}

//badge
export function Badge({ label, color = Colors.blue, textColor = Colors.white }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

//badge
const ROLE_COLORS = {
  FMG:      { bg: '#0A3556', text: '#fff' },
  PL:       { bg: '#0284C9', text: '#fff' },
  PRL:      { bg: '#79BBD9', text: '#0A3556' },
  Lecturer: { bg: '#D7E5EE', text: '#0A3556' },
  Student:  { bg: '#F8F6F2', text: '#0A3556' },
};
export function RoleBadge({ role }) {
  const c = ROLE_COLORS[role] || ROLE_COLORS.Lecturer;
  return <Badge label={role} color={c.bg} textColor={c.text} />;
}

//button
export function Button({ title, onPress, variant = 'primary', icon, loading, style }) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}
      style={[
        styles.button,
        isPrimary && styles.buttonPrimary,
        isOutline && styles.buttonOutline,
        style,
      ]}>
      {loading
        ? <ActivityIndicator color={isPrimary ? Colors.white : Colors.blue} />
        : <>
            {icon && <Ionicons name={icon} size={18} color={isPrimary ? Colors.white : Colors.blue} style={{ marginRight: 6 }} />}
            <Text style={[styles.buttonText, isOutline && styles.buttonTextOutline]}>{title}</Text>
          </>
      }
    </TouchableOpacity>
  );
}

//input
export function Input({ label, icon, error, ...props }) {
  return (
    <View style={styles.inputWrap}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={[styles.inputRow, error && { borderColor: Colors.danger }]}>
        {icon && <Ionicons name={icon} size={18} color={Colors.gray} style={{ marginRight: 8 }} />}
        <TextInput
          style={styles.textInput}
          placeholderTextColor={Colors.gray}
          {...props}
        />
      </View>
      {error && <Text style={styles.inputError}>{error}</Text>}
    </View>
  );
}

//search bar
export function SearchBar({ value, onChangeText, placeholder = 'Search…' }) {
  return (
    <View style={styles.searchBar}>
      <Ionicons name="search" size={18} color={Colors.gray} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray}
        style={styles.searchInput}
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={18} color={Colors.gray} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

//screen header
export function ScreenHeader({ title, subtitle, onBack, right }) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, RNStatusBar.currentHeight || 0);

  return (
    <View style={[styles.header, { paddingTop: Math.max(topInset, 16) + 12 }]}>
      <View style={styles.headerLeft}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.headerSubtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>
      </View>
      {right && <View>{right}</View>}
    </View>
  );
}

//card
export function StatCard({ label, value, icon, color = Colors.blue, onPress }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      {onPress ? <Ionicons name="chevron-forward" size={18} color={Colors.gray} /> : null}
    </Wrapper>
  );
}

//empty state
export function EmptyState({ icon = 'document-text-outline', message }) {
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={48} color={Colors.lightBlue} />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

//styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  buttonPrimary: { backgroundColor: Colors.blue },
  buttonOutline: { borderWidth: 1.5, borderColor: Colors.blue },
  buttonText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  buttonTextOutline: { color: Colors.blue },
  inputWrap: { marginBottom: Spacing.md },
  inputLabel: { ...Typography.label, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.lightBlue,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  textInput: { flex: 1, fontSize: 14, color: Colors.black },
  inputError: { color: Colors.danger, fontSize: 12, marginTop: 4 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  searchInput: { flex: 1, marginHorizontal: 8, fontSize: 14, color: Colors.black },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.navy,
    paddingBottom: 16,
    paddingHorizontal: Spacing.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backBtn: { marginRight: 12, padding: 4 },
  headerTitle: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  headerSubtitle: { color: Colors.steel, fontSize: 12, marginTop: 2 },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
    ...Shadow.card,
  },
  statIcon: { borderRadius: BorderRadius.sm, padding: 10, marginRight: 12 },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.navy },
  statLabel: { ...Typography.caption, marginTop: 2 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { color: Colors.gray, fontSize: 14, marginTop: 12, textAlign: 'center' },
});
