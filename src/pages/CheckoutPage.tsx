import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  CreditCard, 
  Banknote, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  ArrowLeft, 
  Check, 
  Info,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { CustomerDetails, PaymentMethod } from '../types';

export const CheckoutPage: React.FC = () => {
  const { items, totals, activeCoupon } = useCart();
  const { user, selectedDeliveryAddress } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  // Form State
  const [customerName, setCustomerName] = useState(user?.name || 'Alex Johnson');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98765 43210');
  const [streetAddress, setStreetAddress] = useState(selectedDeliveryAddress?.street || 'Flat 402, Sunshine Heights, 12th Main Road, Indiranagar');
  const [landmark, setLandmark] = useState(selectedDeliveryAddress?.landmark || 'Opposite Metro Station');
  const [city, setCity] = useState(selectedDeliveryAddress?.city || 'Bengaluru');
  const [pincode, setPincode] = useState(selectedDeliveryAddress?.pincode || '560038');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>(selectedDeliveryAddress?.label || 'Home');
  const [instructions, setInstructions] = useState('Please leave outside apartment door and ring bell once.');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('alex@oksbi');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('789');

  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display font-black text-2xl text-neutral-900 mb-2">
          Nothing to checkout!
        </h2>
        <p className="text-xs text-stone-500 mb-6">
          Your cart is currently empty. Please add some items before checking out.
        </p>
        <Link
          to="/menu"
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs"
        >
          Go to Menu
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!customerName.trim() || !customerPhone.trim()) {
      setValidationError('Please provide both your name and phone number.');
      return;
    }

    if (!streetAddress.trim() || !city.trim() || !pincode.trim()) {
      setValidationError('Please complete the delivery address and PIN code.');
      return;
    }

    if (paymentMethod === 'upi' && !upiId.trim()) {
      setValidationError('Please enter a valid UPI ID (e.g., username@bank).');
      return;
    }

    setIsSubmitting(true);

    try {
      const customerDetails: CustomerDetails = {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        street: streetAddress.trim(),
        landmark: landmark.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        addressType,
        instructions: instructions.trim(),
      };

      const finalPricing = {
        ...totals,
        couponCode: activeCoupon?.code,
      };

      const order = await placeOrder({
        customer: customerDetails,
        paymentMethod,
        pricing: finalPricing,
      });

      // Redirect to confirmation page
      navigate(`/confirmation/${order.id}`);
    } catch (err) {
      setValidationError('An error occurred while placing order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
        <Link
          to="/cart"
          className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900">
            Complete Your Order
          </h1>
          <p className="text-xs text-stone-500">
            Safe, contactless delivery right to your doorstep.
          </p>
        </div>
      </div>

      {/* Demo Notification Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <div>
          <strong className="font-bold">Demo Mode Active:</strong> Payment options are simulated for testing. No real cards or bank transactions will be charged.
        </div>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Delivery Details & Payment */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Customer & Delivery Address */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h2 className="font-display font-black text-base text-neutral-900">
                  Delivery Address & Contact
                </h2>
              </div>

              {/* Saved Address Pill Switchers */}
              {user?.addresses && user.addresses.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    Fill From Saved Addresses:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {user.addresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => {
                          setStreetAddress(addr.street);
                          setLandmark(addr.landmark || '');
                          setCity(addr.city);
                          setPincode(addr.pincode);
                          setAddressType(addr.label);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition-colors ${
                          streetAddress === addr.street
                            ? 'bg-red-50 text-red-700 border-red-300'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-red-600" />
                        <span>{addr.label}: {addr.street.slice(0, 24)}...</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Phone Number (for delivery updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600 font-medium"
                  />
                </div>
              </div>

              {/* Address Fields */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Complete Address (Flat / House No., Apartment, Street) *
                </label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. Flat 402, Sunshine Heights, 12th Main Road, Indiranagar"
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Opp Metro Station"
                    className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600 font-medium"
                  />
                </div>
              </div>

              {/* Delivery Instructions */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Delivery Instructions for Rider
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Ring bell twice, leave with security guard, call upon arrival..."
                  rows={2}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600 font-medium"
                />
              </div>
            </div>

            {/* Step 2: Delivery Speed Option */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h2 className="font-display font-black text-base text-neutral-900">
                  Delivery Slot
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setDeliverySpeed('standard')}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                    deliverySpeed === 'standard'
                      ? 'border-red-600 bg-red-50/40 shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-red-100 text-red-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block text-sm">
                      Standard Hot Delivery
                    </span>
                    <p className="text-stone-500 mt-0.5">30 - 35 minutes</p>
                    <span className="text-[10px] font-bold text-emerald-600 block mt-1">
                      Included (Free above ₹599)
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setDeliverySpeed('express')}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                    deliverySpeed === 'express'
                      ? 'border-red-600 bg-red-50/40 shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block text-sm">
                      Express Hot Rush
                    </span>
                    <p className="text-stone-500 mt-0.5">20 - 25 minutes</p>
                    <span className="text-[10px] font-bold text-amber-700 block mt-1">
                      Priority Kitchen Queue
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h2 className="font-display font-black text-base text-neutral-900">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-red-600 bg-red-50/20 shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-neutral-900 block text-sm">
                          UPI (Google Pay / PhonePe / Paytm)
                        </span>
                        <span className="text-stone-500 text-[11px]">
                          Instant payment using UPI ID or Scan QR
                        </span>
                      </div>
                    </div>
                    {paymentMethod === 'upi' && (
                      <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-stone-200/80 space-y-2">
                      <label className="text-[11px] font-bold text-stone-700 block">
                        Enter UPI Virtual Address (VPA)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="w-full p-2 text-xs bg-white border border-stone-300 rounded-xl font-mono focus:outline-hidden focus:ring-1 focus:ring-red-600"
                      />
                      <span className="text-[10px] text-stone-400 block">
                        A demo payment approval notification will be simulated.
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Option */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-red-600 bg-red-50/20 shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-neutral-900 block text-sm">
                          Credit / Debit Card
                        </span>
                        <span className="text-stone-500 text-[11px]">
                          Visa, Mastercard, RuPay, Amex
                        </span>
                      </div>
                    </div>
                    {paymentMethod === 'card' && (
                      <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-3 pt-3 border-t border-stone-200/80 space-y-2">
                      <div>
                        <label className="text-[11px] font-bold text-stone-700 block mb-1">
                          Demo Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4532 0000 0000 0000"
                          className="w-full p-2 text-xs bg-white border border-stone-300 rounded-xl font-mono focus:outline-hidden focus:ring-1 focus:ring-red-600"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-stone-700 block mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full p-2 text-xs bg-white border border-stone-300 rounded-xl font-mono focus:outline-hidden focus:ring-1 focus:ring-red-600"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-stone-700 block mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="123"
                            maxLength={4}
                            className="w-full p-2 text-xs bg-white border border-stone-300 rounded-xl font-mono focus:outline-hidden focus:ring-1 focus:ring-red-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-red-600 bg-red-50/20 shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-neutral-900 block text-sm">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-stone-500 text-[11px]">
                          Pay cash or UPI directly to our delivery rider
                        </span>
                      </div>
                    </div>
                    {paymentMethod === 'cod' && (
                      <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Place Order CTA */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4 text-xs">
              <h3 className="font-display font-black text-base text-neutral-900 pb-3 border-b border-stone-100">
                Order Summary ({items.length} items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-bold text-neutral-900 block">
                        {item.quantity}x {item.product.name}
                      </span>
                      {item.spiceLevel && (
                        <span className="text-[10px] text-red-600 block">
                          {item.spiceLevel}
                        </span>
                      )}
                      {item.selectedAddons.length > 0 && (
                        <span className="text-[10px] text-stone-500 block truncate max-w-[180px]">
                          +{item.selectedAddons.map((a) => a.name).join(', ')}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-neutral-900 tabular-nums shrink-0">
                      ₹{item.totalPrice}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill breakdown */}
              <div className="space-y-2 pt-3 border-t border-stone-100">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
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
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon ({activeCoupon?.code})</span>
                    <span className="tabular-nums">-₹{totals.discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>GST & Restaurant Tax (5%)</span>
                  <span className="tabular-nums">₹{totals.tax}</span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between font-display font-black text-base text-neutral-900">
                  <span>Total Amount</span>
                  <span className="text-xl text-red-600 tabular-nums">₹{totals.total}</span>
                </div>
              </div>

              {/* Validation error display */}
              {validationError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 disabled:bg-stone-300 text-white font-display font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all active:scale-98 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <span>Place Order · ₹{totals.total}</span>
                )}
              </button>

              <div className="pt-2 text-[11px] text-stone-400 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Encrypted 256-Bit Checkout</span>
                </div>
                <p>By placing order you agree to CrispyBite terms & privacy policy.</p>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};
