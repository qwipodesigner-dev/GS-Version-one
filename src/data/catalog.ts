/**
 * Qwipo catalog — mock data for the Smart Search MVPs.
 *
 * Categories and artwork come from Seller Store → "Category Images 2".
 * Most SKUs are listed by BOTH a distributor and wholesalers (as in the real
 * business, and as the Figma reference models with two separate lists), so a
 * query returns results in both tabs. Exactly one SKU is wholesaler-only to
 * exercise the "No products available with distributors" edge case.
 */
import { brandLogos, products as productImages, categoryImages } from '../assets';

export type Source = 'distributor' | 'wholesaler';

export type DeliveryOption = { date: string; mov: string };
export type Seller = { name: string; price: string; freeDelivery: boolean; selected?: boolean };

export type Product = {
  id: string;
  brand: string;
  name: string;
  caseText: string;
  quantities: string[];
  margin: string;
  mrp: string;
  price: string;
  unit: string;
  freeDelivery: boolean;
  source: Source;
  category: string;
  subCategory: string;
  keywords: string[];
  tint?: string;
  image?: any;
  bestsellerRank?: number;
  from?: string;
  deliveryOptions?: DeliveryOption[];
  sellers?: Seller[];
  deliveryBy?: string;
};

export type Brand = { id: string; name: string; category: string; color: string; logo?: any };
export type Category = { id: string; name: string; parent?: string; icon: string; image?: any };
export type Offer = { id: string; name: string; productIds: string[]; color: string };
export type Distributor = { id: string; name: string; sub: string; color: string; brands: string[] };
export type OrderHistoryEntry = { productId: string; lastOrdered: string; timesOrdered: number; lastQty: string };

// ─────────────────────────────────────────────────────────────
// Categories (names match the artwork files)
// ─────────────────────────────────────────────────────────────
export const categories: Category[] = [
  { id: 'c_oil', name: 'Oil & Ghee', parent: 'Groceries', icon: 'water-outline', image: categoryImages.oilGhee },
  { id: 'c_dal', name: 'Dals and Pulses', parent: 'Groceries', icon: 'nutrition-outline', image: categoryImages.dalsAndPulses },
  { id: 'c_rice', name: 'Rice and Rice Products', parent: 'Groceries', icon: 'restaurant-outline', image: categoryImages.riceAndRiceProducts },
  { id: 'c_atta', name: 'Atta, Flours and Sooji', parent: 'Groceries', icon: 'cafe-outline', image: categoryImages.attaFloursAndSooji },
  { id: 'c_salt', name: 'Salt, Sugar and Jaggery', parent: 'Groceries', icon: 'flame-outline', image: categoryImages.saltSugarAndJaggery },
  { id: 'c_masala', name: 'Masala & Seasoning', parent: 'Groceries', icon: 'flame-outline', image: categoryImages.masalaSeasoning },
  { id: 'c_tea', name: 'Tea and Coffee', parent: 'Beverages', icon: 'cafe-outline', image: categoryImages.teaAndCoffee },
  { id: 'c_bev', name: 'Beverages', parent: 'Beverages', icon: 'wine-outline', image: categoryImages.beverages },
  { id: 'c_snacks', name: 'Snacks and Namkeen', parent: 'Snacks & Branded Foods', icon: 'fast-food-outline', image: categoryImages.snacksAndNamkeen },
  { id: 'c_choc', name: 'Chocolates and Biscuits', parent: 'Snacks & Branded Foods', icon: 'gift-outline', image: categoryImages.chocolatesAndBiscuits },
  { id: 'c_sauce', name: 'Sauces, Spreads and Dips', parent: 'Snacks & Branded Foods', icon: 'fast-food-outline', image: categoryImages.saucesSpreadsAndDips },
  { id: 'c_noodle', name: 'Pasta, Soup and Noodles', parent: 'Snacks & Branded Foods', icon: 'restaurant-outline', image: categoryImages.pastaSoupAndNoodles },
  { id: 'c_pickle', name: 'Pickles and Chutney', parent: 'Groceries', icon: 'leaf-outline', image: categoryImages.picklesAndChutney },
  { id: 'c_det', name: 'Detergents and Dishwash', parent: 'Home Care', icon: 'sparkles-outline', image: categoryImages.detergentsAndDishwash },
  { id: 'c_beauty', name: 'Beauty & Hygiene', parent: 'Personal Care', icon: 'sparkles-outline', image: categoryImages.beautyHygiene },
  { id: 'c_oral', name: 'Oral care', parent: 'Personal Care', icon: 'happy-outline', image: categoryImages.oralCare },
  { id: 'c_dairy', name: 'Dairy and Cheese', parent: 'Groceries', icon: 'egg-outline', image: categoryImages.dairyAndCheese },
  { id: 'c_ayur', name: 'Ayurvedic', parent: 'Personal Care', icon: 'leaf-outline', image: categoryImages.ayurvedic },
  { id: 'c_pooja', name: 'Pooja Needs', parent: 'Household', icon: 'flame-outline', image: categoryImages.poojaNeeds },
  { id: 'c_grain', name: 'Foodgrains', parent: 'Groceries', icon: 'nutrition-outline', image: categoryImages.foodgrains },
];

const Q_OIL = ['1 ltr', '500 ml', '2 ltr', '5 ltr', '15 ltr'];
const Q_KG = ['1 Kg', '5 Kg', '10 Kg', '30 Kg', '50 Kg'];
const Q_PC = ['1 pc', '6 pc', '12 pc', '24 pc'];
const Q_ML = ['100 ml', '200 ml', '340 ml', '650 ml'];

/** Which distributor carries which brand. Every brand is mapped, so no single
 *  distributor silently absorbs the unmapped remainder. */
const DISTRIBUTORS_BY_BRAND: Record<string, string> = {
  // Shri Sai Krishna Traders — oils & staples
  Fortune: 'Shri Sai Krishna Traders',
  Freedom: 'Shri Sai Krishna Traders',
  'Ruchi Gold': 'Shri Sai Krishna Traders',
  Sunsure: 'Shri Sai Krishna Traders',
  Saffola: 'Shri Sai Krishna Traders',
  Aashirvaad: 'Shri Sai Krishna Traders',
  'Sri Lalitha': 'Shri Sai Krishna Traders',

  // Omkar Enterprices — beverages & branded foods
  Nescafe: 'Omkar Enterprices',
  Nestea: 'Omkar Enterprices',
  'Red Label': 'Omkar Enterprices',
  'Tata Tea': 'Omkar Enterprices',
  Parle: 'Omkar Enterprices',
  Britannia: 'Omkar Enterprices',
  Kurkure: 'Omkar Enterprices',
  Amul: 'Omkar Enterprices',
  Maggi: 'Omkar Enterprices',

  // Sri Sairam Enterprises — personal & home care
  'Ajay Care': 'Sri Sairam Enterprises',
  Cycle: 'Sri Sairam Enterprises',
  Dove: 'Sri Sairam Enterprises',
  'Clinic Plus': 'Sri Sairam Enterprises',
  Lux: 'Sri Sairam Enterprises',
  Colgate: 'Sri Sairam Enterprises',
  'Surf Excel': 'Sri Sairam Enterprises',
  Vim: 'Sri Sairam Enterprises',

  // SR Enterprises — ayurvedic & spreads
  'Mysore Sandal': 'SR Enterprises',
  Vicco: 'SR Enterprises',
  'Zinda Tilismath': 'SR Enterprises',
  Dabur: 'SR Enterprises',
  Kissan: 'SR Enterprises',

  // Venkateswara Agencies — masala, sugar & pulses
  Anil: 'Venkateswara Agencies',
  'Value Choice': 'Venkateswara Agencies',
  'GD Hing': 'Venkateswara Agencies',
  'AS Brand': 'Venkateswara Agencies',
  MTR: 'Venkateswara Agencies',
  Everest: 'Venkateswara Agencies',
  Priya: 'Venkateswara Agencies',
  Madhur: 'Venkateswara Agencies',
  GRB: 'Venkateswara Agencies',
  Tata: 'Venkateswara Agencies',
  'Shreya Gold': 'Venkateswara Agencies',
  'Tata Sampann': 'Venkateswara Agencies',
  Vijayalakshmi: 'Venkateswara Agencies',
  'Sree Mateja': 'Venkateswara Agencies',
  'India Gate': 'Venkateswara Agencies',
};

