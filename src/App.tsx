import React, { useState } from 'react';
import { Product, CartItem, Order, OrderStatus, Coupon, DeliveryZone } from './types';
import { INITIAL_PRODUCTS, DELIVERY_ZONES, INITIAL_COUPONS } from './data/products';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { KitchenAdmin } from './components/KitchenAdmin';
import { MarketingHubModal } from './components/MarketingHubModal';
import { DeliveryZonesModal } from './components/DeliveryZonesModal';
import { KitchenStoryModal } from './components/KitchenStoryModal';
import { AdminSecurityModal } from './components/AdminSecurityModal';
import { StoreLockGate } from './components/StoreLockGate';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileFloatingCart } from './components/MobileFloatingCart';
import {
  Search,
  Sparkles,
  Heart,
  Phone,
  Flame,
  Award,
  Lock,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  // Application Data States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'demo-order-eg-1',
      orderNumber: 'MLB-829143',
      customerName: 'مريم الشناوي',
      phone: '01012345678',
      district: 'التجمع الخامس، القاهرة الجديدة',
      address: 'شارع التسعين الجنوبي، فيلا 22',
      deliveryType: 'instant',
      paymentMethod: 'cash',
      items: [
        {
          id: 'ci-1',
          product: INITIAL_PRODUCTS[0], // ورق عنب كلاسيك 180
          quantity: 1,
          selectedSizeName: undefined,
          calculatedPrice: 180,
          customNotes: 'زيادة ليمون لو سمحتوا',
        },
        {
          id: 'ci-2',
          product: INITIAL_PRODUCTS[11], // مكرونة بشاميل طاجن وسط 150
          quantity: 1,
          selectedSizeName: 'طاجن وسط (2-3 أفراد)',
          calculatedPrice: 150,
        },
      ],
      subtotal: 330,
      discount: 66,
      deliveryFee: 40,
      total: 304,
      couponCode: 'LOVE20',
      status: 'in_kitchen',
      createdAt: 'منذ 20 دقيقة',
      notes: 'رن الجرس وخلي الأوردر مع الأمن لو مش موجودة',
      estimatedDeliveryMinutes: 35,
    },
  ]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(INITIAL_COUPONS[0]); // 20% discount active
  const [availableCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [deliveryZones] = useState<DeliveryZone[]>(DELIVERY_ZONES);

  // View & Modal States
  const [currentView, setCurrentView] = useState<'store' | 'kitchen'>('store');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isDeliveryZonesOpen, setIsDeliveryZonesOpen] = useState(false);
  const [isMarketingHubOpen, setIsMarketingHubOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Security & Access Control State (نظام حماية المتجر ومنع دخول أي شخص آخر)
  const [adminPin, setAdminPin] = useState<string>(() => {
    return localStorage.getItem('malfouf_admin_pin') || '2025';
  });
  const [isSessionUnlocked, setIsSessionUnlocked] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isStoreLocked, setIsStoreLocked] = useState<boolean>(() => {
    return localStorage.getItem('malfouf_store_locked') === 'true';
  });
  const [isStoreTemporarilyUnlocked, setIsStoreTemporarilyUnlocked] = useState(false);

  const handleUpdatePin = (newPin: string) => {
    setAdminPin(newPin);
    localStorage.setItem('malfouf_admin_pin', newPin);
  };

  const handleToggleStoreLock = (locked: boolean) => {
    setIsStoreLocked(locked);
    localStorage.setItem('malfouf_store_locked', String(locked));
    if (!locked) {
      setIsStoreTemporarilyUnlocked(false);
    }
  };

  const handleLockSession = () => {
    setIsSessionUnlocked(false);
    setCurrentView('store');
  };

  const handleToggleView = (view: 'store' | 'kitchen') => {
    if (view === 'kitchen') {
      if (isSessionUnlocked) {
        setCurrentView('kitchen');
      } else {
        setIsSecurityModalOpen(true);
      }
    } else {
      setCurrentView('store');
    }
  };

  // Cart Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.calculatedPrice * item.quantity, 0);
  const cartDiscount = appliedCoupon ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100) : 0;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    selectedSizeName?: string,
    customNotes?: string
  ) => {
    let unitPrice = product.price;
    if (selectedSizeName && product.sizes) {
      const match = product.sizes.find((s) => s.name === selectedSizeName);
      if (match) unitPrice = match.price;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSizeName === selectedSizeName &&
          item.customNotes === customNotes
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      }

      return [
        ...prev,
        {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          product,
          quantity: 1,
          selectedSizeName,
          calculatedPrice: unitPrice,
          customNotes,
        },
      ];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Coupon Handlers
  const handleApplyCoupon = (code: string): boolean => {
    const found = availableCoupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (found) {
      setAppliedCoupon(found);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // Order Handlers
  const handleOrderComplete = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Deduct stock for ordered items
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItem = newOrder.items.find((item) => item.product.id === prod.id);
        if (orderedItem) {
          return {
            ...prod,
            stockCount: Math.max(0, prod.stockCount - orderedItem.quantity),
          };
        }
        return prod;
      })
    );
    setCart([]);
    setIsTrackerOpen(true);
  };

  // Admin Order & Stock Management Handlers
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockCount: newStock } : p))
    );
  };

  const handleAddNewProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  // Filter products by category, search query, or tag
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = !selectedTag || product.dietaryTags.some((t) => t.includes(selectedTag));

    return matchesCategory && matchesSearch && matchesTag;
  });

  const categories = [
    { id: 'all', label: 'كل المنيو 🍽️' },
    { id: 'mahshi', label: 'المحاشي وورق العنب 🥬' },
    { id: 'goulash', label: 'الجلاش والصواني 🥟' },
    { id: 'pasta', label: 'بشاميل ونجرسكو 🍲' },
  ];

  const popularTags = [
    'سمنة بلدي 100%',
    'الأكثر طلباً',
    'مشطشط نار 🔥',
    'طازة كل يوم',
    'لحمة مفرومة بلدي',
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C211B] flex flex-col font-['Cairo',sans-serif] pb-24 md:pb-0">
      
      {/* Main Navbar */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenDeliveryZones={() => setIsDeliveryZonesOpen(true)}
        onOpenMarketingHub={() => setIsMarketingHubOpen(true)}
        onOpenStory={() => setIsStoryOpen(true)}
        currentView={currentView}
        onToggleView={handleToggleView}
        activeOrdersCount={orders.filter((o) => o.status !== 'delivered').length}
        isSessionUnlocked={isSessionUnlocked}
        isStoreLocked={isStoreLocked}
        onLockSession={handleLockSession}
      />

      {/* Main Content: Storefront or Kitchen Admin */}
      {currentView === 'kitchen' ? (
        <KitchenAdmin
          orders={orders}
          products={products}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateStock={handleUpdateStock}
          onAddNewProduct={handleAddNewProduct}
          onCloseAdmin={() => setCurrentView('store')}
          savedPin={adminPin}
          onUpdatePin={handleUpdatePin}
          onLockSession={handleLockSession}
          isStoreLocked={isStoreLocked}
          onToggleStoreLock={handleToggleStoreLock}
        />
      ) : (
        <main className="flex-1">
          
          {/* Hero Banner */}
          <HeroBanner
            onScrollToMenu={() => {
              const menuEl = document.getElementById('menu-section');
              menuEl?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenStory={() => setIsStoryOpen(true)}
            onApplyCoupon={(code) => {
              handleApplyCoupon(code);
              setIsCartOpen(true);
            }}
          />

          {/* Egyptian Quality Strip */}
          <section className="bg-[#FFFDF9] border-b border-[#EAE0D3] py-3.5 px-3">
            <div className="max-w-7xl mx-auto flex items-center justify-around flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm font-bold text-[#5B4B42]">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg">🌿</span>
                <span>سمنة بلدي فلاحي 100% بدون أي دهون مهدرجة</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg">👩‍🍳</span>
                <span>عمايل إيدين ستات بيوت مصريات شاطرين</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg">📦</span>
                <span>علب وحافظات حرارية يوصلك سخن مولع</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg">⚡</span>
                <span>دفع كاش أو إنستاباي وفودافون كاش</span>
              </div>
            </div>
          </section>

          {/* Menu Catalog Section */}
          <section id="menu-section" className="py-8 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
            
            {/* Section Heading */}
            <div className="text-center space-y-1.5 max-w-2xl mx-auto">
              <span className="text-xs font-black uppercase tracking-wider text-[#B83528] bg-[#FDF0EE] px-3 py-1 rounded-full border border-[#F9D6D0] inline-block">
                منيو الأكلات الفعلية الطازة
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#261B16]">
                أشهى المحاشي والطواجن وصواني الجلاش
              </h2>
              <p className="text-xs sm:text-sm text-[#73635A] font-medium">
                اختار أكلتك المفضلة، وسيب تسويتها وتغليفها علينا عشان توصلك سخنة كأنها طالعة من فرنك
              </p>
            </div>

            {/* Category Filter Tabs - Sticky on Mobile for easy thumb browsing */}
            <div className="sticky top-14 sm:static z-20 bg-[#FAF7F2]/95 backdrop-blur-md py-2 -mx-3 px-3 sm:mx-0 sm:px-0 sm:py-0 flex items-center justify-start lg:justify-center gap-2 overflow-x-auto no-scrollbar border-b border-[#EADECF]/60 sm:border-b-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSelectedTag(null);
                  }}
                  className={`px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all shadow-xs cursor-pointer active:scale-95 touch-manipulation ${
                    activeCategory === cat.id
                      ? 'bg-[#B83528] text-white shadow-[#B83528]/25 scale-102'
                      : 'bg-white text-[#524239] border border-[#E8DACB] hover:bg-[#F8F2E8]'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Search Bar & Quick Dietary Tags */}
            <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-[#E9DDCF] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
              
              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#8C7A70] absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="دور على أكلة (ورق عنب، كرنب، جلاش، بشاميل...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm pr-10 pl-4 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#E5D7C6] focus:outline-none focus:ring-2 focus:ring-[#B83528]/20 text-[#281C16]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 font-bold"
                  >
                    مسح
                  </button>
                )}
              </div>

              {/* Tag filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
                <span className="text-xs font-black text-[#86756C] shrink-0 ml-1">
                  فلترة سريعة:
                </span>
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors border ${
                      selectedTag === tag
                        ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                        : 'bg-[#FAF6F0] text-[#55453C] border-[#E8DACB] hover:bg-[#F2EAE0]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#EADFCF] space-y-3">
                <div className="text-4xl">🔍</div>
                <h3 className="font-bold text-base text-[#2A1D17]">مفيش أكلات تطابق بحثك حالياً</h3>
                <p className="text-xs text-[#7B6A61] max-w-sm mx-auto">
                  جرب تدور باسم تاني أو دوس على إظهار كل الأكلات عشان تشوف كل الأصناف المتاحة.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setSelectedTag(null);
                  }}
                  className="px-4 py-2 bg-[#B83528] text-white text-xs font-bold rounded-xl"
                >
                  إظهار كل الأكلات
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => {
                  const productCartItems = cart.filter((item) => item.product.id === product.id);
                  const totalQty = productCartItems.reduce((acc, ci) => acc + ci.quantity, 0);

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onViewDetails={(prod) => setSelectedProductForModal(prod)}
                      cartQuantity={totalQty}
                      onUpdateCartQuantity={(delta) => {
                        const existing = cart.find((ci) => ci.product.id === product.id);
                        if (existing) {
                          handleUpdateQuantity(existing.id, delta);
                        } else if (delta > 0) {
                          handleAddToCart(product);
                        }
                      }}
                    />
                  );
                })}
              </div>
            )}

          </section>

          {/* Banquets & Large Trays CTA Banner */}
          <section className="bg-gradient-to-r from-[#2B1B17] via-[#3C251F] to-[#2B1B17] text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 my-8 sm:my-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="lg:col-span-8 space-y-2.5 text-right">
                <div className="inline-flex items-center gap-1.5 bg-[#B83528] px-3 py-1 rounded-full text-xs font-black">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  خدمة العزومات ولمات العيلة الكبيرة
                </div>
                <h3 className="text-2xl sm:text-4xl font-black">
                  عندك عزومة ومحتاج صواني ومحاشي تشرفك؟
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl font-medium">
                  سيبي وقفة المطبخ وتعب اللف علينا! بنحضرلك سرافيس محاشي مشكلة، صواني جلاش باللحمة المفرومة، وطواجن مكرونة بشاميل ونجرسكو حجم كبير، جاهزة للتقديم المباشر على السفرة وتشرفك قدام كل حبايبك.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-center">
                <button
                  onClick={() => {
                    setActiveCategory('mahshi');
                    const menuEl = document.getElementById('menu-section');
                    menuEl?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-[#B83528] hover:bg-[#A12E22] text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg text-center transition-transform active:scale-95"
                >
                  اطلب أكلات العزومة
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    'مساء الخير، حابب أنسق معاكم لحجز أكل عزومة خاصة من مطبخ ملفوف بالحب'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs sm:text-sm border border-white/20 text-center flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>تنسيق عزومة على واتساب</span>
                </a>
              </div>
            </div>
          </section>

          {/* Authentic Reviews Section */}
          <section className="py-8 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
            <div className="text-center space-y-1.5">
              <span className="text-xs font-black text-[#B83528] bg-[#FDF0EE] px-3 py-1 rounded-full">
                كلام زبائننا اللي داقوا الأكل
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#261B16]">
                إيه رأي الناس في طعم "ملفوف بالحب"؟
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EADBCC] shadow-xs space-y-2.5">
                <div className="flex items-center gap-1 text-amber-400">
                  {'★★★★★'.split('').map((s, i) => (
                    <span key={i} className="text-base">{s}</span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#4E4038] leading-relaxed font-medium">
                  "والله العظيم ورق العنب بالرمان وكرنب زمان طعمهم يجنن! خلطة مظبوطة وسمنة بلدي فلاحي واضحة، وموصلين الأكل سخن بيطلع دخان وريحته قالية الشقة."
                </p>
                <div className="pt-2 border-t border-[#F0E6D8] flex items-center justify-between text-xs">
                  <strong className="text-[#2A1D17] font-black">أم يوسف — التجمع الخامس</strong>
                  <span className="text-[#86756C]">طلبت ورق عنب رمان وكرنب</span>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EADBCC] shadow-xs space-y-2.5">
                <div className="flex items-center gap-1 text-amber-400">
                  {'★★★★★'.split('').map((s, i) => (
                    <span key={i} className="text-base">{s}</span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#4E4038] leading-relaxed font-medium">
                  "صينية الجلاش وطاجن البشاميل الكبير كانوا نجوم العزومة امبارح.. مورقين واللحمة بلدي صافي، شرفتوني قدام حماتي وأهلي وبإذن الله زبون دايم."
                </p>
                <div className="pt-2 border-t border-[#F0E6D8] flex items-center justify-between text-xs">
                  <strong className="text-[#2A1D17] font-black">م. كريم عادل — مصر الجديدة</strong>
                  <span className="text-[#86756C]">طلب صينية جلاش وطاجن بشاميل كبير</span>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EADBCC] shadow-xs space-y-2.5">
                <div className="flex items-center gap-1 text-amber-400">
                  {'★★★★★'.split('').map((s, i) => (
                    <span key={i} className="text-base">{s}</span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#4E4038] leading-relaxed font-medium">
                  "أحسن نجرسكو وورق عنب سبايسي كلتهم في القاهرة.. الجبنة سايحة وبتمط والمحشي مشطشط بطريقة تفتح النفس بجد. تسلم إيديكم!"
                </p>
                <div className="pt-2 border-t border-[#F0E6D8] flex items-center justify-between text-xs">
                  <strong className="text-[#2A1D17] font-black">سارة عبد الله — المعادي</strong>
                  <span className="text-[#86756C]">طلبت طاجن نجرسكو وورق عنب سبايسي</span>
                </div>
              </div>

            </div>
          </section>

        </main>
      )}

      {/* Footer */}
      <footer className="bg-[#231713] text-[#DFD3C8] pt-10 pb-8 border-t border-[#3D2C25] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Col 1: Brand */}
            <div className="space-y-2.5 text-right">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥬</span>
                <span className="text-xl font-black text-white">ملفوف بالحب</span>
              </div>
              <p className="text-xs text-[#AB9B90] leading-relaxed">
                متجر إلكتروني مصري للأكل البيتي الأصيل. بنعملك أحلى محاشي وطواجن وصواني جلاش بسمنة بلدي ونوصلها سخنة مولعة لحد عندك.
              </p>
              <div className="pt-1 text-xs text-[#8F7E73]">
                مواعيد المطبخ: 11:30 صباحاً - 11:30 مساءً يومياً
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-2 text-right text-xs font-bold">
              <h4 className="font-black text-white text-sm mb-2">أقسام سريعة</h4>
              <div>
                <button
                  onClick={() => {
                    setCurrentView('store');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  المنيو وقائمة الأكلات
                </button>
              </div>
              <div>
                <button onClick={() => setIsStoryOpen(true)} className="hover:text-white transition-colors">
                  حكايتنا وسر الطعم
                </button>
              </div>
              <div>
                <button onClick={() => setIsDeliveryZonesOpen(true)} className="hover:text-white transition-colors">
                  مناطق الدليفري والتوصيل
                </button>
              </div>
              <div>
                <button onClick={() => setIsMarketingHubOpen(true)} className="hover:text-white transition-colors text-amber-400">
                  الخطة التسويقية للمتجر
                </button>
              </div>
              <div>
                <button onClick={() => setIsTrackerOpen(true)} className="hover:text-white transition-colors">
                  تتبع أوردرك
                </button>
              </div>
            </div>

            {/* Col 3: Payment & delivery */}
            <div className="space-y-2 text-right text-xs">
              <h4 className="font-black text-white text-sm mb-2">طرق الدفع والتوصيل</h4>
              <p className="text-[#AB9B90] leading-relaxed">
                دفع كاش عند الاستلام، إنستاباي InstaPay، فودافون كاش والمحافظ الذكية، والبطاقات البنكية.
              </p>
              <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                <span className="bg-white/10 px-2 py-1 rounded text-[11px] font-bold text-emerald-400">كاش عند الاستلام</span>
                <span className="bg-white/10 px-2 py-1 rounded text-[11px] font-bold text-purple-300">InstaPay</span>
                <span className="bg-white/10 px-2 py-1 rounded text-[11px] font-bold text-red-400">Vodafone Cash</span>
                <span className="bg-white/10 px-2 py-1 rounded text-[11px] font-mono">VISA / Mada</span>
              </div>
            </div>

            {/* Col 4: Contact & Kitchen Admin Link */}
            <div className="space-y-3 text-right text-xs">
              <h4 className="font-black text-white text-sm">تواصل مع المطبخ</h4>
              <p className="text-[#AB9B90]">
                لطلبات العزومات الكبرى والاستفسارات السريعة:
              </p>
              <a
                href="https://wa.me/?text=%D9%85%D8%B3%D8%A7%D8%A1%20%D8%A7%D9%84%D8%AE%D9%8A%D8%B1%D8%8C%20%D8%B9%D8%A7%D9%8A%D8%B2%20%D8%A3%D8%B7%D9%84%D8%A8%20%D9%85%D9%86%20%D9%85%D8%B7%D8%A8%D8%AE%20%D9%85%D9%84%D9%81%D9%88%D9%81%20%D8%A8%D8%A7%D9%84%D8%AD%D8%A8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2.5 rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>واتساب المطبخ المباشر</span>
              </a>

              <div className="pt-1">
                <button
                  onClick={() => setCurrentView('kitchen')}
                  className="text-stone-400 hover:text-white underline text-[11px]"
                >
                  الدخول للوحة إدارة المطبخ والمخزون
                </button>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-[#382821] text-center text-xs text-[#8F7E73] flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              جميع الحقوق محفوظة © {new Date().getFullYear()} — متجر <strong>ملفوف بالحب</strong> للأكل البيتي المصري
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <span>معمول بكل حب وسمنة بلدي من قلوب أمهاتنا</span>
              <Heart className="w-3.5 h-3.5 text-[#B83528] fill-[#B83528]" />
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        availableCoupons={availableCoupons}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        appliedCoupon={appliedCoupon}
        deliveryZones={deliveryZones}
        onOrderComplete={handleOrderComplete}
      />

      <ProductModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
      />

      <DeliveryZonesModal
        isOpen={isDeliveryZonesOpen}
        onClose={() => setIsDeliveryZonesOpen(false)}
        zones={deliveryZones}
      />

      <MarketingHubModal
        isOpen={isMarketingHubOpen}
        onClose={() => setIsMarketingHubOpen(false)}
        onApplyCoupon={(code) => {
          handleApplyCoupon(code);
          setIsMarketingHubOpen(false);
          setIsCartOpen(true);
        }}
      />

      <KitchenStoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        onExploreMenu={() => {
          setIsStoryOpen(false);
          const menuEl = document.getElementById('menu-section');
          menuEl?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Security PIN Gate Modal (منع دخول أي شخص آخر للوحة الإدارة والبيانات الحساسة) */}
      <AdminSecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        onSuccess={() => {
          setIsSessionUnlocked(true);
          setIsSecurityModalOpen(false);
          setCurrentView('kitchen');
        }}
        savedPin={adminPin}
      />

      {/* Storefront Full Lockdown Gate (وضع الخصوصية وقفل المتجر بالكامل) */}
      <StoreLockGate
        isLocked={isStoreLocked && !isStoreTemporarilyUnlocked && currentView === 'store' && !isSessionUnlocked}
        storePin={adminPin}
        onUnlockTemporarily={() => setIsStoreTemporarilyUnlocked(true)}
        onOpenOwnerLogin={() => setIsSecurityModalOpen(true)}
      />

      {/* Mobile Floating Quick-Cart Action Bar */}
      <MobileFloatingCart
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        isVisible={currentView === 'store' && !isCartOpen && !isCheckoutOpen}
      />

      {/* Mobile Bottom Navigation Bar (شريط ملاحة سفلي مريح للإبهام) */}
      <MobileBottomNav
        currentView={currentView}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenDeliveryZones={() => setIsDeliveryZonesOpen(true)}
        onOpenStory={() => setIsStoryOpen(true)}
        onToggleView={handleToggleView}
        isSessionUnlocked={isSessionUnlocked}
        activeOrdersCount={orders.filter((o) => o.status !== 'delivered').length}
      />

    </div>
  );
}
