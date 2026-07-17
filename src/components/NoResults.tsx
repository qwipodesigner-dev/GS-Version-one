import React from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, font } from '../theme/theme';
import { EmptyBox } from './EmptyBox';
import { trendingTerms } from '../data/catalog';

/** The illustration ships at 302×302 (1×); shrink it only if the screen is narrower. */
const ART_SIZE = 302;
const ART_MARGIN = 56;

function Art() {
  const { width } = useWindowDimensions();
  return <EmptyBox size={Math.min(ART_SIZE, width - ART_MARGIN)} />;
}

/**
 * Nothing matched anywhere in the catalogue (bad keyword / typo).
 * Offers a "did you mean" correction plus trending terms so the buyer is never
 * left at a dead end (PRD FR-REL-06).
 */
export function NoResults({
  query,
  suggestion,
  onSearch,
}: {
  query: string;
  suggestion?: string | null;
  onSearch: (q: string) => void;
}) {
  return (
    <View style={[s.wrap, s.centered]}>
      <Art />
      <Text style={s.title}>No results for “{query}”</Text>

      {suggestion ? (
        <Pressable style={s.didYouMean} onPress={() => onSearch(suggestion)}>
          <Text style={s.dymLabel}>Did you mean </Text>
          <Text style={s.dymTerm}>{suggestion}</Text>
          <Text style={s.dymLabel}>?</Text>
        </Pressable>
      ) : (
        <Text style={s.sub}>Check the spelling, or try a brand or category name.</Text>
      )}

      <Text style={s.tryLabel}>Try one of these</Text>
      <View style={s.chips}>
        {trendingTerms.slice(0, 4).map((t) => (
          <Pressable key={t} style={s.chip} onPress={() => onSearch(t)}>
            <Ionicons name="trending-up" size={13} color={colors.primary} />
            <Text style={s.chipTxt}>{t}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/**
 * The active tab has nothing, but the other tab does — offer the jump.
 * (Distributor variant of this is the Figma "Search in wholesaler" screen.)
 */
export function OtherTabHint({
  query,
  toWholesalers,
  onSwitch,
}: {
  query: string;
  toWholesalers: boolean;
  onSwitch: () => void;
}) {
  return (
    <View style={[s.wrap, s.centered]}>
      <Art />
      <Text style={s.title}>
        No products available with{'\n'}{toWholesalers ? 'distributors' : 'wholesalers'}
      </Text>
      <Text style={s.sub}>
        Please search in “{query}” from {toWholesalers ? 'Wholesalers' : 'Distributors'}?
      </Text>
      <Pressable style={s.btn} onPress={onSwitch}>
        <Ionicons name="search" size={16} color={colors.white} />
        <Text style={s.btnTxt}>Search in {toWholesalers ? 'wholesaler' : 'distributor'}</Text>
      </Pressable>
    </View>
  );
}

/**
 * Nothing matched INSIDE the current scope. The catalogue may still have it, so
 * the only useful action is to widen the search rather than leave a blank body.
 */
export function ScopedNoResults({
  query,
  scopeLabel,
  onSearchAll,
}: {
  query: string;
  scopeLabel?: string;
  onSearchAll: () => void;
}) {
  return (
    <View style={[s.wrap, s.centered]}>
      <Art />
      <Text style={s.title}>No results for “{query}”{'\n'}in {scopeLabel}</Text>
      <Text style={s.sub}>It may still be available elsewhere in the catalogue.</Text>
      <Pressable style={s.btn} onPress={onSearchAll}>
        <Ionicons name="search" size={16} color={colors.white} />
        <Text style={s.btnTxt}>Search all products</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', paddingTop: 36, paddingHorizontal: 28, paddingBottom: 40 },
  /** Empty states sit in the middle of the screen, illustration included. */
  centered: { flex: 1, justifyContent: 'center', paddingTop: 24, paddingBottom: 24 },
  title: { fontFamily: font.semibold, fontSize: 16, color: colors.textDark, textAlign: 'center', marginTop: 16 },
  sub: { fontFamily: font.regular, fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: 8 },

  didYouMean: { flexDirection: 'row', alignItems: 'center', marginTop: 10, flexWrap: 'wrap', justifyContent: 'center' },
  dymLabel: { fontFamily: font.regular, fontSize: 14, color: colors.textMuted },
  dymTerm: { fontFamily: font.semibold, fontSize: 14, color: colors.primary, textDecorationLine: 'underline' },

  tryLabel: { fontFamily: font.medium, fontSize: 12, color: colors.textMuted, marginTop: 22, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.lightBlue, borderRadius: radii.pill,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  chipTxt: { fontFamily: font.medium, fontSize: 13, color: colors.primary },

  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.primary, borderRadius: radii.md,
    paddingHorizontal: 18, height: 42, marginTop: 18,
  },
  btnTxt: { fontFamily: font.semibold, fontSize: 14, color: colors.white },
});