type Base = {
  id: string;
  brand: string;
  name: string;
  subCategory: string;
  category: string;
  keywords: string[];
  mrp: string;
  price: string;
  margin: string;
  tint: string;
  best: number;
  quantities: string[];
  /** omit -> both sources. 'wholesaler' -> wholesaler-only (edge case). */
  only?: Source;
};

/** A pack of a product line: [pack label, MRP, selling price]. */
type Pack = [string, string, string];

const num = (v: string) => Number(v.replace(/,/g, ''));
/** Retailer margin is derived from MRP vs selling price, never hand-typed. */
const marginOf = (mrp: string, price: string) =>
  `${Math.round(((num(mrp) - num(price)) / num(mrp)) * 100)}% Margin`;

const packsFor = (subCategory: string) => {
  if (subCategory === 'Oil & Ghee') return Q_OIL;
  if (['Dals and Pulses', 'Rice and Rice Products', 'Atta, Flours and Sooji',
       'Salt, Sugar and Jaggery', 'Foodgrains', 'Detergents and Dishwash'].includes(subCategory)) return Q_KG;
  if (subCategory === 'Beauty & Hygiene') return Q_ML;
  return Q_PC;
};

/**
 * Expand one product line into a SKU per pack size, e.g.
 * line('oil_freedom', 'Freedom', 'Refined Sunflower Oil', ...) with 5 packs
 * → "Freedom Refined Sunflower Oil - 1 Ltr Packet X 16 Nos", "… - 5 Ltr Jar", …
 */
function line(
  idPrefix: string, brand: string, product: string,
  subCategory: string, category: string, keywords: string[],
  tint: string, best: number, packs: Pack[], only?: Source
): Base[] {
  return packs.map((pk, i) => ({
    id: `${idPrefix}${i + 1}`,
    brand,
    name: `${brand} ${product} - ${pk[0]}`,
    subCategory,
    category,
    keywords,
    mrp: pk[1],
    price: pk[2],
    margin: marginOf(pk[1], pk[2]),
    tint,
    best: best + i,
    quantities: packsFor(subCategory),
    only,
  }));
}

const K_OIL = ['oil', 'tel', 'cooking oil', 'edible oil'];
const K_DAL = ['dal', 'daal', 'pulses'];
const K_RICE = ['rice', 'chawal'];
const K_ATTA = ['atta', 'flour', 'wheat', 'gehun'];
const K_TEA = ['tea', 'chai'];
const K_COFFEE = ['coffee', 'coffe'];
const K_SOAP = ['soap', 'sabun'];
const K_SHAMPOO = ['shampoo', 'hair care', 'hair'];

