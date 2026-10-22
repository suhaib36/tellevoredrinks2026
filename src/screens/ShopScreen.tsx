import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { 
  Search, 
  Mic, 
  SlidersHorizontal, 
  Heart, 
  Plus, 
  ShoppingBag, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { FilterDrawer } from '../components/FilterDrawer';

export const ShopScreen: React.FC = () => {
  const { 
    products, 
    addToCart, 
    favorites, 
    toggleFavorite, 
    cart, 
    cartCount, 
    cartTotal, 
    setIsCartOpen,
    setSelectedProduct,
    showToast,
    t
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Organic', 'Zero-Proof 0.0%']);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const categories = [
    { id: 'all', label: t.shop.allDrinks },
    { id: 'tonics', label: t.shop.tonicsMixers },
    { id: 'sparkling', label: t.shop.wildSparkling },
    { id: 'adaptogens', label: t.shop.adaptogensShots },
    { id: 'spirits', label: t.shop.zeroProofSpirits },
  ];

  const handleVoiceSearch = () => {
    setIsListening(true);
    showToast('Listening for botanical infusions...', 'info');
    setTimeout(() => {
      setIsListening(false);
      setSearchQuery('Cloudberry');
      showToast('Found "Cloudberry" infusions', 'success');
    }, 1500);
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = product.name.toLowerCase().includes(q) || 
                    product.category.toLowerCase().includes(q) ||
                    (product.notes && product.notes.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Category
    if (activeCategory === 'tonics') {
      return product.category.includes('TONIC') || product.name.includes('Tonic');
    }
    if (activeCategory === 'sparkling') {
      return product.category.includes('SPARKLING') || product.category.includes('Soda');
    }
    if (activeCategory === 'adaptogens') {
      return product.category.includes('ADAPTOGEN') || product.category.includes('ELIXIR');
    }
    if (activeCategory === 'spirits') {
      return product.category.includes('SPIRIT') || product.category.includes('APERITIF');
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // default popular
  });

  return (
    <div className="pb-32 px-4 pt-3 max-w-md mx-auto space-y-4 animate-in fade-in duration-200 relative">
      {/* Search & Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C9C8F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.shop.searchPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#E5DFD0] rounded-2xl text-xs text-[#1C3122] placeholder-[#8C9C8F] shadow-soft-sm focus:outline-none focus:ring-1 focus:ring-[#183324]"
          />
          <button
            onClick={handleVoiceSearch}
            aria-label="Voice search"
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-[#8C9C8F] hover:text-[#183324] transition-colors ${
              isListening ? 'text-[#D49B4E] animate-pulse' : ''
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        {/* Filters Button with yellow count badge */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="px-3.5 py-2.5 rounded-2xl bg-[#183324] text-[#FAF8F3] text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#234330] active:scale-95 transition-all"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{t.shop.filters}</span>
          <span className="w-4 h-4 rounded-full bg-[#E5A953] text-[#12281C] text-[10px] font-bold flex items-center justify-center">
            {selectedTags.length}
          </span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
        {categories.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#183324] text-white shadow-sm'
                  : 'bg-white border border-[#E5DFD2] text-[#4F6355] hover:bg-[#F7F4EB]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Product count and Sort Dropdown */}
      <div className="flex items-center justify-between text-xs text-[#6C7E71] pt-1">
        <div>
          <span className="font-semibold text-[#183122]">{sortedProducts.length} {t.shop.blendsCount}</span>
          <span className="mx-1.5">•</span>
          <span>{t.shop.handcraftedIn}</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="px-3 py-1 bg-white border border-[#E5DFD2] rounded-xl text-xs font-medium text-[#203628] flex items-center gap-1 hover:bg-[#F9F7F1]"
          >
            <span>
              {sortBy === 'popular' && t.shop.popular}
              {sortBy === 'rating' && t.shop.topRated}
              {sortBy === 'price-asc' && t.shop.priceLowHigh}
              {sortBy === 'price-desc' && t.shop.priceHighLow}
            </span>
            <ChevronDown className="w-3 h-3 text-[#7B8B7E]" />
          </button>

          {isSortDropdownOpen && (
            <div className="absolute right-0 top-8 w-36 bg-white border border-[#E5DFD2] rounded-xl shadow-lg z-30 py-1 text-xs">
              <button
                onClick={() => { setSortBy('popular'); setIsSortDropdownOpen(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#F7F4EB] text-[#1B3123]"
              >
                {t.shop.popular}
              </button>
              <button
                onClick={() => { setSortBy('rating'); setIsSortDropdownOpen(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#F7F4EB] text-[#1B3123]"
              >
                {t.shop.topRated}
              </button>
              <button
                onClick={() => { setSortBy('price-asc'); setIsSortDropdownOpen(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#F7F4EB] text-[#1B3123]"
              >
                {t.shop.priceLowHigh}
              </button>
              <button
                onClick={() => { setSortBy('price-desc'); setIsSortDropdownOpen(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#F7F4EB] text-[#1B3123]"
              >
                {t.shop.priceHighLow}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2-Column Product Grid */}
      <div className="grid grid-cols-2 gap-3">
        {sortedProducts.map(product => {
          const isFav = favorites.includes(product.id);
          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl p-3 border border-[#EAE4D7] shadow-soft-sm flex flex-col justify-between group hover:border-[#D6CEBF] transition-all"
            >
              {/* Image & Badges */}
              <div 
                onClick={() => setSelectedProduct(product)}
                className="relative rounded-2xl overflow-hidden aspect-square mb-2.5 bg-[#F6F3EB] cursor-pointer"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badge top-left */}
                {product.badge && (
                  <span
                    className={`absolute top-2 left-2 text-[8px] font-bold tracking-wider px-2 py-0.5 rounded-md uppercase ${
                      product.badgeType === 'bestseller'
                        ? 'bg-[#183324] text-white'
                        : product.badgeType === 'organic'
                        ? 'bg-[#E5A953] text-[#12281C]'
                        : product.badgeType === 'adaptogenic'
                        ? 'bg-[#D2E7DA] text-[#183624]'
                        : product.badgeType === 'new-harvest'
                        ? 'bg-[#D2E8DA] text-[#183624]'
                        : product.badgeType === 'zero-proof'
                        ? 'bg-[#162B1D] text-white'
                        : product.badgeType === 'exclusive'
                        ? 'bg-[#E5A953] text-[#12281C]'
                        : 'bg-white/90 text-[#183324]'
                    }`}
                  >
                    {product.badge}
                  </span>
                )}

                {/* Favorite Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  aria-label="Save to favorites"
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#21382A] hover:bg-white shadow-sm transition-transform active:scale-90"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isFav ? 'fill-[#C53D43] text-[#C53D43]' : 'text-[#21382A]'
                    }`}
                  />
                </button>
              </div>

              {/* Subtitle / Category Notes */}
              <div 
                onClick={() => setSelectedProduct(product)}
                className="flex-1 cursor-pointer"
              >
                <div className="text-[9px] font-bold tracking-wider text-[#988151] uppercase mb-0.5 truncate">
                  {product.notes || product.category}
                </div>

                <h3 className="font-editorial text-sm font-semibold text-[#14261B] leading-tight line-clamp-2 hover:text-[#285737] transition-colors">
                  {product.name}
                </h3>

                <p className="text-[11px] text-[#7C8D80] mt-0.5">{product.size}</p>
              </div>

              {/* Price & Add Button */}
              <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#F0EBE0]">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-editorial text-sm font-bold text-[#14261B]">
                    €{product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[10px] text-[#9EAFA2] line-through">
                      €{product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => addToCart(product)}
                  aria-label={`Add ${product.name} to cart`}
                  className="w-8 h-8 rounded-full bg-[#183324] text-[#FAF8F3] flex items-center justify-center hover:bg-[#284B36] active:scale-95 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Forest Box Bar (Fixed right above bottom nav) */}
      <div className="fixed bottom-16 left-0 right-0 z-30 px-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="bg-[#183324] text-white rounded-2xl p-2.5 px-3.5 shadow-float border border-[#284B36] flex items-center justify-between animate-in slide-in-from-bottom-3 duration-200">
            {/* Left bag & count */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#E5A953]">
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E5A953] text-[#12281C] text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold leading-tight">{t.cart.title}</div>
                <div className="text-[11px] text-[#A6C4B0]">
                  {cartCount} ITEMS • €{cartTotal.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Right button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-3.5 py-1.5 bg-[#E5A953] text-[#12281C] rounded-full text-xs font-bold flex items-center gap-1 hover:bg-[#F3BA68] active:scale-95 transition-all shadow-sm"
            >
              <span>{t.shop.viewBox}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
    </div>
  );
};
