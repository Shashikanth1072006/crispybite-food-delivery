import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  CheckCircle2, 
  AlertCircle,
  Percent,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const {
    items,
    itemCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    totals,
    availableCoupons,
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code) return;
    const res = applyCoupon(code);
    setCouponFeedback({
      message: res.message,
      isError: !res.success,
    });
    if (res.success) {
      setCouponInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-12 border border-stone-200/90 shadow-xs space-y-5">
          <div className="w-24 h-24 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-neutral-900">
              Your Cart is Empty
            </h1>
            <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
              You haven't added any crispy bites yet. Explore our mouthwatering chicken buckets, spicy wings, and zinger burgers.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-display font-bold text-sm rounded-xl transition-all shadow-md active:scale-95"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <Link
            to="/menu"
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900">
              Your Food Cart
            </h1>
            <p className="text-xs text-stone-500">
              Review items, customize, apply discount coupons and proceed to checkout.
            </p>
          </div>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-stone-500 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-20 h-20 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-100">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        item.product.isVeg ? 'bg-emerald-600' : 'bg-red-700'
                      }`}
                    />
                    <h3 className="font-display font-bold text-base text-neutral-900">
                      {item.product.name}
                    </h3>
                  </div>

                  {item.spiceLevel && (
                    <p className="text-xs text-red-700 font-semibold">
                      Flavor: {item.spiceLevel}
                    </p>
                  )}

                  {item.selectedAddons.length > 0 && (
                    <p className="text-xs text-stone-500">
                      Add-ons: {item.selectedAddons.map((a) => `${a.name} (+₹${a.price})`).join(', ')}
                    </p>
                  )}

                  {item.specialInstructions && (
                    <p className="text-xs text-stone-400 italic">
                      Note: "{item.specialInstructions}"
                    </p>
                  )}

                  <div className="text-xs font-semibold text-stone-500 pt-0.5">
                    ₹{item.unitPrice} per portion
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Price */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-bold text-xs text-neutral-900 tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-display font-black text-lg text-neutral-900 tabular-nums block">
                    ₹{item.totalPrice}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-xs text-stone-400 hover:text-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add more delicious items from menu</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Coupon Box */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
              <Tag className="w-4 h-4 text-red-600" />
              <span>Apply Promo Coupon</span>
            </div>

            {activeCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{activeCoupon.code}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Saved ₹{totals.discount} on this order!
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600 font-mono uppercase"
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {couponFeedback && (
                  <div
                    className={`text-xs flex items-center gap-1.5 ${
                      couponFeedback.isError ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {couponFeedback.isError ? (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span>{couponFeedback.message}</span>
                  </div>
                )}

                {/* Quick available codes */}
                <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1.5">
                  {availableCoupons.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleApplyCoupon(c.code)}
                      className="text-[10px] bg-stone-50 hover:bg-red-50 border border-stone-200 hover:border-red-300 px-2.5 py-1 rounded-lg text-stone-700 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Percent className="w-3 h-3 text-red-600" />
                      <span>{c.code} ({c.discountPercent}% OFF)</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3 text-xs">
            <h3 className="font-display font-bold text-sm text-neutral-900">
              Bill Summary
            </h3>

            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal ({itemCount} items)</span>
                <span className="font-bold text-neutral-900 tabular-nums">₹{totals.subtotal}</span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Standard Delivery Fee</span>
                <span className="tabular-nums">
                  {totals.deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₹${totals.deliveryFee}`
                  )}
                </span>
              </div>

              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Savings</span>
                  <span className="tabular-nums">-₹{totals.discount}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Restaurant GST & Handling (5%)</span>
                <span className="tabular-nums">₹{totals.tax}</span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between font-display font-black text-base text-neutral-900">
                <span>Grand Total</span>
                <span className="text-xl text-red-600 tabular-nums">₹{totals.total}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-4 py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-display font-black text-sm rounded-xl flex items-center justify-between shadow-lg shadow-red-600/20 transition-all active:scale-98 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <div className="flex items-center gap-1.5">
                <span className="tabular-nums">₹{totals.total}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Contactless Delivery Guaranteed</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
