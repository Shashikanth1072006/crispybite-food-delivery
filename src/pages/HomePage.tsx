import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Flame, 
  ArrowRight, 
  Percent, 
  Star, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  Copy,
  ChevronRight,
  UtensilsCrossed,
  Award
} from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface HomePageProps {
  onOpenProductModal: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenProductModal }) => {
  const { products, coupons } = useMenu();
  const { applyCoupon, openCart } = useCart();
  const navigate = useNavigate();

  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const buckets = products.filter((p) => p.category === 'buckets').slice(0, 3);

  const categories = [
    { id: 'chicken', name: 'Chicken', icon: '🍗', desc: 'Original & Spicy' },
    { id: 'burgers', name: 'Burgers', icon: '🍔', desc: 'Zingers & Towers' },
    { id: 'buckets', name: 'Buckets', icon: '🪣', desc: 'Feast & Sharing' },
    { id: 'sides', name: 'Sides', icon: '🍟', desc: 'Fries & Dips' },
    { id: 'beverages', name: 'Beverages', icon: '🥤', desc: 'Chilled Colas' },
    { id: 'desserts', name: 'Desserts', icon: '🍰', desc: 'Lava Cakes' },
  ];

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    applyCoupon(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. HERO PROMOTIONAL BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-r from-neutral-950 via-neutral-900 to-red-950 text-white border-b border-red-950/40">
        {/* Background Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-red-300">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span>Secret 11 Herbs & Spices · Hand Breaded Fresh Daily</span>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] text-balance">
                It's Finger-Lickin' <span className="text-red-500 underline decoration-red-600/60 decoration-wavy underline-offset-8">Good!</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-300 max-w-xl leading-relaxed">
                Your favourite crispy bites, delivered hot. Golden pressure-fried drumsticks, signature zinger burgers, and legendary family feast buckets right to your door.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/menu')}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-display font-black text-base rounded-2xl shadow-xl shadow-red-600/30 flex items-center gap-2.5 transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                  <span>Order Now</span>
                </button>

                <Link
                  to="/menu"
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-display font-bold text-base rounded-2xl border border-white/20 backdrop-blur-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-display font-extrabold text-xl text-white">30 Min</div>
                  <div className="text-stone-400">Hot Doorstep Delivery</div>
                </div>
                <div>
                  <div className="font-display font-extrabold text-xl text-white">100% Real</div>
                  <div className="text-stone-400">Fresh Whole Chicken</div>
                </div>
                <div>
                  <div className="font-display font-extrabold text-xl text-white">4.9 ★</div>
                  <div className="text-stone-400">Over 50K+ Happy Diners</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Floating Discount Tag */}
                <div className="absolute -top-4 -left-4 z-20 bg-neutral-900 border border-white/10 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">
                    %
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-semibold uppercase">Today's Special</span>
                    <span className="text-xs font-bold text-white">20% OFF on Orders ₹499+</span>
                  </div>
                </div>

                {/* Hero Chicken Image */}
                <div className="relative aspect-16/10 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 group">
                  <img
                    src="/src/assets/images/hero_crispy_chicken_1791867060918.jpg"
                    alt="CrispyBite Golden Fried Chicken"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="font-bold">Original Recipe Bucket</span>
                    <span className="font-black text-red-400 tabular-nums">Starting at ₹249</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORIES BROWSER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
              Craving Something Crisp?
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-neutral-900">
              Browse Menu Categories
            </h2>
          </div>
          <Link
            to="/menu"
            className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/menu?category=${cat.id}`}
              className="p-4 rounded-2xl bg-white border border-stone-200/90 hover:border-red-400 hover:shadow-md transition-all text-center flex flex-col items-center justify-center group"
            >
              <div className="text-3xl mb-2 group-hover:scale-115 transition-transform">
                {cat.icon}
              </div>
              <h3 className="font-display font-bold text-sm text-neutral-900 group-hover:text-red-600 transition-colors">
                {cat.name}
              </h3>
              <span className="text-[11px] text-stone-500 mt-0.5">
                {cat.desc}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Customer Favourites</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-neutral-900">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/menu"
            className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenProductModal}
            />
          ))}
        </div>
      </section>

      {/* 4. TODAY'S EXCLUSIVE DEALS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden border border-neutral-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 mb-8 pb-6 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-1.5 text-red-400 text-xs font-black uppercase tracking-wider mb-1">
                <Percent className="w-4 h-4" />
                <span>Unbeatable Value</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                Today's Hot Deals & Coupons
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Save big on your next crispy feast with these exclusive promo codes.
              </p>
            </div>
            <button
              onClick={() => navigate('/menu?category=buckets')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm self-start md:self-auto cursor-pointer"
            >
              Order Feast Deals
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col justify-between hover:border-red-500/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-base text-red-400 tracking-wider">
                      {coupon.code}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {coupon.expiresOn}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm mt-2">
                    {coupon.description}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Min order value: ₹{coupon.minOrder}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 font-medium">Click to apply</span>
                  <button
                    onClick={() => handleCopyCoupon(coupon.code)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCoupon === coupon.code ? (
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
      </section>

      {/* 5. POPULAR COMBOS & SHARING BUCKETS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
              Feast With Friends & Family
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-neutral-900">
              Popular Combos & Buckets
            </h2>
          </div>
          <Link
            to="/menu?category=buckets"
            className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <span>View All Buckets</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {buckets.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenProductModal}
            />
          ))}
        </div>
      </section>

      {/* 6. WHY CRISPYBITE? (FOOD ETHOS) */}
      <section className="bg-stone-100/70 border-y border-stone-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              The Secret Behind The Crunch
            </span>
            <h2 className="font-display font-black text-3xl text-neutral-900 mt-1">
              Why Diners Choose CrispyBite
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl">
                🍗
              </div>
              <h3 className="font-display font-bold text-base text-neutral-900">100% Real Whole Chicken</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Never minced or reconstituted. We only use high quality fresh chicken sourced from certified farms.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl">
                🌶️
              </div>
              <h3 className="font-display font-bold text-base text-neutral-900">11 Secret Spices</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Hand-rubbed and steeped in buttermilk marinade for 12 hours before pressure-frying for succulent depth.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl">
                🔥
              </div>
              <h3 className="font-display font-bold text-base text-neutral-900">Fried Fresh On Order</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                We never store fried food in heat lamps. Your bucket is tossed into sizzling pure vegetable oil when your order arrives.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl">
                🛵
              </div>
              <h3 className="font-display font-bold text-base text-neutral-900">Insulated Hot Bags</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Dispatched in thermal delivery pods so your chicken arrives with that loud signature crunch intact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-neutral-900">
            Loved By Over 50,000+ Foodies
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real feedback from verified chicken lovers across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-700 leading-relaxed italic">
              "The crunch on the Spicy Zinger Burger is unreal! Better than any fast food chain in town. Arrived boiling hot in 22 minutes."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-neutral-900 text-xs">Priya Sundaram</h4>
                <span className="text-[11px] text-stone-400">Indiranagar, Bengaluru</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Verified Order</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-700 leading-relaxed italic">
              "Ordered the 8-Piece Family Bucket for game night. The garlic dip and spicy wings were gone in 10 minutes. 10/10 recommend!"
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-neutral-900 text-xs">Karthik Reddy</h4>
                <span className="text-[11px] text-stone-400">Koramangala, Bengaluru</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Verified Order</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-700 leading-relaxed italic">
              "The peri peri chicken popcorn and loaded cheese fries are my go-to late night comfort meal. Consistently crunchy and juicy."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-neutral-900 text-xs">Ananya Verma</h4>
                <span className="text-[11px] text-stone-400">HSR Layout, Bengaluru</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Verified Order</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. APP PROMOTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-red-200 bg-red-800/60 px-3 py-1 rounded-full inline-block">
                CrispyBite On The Go
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
                Download The CrispyBite App
              </h2>
              <p className="text-sm text-red-100 max-w-xl leading-relaxed">
                Get exclusive app-only discounts, live real-time GPS tracking, and instant 1-tap reordering. Available on iOS & Android.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="bg-black text-white px-5 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-neutral-900 transition-colors">
                  <span className="text-2xl">🍏</span>
                  <div>
                    <div className="text-[10px] uppercase text-stone-400">Download on the</div>
                    <div className="font-bold text-xs leading-none">App Store</div>
                  </div>
                </div>
                <div className="bg-black text-white px-5 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-neutral-900 transition-colors">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <div className="text-[10px] uppercase text-stone-400">Get it on</div>
                    <div className="font-bold text-xs leading-none">Google Play</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center space-y-2">
                <UtensilsCrossed className="w-12 h-12 text-white mx-auto" />
                <h4 className="font-display font-black text-xl text-white">Ready for Dinner?</h4>
                <p className="text-xs text-red-100">Browse 20+ signature chicken recipes.</p>
                <button
                  onClick={() => navigate('/menu')}
                  className="w-full mt-2 py-2.5 bg-white text-red-600 font-bold rounded-xl text-xs hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Order Online Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
