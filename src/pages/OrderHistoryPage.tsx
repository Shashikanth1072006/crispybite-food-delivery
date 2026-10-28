import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  RotateCcw, 
  ArrowRight, 
  ShoppingBag, 
  CheckCircle2, 
  Truck,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { OrderStatus } from '../types';

export const OrderHistoryPage: React.FC = () => {
  const { orders, reorder } = useOrders();
  const navigate = useNavigate();

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
            <Truck className="w-3 h-3" />
            <span>Out For Delivery</span>
          </span>
        );
      case 'preparing':
      case 'ready':
      case 'placed':
        return (
          <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="capitalize">{status.replace('_', ' ')}</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Page Header */}
      <div className="pb-4 border-b border-stone-200">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900">
          Your Order History
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review past crispy feasts, track active deliveries, or reorder with 1 click.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center max-w-lg mx-auto space-y-4">
          <div className="w-20 h-20 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-neutral-900">
              No orders placed yet
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
              Looks like you haven't enjoyed our crunchy fried chicken yet!
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
          >
            <span>Browse Full Menu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="p-5 bg-stone-50/80 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-sm text-neutral-900">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <span className="text-xs text-stone-500 block">
                      Ordered on {formattedDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/track/${order.id}`}
                      className="px-4 py-2 bg-white border border-stone-300 hover:border-neutral-900 rounded-xl text-xs font-bold text-stone-800 transition-colors flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-red-600" />
                      <span>Track Order</span>
                    </Link>

                    <button
                      onClick={() => reorder(order.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder Items</span>
                    </button>
                  </div>
                </div>

                {/* Order Items Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="divide-y divide-stone-100">
                    {order.items.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs gap-4"
                      >
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
                            <span className="font-bold text-neutral-900 block text-xs">
                              {item.quantity}x {item.product.name}
                            </span>
                            {item.spiceLevel && (
                              <span className="text-[11px] text-red-700 font-medium block">
                                {item.spiceLevel}
                              </span>
                            )}
                            {item.selectedAddons.length > 0 && (
                              <span className="text-[10px] text-stone-500 block">
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

                  {/* Order Footer Breakdown */}
                  <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2 text-stone-500">
                      <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span className="truncate max-w-xs sm:max-w-md">
                        {order.customer.street}, {order.customer.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-stone-500 font-medium">
                        Payment: <strong className="text-neutral-900 uppercase">{order.paymentMethod}</strong>
                      </span>
                      <span className="text-sm font-display font-black text-neutral-900 tabular-nums">
                        Total Paid: <span className="text-red-600">₹{order.pricing.total}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
