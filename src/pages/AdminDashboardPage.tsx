import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShoppingBag, 
  IndianRupee, 
  Utensils, 
  Tag, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RotateCcw, 
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { useOrders } from '../context/OrderContext';
import { Coupon, OrderStatus, Product, ProductCategory } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    toggleAvailability, 
    updatePrice, 
    coupons, 
    addCoupon, 
    deleteCoupon, 
    resetToDefaults 
  } = useMenu();

  const { orders, updateOrderStatus } = useOrders();

  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'coupons'>('orders');

  // Product modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(199);
  const [prodCategory, setProdCategory] = useState<ProductCategory>('chicken');
  const [prodImage, setProdImage] = useState('/src/assets/images/hero_crispy_chicken_1791867060918.jpg');
  const [prodIsVeg, setProdIsVeg] = useState(false);

  // Coupon modal state
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(20);
  const [newCouponMax, setNewCouponMax] = useState<number>(150);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState<number>(499);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Orders Filter
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'all'>('all');

  // Stats calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.pricing.total : 0), 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdDesc('');
    setProdPrice(199);
    setProdCategory('chicken');
    setProdImage('/src/assets/images/hero_crispy_chicken_1791867060918.jpg');
    setProdIsVeg(false);
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdName(prod.name);
    setProdDesc(prod.description);
    setProdPrice(prod.price);
    setProdCategory(prod.category);
    setProdImage(prod.image);
    setProdIsVeg(prod.isVeg);
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) return;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: prodName,
        description: prodDesc,
        price: prodPrice,
        category: prodCategory,
        image: prodImage,
        isVeg: prodIsVeg,
      });
    } else {
      addProduct({
        name: prodName,
        description: prodDesc,
        price: prodPrice,
        category: prodCategory,
        image: prodImage,
        rating: 4.8,
        reviewsCount: 1,
        isVeg: prodIsVeg,
        available: true,
        addons: [],
      });
    }

    setShowProductModal(false);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: newCouponDiscount,
      maxDiscount: newCouponMax,
      minOrder: newCouponMinOrder,
      description: newCouponDesc || `Get ${newCouponDiscount}% OFF up to ₹${newCouponMax}`,
      expiresOn: 'Active Promo',
    });

    setShowCouponModal(false);
    setNewCouponCode('');
  };

  const filteredOrders = orders.filter(
    (o) => orderFilter === 'all' || o.status === orderFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900">
              CrispyBite Kitchen & Store Admin
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time management for incoming orders, dynamic menu pricing, stock availability, and marketing coupons.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset menu and coupons back to initial demo defaults?')) {
              resetToDefaults();
            }
          }}
          className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Top KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-red-600" />
          </div>
          <div className="font-display font-black text-2xl text-neutral-900 tabular-nums">
            {orders.length}
          </div>
          <div className="text-[11px] text-stone-400">
            {activeOrdersCount} actively in progress
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Demo Gross Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-display font-black text-2xl text-emerald-700 tabular-nums">
            ₹{totalRevenue}
          </div>
          <div className="text-[11px] text-stone-400">
            Calculated from all fulfilled orders
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Active Menu Items</span>
            <Utensils className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-display font-black text-2xl text-neutral-900 tabular-nums">
            {products.length}
          </div>
          <div className="text-[11px] text-stone-400">
            {products.filter((p) => p.available).length} in stock right now
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Active Promo Codes</span>
            <Tag className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-display font-black text-2xl text-neutral-900 tabular-nums">
            {coupons.length}
          </div>
          <div className="text-[11px] text-stone-400">
            Ready for instant customer discount
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-neutral-900 hover:bg-stone-100'
          }`}
        >
          Orders Management ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'menu'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-neutral-900 hover:bg-stone-100'
          }`}
        >
          Menu & Pricing ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'coupons'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-neutral-900 hover:bg-stone-100'
          }`}
        >
          Promotions & Coupons ({coupons.length})
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display font-bold text-base text-neutral-900">
              Incoming & Active Orders
            </h3>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-semibold">Filter:</span>
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value as any)}
                className="p-1.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-800"
              >
                <option value="all">All Orders</option>
                <option value="placed">Placed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready for Pickup</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Order ID & Time</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Items Summary</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-4 align-top font-mono">
                        <strong className="text-neutral-900 block font-bold">{order.orderNumber}</strong>
                        <span className="text-[11px] text-stone-400">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="p-4 align-top">
                        <strong className="text-neutral-900 block">{order.customer.name}</strong>
                        <span className="text-stone-500 block">{order.customer.phone}</span>
                        <span className="text-[11px] text-stone-400 block truncate max-w-xs">
                          {order.customer.street}, {order.customer.city}
                        </span>
                      </td>

                      <td className="p-4 align-top">
                        <div className="space-y-0.5">
                          {order.items.map((i) => (
                            <span key={i.cartItemId} className="block text-stone-700">
                              {i.quantity}x {i.product.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-4 align-top font-bold tabular-nums text-neutral-900">
                        ₹{order.pricing.total}
                        <span className="text-[10px] text-stone-400 block uppercase font-normal">
                          {order.paymentMethod}
                        </span>
                      </td>

                      <td className="p-4 align-top">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold capitalize inline-block bg-stone-100 text-stone-800 border border-stone-200">
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-4 align-top">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="p-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-neutral-900 focus:bg-white cursor-pointer"
                        >
                          <option value="placed">Order Placed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready for Pickup</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MENU & PRICING MANAGEMENT */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display font-bold text-base text-neutral-900">
              Food Menu Catalog ({products.length} items)
            </h3>

            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Menu Item</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Item</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (₹)</th>
                    <th className="p-4">Stock Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <strong className="text-neutral-900 block font-bold text-xs">{item.name}</strong>
                          <span className="text-[11px] text-stone-400 block line-clamp-1 max-w-xs">
                            {item.description}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 capitalize font-semibold text-stone-700">
                        {item.category}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <span className="text-stone-400">₹</span>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => updatePrice(item.id, Number(e.target.value))}
                            className="w-18 p-1 bg-stone-50 border border-stone-300 rounded-lg text-xs font-black tabular-nums text-neutral-900"
                          />
                        </div>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => toggleAvailability(item.id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                            item.available
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                          }`}
                        >
                          {item.available ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(item)}
                            className="p-1.5 text-stone-500 hover:text-neutral-900 rounded-lg hover:bg-stone-100 cursor-pointer"
                            title="Edit details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ${item.name} from menu?`)) {
                                deleteProduct(item.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100 cursor-pointer"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COUPONS MANAGEMENT */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-neutral-900">
              Promotional Coupons & Deals
            </h3>

            <button
              onClick={() => setShowCouponModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-base text-red-600 tracking-wider">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => deleteCoupon(coupon.code)}
                      className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-neutral-900 text-sm mt-1">
                    {coupon.description}
                  </h4>
                  <div className="text-xs text-stone-500 space-y-0.5 mt-2">
                    <p>Discount: <strong className="text-neutral-900">{coupon.discountPercent}%</strong></p>
                    <p>Max Savings: <strong className="text-neutral-900">₹{coupon.maxDiscount}</strong></p>
                    <p>Min Cart Value: <strong className="text-neutral-900">₹{coupon.minOrder}</strong></p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span>Status: Active</span>
                  <span className="text-emerald-700 font-semibold">{coupon.expiresOn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <h3 className="font-display font-black text-lg text-neutral-900">
              {editingProductId ? 'Edit Menu Product' : 'Add New Menu Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Smoky Peri Peri Chicken Wings"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Flavor notes, crisp coating, serving info..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  >
                    <option value="chicken">Chicken</option>
                    <option value="burgers">Burgers</option>
                    <option value="buckets">Buckets & Combos</option>
                    <option value="sides">Sides & Dips</option>
                    <option value="beverages">Beverages</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Dietary Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setProdIsVeg(false)}
                    className={`flex-1 py-2 rounded-xl font-bold border ${
                      !prodIsVeg ? 'border-red-600 bg-red-50 text-red-700' : 'border-stone-200'
                    }`}
                  >
                    Non-Veg (Chicken)
                  </button>
                  <button
                    type="button"
                    onClick={() => setProdIsVeg(true)}
                    className={`flex-1 py-2 rounded-xl font-bold border ${
                      prodIsVeg ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-stone-200'
                    }`}
                  >
                    Vegetarian
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <h3 className="font-display font-black text-lg text-neutral-900">
              Create Promotional Coupon
            </h3>

            <form onSubmit={handleSaveCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. MEGA50"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Description</label>
                <input
                  type="text"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  placeholder="e.g. Flat 20% off on all items"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCouponMax}
                    onChange={(e) => setNewCouponMax(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCouponMinOrder}
                    onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Create Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
