import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, LayoutChangeEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, ScopeParam } from '../navigation/types';
import { colors, radii, spacing } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { SearchField } from '../components/SearchField';
import { useSearch } from '../context/SearchContext';
import { getSuggestions, Suggestion } from '../search/suggest';
import { trendingTerms, categories } from '../data/catalog';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchInitial'>;

/** Recent-search chips wrap, but never past this many rows. */
const MAX_RECENT_ROWS = 3;

export function SearchInitialScreen({ navigation, route }: Props) {
  const scope = route.params?.scope;
  const { recent, addRecent, clearRecent } = useSearch();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');

  // 300 ms debounce (PRD FR-SUG-05)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const suggestions = useMemo(
    () => (debounced.trim().length >= 2 ? getSuggestions(debounced, recent) : []),
    [debounced, recent]
  );

  const runSearch = (q: string, sc?: ScopeParam) => {
    const query = q.trim();
    if (!query && !sc) return;
    if (query) addRecent(query);
    navigation.navigate('SearchResults', { query, scope: sc ?? scope });
  };

  const onSuggestion = (s: Suggestion) => {
    if (s.type === 'category') {
      const cat = categories.find((c) => c.name === s.text);
      navigation.navigate('SearchResults', { query: '', scope: { kind: 'category', label: cat?.name, id: cat?.id } });
    } else {
      runSearch(s.text);
    }
  };

  const typing = debounced.trim().length >= 2;
  const showRecent = recent.length > 0;

  // Chips wrap on their own, so the row count is only knowable after layout:
  // measure each chip's y, then keep the ones landing in the first three rows.
  const [rowCap, setRowCap] = useState(recent.length);
  const chipY = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    chipY.current.clear();
    setRowCap(recent.length);
  }, [recent]);

  const onChipLayout = (i: number) => (e: LayoutChangeEvent) => {
    chipY.current.set(i, Math.round(e.nativeEvent.layout.y));
    if (chipY.current.size < recent.length) return;
    const rows = [...new Set(chipY.current.values())].sort((a, b) => a - b);
    if (rows.length <= MAX_RECENT_ROWS) return;
    const firstClippedRow = rows[MAX_RECENT_ROWS];
    setRowCap([...chipY.current.values()].filter((y) => y < firstClippedRow).length);
  };

  const visibleRecent = recent.slice(0, rowCap);

  return (
    <View style={styles.root}>
      <DeviceStatusBar />
      <View style={{ marginTop: 4, marginBottom: 8 }}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          onBack={() => navigation.goBack()}
          onSubmit={() => runSearch(query)}
          placeholder={scope?.label ? `Search in ${scope.label}` : 'Search for Products'}
          autoFocus
        />
      </View>

      {typing ? (
        <ScrollView keyboardShouldPersistTaps="handled">
          {suggestions.map((s) => (
            <Pressable key={s.id} style={styles.sugRow} onPress={() => onSuggestion(s)}>
              <Ionicons name={s.icon as any} size={18} color={s.type === 'recent' ? colors.inkFaint : colors.inkMuted} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Highlighted text={s.text} q={debounced} />
                {!!s.sub && <Text style={styles.sugSub}>{typeLabel(s.type)} · {s.sub}</Text>}
                {!s.sub && s.type !== 'term' && s.type !== 'recent' && (
                  <Text style={styles.sugSub}>{typeLabel(s.type)}</Text>
                )}
              </View>
              <Ionicons name="arrow-up-outline" size={15} color={colors.inkFaint} style={{ transform: [{ rotate: '45deg' }] }} />
            </Pressable>
          ))}
          {suggestions.length === 0 && (
            <Text style={styles.noSug}>No suggestions — press search to see all matches.</Text>
          )}
        </ScrollView>
      ) : (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>
          {/* A retailer with no search history simply has no Recent section —
              they land straight on Trending. */}
          {showRecent && (
            <View style={styles.section}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>Recent searches</Text>
                <Pressable onPress={clearRecent} hitSlop={8}><Text style={styles.clear}>Clear</Text></Pressable>
              </View>
              <View style={styles.chipWrap}>
                {visibleRecent.map((r, i) => (
                  <Pressable key={r} style={styles.chip} onPress={() => runSearch(r)} onLayout={onChipLayout(i)}>
                    <Ionicons name="time-outline" size={13} color={colors.inkMuted} />
                    <Text style={styles.chipText}>{r}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending searches</Text>
            <View style={styles.chipWrap}>
              {trendingTerms.map((t) => (
                <Pressable key={t} style={[styles.chip, styles.chipTrend]} onPress={() => runSearch(t)}>
                  <Ionicons name="trending-up" size={13} color={colors.primary} />
                  <Text style={[styles.chipText, { color: colors.primary }]}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function typeLabel(t: Suggestion['type']) {
  return { term: 'Search', category: 'Category', brand: 'Brand', product: 'Product', recent: 'Recent' }[t];
}

function Highlighted({ text, q }: { text: string; q: string }) {
  const idx = text.toLowerCase().indexOf(q.trim().toLowerCase());
  if (idx < 0 || !q.trim()) return <Text style={styles.sugText}>{text}</Text>;
  return (
    <Text style={styles.sugText}>
      {text.slice(0, idx)}
      <Text style={styles.sugMatch}>{text.slice(idx, idx + q.trim().length)}</Text>
      {text.slice(idx + q.trim().length)}
    </Text>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },

  sugRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.gutter,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  sugText: { fontSize: 15, color: colors.ink, fontWeight: '500' },
  sugMatch: { fontWeight: '800', color: colors.ink },
  sugSub: { fontSize: 11.5, color: colors.inkFaint, marginTop: 2 },
  noSug: { padding: spacing.gutter, color: colors.inkFaint, fontSize: 13 },

  section: { paddingHorizontal: spacing.gutter, marginTop: 18 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: colors.ink, marginBottom: 10 },
  clear: { fontSize: 12.5, fontWeight: '700', color: colors.primary },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.surfaceChip, borderRadius: radii.pill,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  chipTrend: { backgroundColor: colors.primarySoft },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.ink },
});
