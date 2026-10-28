import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  LogOut, 
  Plus, 
  Trash2, 
  Check, 
  Edit3,
  ShieldCheck,
  Home,
  Briefcase,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, addAddress, deleteAddress, setDefaultAddress, logout, isAdmin } = useAuth();
  const { orders } = useOrders();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '');
  const [emailInput, setEmailInput] = useState(user?.email || '');

  // Add address state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrLabel, setAddrLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrCity, setAddrCity] = useState('Bengaluru');
  const [addrPincode, setAddrPincode] = useState('560038');

  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="font-display font-black text-2xl text-neutral-900 mb-2">
          Please Sign In
        </h2>
        <p className="text-xs text-stone-500 mb-6">
          Sign in or create an account to view and manage your profile and addresses.
        </p>
        <Link
          to="/login"
          className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl text-xs"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput,
      phone: phoneInput,
      email: emailInput,
    });
    setIsEditing(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet || !addrCity || !addrPincode) return;

    addAddress({
      label: addrLabel,
      street: addrStreet,
      landmark: addrLandmark,
      city: addrCity,
      pincode: addrPincode,
      isDefault: false,
    });

    setShowAddressModal(false);
    setAddrStreet('');
    setAddrLandmark('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Page Header */}
      <div className="pb-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900">
            Account Dashboard
          </h1>
          <p className="text-xs text-stone-500">
            Manage your personal profile, addresses, and dining preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-600 border border-stone-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-5 text-center">
            <div className="w-20 h-20 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-display font-black text-3xl mx-auto shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="font-display font-bold text-lg text-neutral-900">
                {user.name}
              </h2>
              <span className="text-xs text-stone-500 block">{user.email}</span>
              {isAdmin && (
                <span className="inline-block mt-1 text-[10px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  Admin Account
                </span>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 text-left space-y-2.5 text-xs text-stone-600">
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{orders.length} Past Orders Placed</span>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Edit Form or Saved Addresses */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Edit Profile Form */}
          {isEditing && (
            <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
              <h3 className="font-display font-bold text-base text-neutral-900">
                Edit Personal Info
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Saved Addresses Section */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <h3 className="font-display font-bold text-base text-neutral-900">
                  Saved Delivery Addresses ({user.addresses.length})
                </h3>
              </div>

              <button
                onClick={() => setShowAddressModal(true)}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-900">
                        {addr.label === 'Home' ? (
                          <Home className="w-3.5 h-3.5 text-red-600" />
                        ) : addr.label === 'Work' ? (
                          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <Compass className="w-3.5 h-3.5 text-stone-600" />
                        )}
                        <span>{addr.label}</span>
                      </div>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed pt-1">
                      {addr.street}
                      {addr.landmark && ` · Near ${addr.landmark}`}
                      <br />
                      {addr.city} - {addr.pincode}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                    {!addr.isDefault ? (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-stone-500 hover:text-neutral-900 font-semibold cursor-pointer"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-emerald-700 text-[11px] font-semibold">Primary Address</span>
                    )}

                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                      title="Delete address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Address Modal Dialog */}
          {showAddressModal && (
            <div className="p-5 rounded-2xl border border-red-200 bg-red-50/30 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-sm text-neutral-900">
                  New Delivery Location
                </h4>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-xs text-stone-500 hover:text-neutral-900"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setAddrLabel(l)}
                      className={`px-3 py-1.5 rounded-xl font-bold border transition-colors cursor-pointer ${
                        addrLabel === l
                          ? 'border-red-600 bg-red-600 text-white'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    placeholder="House / Flat / Street"
                    className="w-full p-2 bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      value={addrPincode}
                      onChange={(e) => setAddrPincode(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Address
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