const BASE: Base[] = [
  // ══ Oil & Ghee ══
  ...line('oil_freedom', 'Freedom', 'Refined Sunflower Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'sunflower', 'refined'], '#F4C21E', 3, [
      ['1 Ltr Packet X 16 Nos', '215', '177'],
      ['500 ml Pouch X 24 Nos', '110', '92'],
      ['2 Ltr Pouch X 9 Nos', '420', '352'],
      ['5 Ltr Jar', '1,050', '880'],
      ['15 Ltr Tin', '3,100', '2,610'],
    ]),
  ...line('oil_freedom_gn', 'Freedom', 'Groundnut Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'groundnut', 'peanut'], '#C98A1B', 12, [
      ['1 Ltr Pouch X 16 Nos', '240', '210'],
      ['5 Ltr Jar', '1,180', '1,030'],
    ]),
  ...line('oil_freedom_rb', 'Freedom', 'Refined Rice Bran Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'rice bran', 'health oil'], '#D98E04', 14, [
      ['1 Ltr Pouch X 16 Nos', '205', '176'],
      ['5 Ltr Jar', '1,010', '868'],
    ]),
  ...line('oil_freedom_vs', 'Freedom', 'Vanaspati', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'vanaspati', 'dalda'], '#E7B10A', 20, [['1 Ltr Pouch X 16 Nos', '160', '138']]),
  ...line('oil_freedom_cs', 'Freedom', 'Cottonseed Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'cottonseed'], '#DDB320', 21, [['1 Ltr Pouch X 16 Nos', '185', '160']]),
  ...line('oil_freedom_ms', 'Freedom', 'Kachi Ghani Mustard Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'mustard', 'sarson', 'kachi ghani'], '#C9A227', 22, [['1 Ltr Pouch X 16 Nos', '190', '164']]),
  ...line('oil_freedom_ghee', 'Freedom', 'Pure Ghee', 'Oil & Ghee', 'Groceries',
    ['ghee', 'pure ghee', 'desi ghee'], '#E0A21C', 23, [['1 Ltr Jar', '640', '556']]),

  ...line('oil_fortune', 'Fortune', 'Sunflower Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'sunflower', 'refined'], '#E7B10A', 1, [
      ['1 Ltr Pouch X 16 Nos', '190', '162'],
      ['5 Ltr Jar', '940', '805'],
      ['15 Ltr Tin', '2,780', '2,380'],
    ]),
  ...line('oil_fortune_rb', 'Fortune', 'Rice Bran Health Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'rice bran', 'health oil'], '#D98E04', 8, [
      ['1 Ltr Pouch X 16 Nos', '210', '185'],
      ['5 Ltr Jar', '1,040', '915'],
    ]),
  ...line('oil_fortune_ms', 'Fortune', 'Kachi Ghani Mustard Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'mustard', 'sarson', 'kachi ghani'], '#C9A227', 16, [
      ['1 Ltr Pouch X 16 Nos', '198', '172'],
      ['5 Ltr Jar', '980', '852'],
    ]),
  ...line('oil_fortune_soya', 'Fortune', 'Soyabean Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'soyabean', 'soya'], '#E4B92E', 18, [
      ['1 Ltr Pouch X 16 Nos', '175', '150'],
      ['5 Ltr Jar', '865', '742'],
    ]),
  ...line('oil_fortune_gn', 'Fortune', 'Groundnut Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'groundnut', 'peanut'], '#C98A1B', 24, [['1 Ltr Pouch X 16 Nos', '245', '214']]),

  ...line('oil_ruchi', 'Ruchi Gold', 'Refined Palmolein Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'palmolein', 'palm oil', 'ruchi'], '#C0392B', 6, [
      ['1 Ltr Pouch X 16 Nos', '150', '128'],
      ['5 Ltr Jar', '740', '630'],
      ['15 Ltr Tin', '2,190', '1,860'],
    ]),
  ...line('oil_ruchi_soya', 'Ruchi Gold', 'Soyabean Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'soyabean', 'soya'], '#B03A2E', 25, [['1 Ltr Pouch X 16 Nos', '168', '145']]),

  ...line('oil_sunsure', 'Sunsure', 'Sunflower Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'sunflower'], '#F0A500', 2, [
      ['1 Ltr, 1 Pouch', '180', '149'],
      ['5 Ltr Jar', '890', '735'],
      ['15 Ltr Tin', '2,640', '2,180'],
    ]),

  ...line('oil_saffola', 'Saffola', 'Gold Edible Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'saffola', 'gold'], '#E0A21C', 11, [
      ['1 Ltr Pouch X 16 Nos', '230', '198'],
      ['5 Ltr Jar', '1,140', '980'],
    ]),
  ...line('oil_saffola_active', 'Saffola', 'Active Edible Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'saffola', 'active'], '#D4941A', 26, [['1 Ltr Pouch X 16 Nos', '215', '186']]),

  ...line('oil_as', 'AS Brand', 'Gingelly Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'gingelly', 'sesame', 'til'], '#C0392B', 27, [
      ['1 Ltr Pouch X 12 Nos', '320', '278'],
      ['5 Ltr Jar', '1,580', '1,375'],
    ]),
  ...line('oil_sneha', 'Sneha', 'Refined Sunflower Oil', 'Oil & Ghee', 'Groceries',
    [...K_OIL, 'sunflower', 'sneha', 'sukhibhava'], '#FBEE2F', 28, [
      ['1 Ltr Pouch X 16 Nos', '186', '160'],
      ['5 Ltr Jar', '920', '790'],
    ]),

  // ══ Dals and Pulses ══
  ...line('dal_shreya', 'Shreya Gold', 'Toor Dal', 'Dals and Pulses', 'Groceries',
    [...K_DAL, 'toor', 'arhar'], '#C99A2E', 4, [
      ['1 Bag, 30 Kg', '4,000', '3,379'],
      ['1 Kg Pack', '145', '124'],
      ['5 Kg Pack', '700', '598'],
    ]),
  ...line('dal_sampann_moong', 'Tata Sampann', 'Moong Dal', 'Dals and Pulses', 'Groceries',
    [...K_DAL, 'moong', 'green gram'], '#9CB33A', 7, [
      ['1 Kg Pack', '150', '132'],
      ['5 Kg Pack', '730', '640'],
    ]),
  ...line('dal_sampann_chana', 'Tata Sampann', 'Chana Dal', 'Dals and Pulses', 'Groceries',
    [...K_DAL, 'chana', 'bengal gram'], '#D3A93B', 10, [
      ['1 Kg Pack', '110', '96'],
      ['5 Kg Pack', '535', '468'],
    ]),
  ...line('dal_sampann_toor', 'Tata Sampann', 'Toor Dal', 'Dals and Pulses', 'Groceries',
    [...K_DAL, 'toor', 'arhar'], '#C99A2E', 13, [
      ['1 Kg Pack', '158', '138'],
      ['5 Kg Pack', '770', '672'],
    ]),
  ...line('dal_sampann_urad', 'Tata Sampann', 'Urad Dal', 'Dals and Pulses', 'Groceries',
    [...K_DAL, 'urad', 'black gram'], '#8A7A4A', 19, [['1 Kg Pack', '168', '146']]),
  ...line('dal_vijaya', 'Vijayalakshmi', 'Deer Urad Gundu', 'Dals and Pulses', 'Groceries',
    [...K_DAL, 'urad', 'gundu'], '#B98A2C', 9, [
      ['1 Kg Pack', '175', '148'],
      ['30 Kg Bag', '5,100', '4,340'],
    ]),

  // ══ Rice and Rice Products ══
  ...line('rice_mateja', 'Sree Mateja', 'Satake Silky Sortex HMT Rice', 'Rice and Rice Products', 'Groceries',
    [...K_RICE, 'hmt', 'sortex'], '#B79A5E', 5, [
      ['26 Kg Bag', '1,800', '1,641'],
      ['10 Kg Bag', '710', '648'],
    ]),
  ...line('rice_indiagate', 'India Gate', 'Basmati Rice Classic', 'Rice and Rice Products', 'Groceries',
    [...K_RICE, 'basmati'], '#CDB88A', 12, [
      ['5 Kg Bag', '600', '520'],
      ['1 Kg Pack', '128', '112'],
    ]),
  ...line('rice_indiagate_prem', 'India Gate', 'Basmati Rice Premium', 'Rice and Rice Products', 'Groceries',
    [...K_RICE, 'basmati', 'premium'], '#C4AE7E', 29, [['5 Kg Bag', '760', '662']]),

  // ══ Atta, Flours and Sooji ══
  ...line('atta_ashirvaad', 'Aashirvaad', 'Shudh Chakki Atta', 'Atta, Flours and Sooji', 'Groceries',
    [...K_ATTA, 'chakki atta', 'aashirvaad'], '#D77A2B', 6, [
      ['10 Kg Bag', '505', '440'],
      ['5 Kg Bag', '260', '226'],
      ['1 Kg Pack', '58', '50'],
    ]),
  ...line('atta_ashirvaad_mg', 'Aashirvaad', 'Multigrain Atta', 'Atta, Flours and Sooji', 'Groceries',
    [...K_ATTA, 'multigrain', 'aashirvaad'], '#C86A24', 15, [
      ['5 Kg Bag', '320', '278'],
      ['10 Kg Bag', '630', '548'],
    ]),
  ...line('atta_ashirvaad_sel', 'Aashirvaad', 'Select Sharbati Atta', 'Atta, Flours and Sooji', 'Groceries',
    [...K_ATTA, 'sharbati', 'select', 'aashirvaad'], '#B85E1E', 30, [['5 Kg Bag', '360', '313']]),
  ...line('atta_lalitha_rava', 'Sri Lalitha', 'Bombay Rava / Sooji', 'Atta, Flours and Sooji', 'Groceries',
    ['sooji', 'rava', 'suji', 'semolina'], '#E0C56A', 22, [
      ['1 Kg Pack', '62', '52'],
      ['5 Kg Bag', '300', '253'],
    ]),
  ...line('atta_lalitha_maida', 'Sri Lalitha', 'Maida', 'Atta, Flours and Sooji', 'Groceries',
    ['maida', 'flour', 'refined flour'], '#E8D79A', 31, [['1 Kg Pack', '55', '47']]),

  // ══ Salt, Sugar and Jaggery ══
  ...line('salt_tata', 'Tata', 'Salt Iodised', 'Salt, Sugar and Jaggery', 'Groceries',
    ['salt', 'namak', 'iodised salt'], '#3B7FC4', 13, [
      ['1 Kg Pack', '28', '24'],
      ['1 Kg X 10 Pack', '280', '238'],
    ]),
  ...line('salt_tata_lite', 'Tata', 'Salt Lite', 'Salt, Sugar and Jaggery', 'Groceries',
    ['salt', 'namak', 'lite'], '#5A9BD8', 32, [['1 Kg Pack', '42', '36']]),
  ...line('sugar_madhur', 'Madhur', 'Pure & Hygienic Sugar', 'Salt, Sugar and Jaggery', 'Groceries',
    ['sugar', 'cheeni', 'shakkar', 'madhur'], '#7DBE4E', 8, [
      ['5 Kg Bag', '260', '228'],
      ['1 Kg Pack', '54', '47'],
      ['30 Kg Bag', '1,530', '1,340'],
    ]),
  ...line('jaggery_grb', 'GRB', 'Pure Jaggery Block', 'Salt, Sugar and Jaggery', 'Groceries',
    ['jaggery', 'gud', 'bellam'], '#B5651D', 24, [
      ['1 Kg Pack', '95', '82'],
      ['5 Kg Pack', '460', '397'],
    ]),

  // ══ Tea and Coffee ══
  ...line('tea_redlabel', 'Red Label', 'Brooke Bond Tea', 'Tea and Coffee', 'Beverages',
    [...K_TEA, 'red label', 'red', 'label', 'brooke bond'], '#C81E1E', 5, [
      ['250 g Pack', '155', '135'],
      ['500 g Pack', '300', '262'],
      ['1 Kg Pack', '590', '515'],
    ]),
  ...line('tea_tatagold', 'Tata Tea', 'Gold', 'Tea and Coffee', 'Beverages',
    [...K_TEA, 'tata gold'], '#B8860B', 14, [
      ['500 g Pack', '300', '265'],
      ['250 g Pack', '155', '137'],
    ]),
  ...line('tea_tatapremium', 'Tata Tea', 'Premium', 'Tea and Coffee', 'Beverages',
    [...K_TEA, 'tata premium'], '#A67C00', 33, [['500 g Pack', '270', '238']]),
  ...line('coffee_classic', 'Nescafe', 'Classic Coffee', 'Tea and Coffee', 'Beverages',
    [...K_COFFEE, 'nescafe', 'classic'], '#1A1A1A', 15, [
      ['100 g Jar', '320', '290'],
      ['200 g Jar', '620', '562'],
    ]),
  ...line('coffee_sunrise', 'Nescafe', 'Sunrise Coffee', 'Tea and Coffee', 'Beverages',
    [...K_COFFEE, 'nescafe', 'sunrise'], '#C7401F', 18, [
      ['200 g Pouch', '285', '252'],
      ['100 g Pouch', '150', '133'],
    ]),
  ...line('coffee_gold', 'Nescafe', 'Gold Coffee', 'Tea and Coffee', 'Beverages',
    [...K_COFFEE, 'nescafe', 'gold'], '#7A1E1E', 34, [['100 g Jar', '580', '520']]),

  // ══ Beverages ══
  ...line('bev_nestea', 'Nestea', 'Instant Lemon Iced Tea', 'Beverages', 'Beverages',
    ['nestea', 'iced tea', 'lemon tea', 'tea'], '#2C6BE8', 26, [
      ['400 g Jar', '260', '228'],
      ['1 Kg Pack', '620', '545'],
    ]),

  // ══ Beauty & Hygiene ══
  ...line('shampoo_dove', 'Dove', 'Daily Shine Shampoo', 'Beauty & Hygiene', 'Personal Care',
    [...K_SHAMPOO, 'dove'], '#5AA9E6', 8, [
      ['340 ml Bottle', '285', '245'],
      ['180 ml Bottle', '160', '138'],
    ]),
  ...line('shampoo_dove_ir', 'Dove', 'Intense Repair Shampoo', 'Beauty & Hygiene', 'Personal Care',
    [...K_SHAMPOO, 'dove', 'repair'], '#4A99D6', 35, [['340 ml Bottle', '295', '254']]),
  ...line('soap_dove', 'Dove', 'Cream Beauty Bathing Bar', 'Beauty & Hygiene', 'Personal Care',
    [...K_SOAP, 'dove', 'bathing bar'], '#7DBBE8', 36, [['100 g X 4 Pack', '220', '190']]),
  ...line('shampoo_clinic', 'Clinic Plus', 'Strong & Long Shampoo', 'Beauty & Hygiene', 'Personal Care',
    [...K_SHAMPOO, 'clinic plus'], '#E86AA6', 16, [
      ['340 ml Bottle', '230', '198'],
      ['175 ml Bottle', '125', '108'],
    ]),
  ...line('soap_mysore', 'Mysore Sandal', 'Soap', 'Beauty & Hygiene', 'Personal Care',
    [...K_SOAP, 'sandal', 'mysore'], '#C0392B', 17, [
      ['100 g X 3 Pack', '165', '142'],
      ['150 g X 3 Pack', '240', '207'],
    ]),
  ...line('soap_lux', 'Lux', 'Soft Touch Soap', 'Beauty & Hygiene', 'Personal Care',
    [...K_SOAP, 'lux'], '#D98AB0', 19, [
      ['100 g X 4 Pack', '140', '120'],
      ['150 g X 4 Pack', '200', '172'],
    ]),
  ...line('hair_blackrose', 'Black Rose', 'Hair Color', 'Beauty & Hygiene', 'Personal Care',
    ['hair color', 'black rose', 'dye', 'hair'], '#1A1A1A', 37, [['12 g X 12 Pack', '180', '155']]),

  // ══ Oral care ══
  ...line('oral_colgate', 'Colgate', 'Strong Teeth Toothpaste', 'Oral care', 'Personal Care',
    ['toothpaste', 'colgate', 'oral', 'manjan', 'dant'], '#C81E1E', 20, [
      ['200 g Tube', '115', '99'],
      ['100 g Tube', '62', '54'],
    ]),
  ...line('oral_colgate_mf', 'Colgate', 'MaxFresh Toothpaste', 'Oral care', 'Personal Care',
    ['toothpaste', 'colgate', 'maxfresh', 'oral'], '#1E5FA8', 38, [['150 g Tube', '105', '90']]),

  // ══ Detergents and Dishwash ══
  ...line('det_surf', 'Surf Excel', 'Easy Wash Detergent', 'Detergents and Dishwash', 'Home Care',
    ['detergent', 'washing powder', 'surf excel', 'surf'], '#1E5FA8', 9, [
      ['1 Kg Pack', '175', '150'],
      ['500 g Pack', '92', '79'],
    ]),
  ...line('det_surf_matic', 'Surf Excel', 'Matic Front Load', 'Detergents and Dishwash', 'Home Care',
    ['detergent', 'matic', 'surf excel'], '#164C86', 39, [['1 Kg Pack', '230', '198']]),
  ...line('det_vim', 'Vim', 'Dishwash Bar', 'Detergents and Dishwash', 'Home Care',
    ['dishwash', 'vim', 'bartan', 'utensil'], '#F4C21E', 21, [
      ['300 g X 4 Pack', '80', '68'],
      ['150 g X 6 Pack', '70', '60'],
    ]),
  ...line('det_vim_gel', 'Vim', 'Dishwash Gel', 'Detergents and Dishwash', 'Home Care',
    ['dishwash', 'vim', 'gel', 'bartan'], '#D9AE18', 40, [['500 ml Bottle', '115', '99']]),

  // ══ Chocolates and Biscuits ══
  ...line('bis_parle', 'Parle', 'Parle-G Gold Biscuits', 'Chocolates and Biscuits', 'Snacks & Branded Foods',
    ['biscuit', 'parle', 'parle g', 'cookies', 'snacks'], '#E0B04A', 10, [
      ['100 g X 12 Pack', '120', '110'],
      ['250 g X 6 Pack', '150', '137'],
    ]),
  ...line('bis_parle_monaco', 'Parle', 'Monaco Salted Biscuits', 'Chocolates and Biscuits', 'Snacks & Branded Foods',
    ['biscuit', 'parle', 'monaco', 'salted'], '#D9A73C', 41, [['75 g X 12 Pack', '120', '109']]),
  ...line('bis_goodday', 'Britannia', 'Good Day Cashew Cookies', 'Chocolates and Biscuits', 'Snacks & Branded Foods',
    ['biscuit', 'britannia', 'good day', 'cookies', 'cashew'], '#D4A017', 23, [
      ['200 g X 6 Pack', '210', '182'],
      ['100 g X 12 Pack', '180', '156'],
    ]),
  ...line('bis_marie', 'Britannia', 'Marie Gold Biscuits', 'Chocolates and Biscuits', 'Snacks & Branded Foods',
    ['biscuit', 'britannia', 'marie', 'cookies'], '#C79412', 42, [['250 g X 6 Pack', '180', '156']]),

  // ══ Snacks and Namkeen ══
  ...line('snack_kurkure', 'Kurkure', 'Masala Munch', 'Snacks and Namkeen', 'Snacks & Branded Foods',
    ['namkeen', 'kurkure', 'snacks', 'chips'], '#E2571E', 25, [
      ['90 g X 10 Pack', '200', '176'],
      ['45 g X 20 Pack', '200', '176'],
    ]),

  // ══ Sauces, Spreads and Dips ══
  ...line('honey_dabur', 'Dabur', '100% Pure Honey', 'Sauces, Spreads and Dips', 'Snacks & Branded Foods',
    ['honey', 'shahad', 'spread', 'dabur'], '#E0A21C', 12, [
      ['1 Kg Bottle', '495', '420'],
      ['500 g Bottle', '260', '221'],
    ]),
  ...line('jam_kissan', 'Kissan', 'Mixed Fruit Jam', 'Sauces, Spreads and Dips', 'Snacks & Branded Foods',
    ['jam', 'fruit jam', 'kissan', 'spread'], '#D64545', 19, [
      ['700 g Pack', '245', '210'],
      ['500 g Pack', '180', '155'],
    ]),
  ...line('ketchup_kissan', 'Kissan', 'Fresh Tomato Ketchup', 'Sauces, Spreads and Dips', 'Snacks & Branded Foods',
    ['ketchup', 'tomato', 'sauce', 'kissan'], '#C0392B', 21, [
      ['950 g Bottle', '160', '135'],
      ['500 g Bottle', '95', '80'],
    ]),

  // ══ Masala & Seasoning ══
  ...line('masala_chilli', 'Everest', 'Red Chilli Powder', 'Masala & Seasoning', 'Groceries',
    ['red chilli', 'chilli', 'mirchi', 'lal mirch', 'masala', 'spice', 'red', 'powder'], '#C0392B', 18, [
      ['200 g Box', '90', '78'],
      ['500 g Box', '215', '187'],
    ]),
  ...line('masala_turmeric', 'Everest', 'Turmeric Powder', 'Masala & Seasoning', 'Groceries',
    ['turmeric', 'haldi', 'masala', 'spice', 'powder'], '#E0A21C', 43, [['200 g Box', '85', '74']]),
  ...line('masala_garam', 'Everest', 'Garam Masala', 'Masala & Seasoning', 'Groceries',
    ['garam masala', 'masala', 'spice'], '#8B4513', 44, [['100 g Box', '95', '82']]),
  ...line('masala_sambar', 'MTR', 'Sambar Powder', 'Masala & Seasoning', 'Groceries',
    ['sambar', 'masala', 'powder', 'mtr', 'spice'], '#C0392B', 27, [
      ['100 g Box', '65', '56'],
      ['200 g Box', '125', '108'],
    ]),
  ...line('masala_rasam', 'MTR', 'Rasam Powder', 'Masala & Seasoning', 'Groceries',
    ['rasam', 'masala', 'powder', 'mtr', 'spice'], '#B03A2E', 45, [['100 g Box', '68', '59']]),
  ...line('masala_hing', 'GD Hing', 'Compounded Hing', 'Masala & Seasoning', 'Groceries',
    ['hing', 'asafoetida', 'masala', 'gd', 'spice'], '#E0B04A', 28, [
      ['50 g Box', '85', '73'],
      ['100 g Box', '160', '138'],
    ]),

  // ══ Dairy and Cheese ══
  ...line('dairy_amul_butter', 'Amul', 'Butter', 'Dairy and Cheese', 'Groceries',
    ['butter', 'amul', 'makhan', 'dairy'], '#E23D3D', 16, [
      ['500 g Pack', '285', '256'],
      ['100 g X 10 Pack', '580', '522'],
    ]),
  ...line('dairy_amul_ghee', 'Amul', 'Pure Ghee', 'Dairy and Cheese', 'Groceries',
    ['ghee', 'amul', 'desi ghee', 'dairy'], '#E0A21C', 46, [['1 Ltr Tin', '640', '576']]),

  // ══ Pickles and Chutney ══
  ...line('pickle_priya', 'Priya', 'Mango Pickle', 'Pickles and Chutney', 'Groceries',
    ['pickle', 'achar', 'mango', 'priya'], '#D98E04', 29, [
      ['1 Kg Jar', '210', '182'],
      ['500 g Jar', '115', '99'],
    ]),

  // ══ Ayurvedic ══
  ...line('ayur_zinda', 'Zinda Tilismath', 'Herbal Oil', 'Ayurvedic', 'Personal Care',
    ['ayurvedic', 'zinda', 'tilismath', 'herbal'], '#1A1A1A', 30, [
      ['15 ml X 12 Pack', '180', '156'],
      ['30 ml X 12 Pack', '340', '295'],
    ]),
  ...line('ayur_vicco', 'Vicco', 'Turmeric Skin Cream', 'Ayurvedic', 'Personal Care',
    ['ayurvedic', 'vicco', 'turmeric', 'cream'], '#C0392B', 31, [
      ['70 g X 6 Pack', '240', '208'],
      ['30 g X 12 Pack', '260', '225'],
    ]),
  ...line('ayur_dwibhashi', 'Dwibhashi', 'Herbal Powder', 'Ayurvedic', 'Personal Care',
    ['ayurvedic', 'dwibhashi', 'herbal', 'powder'], '#7A9A2E', 47, [['100 g X 6 Pack', '190', '164']]),

  // ══ Pooja Needs ══
  ...line('pooja_cycle', 'Cycle', 'Pure Agarbatti', 'Pooja Needs', 'Household',
    ['agarbatti', 'incense', 'cycle', 'pooja'], '#2C3E8F', 32, [
      ['120 Sticks X 12 Pack', '240', '206'],
      ['20 Sticks X 24 Pack', '180', '155'],
    ]),

  // ══ Personal Care ══
  ...line('care_ajay', 'Ajay Care', 'Herbal Hair Oil', 'Beauty & Hygiene', 'Personal Care',
    ['hair oil', 'ajay', 'herbal', 'hair'], '#2AA6D6', 33, [
      ['200 ml Bottle', '145', '125'],
      ['100 ml Bottle', '80', '69'],
    ]),

  // ══ EDGE CASE: wholesaler-only (no distributor carries Maggi) ══
  ...line('noodle_maggi', 'Maggi', '2-Minute Masala Noodles', 'Pasta, Soup and Noodles', 'Snacks & Branded Foods',
    ['maggi', 'noodles', 'instant noodles', 'masala noodles'], '#E2571E', 2, [
      ['70 g X 12 Pack', '168', '144'],
      ['70 g X 24 Pack', '336', '285'],
    ], 'wholesaler'),

  // ══ White-label / unbranded staples ══
  // Loose staples carry no brand a retailer can search for, so they rank purely
  // on the product name. They must still surface for a plain "sona masoori" or
  // "toor dal" query alongside the branded SKUs.
  ...line('wl_rice', 'Value Choice', 'Sona Masoori Rice', 'Rice and Rice Products', 'Groceries',
    [...K_RICE, 'sona masoori', 'sona', 'masoori', 'loose', 'unbranded', 'white label'], '#CBB994', 12, [
      ['25 Kg Bag', '1,450', '1,285'],
      ['10 Kg Bag', '610', '545'],
    ]),
  ...line('wl_dal', 'Value Choice', 'Toor Dal', 'Dals and Pulses', 'Groceries',
    [...K_DAL, 'toor', 'kandi pappu', 'loose', 'unbranded', 'white label'], '#D8C06A', 14, [
      ['30 Kg Bag', '4,350', '3,980'],
      ['1 Kg Pack', '158', '142'],
    ]),

  // ══ EDGE CASE: distributor-only (a regional SKU no wholesaler lists) ══
  // Keywords are deliberately unique to this line — if any other SKU matched
  // "jowar"/"millet", the Wholesalers tab would find something and the
  // "Search in distributor" hint could never fire.
  ...line('grain_anil', 'Anil', 'Jowar Millets', 'Foodgrains', 'Groceries',
    ['jowar', 'millet', 'millets', 'anil', 'grain'], '#C88A2E', 40, [
      ['1 Kg Pack', '95', '82'],
      ['5 Kg Bag', '460', '395'],
    ], 'distributor'),
];

