import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Phone, Mail, Clock, Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-stone-300 pt-16 pb-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Guarantee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-neutral-800">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Fresh & Hot Promise</h4>
              <p className="text-xs text-stone-400">Fried on order using secret 11 herbs & spices recipe.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">30-Minute Delivery</h4>
              <p className="text-xs text-stone-400">Express delivery to your doorstep in insulated thermal bags.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">100% Quality Assurance</h4>
              <p className="text-xs text-stone-400">Strict hygiene protocols & tamper-proof sealed packaging.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12">
          
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white">
                <Flame className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                CRISPY<span className="text-red-500">BITE</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 max-w-sm">
              Your ultimate destination for finger-lickin' good crispy fried chicken, juicy zinger burgers, and loaded family feast buckets. Made fresh daily.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span>Customer Hotline: +91 1800-274-7799</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-500" />
                <span>support@crispybite.com</span>
              </div>
            </div>
          </div>

          {/* Quick Menu */}
          <div>
            <h5 className="font-display font-bold text-white text-sm mb-4 tracking-wide uppercase">
              Our Menu
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link to="/menu?category=chicken" className="hover:text-red-400 transition-colors">Crispy Chicken</Link></li>
              <li><Link to="/menu?category=burgers" className="hover:text-red-400 transition-colors">Zinger Burgers</Link></li>
              <li><Link to="/menu?category=buckets" className="hover:text-red-400 transition-colors">Family Buckets</Link></li>
              <li><Link to="/menu?category=sides" className="hover:text-red-400 transition-colors">Golden Fries & Dips</Link></li>
              <li><Link to="/menu?category=beverages" className="hover:text-red-400 transition-colors">Beverages & Shakes</Link></li>
            </ul>
          </div>

          {/* Order & Account */}
          <div>
            <h5 className="font-display font-bold text-white text-sm mb-4 tracking-wide uppercase">
              Help & Support
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link to="/orders" className="hover:text-red-400 transition-colors">Track Active Order</Link></li>
              <li><Link to="/deals" className="hover:text-red-400 transition-colors">Coupons & Deals</Link></li>
              <li><Link to="/profile" className="hover:text-red-400 transition-colors">Saved Addresses</Link></li>
              <li><Link to="/orders" className="hover:text-red-400 transition-colors">Order History</Link></li>
              <li><Link to="/admin" className="hover:text-red-400 transition-colors">Demo Admin Portal</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="font-display font-bold text-white text-sm mb-4 tracking-wide uppercase">
              Company
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><span className="hover:text-white cursor-pointer">About CrispyBite</span></li>
              <li><span className="hover:text-white cursor-pointer">Allergen & Nutrition</span></li>
              <li><span className="hover:text-white cursor-pointer">Franchise Inquiry</span></li>
              <li><span className="hover:text-white cursor-pointer">Privacy & Cookie Policy</span></li>
              <li><span className="hover:text-white cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 text-xs text-stone-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} CrispyBite Foods Private Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-stone-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for fried chicken lovers. Demo platform.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
