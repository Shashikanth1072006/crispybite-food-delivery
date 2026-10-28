export type ProductCategory = 
  | 'chicken'
  | 'burgers'
  | 'buckets'
  | 'sides'
  | 'beverages'
  | 'desserts';

export interface AddonOption {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  image: string;
  rating: number;
  reviewsCount: number;
  isVeg: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  spiceLevels?: string[]; // e.g. ['Mild', 'Medium', 'Fiery Hot']
  addons?: AddonOption[];
  available: boolean;
  pieceCount?: string; // e.g. "4 Pcs", "8 Pcs"
  serves?: string; // e.g. "Serves 1-2"
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  spiceLevel?: string;
  selectedAddons: AddonOption[];
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 
  | 'placed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderPricing {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  pincode: string;
  instructions?: string;
  addressType: 'Home' | 'Work' | 'Other';
}

export type PaymentMethod = 'cod' | 'upi' | 'card';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  pricing: OrderPricing;
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
  estimatedDeliveryTime: string; // e.g. "30-35 mins"
  deliveryPartner?: {
    name: string;
    phone: string;
    rating: number;
  };
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  street: string;
  landmark?: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
  addresses: Address[];
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  description: string;
  expiresOn: string;
}