// ─────────────────────────────────────────────────────────────
// Expand each base SKU into its distributor / wholesaler listings
// ─────────────────────────────────────────────────────────────
/**
 * Seller-level delivery slots + minimum order value.
 * `mov` is the raw value; components render the "Seller MOV:" label.
 * ("Beat day" = the salesman's route day for that retailer.)
 */
export const DELIVERY_OPTIONS: DeliveryOption[] = [
  { date: 'Fri, 28th (Beat day)', mov: '500' },
  { date: 'Tomorrow', mov: '2,500' },
];
const distOpts = DELIVERY_OPTIONS;

function rupees(n: string) { return Number(n.replace(/,/g, '')); }
function fmt(n: number) { return n.toLocaleString('en-IN'); }

/** Category artwork, keyed by category name — used as the product-photo fallback. */
const CATEGORY_IMAGE_BY_NAME: Record<string, any> = Object.fromEntries(
  categories.map((c) => [c.name, c.image])
);

function build(base: Base, source: Source): Product {
  const caseText =
    base.quantities === Q_PC ? 'Case: 12 pc' :
    base.quantities === Q_KG ? 'Case: 1 bag' :
    base.quantities === Q_ML ? 'Case: 24 pc' : 'Case: 16 pc';
  // Real pack shot where we have one, else the category artwork (never a bare colour block).
  const image =
    base.subCategory === 'Oil & Ghee'
      ? productImages.freedomSunflower1L
      : CATEGORY_IMAGE_BY_NAME[base.subCategory];

  const common = {
    id: `${source === 'distributor' ? 'd' : 'w'}_${base.id}`,
    brand: base.brand,
    name: base.name,
    caseText,
    quantities: base.quantities,
    margin: base.margin,
    mrp: base.mrp,
    price: base.price,
    unit: 'pc',
    freeDelivery: true,
    source,
    category: base.category,
    subCategory: base.subCategory,
    keywords: base.keywords,
    tint: base.tint,
    image,
    bestsellerRank: base.best,
  };

  if (source === 'distributor') {
    return {
      ...common,
      from: DISTRIBUTORS_BY_BRAND[base.brand] ?? 'Shri Sai Krishna Traders',
      deliveryOptions: distOpts,
    };
  }
  // wholesalers: two competing sellers around the case price
  const unit = rupees(base.price);
  const caseQty = base.quantities === Q_KG ? 8 : 12;
  const p1 = unit * caseQty;
  const p2 = Math.round(p1 * 0.94);
  return {
    ...common,
    sellers: [
      { name: 'Seller 1', price: fmt(p1), freeDelivery: true, selected: true },
      { name: 'Seller 2', price: fmt(p2), freeDelivery: true },
    ],
    deliveryBy: 'Delivery by Tomorrow',
  };
}

