import React, { useState } from 'react';
import { X, MapPin, Check, Plus, Home, Briefcase, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Address } from '../types';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { user, selectedDeliveryAddress, setSelectedDeliveryAddress, addAddress } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru');
  const [newPincode, setNewPincode] = useState('560038');

  if (!isOpen) return null;

  const handleSelect = (addr: Address) => {
    setSelectedDeliveryAddress(addr);
    onClose();
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPincode) return;

    addAddress({
      label: newLabel,
      street: newStreet,
      landmark: newLandmark,
      city: newCity,
      pincode: newPincode,
      isDefault: false,
    });

    setShowAddForm(false);
    setNewStreet('');
    setNewLandmark('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-neutral-900 leading-none">
                Select Delivery Location
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">Where should we deliver your hot crispy bites?</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-neutral-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          {!showAddForm ? (
            <>
              {/* Saved Addresses List */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                  Saved Delivery Addresses
                </span>
                {user?.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((addr) => {
                    const isSelected = selectedDeliveryAddress.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => handleSelect(addr)}
                        className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'border-red-600 bg-red-50/40 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-red-600 text-white' : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {addr.label === 'Home' ? (
                              <Home className="w-4 h-4" />
                            ) : addr.label === 'Work' ? (
                              <Briefcase className="w-4 h-4" />
                            ) : (
                              <Compass className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-neutral-900 block">{addr.label}</span>
                            <p className="text-stone-600 mt-0.5 line-clamp-2 leading-relaxed">
                              {addr.street} {addr.landmark && `· Landmark: ${addr.landmark}`}
                            </p>
                            <span className="text-[11px] text-stone-500 font-medium mt-0.5 block">
                              {addr.city} - {addr.pincode}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 mt-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-stone-500 italic">No saved addresses yet.</p>
                )}
              </div>

              {/* Add New Address Trigger */}
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 px-4 border border-dashed border-stone-300 hover:border-red-500 rounded-2xl text-xs font-bold text-stone-700 hover:text-red-600 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </>
          ) : (
            /* Add Address Form */
            <form onSubmit={handleSaveNewAddress} className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900">Add New Address</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-red-600 font-semibold"
                >
                  Cancel
                </button>
              </div>

              {/* Label selector */}
              <div className="flex gap-2">
                {(['Home', 'Work', 'Other'] as const).map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setNewLabel(label)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      newLabel === label
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-stone-200 text-stone-600 bg-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Complete Address (Flat / House No / Street) *
                </label>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="E.g. #304, Green Villa, 5th Cross Road"
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                  placeholder="E.g. Near Community Park"
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save & Set as Delivery Address
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
