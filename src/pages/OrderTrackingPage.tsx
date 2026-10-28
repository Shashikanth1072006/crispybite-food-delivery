import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Check, 
  Clock, 
  MapPin, 
  Phone, 
  ChefHat, 
  Bike, 
  PackageCheck, 
  ArrowLeft, 
  Play,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { OrderStatus } from '../types';

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, advanceOrderStage, updateOrderStatus } = useOrders();

  const order = orderId ? getOrderById(orderId) : undefined;
  const [callRiderToast, setCallRiderToast] = useState(false);

  const stages: { key: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: 'placed',
      label: 'Order Placed',
      desc: 'Order received and confirmed by kitchen',
      icon: <Clock className="w-5 h-5" />,
    },
    {
      key: 'preparing',
      label: 'Restaurant Preparing',
      desc: 'Chicken marinated & frying to golden perfection',
      icon: <ChefHat className="w-5 h-5" />,
    },
    {
      key: 'ready',
      label: 'Ready for Pickup',
      desc: 'Packed hot in sealed insulated thermal boxes',
      icon: <PackageCheck className="w-5 h-5" />,
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      desc: 'Rider is on the way to your doorstep',
      icon: <Bike className="w-5 h-5" />,
    },
    {
      key: 'delivered',
      label: 'Delivered',
      desc: 'Enjoy your hot & crunchy CrispyBite meal!',
      icon: <Check className="w-5 h-5" />,
    },
  ];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display font-black text-2xl text-neutral-900 mb-2">
          Tracking Details Unavailable
        </h2>
        <p className="text-xs text-stone-500 mb-6">
          Order ID not found or may have expired.
        </p>
        <Link
          to="/orders"
          className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl text-xs"
        >
          Go to Order History
        </Link>
      </div>
    );
  }

  const currentStageIndex = stages.findIndex((s) => s.key === order.status);
  const activeIndex = currentStageIndex === -1 ? 0 : currentStageIndex;

  const handleSimulateAdvance = () => {
    advanceOrderStage(order.id);
  };

  const handleResetToPlaced = () => {
    updateOrderStatus(order.id, 'placed');
  };

  const handleCallRider = () => {
    setCallRiderToast(true);
    setTimeout(() => setCallRiderToast(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900">
                Live Order Tracker
              </h1>
              <span className="bg-red-100 text-red-700 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                Demo
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Tracking Order: <strong className="text-neutral-900 font-mono">{order.orderNumber}</strong>
            </p>
          </div>
        </div>

        {/* Demo Simulation Advance Button */}
        <div className="flex items-center gap-2">
          {order.status !== 'delivered' ? (
            <button
              onClick={handleSimulateAdvance}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Fast forward to next tracking stage"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Next Stage</span>
            </button>
          ) : (
            <button
              onClick={handleResetToPlaced}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Demo Flow</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Delivery Status Card */}
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-red-950 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-neutral-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-red-400 bg-red-950/80 border border-red-800 px-3 py-1 rounded-full inline-block">
              {stages[activeIndex]?.label}
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
              {order.status === 'delivered'
                ? 'Your Feast Has Arrived!'
                : `Estimated Delivery: ${order.estimatedDeliveryTime}`}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              {stages[activeIndex]?.desc}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[180px] shrink-0">
            <div className="text-xs text-stone-400 font-medium">Order Total</div>
            <div className="font-display font-black text-2xl text-white mt-0.5 tabular-nums">
              ₹{order.pricing.total}
            </div>
            <div className="text-[10px] text-stone-400 mt-1 uppercase font-bold">
              {order.paymentMethod.toUpperCase()} · {order.items.length} items
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Stepper Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xs space-y-6">
        <h3 className="font-display font-black text-base text-neutral-900">
          Order Progress Timeline
        </h3>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
          {stages.map((stage, idx) => {
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div key={stage.key} className="relative flex items-start gap-4">
                {/* Stepper Dot */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-0 w-6.5 h-6.5 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? 'bg-red-600 border-red-600 text-white shadow-xs'
                      : 'bg-white border-stone-300 text-stone-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-stone-300" />
                  )}
                </div>

                {/* Step Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-display font-bold text-sm ${
                        isCurrent
                          ? 'text-red-600 font-black'
                          : isCompleted
                          ? 'text-neutral-900'
                          : 'text-stone-400'
                      }`}
                    >
                      {stage.label}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded">
                        Active Stage
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Partner Details & Map Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rider Card */}
        {order.deliveryPartner && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
            <h4 className="font-display font-bold text-sm text-neutral-900">
              Delivery Hero Assigned
            </h4>

            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg">
                  🛵
                </div>
                <div>
                  <h5 className="font-bold text-sm text-neutral-900">
                    {order.deliveryPartner.name}
                  </h5>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="text-emerald-700 font-bold">
                      {order.deliveryPartner.rating} ★
                    </span>
                    <span>·</span>
                    <span>CrispyBite Express Rider</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCallRider}
                className="w-10 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                title="Simulate Call to Rider"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>

            {callRiderToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Simulated call connected to {order.deliveryPartner.name} ({order.deliveryPartner.phone})</span>
              </div>
            )}

            <div className="text-xs text-stone-500 leading-relaxed">
              Equipped with temperature-sealed thermal delivery bag to keep your crispy chicken steaming hot.
            </div>
          </div>
        )}

        {/* Address & Instructions */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
          <h4 className="font-display font-bold text-sm text-neutral-900">
            Delivering To
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-neutral-900 text-sm block">
                  {order.customer.addressType} Delivery
                </span>
                <p className="text-stone-600 leading-relaxed mt-0.5">
                  {order.customer.street}
                  {order.customer.landmark && ` (Near ${order.customer.landmark})`},<br />
                  {order.customer.city} - {order.customer.pincode}
                </p>
              </div>
            </div>

            {order.customer.instructions && (
              <div className="pt-2 border-t border-stone-100">
                <span className="text-stone-400 font-bold block text-[10px] uppercase">
                  Rider Instructions:
                </span>
                <p className="text-stone-700 italic">
                  "{order.customer.instructions}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