export const products: Product[] = BASE.flatMap((base) => {
  if (base.only === 'wholesaler') return [build(base, 'wholesaler')];
  if (base.only === 'distributor') return [build(base, 'distributor')];
  return [build(base, 'distributor'), build(base, 'wholesaler')];
});

/** The single SKU that no distributor carries — drives the empty-state edge case. */
export const WHOLESALER_ONLY_EXAMPLE = 'Maggi 2-Minute Masala Noodles';

/** The mirror case: no wholesaler lists it, so the Wholesalers tab points back. */
export const DISTRIBUTOR_ONLY_EXAMPLE = 'Anil Jowar Millets';

// ─────────────────────────────────────────────────────────────
// Brands / distributors / offers
// ─────────────────────────────────────────────────────────────
export const brands: Brand[] = [
  { id: 'b_fortune', name: 'Fortune', category: 'Oil & Ghee', color: '#E7B10A', logo: brandLogos.fortune },
  { id: 'b_freedom', name: 'Freedom', category: 'Oil & Ghee', color: '#F4C21E', logo: brandLogos.freedom },
  { id: 'b_ruchi', name: 'Ruchi Gold', category: 'Oil & Ghee', color: '#C0392B', logo: brandLogos.ruchiGold },
  { id: 'b_sunsure', name: 'Sunsure', category: 'Oil & Ghee', color: '#F0A500' },
  { id: 'b_saffola', name: 'Saffola', category: 'Oil & Ghee', color: '#E0A21C' },
  { id: 'b_aashirvaad', name: 'Aashirvaad', category: 'Atta, Flours and Sooji', color: '#D77A2B' },
  { id: 'b_tatasampann', name: 'Tata Sampann', category: 'Dals and Pulses', color: '#9CB33A' },
  { id: 'b_shreya', name: 'Shreya Gold', category: 'Dals and Pulses', color: '#C99A2E' },
  { id: 'b_indiagate', name: 'India Gate', category: 'Rice and Rice Products', color: '#CDB88A' },
  { id: 'b_tata', name: 'Tata', category: 'Salt, Sugar and Jaggery', color: '#3B7FC4' },
  { id: 'b_madhur', name: 'Madhur', category: 'Salt, Sugar and Jaggery', color: '#7DBE4E', logo: brandLogos.madhurSugar },
  { id: 'b_grb', name: 'GRB', category: 'Salt, Sugar and Jaggery', color: '#B5651D', logo: brandLogos.grb },
  { id: 'b_redlabel', name: 'Red Label', category: 'Tea and Coffee', color: '#C81E1E' },
  { id: 'b_tatatea', name: 'Tata Tea', category: 'Tea and Coffee', color: '#B8860B' },
  { id: 'b_nescafe', name: 'Nescafe', category: 'Tea and Coffee', color: '#1A1A1A', logo: brandLogos.nescafe },
  { id: 'b_nestea', name: 'Nestea', category: 'Beverages', color: '#2C6BE8', logo: brandLogos.nescafe },
  { id: 'b_dove', name: 'Dove', category: 'Beauty & Hygiene', color: '#5AA9E6' },
  { id: 'b_clinic', name: 'Clinic Plus', category: 'Beauty & Hygiene', color: '#E86AA6' },
  { id: 'b_mysore', name: 'Mysore Sandal', category: 'Beauty & Hygiene', color: '#C0392B', logo: brandLogos.mysoreSandal },
  { id: 'b_lux', name: 'Lux', category: 'Beauty & Hygiene', color: '#D98AB0' },
  { id: 'b_colgate', name: 'Colgate', category: 'Oral care', color: '#C81E1E' },
  { id: 'b_surf', name: 'Surf Excel', category: 'Detergents and Dishwash', color: '#1E5FA8' },
  { id: 'b_vim', name: 'Vim', category: 'Detergents and Dishwash', color: '#F4C21E' },
  { id: 'b_parle', name: 'Parle', category: 'Chocolates and Biscuits', color: '#E0B04A' },
  { id: 'b_britannia', name: 'Britannia', category: 'Chocolates and Biscuits', color: '#D4A017' },
  { id: 'b_kurkure', name: 'Kurkure', category: 'Snacks and Namkeen', color: '#E2571E' },
  { id: 'b_dabur', name: 'Dabur', category: 'Sauces, Spreads and Dips', color: '#E0A21C' },
  { id: 'b_kissan', name: 'Kissan', category: 'Sauces, Spreads and Dips', color: '#D64545' },
  { id: 'b_everest', name: 'Everest', category: 'Masala & Seasoning', color: '#C0392B' },
  { id: 'b_mtr', name: 'MTR', category: 'Masala & Seasoning', color: '#C0392B', logo: brandLogos.mtr },
  { id: 'b_gd', name: 'GD Hing', category: 'Masala & Seasoning', color: '#E0B04A', logo: brandLogos.gdHing },
  { id: 'b_amul', name: 'Amul', category: 'Dairy and Cheese', color: '#E23D3D' },
  { id: 'b_maggi', name: 'Maggi', category: 'Pasta, Soup and Noodles', color: '#E2571E' },
  { id: 'b_anil', name: 'Anil', category: 'Foodgrains', color: '#C88A2E' },
  /** White label — the distributor's own unbranded staples. */
  { id: 'b_valuechoice', name: 'Value Choice', category: 'Foodgrains', color: '#8A9A5B' },
  { id: 'b_srilalitha', name: 'Sri Lalitha', category: 'Atta, Flours and Sooji', color: '#E0C56A', logo: brandLogos.sriLalitha },
  { id: 'b_cycle', name: 'Cycle', category: 'Pooja Needs', color: '#2C3E8F', logo: brandLogos.cycle },
  { id: 'b_ajay', name: 'Ajay Care', category: 'Personal Care', color: '#2AA6D6', logo: brandLogos.ajay },
  { id: 'b_vicco', name: 'Vicco', category: 'Ayurvedic', color: '#C0392B', logo: brandLogos.vicco },
  { id: 'b_zinda', name: 'Zinda Tilismath', category: 'Ayurvedic', color: '#1A1A1A', logo: brandLogos.zindaTilismath },
  { id: 'b_as', name: 'AS Brand', category: 'Oil & Ghee', color: '#C0392B', logo: brandLogos.asBrand },
  { id: 'b_sneha', name: 'Sneha', category: 'Oil & Ghee', color: '#FBEE2F', logo: brandLogos.sneha },
  { id: 'b_dwibhashi', name: 'Dwibhashi', category: 'Ayurvedic', color: '#7A9A2E', logo: brandLogos.dwibhashi },
  { id: 'b_blackrose', name: 'Black Rose', category: 'Beauty & Hygiene', color: '#1A1A1A', logo: brandLogos.blackRose },
];

