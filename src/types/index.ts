export type CategoryId = string;

export interface ProductVariant {
  id: string;
  name?: string; // e.g. "Standard Pack", "Value Pack", "500g"
  unit: string; // e.g. "50 g", "100 g", "200 g", "250 g", "500 g", "1 kg"
  price: number;
  mrp: number;
  inStock: boolean;
  stockQuantity?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  description: string;
  imageUrl: string;
  icon?: string;
  displayOrder?: number;
  isActive?: boolean;
  itemCount: number;
  featured?: boolean;
  subcategories?: Category[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryId;
  categoryName: string;
  subcategoryId?: string;
  subcategorySlug?: string;
  subcategoryName?: string;
  brand?: string;
  price: number;
  mrp: number; // Maximum Retail Price (for strikethrough discount)
  unit: string; // e.g. "1 kg", "500 g", "1 L", "Pack of 6"
  variants?: ProductVariant[];
  inStock: boolean;
  stockQuantity: number;
  isFeatured?: boolean;
  isDailyStaple?: boolean;
  isDeal?: boolean;
  rating: number;
  reviewCount: number;
  origin: string; // e.g. "Direct from Ooty Farms", "Madurai Local Produce"
  description: string;
  storageInstructions?: string;
  nutritionalHighlights?: string[];
  images: string[];
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  notes?: string;
}

export type FulfillmentMethod = 'delivery' | 'store_pickup';

export type PaymentMethod = 'cod' | 'razorpay' | 'paytm' | 'phonepe' | 'pay_at_store';

export type OrderStatus = 
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface DeliveryAddress {
  id?: string;
  recipientName: string;
  phone: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
  label?: 'Home' | 'Work' | 'Other';
}

export interface OrderItem {
  productId: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  imageUrl: string;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  fulfillmentMethod: FulfillmentMethod;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress?: DeliveryAddress;
  deliverySlot?: string;
  specialInstructions?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  transactionId?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses: DeliveryAddress[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  badge: string;          // campaign label e.g. "FRESH FROM THE MARKET"
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  bgGradient: string;
  imageUrl: string;
  mobileImageUrl?: string;
  category?: string;
  theme?: 'dark' | 'light'; // text colour theme over image
  displayOrder?: number;
  isActive: boolean;
}

export interface SupermarketSettings {
  storeName: string;
  storeAddress: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  minOrderForFreeDelivery: number;
  standardDeliveryFee: number;
  codEnabled: boolean;
  onlinePaymentEnabled: boolean;
  storePickupEnabled: boolean;
  gstin: string;
}
