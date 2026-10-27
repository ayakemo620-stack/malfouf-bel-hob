import React, { useState } from 'react';
import { Product, Order, OrderStatus } from '../types';
import { ChefHat, Package, CheckCircle2, Clock, Bike, AlertCircle, Plus, Search, DollarSign, Layers, ShieldCheck, Lock, Unlock, KeyRound, Eye, EyeOff, ShieldAlert, Check } from 'lucide-react';

interface KitchenAdminProps {
  orders: Order[];
  products: Product[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onAddNewProduct: (product: Product) => void;
  onCloseAdmin: () => void;
  savedPin: string;
  onUpdatePin: (newPin: string) => void;
  onLockSession: () => void;
  isStoreLocked: boolean;
  onToggleStoreLock: (locked: boolean) => void;
}

export const KitchenAdmin: React.FC<KitchenAdminProps> = ({
  orders,
  products,
  onUpdateOrderStatus,
  onUpdateStock,
  onAddNewProduct,
  onCloseAdmin,
  savedPin,
  onUpdatePin,
  onLockSession,
  isStoreLocked,
  onToggleStoreLock,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'add_dish' | 'security'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [inventorySearch, setInventorySearch] = useState('');
  const [maskCustomerData, setMaskCustomerData] = useState(false);

  // Security Tab state
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [pinChangeError, setPinChangeError] = useState('');

  // Form state for adding new dish
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState<'mahshi' | 'goulash' | 'pasta' | 'boxes'>('mahshi');
  const [newDishPrice, setNewDishPrice] = useState('150');
  const [newDishStock, setNewDishStock] = useState('20');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishPrepTime, setNewDishPrepTime] = useState('35 دقيقة');
  const [newDishImage, setNewDishImage] = useState('https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80');

  // Stats calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrders = orders.filter((o) => o.status !== 'delivered');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const lowStockCount = products.filter((p) => p.stockCount <= 5).length;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  const filteredProducts = products.filter((p) =>
    p.name.includes(inventorySearch) || p.category.includes(inventorySearch)
  );

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    const newProd: Product = {
      id: `custom-dish-${Date.now()}`,
      name: newDishName.trim(),
      category: newDishCategory,
      description: newDishDesc.trim() || 'أكل بيتي مصري أصيل معمول بالسمنة البلدي.',
      longDescription: newDishDesc.trim() || 'وجبة طازة معموله مخصوص على إيد ستات بيوت شاطرين.',
      price: parseFloat(newDishPrice) || 100,
      image: newDishImage,
      prepTime: newDishPrepTime,
      calories: 450,
      servings: 'يكفي 2-3 أفراد',
      ingredients: ['مكونات بلدي طازة', 'سمنة بلدي', 'توابل المطبخ'],
      dietaryTags: ['طازة النهاردة', 'سمنة بلدي 100%'],
      spiceLevel: 'mild',
      rating: 5.0,
      reviewsCount: 1,
      stockCount: parseInt(newDishStock) || 15,
      isFeatured: false,
    };

    onAddNewProduct(newProd);
    setActiveTab('inventory');
    setNewDishName('');
    setNewDishDesc('');
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-6 px-3 sm:px-6 lg:px-8 text-right">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top bar header */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E9DDCF] shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#2D5A27] text-white flex items-center justify-center shadow-md shadow-[#2D5A27]/25 shrink-0">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black text-[#261B16]">
                  لوحة تحكم مطبخ ملفوف بالحب
                </h1>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  متصل ومباشر 🟢
                </span>
              </div>
              <p className="text-xs text-[#7B6A61] mt-0.5">
                إدارة الأوردرات اليومية والتحكم في الكميات المتبقية لكل صنف
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLockSession}
              className="px-3 sm:px-4 py-2 bg-amber-50 hover:bg-amber-100 text-[#B83528] border border-amber-300 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="قفل فوري لمنع دخول أي شخص آخر للمطبخ"
            >
              <Lock className="w-4 h-4 text-[#B83528]" />
              <span>قفل الجلسة (منع الدخول)</span>
            </button>
            <button
              onClick={onCloseAdmin}
              className="px-4 sm:px-5 py-2.5 bg-[#B83528] hover:bg-[#A12E22] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-[#B83528]/20 cursor-pointer"
            >
              الرجوع لمتجر الزبائن
            </button>
          </div>
        </div>

