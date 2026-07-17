/**
 * Personalized ranking (PRD Layer 5).
 * Matches for a query are split into the three shelves the Distributors tab
 * renders, in this order:
 *   1. Previously Bought      — the retailer's own order history
 *   2. Bestsellers in Your Area — what sells best nearby, of what's left
 *   3. More Results           — the rest of the keyword matches
 * A new retailer has no order history, so shelf 1 is simply empty for them.
 */
import { Product, orderedProductIds, historyById } from '../data/catalog';

export type Persona = 'existing' | 'new';

export type RankedProducts = {
  previouslyBought: Product[];
  bestsellers: Product[];
  more: Product[];
  /** All three shelves, in order — for surfaces that list without headings. */
  list: Product[];
};

/** How many of the remaining matches get the bestseller shelf. */
const BESTSELLER_SLOTS = 3;

export function personalize(list: Product[], persona: Persona): RankedProducts {
  const previouslyBought = persona === 'existing' ? list.filter((p) => orderedProductIds.has(p.id)) : [];
  const boughtIds = new Set(previouslyBought.map((p) => p.id));
  const rest = list.filter((p) => !boughtIds.has(p.id));

  // Carving out a bestseller shelf only pays off when enough is left over for
  // "More Results" to still mean something.
  const bestsellers =
    rest.length > BESTSELLER_SLOTS
      ? [...rest]
          .sort((a, b) => (a.bestsellerRank ?? 999) - (b.bestsellerRank ?? 999))
          .slice(0, BESTSELLER_SLOTS)
      : [];
  const bestIds = new Set(bestsellers.map((p) => p.id));
  const more = rest.filter((p) => !bestIds.has(p.id));

  return { previouslyBought, bestsellers, more, list: [...previouslyBought, ...bestsellers, ...more] };
}

export function usualSubtitle(productId: string): string | undefined {
  const h = historyById(productId);
  if (!h) return undefined;
  return `Ordered ${h.timesOrdered}× · last ${h.lastOrdered} · ${h.lastQty}`;
}