export const offers: Offer[] = [
  { id: 'o_dal', name: 'Amazing Dal Deals', productIds: products.filter((p) => p.subCategory === 'Dals and Pulses').map((p) => p.id), color: '#029664' },
  { id: 'o_savings', name: 'Big Savings Alert', productIds: products.filter((p) => ['Oil & Ghee', 'Rice and Rice Products'].includes(p.subCategory)).map((p) => p.id), color: '#7A2FF2' },
];

export const distributors: Distributor[] = [
  { id: 'd_saikrishna', name: 'Shri Sai Krishna Traders', sub: 'Fortune, Freedom, Ruchi Gold', color: '#F4C21E', brands: ['Fortune', 'Freedom', 'Ruchi Gold', 'Sunsure', 'Saffola'] },
  { id: 'd_omkar', name: 'Omkar Enterprices', sub: 'Nescafe, Nestea, Red Label', color: '#1A1A1A', brands: ['Nescafe', 'Nestea', 'Red Label', 'Tata Tea'] },
  { id: 'd_sairam', name: 'Sri Sairam Enterprises', sub: 'Ajay Care, Cycle', color: '#2C6BE8', brands: ['Ajay Care', 'Cycle'] },
  { id: 'd_sr', name: 'SR Enterprises', sub: 'Mysore Sandal, Vicco', color: '#C0392B', brands: ['Mysore Sandal', 'Vicco'] },
  { id: 'd_venkat', name: 'Venkateswara Agencies', sub: 'GD Hing, AS Brand, MTR', color: '#E0A21C', brands: ['GD Hing', 'AS Brand', 'MTR'] },
];