        {/* Real-time KPI Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EADFCF] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#7A6960] mb-1.5 font-bold">
              <span>إجمالي المبيعات</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#261B16] font-mono">
              {totalRevenue} <span className="text-xs font-sans font-bold">ج.م</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium block mt-1">
              من {orders.length} أوردر منفذ
            </span>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EADFCF] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#7A6960] mb-1.5 font-bold">
              <span>أوردرات على النار</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-700 font-mono">
              {activeOrders.length}
            </div>
            <span className="text-[11px] text-amber-800 font-medium block mt-1">
              في المطبخ أو مع الطيار
            </span>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EADFCF] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#7A6960] mb-1.5 font-bold">
              <span>أوردرات اتسلمت</span>
              <CheckCircle2 className="w-4 h-4 text-[#2D5A27]" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#2D5A27] font-mono">
              {deliveredOrders.length}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium block mt-1">
              اتسلمت بالهنا والشفا
            </span>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EADFCF] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#7A6960] mb-1.5 font-bold">
              <span>تنبيهات الأصناف</span>
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-600 font-mono">
              {lowStockCount}
            </div>
            <span className="text-[11px] text-rose-700 font-medium block mt-1">
              أصناف قربت تخلص
            </span>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E3D4C4] pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#B83528] text-white shadow-xs'
                : 'bg-white text-[#5E4D44] hover:bg-[#F3EBE0]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>الأوردرات الحية ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-[#2D5A27] text-white shadow-xs'
                : 'bg-white text-[#5E4D44] hover:bg-[#F3EBE0]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>مخزون الأكلات ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add_dish')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'add_dish'
                ? 'bg-[#3C2D25] text-white shadow-xs'
                : 'bg-white text-[#5E4D44] hover:bg-[#F3EBE0]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>إضافة صنف جديد</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#B83528] text-white shadow-xs'
                : 'bg-white text-[#5E4D44] hover:bg-[#F3EBE0]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>🔐 أمان ومنع الدخول</span>
          </button>
        </div>

        {/* TAB 1: Orders Queue & Live Stage Advancements */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Filters */}
            <div className="bg-white p-3 rounded-2xl border border-[#EAE0D3] flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="font-bold text-[#6D5D54] shrink-0">تصفية:</span>
                {['all', 'received', 'in_kitchen', 'packaged', 'on_the_way', 'delivered'].map(
                  (filterKey) => (
                    <button
                      key={filterKey}
                      onClick={() => setOrderFilter(filterKey)}
                      className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                        orderFilter === filterKey
                          ? 'bg-[#B83528] text-white'
                          : 'bg-[#F7F2EB] text-[#55453C] hover:bg-[#EDE3D6]'
                      }`}
                    >
                      {filterKey === 'all'
                        ? 'الكل'
                        : filterKey === 'received'
                        ? 'تم الاستلام'
                        : filterKey === 'in_kitchen'
                        ? 'على النار'
                        : filterKey === 'packaged'
                        ? 'تغليف'
                        : filterKey === 'on_the_way'
                        ? 'مع الطيار'
                        : 'تم التسليم'}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Orders list */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#EADFCF] text-[#86756C] space-y-2">
                <div className="text-3xl">🍲</div>
                <h3 className="font-bold text-base text-[#2C1F19]">مفيش أوردرات في القسم ده حالياً</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EADFCF] shadow-xs space-y-3.5"
                  >
                    {/* Header info */}
                    <div className="flex items-start justify-between flex-wrap gap-2 border-b border-[#F0E6D8] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black font-mono text-base text-[#261B16]">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs bg-[#FAF3EA] text-[#635248] px-2 py-0.5 rounded-md font-bold">
                            {order.createdAt}
                          </span>
                          <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md">
                            {order.deliveryType === 'instant'
                              ? '⚡ فوري'
                              : order.deliveryType === 'pickup'
                              ? 'استلام'
                              : 'مجدول'}
                          </span>
                        </div>
                        <div className="text-xs text-[#5D4D44] mt-1">
                          العميل: <strong className="text-[#261B16]">{order.customerName}</strong> | موبايل:{' '}
                          <span className="font-mono font-bold">{order.phone}</span> | العنوان:{' '}
                          <span>{order.address} ({order.district})</span>
                        </div>
                      </div>

                      <div className="text-left">
                        <span className="text-xs text-[#7B6A61] block font-medium">المبلغ الإجمالي</span>
                        <span className="text-xl font-black text-[#B83528] font-mono">
                          {order.total} ج.م
                        </span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#ECE0D2] flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-[#B83528] bg-white px-2 py-0.5 rounded border border-[#DECFC0]">
                              {item.quantity}×
                            </span>
                            <div>
                              <div className="font-black text-[#2C1F19]">{item.product.name}</div>
                              {item.selectedSizeName && (
                                <div className="text-[10px] text-[#86756C]">
                                  {item.selectedSizeName}
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="font-mono font-bold text-[#2C1F19]">
                            {item.calculatedPrice * item.quantity} ج.م
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Status Changer Actions */}
                    <div className="pt-2 flex items-center justify-between flex-wrap gap-2 bg-[#FDFBF7] p-2.5 sm:p-3 rounded-2xl border border-[#EDE2D4]">
                      <div className="text-xs font-bold text-[#6D5D54]">
                        تحديث مرحلة الأوردر في المطبخ:
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(
                          [
                            { id: 'received', label: 'تم الاستلام 📝' },
                            { id: 'in_kitchen', label: 'على النار 🔥' },
                            { id: 'packaged', label: 'تغليف حراري 📦' },
                            { id: 'on_the_way', label: 'مع الطيار 🛵' },
                            { id: 'delivered', label: 'تم التسليم 🍽️' },
                          ] as const
                        ).map((st) => (
                          <button
                            key={st.id}
                            onClick={() => onUpdateOrderStatus(order.id, st.id)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                              order.status === st.id
                                ? 'bg-[#2D5A27] text-white shadow-xs ring-2 ring-[#2D5A27]/20'
                                : 'bg-white text-[#4F3F36] border border-[#DCCEC0] hover:bg-[#F2EAE0]'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: Inventory Management */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            
            {/* Search bar */}
            <div className="bg-white p-3 rounded-2xl border border-[#EAE0D3] flex items-center gap-2">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                placeholder="ابحث عن صنف (ورق عنب، كرنب، جلاش، بشاميل، نجرسكو...)"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-[#2C1F19]"
              />
            </div>

            {/* Dishes Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredProducts.map((prod) => {
                const isOutOfStock = prod.stockCount <= 0;
                const isLow = prod.stockCount > 0 && prod.stockCount <= 5;

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-3xl p-3.5 border border-[#EADFCF] shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div className="flex gap-2.5">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-[#F4EFE6]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#86756C]">
                            {prod.category === 'mahshi' ? 'محاشي' : prod.category === 'goulash' ? 'جلاش' : 'مكرونة'}
                          </span>
                          <span className="font-mono font-black text-sm text-[#B83528]">
                            {prod.price} ج.م
                          </span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-[#261B16] leading-snug line-clamp-1 mt-0.5">
                          {prod.name}
                        </h4>
                        <div className="mt-1 text-[11px]">
                          {isOutOfStock ? (
                            <span className="text-red-600 font-bold">🔴 خلص من المطبخ</span>
                          ) : isLow ? (
                            <span className="text-amber-700 font-bold">🟡 باقي {prod.stockCount} بس</span>
                          ) : (
                            <span className="text-emerald-700 font-semibold">
                              🟢 متوفر ({prod.stockCount} طبق/طاجن)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stock Control Counter */}
                    <div className="pt-2 border-t border-[#F0E6D8] flex items-center justify-between bg-[#FDFBF7] p-2 rounded-xl border">
                      <span className="text-xs font-bold text-[#64534A]">تعديل الحصص المتاحة:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onUpdateStock(prod.id, Math.max(0, prod.stockCount - 1))}
                          className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center text-xs"
                        >
                          -1
                        </button>
                        <span className="w-8 text-center font-mono font-bold text-sm text-[#261B16]">
                          {prod.stockCount}
                        </span>
                        <button
                          onClick={() => onUpdateStock(prod.id, prod.stockCount + 5)}
                          className="w-7 h-7 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xs"
                          title="إضافة 5 حصص"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 3: Add New Dish */}
        {activeTab === 'add_dish' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-5 sm:p-7 border border-[#E9DDCF] shadow-xs space-y-4">
            <div>
              <h3 className="text-lg font-black text-[#261B16]">إضافة أكلة أو صينية جديدة</h3>
              <p className="text-xs text-[#7B6A61] mt-0.5">
                اكتب بيانات الأكلة وهتظهر فوراً في المنيو للزبائن
              </p>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#4B3B32] block mb-1">
                  اسم الطبق *
                </label>
                <input
                  type="text"
                  placeholder="مثال: طاجن عكاوي بالبصل الأورمة البلدي"
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-[#D8C7B5] focus:outline-none focus:ring-2 focus:ring-[#2D5A27]/25"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#4B3B32] block mb-1">
                    القسم *
                  </label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as any)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white"
                  >
                    <option value="mahshi">محاشي وورق عنب</option>
                    <option value="goulash">جلاش وصواني</option>
                    <option value="pasta">طواجن مكرونة وبشاميل</option>
                    <option value="boxes">بوكسات العزومات</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#4B3B32] block mb-1">
                    السعر (بالجنيه المصري) *
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-[#D8C7B5]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#4B3B32] block mb-1">
                    الحصص المتاحة في المطبخ النهاردة
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newDishStock}
                    onChange={(e) => setNewDishStock(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-[#D8C7B5]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#4B3B32] block mb-1">
                    مدة التحضير
                  </label>
                  <input
                    type="text"
                    value={newDishPrepTime}
                    onChange={(e) => setNewDishPrepTime(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-[#D8C7B5]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#4B3B32] block mb-1">
                  وصف الأكلة
                </label>
                <textarea
                  rows={2}
                  placeholder="وصف مشهي يوضح طعم الأكلة ومكوناتها..."
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-[#D8C7B5]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#2D5A27] hover:bg-[#23461e] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة الصنف للمنيو دلوقتي</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: Security & Access Control (عدم دخول أي شخص آخر) */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            
            {/* Security Status Banner */}
            <div className="bg-gradient-to-r from-[#B83528] to-[#99251A] text-white rounded-3xl p-5 sm:p-6 shadow-lg shadow-[#B83528]/20 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                  <ShieldCheck className="w-8 h-8 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black">نظام حماية المتجر: عدم دخول أي شخص آخر</h3>
                    <span className="text-xs bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-bold">
                      نشط ومؤمن 🔒
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
                    كل بيانات المطبخ، أسماء الزبائن، أرقام تليفوناتهم، وحجم المبيعات مشفرة ومحمية برمز سري لا يمكن لأي شخص آخر فتحها إلا بموافقتك.
                  </p>
                </div>
              </div>

              {/* Immediate Lock Action */}
              <button
                onClick={onLockSession}
                className="w-full md:w-auto px-6 py-3 bg-white text-[#B83528] hover:bg-amber-50 font-black text-xs sm:text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>قفل الجلسة فوراً والخروج</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box 1: Change / Update Security PIN */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E9DDCF] shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 border-b border-[#F0E6D8] pb-3">
                  <KeyRound className="w-5 h-5 text-[#B83528]" />
                  <h4 className="font-black text-base text-[#261B16]">
                    تغيير الرمز السري للوحة الإدارة (PIN)
                  </h4>
                </div>

                <div className="text-xs text-[#7A6960] space-y-1">
                  <p>الرمز السري الحالي: <span className="font-mono font-bold text-[#B83528] bg-[#FAF3EA] px-2 py-0.5 rounded border border-[#EADFCF]">{savedPin}</span></p>
                  <p>يمكنك تعيين رمز مكون من 4 إلى 6 أرقام يمنع أي شخص آخر من دخول لوحة التحكم.</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newPinInput || newPinInput.length < 4) {
                      setPinChangeError('يجب أن يتكون الرمز من 4 إلى 6 أرقام على الأقل');
                      setPinChangeSuccess(false);
                      return;
                    }
                    if (newPinInput !== confirmPinInput) {
                      setPinChangeError('الرمزان غير متطابقين، تأكد من إعادة كتابة نفس الرقم');
                      setPinChangeSuccess(false);
                      return;
                    }
                    onUpdatePin(newPinInput);
                    setPinChangeError('');
                    setPinChangeSuccess(true);
                    setNewPinInput('');
                    setConfirmPinInput('');
                    setTimeout(() => setPinChangeSuccess(false), 4000);
                  }}
                  className="space-y-3 pt-1"
                >
                  <div>
                    <label className="text-xs font-bold text-[#4B3B32] block mb-1">
                      الرمز السري الجديد (أرقام فقط)
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="مثال: 2025"
                      className="w-full text-sm font-mono tracking-widest font-black px-3.5 py-2.5 rounded-xl border border-[#D8C7B5] bg-[#FAF7F2] text-[#261B16] focus:outline-none focus:ring-2 focus:ring-[#B83528]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#4B3B32] block mb-1">
                      تأكيد الرمز السري الجديد
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={confirmPinInput}
                      onChange={(e) => setConfirmPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="أعد إدخال نفس الرمز..."
                      className="w-full text-sm font-mono tracking-widest font-black px-3.5 py-2.5 rounded-xl border border-[#D8C7B5] bg-[#FAF7F2] text-[#261B16] focus:outline-none focus:ring-2 focus:ring-[#B83528]"
                    />
                  </div>

                  {pinChangeError && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{pinChangeError}</span>
                    </div>
                  )}

                  {pinChangeSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>تم تحديث الرمز السري بنجاح! تم حفظه في ذاكرة النظام.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#B83528] hover:bg-[#9E2A1F] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>حفظ وتفعيل الرمز السري الجديد</span>
                  </button>
                </form>
              </div>

              {/* Box 2: Storefront Lockdown & Customer Privacy */}
              <div className="space-y-4">
                
                {/* Storefront Lock Toggle */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E9DDCF] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="w-5 h-5 text-amber-600" />
                      <div>
                        <h4 className="font-black text-sm sm:text-base text-[#261B16]">
                          وضع قفل المتجر بالكامل (حظر دخول الزوار)
                        </h4>
                        <p className="text-xs text-[#7A6960]">
                          إغلاق المتجر أمام أي شخص غير مصرح له بطلب أو تصفح
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#8A796F] leading-relaxed bg-[#FAF7F2] p-3 rounded-2xl border border-[#EADFCF]">
                    عند تشغيل هذا الوضع، أي شخص يفتح رابط الموقع لن يرى أي أكلات وسيرى شاشة قفل تفيد بأن المطبخ مخصص للطلبات الخاصة فقط مع إمكانية الدخول بالرمز السري.
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-[#3B2C24]">
                      الحالة الحالية: {isStoreLocked ? '🔴 المتجر مقفول على الجميع' : '🟢 المتجر مفتوح ومتاح للزبائن'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleStoreLock(!isStoreLocked)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                        isStoreLocked
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-[#B83528] hover:bg-[#9E2A1F] text-white'
                      }`}
                    >
                      {isStoreLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      <span>{isStoreLocked ? 'فتح المتجر للزبائن' : 'قفل المتجر ومنع الدخول'}</span>
                    </button>
                  </div>
                </div>

                {/* Privacy & Masking Toggle */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E9DDCF] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <EyeOff className="w-5 h-5 text-[#2D5A27]" />
                      <div>
                        <h4 className="font-black text-sm sm:text-base text-[#261B16]">
                          إخفاء وتشفير بيانات الزبائن على الشاشة
                        </h4>
                        <p className="text-xs text-[#7A6960]">
                          إخفاء أرقام التليفونات والعناوين في قائمة الطلبات
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={maskCustomerData}
                        onChange={(e) => setMaskCustomerData(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D5A27]"></div>
                    </label>
                  </div>
                  <p className="text-xs text-[#8A796F]">
                    ميزة مفيدة جداً إذا كان هناك عمال أو مساعدين بجوارك في المطبخ لمنعهم من رؤية أو نسخ أرقام وعناوين الزبائن.
                  </p>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
