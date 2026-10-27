export interface Product {
  id: string;
  name: string;
  category: 'mahshi' | 'goulash' | 'pasta' | 'boxes';
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  prepTime: string; // e.g. "45 دقيقة"
  calories: number;
  servings: string; // e.g. "يكفي 3-4 أفراد"
  ingredients: string[];
  dietaryTags: string[]; // e.g. "سمنة بلدي 100%", "طازة النهاردة", "حراق ومشطشط"
  spiceLevel: 'none' | 'mild' | 'spicy';
  rating: number;
  reviewsCount: number;
  stockCount: number;
  isFeatured?: boolean;
  chefTip?: string;
  sizes?: {
    id: 'medium' | 'large' | 'single' | 'family' | 'banquet';
    name: string;
    servings: string;
    price: number;
  }[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSizeName?: string;
  calculatedPrice: number;
  customNotes?: string;
}

export type OrderStatus = 'received' | 'in_kitchen' | 'packaged' | 'on_the_way' | 'delivered';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  district: string;
  address: string;
  deliveryType: 'instant' | 'scheduled' | 'pickup';
  scheduledDate?: string;
  scheduledTime?: string;
  paymentMethod: 'instapay' | 'vodafone_cash' | 'card' | 'cash';
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
  estimatedDeliveryMinutes: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  cities: string[];
  fee: number;
  estimatedTime: string;
  minOrder: number;
  available: boolean;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  minSpend: number;
}