// ─────────────────────────────────────────────────────────────
// Personalization + zero-state
// ─────────────────────────────────────────────────────────────
/** Existing-retailer order history → drives "Previously Bought" (distributor listings). */
export const orderHistory: OrderHistoryEntry[] = [
  { productId: 'd_oil_freedom1', lastOrdered: '2 days ago', timesOrdered: 12, lastQty: '1 ltr' },
  { productId: 'd_oil_freedom4', lastOrdered: '3 weeks ago', timesOrdered: 3, lastQty: '5 ltr' },
  { productId: 'd_oil_fortune1', lastOrdered: '3 days ago', timesOrdered: 14, lastQty: '5 ltr' },
  { productId: 'd_oil_ruchi1', lastOrdered: '10 days ago', timesOrdered: 4, lastQty: '1 ltr' },
  { productId: 'd_atta_ashirvaad1', lastOrdered: '5 days ago', timesOrdered: 9, lastQty: '10 Kg' },
  { productId: 'd_salt_tata1', lastOrdered: '1 week ago', timesOrdered: 7, lastQty: '5 Kg' },
  { productId: 'd_tea_redlabel1', lastOrdered: '4 days ago', timesOrdered: 11, lastQty: '250 g' },
  { productId: 'd_tea_tatagold1', lastOrdered: '2 weeks ago', timesOrdered: 3, lastQty: '500 g' },
  { productId: 'd_shampoo_dove1', lastOrdered: '2 weeks ago', timesOrdered: 4, lastQty: '340 ml' },
  { productId: 'd_dal_shreya1', lastOrdered: '6 days ago', timesOrdered: 6, lastQty: '30 Kg' },
  { productId: 'd_dal_sampann_moong1', lastOrdered: '9 days ago', timesOrdered: 5, lastQty: '1 Kg' },
  { productId: 'd_sugar_madhur1', lastOrdered: '8 days ago', timesOrdered: 8, lastQty: '5 Kg' },
  { productId: 'd_bis_parle1', lastOrdered: '3 days ago', timesOrdered: 10, lastQty: '12 pc' },
  { productId: 'd_det_surf1', lastOrdered: '11 days ago', timesOrdered: 5, lastQty: '1 Kg' },
  { productId: 'd_coffee_classic1', lastOrdered: '5 days ago', timesOrdered: 6, lastQty: '100 g' },
  { productId: 'd_masala_chilli1', lastOrdered: '12 days ago', timesOrdered: 4, lastQty: '200 g' },
  { productId: 'd_soap_mysore1', lastOrdered: '3 weeks ago', timesOrdered: 3, lastQty: '100 g' },
  // wholesaler-side history
  { productId: 'w_rice_mateja1', lastOrdered: '1 week ago', timesOrdered: 4, lastQty: '26 Kg' },
];

