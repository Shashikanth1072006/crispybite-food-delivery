import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  CheckCircle2, 
  AlertCircle,
  Percent
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    itemCount,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    totals,
    availableCoupons,
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

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

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base text-neutral-900 leading-none">
                Your Delicious Cart
              </h2>
              <span className="text-xs text-stone-500 font-medium">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-neutral-900 transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body (Items list) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-neutral-900">Your cart is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mt-1">
                  Good food is always calling! Browse our signature fried chicken and zinger burgers.
                </p>
              </div>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/menu');
                }}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <>
              {/* Item Rows */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 rounded-2xl border border-stone-200 bg-white shadow-2xs flex gap-3 relative group"
                  >
                    {/* Item Image */}
                    <div className="w-18 h-18 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-100">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            item.product.isVeg ? 'bg-emerald-600' : 'bg-red-700'
                          }`}
                        />
                        <h4 className="font-display font-bold text-xs text-neutral-900 truncate">
                          {item.product.name}
                        </h4>
                      </div>

                      {/* Customizations tags */}
                      <div className="mt-1 space-y-0.5 text-[11px] text-stone-500">
                        {item.spiceLevel && (
                          <div className="text-red-700 font-medium">
                            Flavor: {item.spiceLevel}
                          </div>
                        )}
                        {item.selectedAddons.length > 0 && (
                          <div className="text-stone-600 truncate">
                            +{item.selectedAddons.map((a) => a.name).join(', ')}
                          </div>
                        )}
                      </div>

                      {/* Quantity & Unit Price */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-6 h-6 rounded hover:bg-white flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-neutral-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-6 h-6 rounded hover:bg-white flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-display font-black text-sm text-neutral-900 tabular-nums">
                          ₹{item.totalPrice}
                        </span>
                      </div>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="absolute top-3 right-3 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                  <Tag className="w-3.5 h-3.5 text-red-600" />
                  <span>Offers & Coupons</span>
                </div>

                {activeCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-emerald-900">{activeCoupon.code}</span>
                        <p className="text-[10px] text-emerald-700">Applied! You saved ₹{totals.discount}</p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-red-600 font-mono uppercase"
                    />
                    <button
                      onClick={() => handleApplyCoupon()}
                      className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Feedback message */}
                {couponFeedback && (
                  <div
                    className={`text-[11px] flex items-center gap-1.5 ${
                      couponFeedback.isError ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {couponFeedback.isError ? (
                      <AlertCircle className="w-3 h-3 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                    )}
                    <span>{couponFeedback.message}</span>
                  </div>
                )}

                {/* Available Quick Coupon Chips */}
                {!activeCoupon && availableCoupons.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {availableCoupons.slice(0, 2).map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleApplyCoupon(c.code)}
                        className="text-[10px] bg-white border border-stone-200 hover:border-red-400 px-2 py-1 rounded-md text-stone-700 hover:text-red-600 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Percent className="w-2.5 h-2.5 text-red-600" />
                        <span>Use {c.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bill Details */}
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-2 text-xs">
                <h5 className="font-bold text-neutral-900 text-xs">Bill Details</h5>

                <div className="flex justify-between text-stone-600">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">₹{totals.subtotal}</span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Delivery Fee</span>
                  <span className="tabular-nums">
                    {totals.deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${totals.deliveryFee}`
                    )}
                  </span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span className="tabular-nums">-₹{totals.discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>Restaurant GST & Taxes (5%)</span>
                  <span className="tabular-nums">₹{totals.tax}</span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between font-display font-black text-sm text-neutral-900">
                  <span>To Pay</span>
                  <span className="text-base text-red-600 tabular-nums">₹{totals.total}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer CTA */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 space-y-2">
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-6 bg-red-600 hover:bg-red-700 text-white font-display font-bold text-sm rounded-xl flex items-center justify-between shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <div className="flex items-center gap-1.5">
                <span className="tabular-nums">₹{totals.total}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={closeCart}
              className="w-full py-2 text-stone-500 hover:text-neutral-900 text-xs font-semibold text-center transition-colors cursor-pointer"
            >
              Continue Adding Bites
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
