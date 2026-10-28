import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Percent, 
  Copy, 
  Check, 
  Flame, 
  ShoppingBag, 
  Sparkles, 
  Clock, 
  Tag, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface DealsPageProps {
  onOpenProductModal: (product: Product) => void;
}

export const DealsPage: React.FC<DealsPageProps> = ({ onOpenProductModal }) => {
  const { coupons, products } = useMenu();
  const { applyCoupon, openCart } = useCart();
  const navigate = useNavigate();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const comboDeals = products.filter(
    (p) => p.category === 'buckets' || (p.originalPrice && p.originalPrice > p.price)
  );

  const handleCopyAndApply = (code: string) => {
    navigator.clipboard?.writeText(code);
    applyCoupon(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      {/* Deals Hero */}
      <div className="bg-gradient-to-r from-red-650 via-red-600 to-amber-600 rounded-3xl p-6 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white">
            <Percent className="w-3.5 h-3.5" />
            <span>Crispy Savings & Combo Deals</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Exclusive Deals & Feast Combos
          </h1>
          <p className="text-sm sm:text-base text-red-50 max-w-lg leading-relaxed">
            Get more crunch for your rupee! Enjoy hand-picked combo buckets, spicy burger feasts, and instant discount promo codes.
          </p>
        </div>
      </div>

      {/* 1. Active Coupons Strip */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-red-600" />
          <h2 className="font-display font-black text-xl text-neutral-900">
            Available Discount Coupons
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs space-y-3 flex flex-col justify-between hover:border-red-400 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-lg text-red-600 tracking-wider">
                    {coupon.code}
                  </span>
                  <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                    {coupon.discountPercent}% OFF
                  </span>
                </div>
                <h3 className="font-bold text-neutral-900 text-sm mt-2">
                  {coupon.description}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Valid on orders above ₹{coupon.minOrder} · Max discount ₹{coupon.maxDiscount}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400 font-medium">
                  {coupon.expiresOn}
                </span>

                <button
                  onClick={() => handleCopyAndApply(coupon.code)}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Applied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Apply Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Value Combos & Sharing Buckets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-600" />
            <h2 className="font-display font-black text-xl text-neutral-900">
              Value Meal Combos & Feast Buckets
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-semibold">
            Up to 30% savings vs individual items
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {comboDeals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenProductModal}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-stone-900 text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="font-display font-black text-2xl text-white">
            Hosting a Party or Game Night?
          </h3>
          <p className="text-xs sm:text-sm text-stone-400">
            Pre-order customized jumbo chicken buckets with personalized spice mixes for your guests.
          </p>
        </div>

        <button
          onClick={() => navigate('/menu?category=buckets')}
          className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-display font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer whitespace-nowrap"
        >
          <span>Order Jumbo Buckets</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
