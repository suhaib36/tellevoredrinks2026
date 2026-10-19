export type TabType = 'home' | 'shop' | 'rewards' | 'favorites' | 'profile';

export interface Product {
  id: string;
  name: string;
  category: string;
  badge?: string;
  badgeType?: 'bestseller' | 'seasonal' | 'organic' | 'adaptogenic' | 'new-harvest' | 'zero-proof' | 'exclusive';
  price: number;
  originalPrice?: number;
  size: string;
  rating?: number;
  reviewsCount?: number;
  notes?: string;
  description: string;
  imageUrl: string;
  isSaved?: boolean;
  stockStatus?: 'in-stock' | 'low-stock' | 'just-restocked' | 'out-of-stock';
  stockCount?: number;
  lastOrderedText?: string;
  autoRefillOptions?: string[];
  currentAutoRefill?: string;
  stockNotify?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface RewardItem {
  id: string;
  title: string;
  seedsCost: number;
  description: string;
  imageUrl: string;
  category: string;
}

export interface SeedActivity {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  iconType: 'cart' | 'referral' | 'voucher' | 'streak';
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
  statusType: 'in-transit' | 'delivered';
  courier: string;
  summary: string;
  items: { name: string; qty: number; price: number }[];
  trackingId?: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  memberSince: string;
  tier: string;
  seeds: number;
  level: number;
  totalLevels: number;
  nextTier: string;
  seedsNeeded: number;
  treesPlanted: number;
  avatarUrl: string;
  address: string;
  paymentMethod: string;
  dietaryPreferences: string;
  subscription: {
    title: string;
    status: string;
    cycleText: string;
    price: number;
    nextDispatchDate: string;
    curatedItems: string;
    canCount: number;
  };
  notifications: {
    seasonalDrops: boolean;
    restockAlerts: boolean;
    orderUpdates: boolean;
  };
}
