import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Flame, 
  ArrowUpDown,
  Utensils,
  X
} from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { ProductCard } from '../components/ProductCard';
import { Product, ProductCategory } from '../types';

interface MenuPageProps {
  onOpenProductModal: (product: Product) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onOpenProductModal }) => {
  const { products } = useMenu();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = (searchParams.get('category') as ProductCategory | 'all') || 'all';
  const urlSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');

  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  const categoryTabs: { id: ProductCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Items', icon: '🔥' },
    { id: 'chicken', label: 'Crispy Chicken', icon: '🍗' },
    { id: 'burgers', label: 'Zinger Burgers', icon: '🍔' },
    { id: 'buckets', label: 'Buckets & Combos', icon: '🪣' },
    { id: 'sides', label: 'Sides & Dips', icon: '🍟' },
    { id: 'beverages', label: 'Beverages', icon: '🥤' },
    { id: 'desserts', label: 'Desserts', icon: '🍰' },
  ];

  const handleCategoryChange = (catId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', catId);
    }
    setSearchParams(nextParams);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (activeCategory !== 'all' && product.category !== activeCategory) {
          return false;
        }

        // Veg / Non-Veg filter
        if (vegFilter === 'veg' && !product.isVeg) return false;
        if (vegFilter === 'non-veg' && product.isVeg) return false;

        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(query);
          const matchDesc = product.description.toLowerCase().includes(query);
          const matchCat = product.category.toLowerCase().includes(query);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // recommended
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [products, activeCategory, vegFilter, searchQuery, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setVegFilter('all');
    setSortBy('recommended');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      
      {/* Page Header */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-red-400 text-xs font-black uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>Finger-Lickin' Menu</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
            CrispyBite Food Menu
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm">
            Hand-breaded crispy chicken, juicy zinger burgers, mega feast buckets, and golden sides prepared fresh on your order.
          </p>
        </div>
      </div>

      {/* Category Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categoryTabs.map((tab) => {
          const isSelected = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleCategoryChange(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search within menu (e.g. wings, burger, bucket)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600 text-stone-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-neutral-900"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Secondary Controls: Veg/Non-Veg & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Veg / Non-Veg Segmented Control */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs">
            <button
              onClick={() => setVegFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                vegFilter === 'all'
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-stone-600 hover:text-neutral-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setVegFilter('veg')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                vegFilter === 'veg'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-700 hover:text-emerald-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              <span>Veg Only</span>
            </button>
            <button
              onClick={() => setVegFilter('non-veg')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                vegFilter === 'non-veg'
                  ? 'bg-red-700 text-white shadow-2xs'
                  : 'text-red-700 hover:text-red-850'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              <span>Non-Veg</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-stone-100 border border-stone-200 rounded-xl px-3 py-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-stone-800 font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="recommended">Best Sellers & Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated (★)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>
          Showing <strong className="text-neutral-900">{filteredProducts.length}</strong> delicious items
          {activeCategory !== 'all' && ` in ${activeCategory}`}
        </span>
        {(searchQuery || vegFilter !== 'all' || activeCategory !== 'all') && (
          <button
            onClick={clearFilters}
            className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenProductModal}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <Utensils className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-neutral-900">
              No matching bites found
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              We couldn't find anything matching "{searchQuery || vegFilter}". Try adjusting your filters or browse our full menu.
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Show All Items
          </button>
        </div>
      )}

    </div>
  );
};
