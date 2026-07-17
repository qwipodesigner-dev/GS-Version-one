import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, ScopeParam } from '../navigation/types';
import { colors, radii, font, layout } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { SearchField } from '../components/SearchField';
import { SegmentedTabs } from '../components/SegmentedTabs';
import { DistributorProductCard } from '../components/DistributorProductCard';
import { WholesalerProductCard } from '../components/WholesalerProductCard';
import { NoResults, OtherTabHint, ScopedNoResults } from '../components/NoResults';
import { BrandTile } from '../components/EntityTiles';
import { useSearch } from '../context/SearchContext';
import { federatedSearch, productsInScope, didYouMean, hasAnyMatch } from '../search/engine';
import { personalize, usualSubtitle } from '../search/personalize';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchResults'>;

const TABS = ['Distributors', 'Wholesalers'];

export function SearchResultsScreen({ navigation, route }: Props) {
  const { persona, addRecent } = useSearch();
  const [query, setQuery] = useState(route.params.query || '');
  const [scope, setScope] = useState<ScopeParam | undefined>(route.params.scope);
  const [tab, setTab] = useState(route.params.tab === 'wholesalers' ? 1 : 0);
  /** Set when the retailer rejects the spelling correction and wants their words. */
  const [forceRaw, setForceRaw] = useState(false);

  const isScoped = scope && scope.kind !== 'all';
  const hasQuery = query.trim().length > 0;
  const isDist = tab === 0;

  const results = useMemo(
    () => federatedSearch(query, scope as any, !forceRaw),
    [query, scope, forceRaw]
  );

  // Products for the active tab, split by source.
  const rawProducts = hasQuery ? results.products : productsInScope(scope as any);
  const tabProducts = useMemo(
    () => rawProducts.filter((p) => (isDist ? p.source === 'distributor' : p.source === 'wholesaler')),
    [rawProducts, isDist]
  );

  const { previouslyBought, bestsellers, more, list } = useMemo(
    () => personalize(tabProducts, persona),
    [tabProducts, persona]
  );

  const submit = (q: string) => {
    const v = q.trim();
    setQuery(v);
    setForceRaw(false); // a new query gets the correction offered again
    if (v) addRecent(v);
  };
  const searchAll = () => setScope({ kind: 'all' });

  /** A brand tap → the Product List page, with context built from where we came from. */
  const openBrand = (brand: string) =>
    navigation.navigate('ProductList', {
      title: brand,
      crumbs: ['Brands', brand],
      filter: { brand, source: isDist ? 'distributor' : 'wholesaler' },
    });

  // Brands is the only entity rail the Distributors tab carries — everything
  // else on this tab is products.
  const showFederated = isDist && hasQuery && !isScoped;

  // ── Edge cases ──
  // Does the *other* tab have this product? Drives the cross-tab hint vs a true dead end.
  const anyMatch = useMemo(() => (hasQuery ? hasAnyMatch(query) : { distributor: true, wholesaler: true }), [query, hasQuery]);
  const suggestion = useMemo(
    () => (hasQuery && !anyMatch.distributor && !anyMatch.wholesaler ? didYouMean(query) : null),
    [query, hasQuery, anyMatch]
  );
  // Inside a scope, "nothing here" is a different problem from "nothing anywhere":
  // the fix is to widen the scope, not to switch tabs.
  const scopedEmpty = hasQuery && !!isScoped && list.length === 0;
  const tabEmpty = hasQuery && !isScoped && list.length === 0;
  const otherTabHas = isDist ? anyMatch.wholesaler : anyMatch.distributor;
  const deadEnd = tabEmpty && !otherTabHas;

  // Distributors carry nothing but wholesalers do → land the retailer on the
  // results instead of a dead tab with a CTA. Once per query: if they tab back
  // to Distributors themselves, respect it and leave them the manual hint.
  const [jumpedFor, setJumpedFor] = useState<string | null>(null);
  useEffect(() => {
    if (isDist && tabEmpty && anyMatch.wholesaler && jumpedFor !== query) {
      setJumpedFor(query);
      setTab(1);
    }
  }, [isDist, tabEmpty, anyMatch.wholesaler, jumpedFor, query]);
  const autoJumped = !isDist && hasQuery && jumpedFor === query;

  // Spelling was corrected before searching (mung -> moong): say so, and let
  // the retailer force the original back.
  const correction = results.correction;
  const showCorrection = hasQuery && correction.changed && !forceRaw && list.length > 0;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <DeviceStatusBar />
        <View style={styles.searchRow}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.textDark} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <SearchField
              bare
              value={query}
              onChangeText={setQuery}
              onSubmit={() => submit(query)}
              placeholder={isScoped ? `Search in ${scope?.label}` : 'Search for Products'}
            />
          </View>
        </View>

        <SegmentedTabs tabs={TABS} active={tab} onChange={setTab} />
      </View>

      {/* Scope context chip */}
      {isScoped && (
        <View style={styles.scopeRow}>
          <View style={styles.scopeChip}>
            <Ionicons name="funnel" size={12} color={colors.primary} />
            <Text style={styles.scopeText}>Searching in {scope?.label}</Text>
            <Pressable onPress={searchAll} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={colors.textDark2} />
            </Pressable>
          </View>
        </View>
      )}

      {/* ── Edge case A: nothing anywhere → No results + did-you-mean ── */}
      {deadEnd ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.fill}>
          <NoResults query={query} suggestion={suggestion} onSearch={submit} />
        </ScrollView>
      ) : /* ── Edge case B: this tab empty, the other tab stocks it ── */
      tabEmpty ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.fill}>
          <OtherTabHint query={query} toWholesalers={isDist} onSwitch={() => setTab(isDist ? 1 : 0)} />
        </ScrollView>
      ) : /* ── Edge case C: nothing inside this scope → offer to widen ── */
      scopedEmpty ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.fill}>
          <ScopedNoResults query={query} scopeLabel={scope?.label} onSearchAll={searchAll} />
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Spelling corrected before searching — never silently */}
          {showCorrection && (
            <View style={styles.correctionBox}>
              <Text style={styles.correctionLine}>
                Showing results for <Text style={styles.correctionTerm}>{correction.corrected}</Text>
              </Text>
              <Pressable onPress={() => setForceRaw(true)} hitSlop={6}>
                <Text style={styles.correctionAlt}>
                  Search instead for “{correction.original}”
                </Text>
              </Pressable>
            </View>
          )}

          {results.broadened && hasQuery && list.length > 0 && (
            <Text style={styles.broadened}>Showing closest matches for “{query}”</Text>
          )}

          {/* ── Federated sections (Distributors tab) ── */}
          {showFederated && results.brands.length > 0 && (
            <Section title="Brands">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
                {results.brands.map((b) => (
                  <BrandTile key={b.id} brand={b} onPress={() => openBrand(b.name)} />
                ))}
              </ScrollView>
            </Section>
          )}

          {/* ── Products: Previously Bought → Bestsellers → More Results ── */}
          {isDist ? (
            <>
              {previouslyBought.length > 0 && (
                <>
                  <ProductsHeader icon="repeat" text="Previously Bought" tint={colors.primary} />
                  {previouslyBought.map((p) => (
                    <DistributorProductCard key={p.id} product={p} yourUsual usualSub={usualSubtitle(p.id)} />
                  ))}
                </>
              )}

              {bestsellers.length > 0 && (
                <>
                  <ProductsHeader icon="trending-up" text="Bestsellers in Your Area" tint={colors.marginGreen} />
                  {bestsellers.map((p) => <DistributorProductCard key={p.id} product={p} />)}
                </>
              )}

              {more.length > 0 && (
                <>
                  <ProductsHeader
                    icon="search"
                    text={
                      hasQuery
                        ? `More results for “${query}”`
                        : isScoped
                        ? scope?.label || 'More Results'
                        : 'More Results'
                    }
                  />
                  {more.map((p) => <DistributorProductCard key={p.id} product={p} />)}
                </>
              )}
            </>
          ) : (
            // ── Wholesalers tab: product list only ──
            <>
              {autoJumped && (
                <View style={styles.jumpNote}>
                  <Ionicons name="information-circle" size={15} color={colors.primary} />
                  <Text style={styles.jumpNoteText}>
                    No distributor stocks “{query}” — showing wholesalers.
                  </Text>
                </View>
              )}
              {list.map((p) => <WholesalerProductCard key={p.id} product={p} />)}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ProductsHeader({ icon, text, tint }: { icon: string; text: string; tint?: string }) {
  return (
    <View style={styles.prodHead}>
      <Ionicons name={icon as any} size={15} color={tint || colors.textDark} />
      <Text style={[styles.prodHeadText, tint ? { color: tint } : null]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FBFBFB' },

  header: { backgroundColor: colors.white, paddingBottom: 12, gap: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 },
  backBtn: {
    width: 40, height: 40, padding: 8, borderRadius: radii.md,
    backgroundColor: colors.bgGrey, alignItems: 'center', justifyContent: 'center',
  },

  scroll: { paddingHorizontal: 12, paddingVertical: 12 },
  /** Lets an empty-state body centre itself against the full screen height. */
  fill: { flexGrow: 1 },

  scopeRow: { paddingHorizontal: layout.gutter, marginTop: 10 },
  scopeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: colors.lightBlue, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 7,
  },
  scopeText: { fontFamily: font.semibold, fontSize: 12.5, color: colors.primary },

  broadened: { fontFamily: font.regular, fontSize: 12.5, color: colors.textDark2, fontStyle: 'italic', marginBottom: 10 },

  jumpNote: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: colors.lightBlue, borderRadius: radii.md,
    paddingHorizontal: 12, paddingVertical: 9, marginBottom: 12,
  },
  jumpNoteText: { flex: 1, fontFamily: font.medium, fontSize: 12.5, color: colors.primary },

  correctionBox: {
    backgroundColor: colors.lightBlue, borderRadius: radii.md,
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, gap: 3,
  },
  correctionLine: { fontFamily: font.regular, fontSize: 13, color: colors.textDark },
  correctionTerm: { fontFamily: font.bold, color: colors.primary },
  correctionAlt: {
    fontFamily: font.medium, fontSize: 12, color: colors.textDark2,
    textDecorationLine: 'underline',
  },

  section: { marginBottom: 14 },
  sectionTitle: {
    fontFamily: font.bold, fontSize: 12, color: colors.textMuted,
    letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8,
  },
  rail: { gap: 8, paddingRight: 4 },

  prodHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, marginTop: 4 },
  prodHeadText: { fontFamily: font.bold, fontSize: 14, color: colors.textDark },

});
