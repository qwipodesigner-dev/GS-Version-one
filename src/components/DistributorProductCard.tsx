import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, font } from '../theme/theme';
import { Product } from '../data/catalog';
import { ProductImage, CaseLine, VariantPills, PriceBand, ActionsRow, s } from './ProductCardParts';

/**
 * Distributor product card — replicated from the Figma export.
 * Brand chip → name → case → 120px image → variants → price band
 * → Discounts/Add → "From <seller>" pill → "Delivery by" MOV boxes.
 */
export function DistributorProductCard({ product }: { product: Product }) {
  const [variant, setVariant] = useState(0);

  return (
    <View style={s.card}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.brandChip}>
            <Text style={s.brandChipTxt}>{product.brand}</Text>
          </View>
          <Text style={s.name} numberOfLines={2}>{product.name}</Text>
          <CaseLine product={product} />
        </View>
        <ProductImage product={product} />
      </View>

      <VariantPills options={product.quantities} selected={variant} onSelect={setVariant} />

      <PriceBand product={product} showFreeDelivery />

      <ActionsRow />

      {/* From <distributor> */}
      {!!product.from && (
        <View style={d.fromPill}>
          <Text style={d.fromLabel}>From</Text>
          <Text style={d.fromName} numberOfLines={1}>{product.from}</Text>
        </View>
      )}

      {/* Delivery by */}
      {!!product.deliveryOptions?.length && (
        <View style={{ gap: 8 }}>
          <Text style={d.deliveryLabel}>Delivery by</Text>
          <View style={d.optionRow}>
            {product.deliveryOptions.map((o, i) => (
              <View key={i} style={d.optionBox}>
                <Text style={d.optionDate}>{o.date}</Text>
                <Text style={d.optionMov}>Seller MOV: {o.mov}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const d = StyleSheet.create({
  fromPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.lightBlue,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: radii.md,
  },
  fromLabel: { fontFamily: font.regular, fontSize: 10, color: colors.textDark2 },
  fromName: { fontFamily: font.medium, fontSize: 12, color: colors.primary },

  deliveryLabel: { fontFamily: font.medium, fontSize: 12, color: colors.textDark2 },
  optionRow: { flexDirection: 'row', gap: 12 },
  optionBox: {
    flex: 1, gap: 4, padding: 8,
    borderWidth: 1, borderColor: colors.primary, borderRadius: 4,
  },
  optionDate: { fontFamily: font.medium, fontSize: 12, color: colors.primary },
  optionMov: { fontFamily: font.medium, fontSize: 10, color: colors.textDark2 },
});
