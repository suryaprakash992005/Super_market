import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Category, 
  CartItem, 
  Order, 
  UserProfile, 
  Banner, 
  SupermarketSettings, 
  DeliveryAddress,
  OrderStatus,
  PaymentStatus,
  FulfillmentMethod,
  PaymentMethod
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_BANNERS, 
  INITIAL_SETTINGS, 
  INITIAL_ORDERS 
} from '../data/seedData';
import { generateOrderNumber } from '../lib/utils';
import confetti from 'canvas-confetti';

interface StoreContextType {
  // Catalog
  products: Product[];
  categories: Category[];
  banners: Banner[];
  settings: SupermarketSettings;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  updateSettings: (updates: Partial<SupermarketSettings>) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, notes?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  updateCartNotes: (productId: string, notes: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  cartTotal: number;
  couponCode: string;
  couponDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  lastAddedProductId: string | null;
  cartBounce: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCartFromWishlist: (productId: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (details: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    fulfillmentMethod: FulfillmentMethod;
    paymentMethod: PaymentMethod;
    deliveryAddress?: DeliveryAddress;
    deliverySlot?: string;
    specialInstructions?: string;
    transactionId?: string;
  }) => Order;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderPaymentStatus: (orderId: string, status: PaymentStatus) => void;
  reorder: (orderId: string) => void;

  // User / Auth
  user: UserProfile | null;
  addresses: DeliveryAddress[];
  addAddress: (address: Omit<DeliveryAddress, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<DeliveryAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  login: (email: string, role?: 'customer' | 'admin') => void;
  logout: () => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;

  // Global search & UI
  globalSearch: string;
  setGlobalSearch: (term: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'bharathi_store_products_v1',
  CATEGORIES: 'bharathi_store_categories_v1',
  BANNERS: 'bharathi_store_banners_v1',
  SETTINGS: 'bharathi_store_settings_v1',
  CART: 'bharathi_store_cart_v1',
  WISHLIST: 'bharathi_store_wishlist_v1',
  ORDERS: 'bharathi_store_orders_v1',
  ADDRESSES: 'bharathi_store_addresses_v1',
  USER: 'bharathi_store_user_v1',
  IS_ADMIN: 'bharathi_store_is_admin_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Catalog State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [banners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BANNERS);
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [settings, setSettings] = useState<SupermarketSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // 2. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [lastAddedProductId, setLastAddedProductId] = useState<string | null>(null);
  const [cartBounce, setCartBounce] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // 3. Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : ['prod-01', 'prod-06', 'prod-14'];
  });

  // 4. Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // 5. User & Addresses State
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    if (saved) return JSON.parse(saved);
    return {
      id: 'usr-default-01',
      email: 'customer@bharathistore.com',
      fullName: 'Karthik Subramanian',
      phone: '+91 98421 99887',
      role: 'customer',
      savedAddresses: [],
    };
  });

  const [addresses, setAddresses] = useState<DeliveryAddress[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ADDRESSES);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'addr-01',
        recipientName: 'Karthik Subramanian',
        phone: '+91 98421 99887',
        streetAddress: '15/2, Annai Nagar, Bypass Road',
        landmark: 'Near Meenakshi Mission Hospital',
        city: 'Madurai',
        state: 'Tamil Nadu',
        postalCode: '625016',
        label: 'Home',
        isDefault: true,
      },
      {
        id: 'addr-02',
        recipientName: 'Karthik Subramanian',
        phone: '+91 98421 99887',
        streetAddress: 'Suite 302, Cyber Tower, Ring Road',
        landmark: 'Opposite State Bank',
        city: 'Madurai',
        state: 'Tamil Nadu',
        postalCode: '625020',
        label: 'Work',
        isDefault: false,
      }
    ];
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.IS_ADMIN);
    return saved ? JSON.parse(saved) : false;
  });

  // UI state
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Realtime cross-tab synchronization for order fulfillment updates
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEYS.ORDERS && e.newValue) {
        try {
          const updatedOrders = JSON.parse(e.newValue);
          setOrders(updatedOrders);
        } catch {
          // ignore corrupted event data
        }
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.IS_ADMIN, JSON.stringify(isAdmin));
  }, [isAdmin]);

  // Cart Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const freeDeliveryThreshold = settings.minOrderForFreeDelivery;
  const isFreeDelivery = cartSubtotal >= freeDeliveryThreshold || cartSubtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : settings.standardDeliveryFee;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const cartTotal = Math.max(0, cartSubtotal + deliveryFee - couponDiscount);

  // Cart Actions
  const addToCart = (product: Product, quantity: number = 1, notes?: string) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
            : item
        );
      }
      return [...prevCart, { product, quantity, notes }];
    });

    // Trigger micro-interaction animation
    setLastAddedProductId(product.id);
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 500);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const updateCartNotes = (productId: string, notes: string) => {
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, notes } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setCouponDiscount(0);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BHARATHI50' && cartSubtotal >= 300) {
      setCouponCode('BHARATHI50');
      setCouponDiscount(50);
      return { success: true, message: '₹50 savings applied!' };
    }
    if (clean === 'FIRSTORDER' && cartSubtotal >= 200) {
      setCouponCode('FIRSTORDER');
      setCouponDiscount(40);
      return { success: true, message: 'Welcome offer: ₹40 discount applied!' };
    }
    if (clean === 'SUPER100' && cartSubtotal >= 999) {
      setCouponCode('SUPER100');
      setCouponDiscount(100);
      return { success: true, message: 'Mega savings: ₹100 discount applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code. Try BHARATHI50 (min ₹300).' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
  };

  // Wishlist Actions
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const moveToCartFromWishlist = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
      toggleWishlist(productId);
    }
  };

  // Orders Actions
  const placeOrder = (details: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    fulfillmentMethod: FulfillmentMethod;
    paymentMethod: PaymentMethod;
    deliveryAddress?: DeliveryAddress;
    deliverySlot?: string;
    specialInstructions?: string;
    transactionId?: string;
  }): Order => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      userId: user ? user.id : 'usr-default-01',
      createdAt: new Date().toISOString(),
      status: 'placed',
      paymentStatus: details.paymentMethod === 'cod' || details.paymentMethod === 'pay_at_store' ? 'pending' : 'paid',
      paymentMethod: details.paymentMethod,
      fulfillmentMethod: details.fulfillmentMethod,
      customerName: details.customerName,
      customerPhone: details.customerPhone,
      customerEmail: details.customerEmail,
      deliveryAddress: details.deliveryAddress,
      deliverySlot: details.deliverySlot || 'Earliest available slot (within 2 hours)',
      specialInstructions: details.specialInstructions,
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        unit: item.product.unit,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.images[0],
        total: item.product.price * item.quantity,
      })),
      subtotal: cartSubtotal,
      deliveryFee: details.fulfillmentMethod === 'store_pickup' ? 0 : deliveryFee,
      discount: couponDiscount,
      total: details.fulfillmentMethod === 'store_pickup' 
        ? Math.max(0, cartSubtotal - couponDiscount) 
        : cartTotal,
      transactionId: details.transactionId,
    };

    // Deduct stock
    setProducts(prevProducts => 
      prevProducts.map(prod => {
        const cartItem = cart.find(ci => ci.product.id === prod.id);
        if (cartItem) {
          const newQty = Math.max(0, prod.stockQuantity - cartItem.quantity);
          return {
            ...prod,
            stockQuantity: newQty,
            inStock: newQty > 0,
          };
        }
        return prod;
      })
    );

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#C8102E', '#1B873F', '#FFFFFF', '#C98A19'],
      });
    } catch {
      // ignore
    }

    return newOrder;
  };

  const getOrderById = (id: string) => {
    return orders.find(o => o.id === id || o.orderNumber === id);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updateOrderPaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: status } : o));
  };

  const reorder = (orderId: string) => {
    const order = getOrderById(orderId);
    if (!order) return;

    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantity);
      }
    });
    setIsCartOpen(true);
  };

  // Addresses
  const addAddress = (addr: Omit<DeliveryAddress, 'id'>) => {
    const newAddr: DeliveryAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0 ? true : addr.isDefault,
    };
    if (newAddr.isDefault) {
      setAddresses(prev => [...prev.map(a => ({ ...a, isDefault: false })), newAddr]);
    } else {
      setAddresses(prev => [...prev, newAddr]);
    }
  };

  const updateAddress = (id: string, updates: Partial<DeliveryAddress>) => {
    setAddresses(prev => prev.map(addr => {
      if (addr.id === id) {
        return { ...addr, ...updates };
      }
      if (updates.isDefault) {
        return { ...addr, isDefault: false };
      }
      return addr;
    }));
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  // Auth simulation
  const login = (email: string, role: 'customer' | 'admin' = 'customer') => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
      phone: '+91 98421 23456',
      role,
      savedAddresses: addresses,
    };
    setUser(newUser);
    if (role === 'admin') {
      setIsAdmin(true);
    }
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  // Admin Catalog Management
  const addProduct = (newProdData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const updateSettings = (updates: Partial<SupermarketSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        banners,
        settings,
        addProduct,
        updateProduct,
        deleteProduct,
        updateCategory,
        updateSettings,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartNotes,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryFee,
        freeDeliveryThreshold,
        amountNeededForFreeDelivery,
        cartTotal,
        couponCode,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        lastAddedProductId,
        cartBounce,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,
        orders,
        placeOrder,
        getOrderById,
        updateOrderStatus,
        updateOrderPaymentStatus,
        reorder,
        user,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        login,
        logout,
        isAdmin,
        setIsAdmin,
        globalSearch,
        setGlobalSearch,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
