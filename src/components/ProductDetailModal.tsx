import React, { useState, useEffect } from 'react';
import { X, Star, Plus, Minus, Check, Flame, MessageSquare } from 'lucide-react';
import { AddonOption, Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSpice, setSelectedSpice] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<AddonOption[]>([]);
  const [instructions, setInstructions] = useState('');
  const [imageError, setImageError] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedSpice(product.spiceLevels && product.spiceLevels.length > 0 ? product.spiceLevels[0] : '');
      setSelectedAddons([]);
      setInstructions('');
      setImageError(false);
      setAddedToast(false);
    }
  }, [product]);

  if (!product) return null;

  const toggleAddon = (addon: AddonOption) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = product.price + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(
      product,
      quantity,
      selectedSpice || undefined,
      selectedAddons,
      instructions.trim()
    );

    setAddedToast(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-black flex items-center justify-center shadow-md transition-all cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Header Image */}
          <div className="relative aspect-16/9 w-full bg-stone-100 overflow-hidden">
            {!imageError ? (
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-500">
                <Flame className="w-12 h-12 text-red-500 mb-2" />
                <span className="font-semibold text-sm">{product.name}</span>
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                product.isVeg ? 'bg-emerald-600 text-white' : 'bg-red-700 text-white'
              }`}>
                {product.isVeg ? 'Vegetarian' : 'Non-Veg'}
              </span>
              {product.pieceCount && (
                <span className="bg-neutral-900/90 text-white text-xs font-medium px-2.5 py-1 rounded-md">
                  {product.pieceCount}
                </span>
              )}
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <span>·</span>
                <span>{product.reviewsCount} customer reviews</span>
                {product.serves && (
                  <>
                    <span>·</span>
                    <span className="text-stone-700 font-medium">{product.serves}</span>
                  </>
                )}
              </div>

              <h2 className="font-display font-black text-2xl text-neutral-900 leading-tight">
                {product.name}
              </h2>
              <p className="text-stone-600 text-sm mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Spice Level Selection */}
            {product.spiceLevels && product.spiceLevels.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <label className="font-display font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-red-600" />
                    <span>Choose Spice Level</span>
                  </label>
                  <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    Required
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {product.spiceLevels.map((spice) => {
                    const isSelected = selectedSpice === spice;
                    return (
                      <button
                        key={spice}
                        type="button"
                        onClick={() => setSelectedSpice(spice)}
                        className={`p-3 rounded-xl text-xs font-bold border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-red-600 bg-red-50/50 text-red-900 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                        }`}
                      >
                        <span>{spice}</span>
                        {isSelected && <Check className="w-4 h-4 text-red-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Addons & Dips */}
            {product.addons && product.addons.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <label className="font-display font-bold text-neutral-900 text-sm">
                    Customize with Add-ons & Dips
                  </label>
                  <span className="text-xs text-stone-400">Optional</span>
                </div>

                <div className="space-y-2">
                  {product.addons.map((addon) => {
                    const isSelected = selectedAddons.some((a) => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-red-600 bg-red-50/30 text-neutral-900'
                            : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-red-600 border-red-600 text-white'
                                : 'border-stone-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{addon.name}</span>
                        </div>
                        <span className="font-bold text-neutral-900 tabular-nums">
                          +₹{addon.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="font-display font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-stone-400" />
                <span>Special Cooking Instructions</span>
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="E.g. Extra napkins, sauce on the side, well done crunchy..."
                rows={2}
                maxLength={120}
                className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white text-stone-800 placeholder:text-stone-400"
              />
            </div>
          </div>
        </div>

        {/* Modal Fixed Footer: Quantity & Add Button */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-stone-300 rounded-xl bg-white shadow-xs p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-600 disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-display font-black text-sm text-neutral-900 tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3.5 px-6 rounded-xl font-display font-bold text-sm text-white flex items-center justify-between shadow-md transition-all active:scale-98 cursor-pointer ${
              addedToast ? 'bg-emerald-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <span>{addedToast ? 'Added to Cart!' : 'Add to Cart'}</span>
            <span className="text-base font-black tabular-nums">₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
