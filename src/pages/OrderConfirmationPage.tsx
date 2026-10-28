import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ShoppingBag, 
  Receipt,
  Phone,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useOrders } from '../context/OrderContext';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();
  const navigate = useNavigate();

  const order = orderId ? getOrderById(orderId) : undefined;

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e4002b', '#ffffff', '#f59e0b', '#111111'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display font-black text-2xl text-neutral-900 mb-2">
          Order Not Found
        </h2>
        <p className="text-xs text-stone-500 mb-6">
          We could not locate the details for this order.
        </p>
        <Link
          to="/orders"
          className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl text-xs"
        >
          View Order History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      
      {/* Top Banner Success Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-sm text-center space-y-4 relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full inline-block mb-2">
            Order Confirmed & Sizzling
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900">
            Thank You For Ordering!
          </h1>
          <p className="text-sm text-stone-600 max-w-md mx-auto mt-2">
            Your chicken has been sent to our kitchen. Our chefs are seasoning and frying your order to golden crunchiness.
          </p>
        </div>

        {/* Order ID & Estimated Time Strip */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-600">
          <div className="bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Demo Order ID</span>
            <span className="font-mono font-black text-sm text-neutral-900">{order.orderNumber}</span>
          </div>

          <div className="bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Estimated Delivery</span>
            <span className="font-bold text-sm text-red-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{order.estimatedDeliveryTime}</span>
            </span>
          </div>

          <div className="bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Payment Status</span>
            <span className="font-bold text-sm text-neutral-900 uppercase">
              {order.paymentMethod.toUpperCase()} · {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={`/track/${order.id}`}
            className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-display font-black text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-102 active:scale-98"
          >
            <Flame className="w-4 h-4" />
            <span>Track Live Order Progress</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/orders"
            className="px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm rounded-xl transition-colors"
          >
            View Order History
          </Link>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ordered Items List */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100 font-display font-black text-sm text-neutral-900">
            <ShoppingBag className="w-4 h-4 text-red-600" />
            <span>Ordered Items ({order.items.length})</span>
          </div>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.cartItemId} className="flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-100">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">
                      {item.quantity}x {item.product.name}
                    </span>
                    {item.spiceLevel && (
                      <span className="text-[11px] text-red-600 block">
                        {item.spiceLevel}
                      </span>
                    )}
                    {item.selectedAddons.length > 0 && (
                      <span className="text-[10px] text-stone-500 block truncate max-w-[170px]">
                        +{item.selectedAddons.map((a) => a.name).join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                <span className="font-bold text-neutral-900 tabular-nums">
                  ₹{item.totalPrice}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Recap */}
          <div className="pt-4 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="tabular-nums">₹{order.pricing.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="tabular-nums">{order.pricing.deliveryFee === 0 ? 'FREE' : `₹${order.pricing.deliveryFee}`}</span>
            </div>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount ({order.pricing.couponCode || 'Promo'})</span>
                <span className="tabular-nums">-₹{order.pricing.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Taxes & GST (5%)</span>
              <span className="tabular-nums">₹{order.pricing.tax}</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between font-display font-black text-sm text-neutral-900">
              <span>Total Paid</span>
              <span className="text-base text-red-600 tabular-nums">₹{order.pricing.total}</span>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100 font-display font-black text-sm text-neutral-900">
            <MapPin className="w-4 h-4 text-red-600" />
            <span>Delivery Destination</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Recipient</span>
              <span className="font-bold text-neutral-900 text-sm block">{order.customer.name}</span>
              <span className="text-stone-600">{order.customer.phone}</span>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Address</span>
              <p className="text-stone-700 leading-relaxed font-medium">
                {order.customer.street}
                {order.customer.landmark && ` (Landmark: ${order.customer.landmark})`}
                <br />
                {order.customer.city} - {order.customer.pincode}
              </p>
            </div>

            {order.customer.instructions && (
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Instructions</span>
                <p className="text-stone-600 italic">"{order.customer.instructions}"</p>
              </div>
            )}

            {/* Delivery Partner Assigned */}
            {order.deliveryPartner && (
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Assigned Rider</span>
                  <span className="font-bold text-neutral-900 text-xs block">{order.deliveryPartner.name}</span>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    {order.deliveryPartner.rating} ★ Rated Partner
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