export const trendingTerms = ['Cooking Oil', 'Toor Dal', 'Aashirvaad Atta', 'Red Label Tea', 'Shampoo', 'Sugar'];
export const seedRecentSearches = ['Fortune Oil', 'Red Label', 'Moong Dal'];

/** Synonym / vernacular dictionary (PRD Layer 1, Appendix C). */
export const synonyms: Record<string, string[]> = {
  tel: ['oil'],
  chawal: ['rice'],
  namak: ['salt'],
  cheeni: ['sugar'],
  shakkar: ['sugar'],
  atta: ['atta', 'wheat', 'flour'],
  gehun: ['wheat', 'atta', 'flour'],
  dal: ['dal', 'pulses'],
  daal: ['dal', 'pulses'],
  sabun: ['soap'],
  chai: ['tea'],
  shahad: ['honey'],
  mirchi: ['chilli'],
  achar: ['pickle'],
  makhan: ['butter'],
  gud: ['jaggery'],
  bellam: ['jaggery'],
  suji: ['sooji', 'rava'],
  rava: ['sooji', 'rava'],
  bartan: ['dishwash'],
  coffe: ['coffee'],
};

// ─────────────────────────────────────────────────────────────
// Home screen rails
// ─────────────────────────────────────────────────────────────
export const homeDistributors = [
  { id: 'hd1', brand: 'Freedom Oil', distributor: 'Shri Sai Krishna Traders', logo: brandLogos.freedom },
  { id: 'hd2', brand: 'Nescafe', distributor: 'Omkar Enterprices', logo: brandLogos.nescafe, bg: '#000000' },
  { id: 'hd3', brand: 'Nestea', distributor: 'Omkar Enterprices', logo: brandLogos.nescafe, bg: '#000000' },
  { id: 'hd4', brand: 'Ruchi Gold Oil', distributor: 'Shri Sai Krishna Traders', logo: brandLogos.ruchiGold },
  { id: 'hd5', brand: 'Ajay Care', distributor: 'Sri Sairam Enterprises', logo: brandLogos.ajay },
  { id: 'hd6', brand: 'Mysore Sandal', distributor: 'SR Enterprises', logo: brandLogos.mysoreSandal },
  { id: 'hd7', brand: 'Cycle', distributor: 'Sri Sairam Enterprises', logo: brandLogos.cycle },
  { id: 'hd8', brand: 'Vicco', distributor: 'SR Enterprises', logo: brandLogos.vicco },
  { id: 'hd9', brand: 'GD Hing', distributor: 'Venkateswara Agencies', logo: brandLogos.gdHing },
  { id: 'hd10', brand: 'AS Brand', distributor: 'Venkateswara Agencies', logo: brandLogos.asBrand },
];

export const homeBrands = [
  { id: 'hb1', label: 'Freedom Oil', logo: brandLogos.freedom },
  { id: 'hb2', label: 'Nescafe Classic', logo: brandLogos.nescafe, bg: '#000000' },
  { id: 'hb3', label: 'Nescafe Sunrise', logo: brandLogos.nescafe, bg: '#000000' },
  { id: 'hb4', label: 'Nescafe Gold', logo: brandLogos.nescafe, bg: '#000000' },
  { id: 'hb5', label: 'Nestea', logo: brandLogos.nescafe, bg: '#000000' },
  { id: 'hb6', label: 'AS Brand', logo: brandLogos.asBrand },
  { id: 'hb7', label: 'GD Hing', logo: brandLogos.gdHing },
  { id: 'hb8', label: 'Madhur Sugar', logo: brandLogos.madhurSugar },
  { id: 'hb9', label: 'Ajay Care', logo: brandLogos.ajay },
  { id: 'hb10', label: 'Sneha & Sukhibhava Oil', logo: brandLogos.sneha, bg: '#FBEE2F' },
  { id: 'hb11', label: 'Cycle', logo: brandLogos.cycle },
  { id: 'hb12', label: 'GRB', logo: brandLogos.grb },
  { id: 'hb13', label: 'MTR', logo: brandLogos.mtr },
  { id: 'hb14', label: 'Sri Lalitha', logo: brandLogos.sriLalitha },
  { id: 'hb15', label: 'Mysore Sandal', logo: brandLogos.mysoreSandal },
  { id: 'hb16', label: 'Fortune Oil', logo: brandLogos.fortune },
  { id: 'hb17', label: 'Zindha Tilismath', logo: brandLogos.zindaTilismath },
  { id: 'hb18', label: 'Dwibhashi Ayurveda', logo: brandLogos.dwibhashi },
  { id: 'hb19', label: 'Vicco', logo: brandLogos.vicco },
  { id: 'hb20', label: 'Black Rose Hair Color', logo: brandLogos.blackRose },
];

export const productById = (id: string) => products.find((p) => p.id === id);
export const orderedProductIds = new Set(orderHistory.map((o) => o.productId));
export const historyById = (id: string) => orderHistory.find((o) => o.productId === id);
