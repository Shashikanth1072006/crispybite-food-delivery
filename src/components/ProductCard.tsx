import React, { useState } from 'react';
import { Star, Plus, Flame, SlidersHorizontal } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, items } = useCart();
  const [imageError, setImageError] = useState(false);

  // Check how many items of this product are in the cart
  const quantityInCart = items
    .filter((item) => item.product.id === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const hasCustomizations = (product.spiceLevels && product.spiceLevels.length > 0) || (product.addons && product.addons.length > 0);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasCustomizations) {
      onOpenDetails(product);
    } else {
      addToCart(product, 1);
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group bg-white rounded-2xl border border-stone-200/90 hover:border-red-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-stone-100 to-stone-200 flex flex-col items-center justify-center p-4 text-center">
            <Flame className="w-10 h-10 text-red-500 mb-2" />
            <span className="text-xs font-semibold text-stone-600">{product.name}</span>
          </div>
        )}

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-md shadow-xs flex items-center gap-1.5 z-10">
          <div
            className={`w-3.5 h-3.5 border flex items-center justify-center ${
              product.isVeg ? 'border-emerald-600' : 'border-red-700'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                product.isVeg ? 'bg-emerald-600' : 'bg-red-700'
              }`}
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700">
            {product.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {/* Best Seller / New Badge */}
        {product.isBestSeller && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs z-10">
            Best Seller
          </div>
        )}
        {product.isNew && !product.isBestSeller && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs z-10">
            New
          </div>
        )}

        {/* Pieces or Serving Info */}
        {(product.pieceCount || product.serves) && (
          <div className="absolute bottom-2 left-2 bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
            {product.pieceCount || product.serves}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center gap-1 text-xs text-stone-500 mb-1.5">
            <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <span>·</span>
            <span>({product.reviewsCount})</span>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-neutral-900 text-base leading-snug group-hover:text-red-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Bottom Bar: Price & CTA */}
        <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-extrabold text-lg text-neutral-900 tabular-nums">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through tabular-nums">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            {hasCustomizations && (
              <span className="text-[10px] text-stone-400 block font-medium">
                Customizable
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddClick}
            disabled={!product.available}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
              !product.available
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : quantityInCart > 0
                ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
            }`}
          >
            {hasCustomizations ? (
              <>
                <SlidersHorizontal className="w-3 h-3" />
                <span>{quantityInCart > 0 ? `Added (${quantityInCart})` : 'Add +'}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>{quantityInCart > 0 ? `Added (${quantityInCart})` : 'Add'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
