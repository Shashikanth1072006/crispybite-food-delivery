import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  User as UserIcon, 
  Menu as MenuIcon, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  Clock, 
  LogOut,
  Flame,
  Percent
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenLocationModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLocationModal }) => {
  const { itemCount, openCart } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200/80 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-neutral-900 text-stone-200 text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
            <span>Hot & Fresh Guarantee · Delivered in under 30 minutes</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-stone-400">
            <span>Use code <strong className="text-white">CRISPY50</strong> for 20% OFF</span>
            <span>·</span>
            <Link to="/deals" className="text-red-400 hover:text-red-300 font-semibold">View All Deals</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-18">
          
          {/* Zone 1: Brand & Location */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-2xl tracking-tight text-neutral-900 leading-none">
                  CRISPY<span className="text-red-600">BITE</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">
                  Fried Chicken & Co.
                </span>
              </div>
            </Link>

            {/* Delivery Location Selector */}
            <button
              onClick={onOpenLocationModal}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-stone-100 hover:bg-stone-200/80 rounded-lg text-xs transition-colors border border-stone-200"
              title="Change Delivery Location"
            >
              <MapPin className="w-4 h-4 text-red-600 shrink-0" />
              <div className="text-left">
                <span className="text-[10px] text-stone-500 block leading-tight font-medium">Delivery to</span>
                <span className="font-semibold text-stone-800 max-w-[140px] truncate block leading-tight">
                  Indiranagar, BLR
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0 ml-0.5" />
            </button>
          </div>

          {/* Search Bar (Center / Desktop) */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex items-center flex-1 max-w-md mx-4 relative"
          >
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search chicken buckets, zinger burgers, wings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-stone-100 border border-stone-200 rounded-full focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white transition-all text-neutral-900 placeholder:text-stone-400"
            />
          </form>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold text-stone-700">
            <Link
              to="/menu"
              className={`hover:text-red-600 transition-colors whitespace-nowrap ${
                isActive('/menu') ? 'text-red-600 font-bold' : ''
              }`}
            >
              Menu
            </Link>
            <Link
              to="/deals"
              className={`flex items-center gap-1 hover:text-red-600 transition-colors whitespace-nowrap ${
                isActive('/deals') ? 'text-red-600 font-bold' : ''
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-red-600" />
              <span>Deals & Combos</span>
            </Link>
            <Link
              to="/orders"
              className={`hover:text-red-600 transition-colors whitespace-nowrap ${
                isActive('/orders') ? 'text-red-600 font-bold' : ''
              }`}
            >
              Order History
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md text-xs font-bold border border-red-200 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>
            )}
          </nav>

          {/* Zone 3: Actions (Cart & Auth) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
              <span className="hidden sm:inline font-bold">Cart</span>
              <span className="bg-white text-red-600 text-xs font-black rounded-full w-5 h-5 flex items-center justify-center tabular-nums">
                {itemCount}
              </span>
            </button>

            {/* Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors text-stone-800 text-sm font-semibold cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                    {user?.name.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 text-sm">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="font-semibold text-neutral-900 truncate">{user?.name}</p>
                      <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-red-600 uppercase tracking-wider">
                          Administrator
                        </span>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-stone-700 hover:bg-stone-50 hover:text-red-600 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>My Profile & Addresses</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-stone-700 hover:bg-stone-50 hover:text-red-600 transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Order History</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-red-600 bg-red-50/50 hover:bg-red-50 font-medium transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-stone-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 border border-stone-300 hover:border-neutral-900 rounded-xl text-sm font-semibold text-stone-800 transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search & Location (below main row on smaller screens) */}
        <div className="md:hidden pb-3 pt-1 flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search chicken, burgers, combos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-100 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-600"
            />
          </form>
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            <span className="max-w-[70px] truncate">BLR</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-semibold">
            <Link
              to="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-lg ${isActive('/menu') ? 'bg-red-50 text-red-600' : 'text-stone-700'}`}
            >
              Explore Full Menu
            </Link>
            <Link
              to="/deals"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-lg flex items-center gap-2 ${isActive('/deals') ? 'bg-red-50 text-red-600' : 'text-stone-700'}`}
            >
              <Percent className="w-4 h-4 text-red-600" />
              <span>Deals & Special Offers</span>
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-lg ${isActive('/orders') ? 'bg-red-50 text-red-600' : 'text-stone-700'}`}
            >
              Order History & Tracking
            </Link>
            {isAuthenticated && (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-lg ${isActive('/profile') ? 'bg-red-50 text-red-600' : 'text-stone-700'}`}
              >
                My Profile & Addresses
              </Link>
            )}
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-red-600 bg-red-50 font-bold flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Management Dashboard</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
