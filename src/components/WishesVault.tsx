import React, { useState, useMemo } from 'react';
import { Copy, Check, Sparkles, Heart, Search, Filter, LayoutGrid, ListFilter, ChevronDown, ChevronUp } from 'lucide-react';
import { WISHES_VAULT } from '../data/floralData.ts';
import { WishItem, WishCategory } from '../types.ts';
import { playAffirmationSound, playPluckChime } from '../utils/soundEffects.ts';

interface WishesVaultProps {
  isDarkTheme: boolean;
  onApplyWishToCard: (wish: WishItem) => void;
}

export const WishesVault: React.FC<WishesVaultProps> = ({
  isDarkTheme,
  onApplyWishToCard,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WishCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDenseGrid, setIsDenseGrid] = useState<boolean>(true);

  const categories = [
    { id: 'all' as WishCategory, label: 'Tất Cả', count: WISHES_VAULT.length },
    { id: 'mom' as WishCategory, label: 'Tặng Mẹ', count: WISHES_VAULT.filter((w) => w.category === 'mom').length },
    { id: 'lover' as WishCategory, label: 'Vợ & Người Yêu', count: WISHES_VAULT.filter((w) => w.category === 'lover').length },
    { id: 'sister' as WishCategory, label: 'Chị & Em Gái', count: WISHES_VAULT.filter((w) => w.category === 'sister').length },
    { id: 'mentor' as WishCategory, label: 'Cô Giáo Kính Yêu', count: WISHES_VAULT.filter((w) => w.category === 'mentor').length },
    { id: 'colleague' as WishCategory, label: 'Đồng Nghiệp & Sếp', count: WISHES_VAULT.filter((w) => w.category === 'colleague').length },
  ];

  const filteredWishes = useMemo(() => {
    return WISHES_VAULT.filter((wish) => {
      const matchCat =
        selectedCategory === 'all' || wish.category === selectedCategory;
      const matchQuery =
        searchQuery.trim() === '' ||
        wish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wish.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (wish.verse && wish.verse.toLowerCase().includes(searchQuery.toLowerCase())) ||
        wish.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wish.tone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wish.tag.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Show first 9 wishes when in 'all' category unless expanded, so it stays ultra neat!
  const displayedWishes = useMemo(() => {
    if (selectedCategory !== 'all' || searchQuery.trim() !== '' || isExpanded) {
      return filteredWishes;
    }
    return filteredWishes.slice(0, 9);
  }, [filteredWishes, selectedCategory, searchQuery, isExpanded]);

  const handleCopyWish = (wish: WishItem) => {
    const fullText = `${wish.content}${wish.verse ? `\n\n"${wish.verse}"` : ''}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedId(wish.id);
      playAffirmationSound();
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  return (
    <section
      id="kho-cau-chuc"
      className={`relative w-full py-16 px-6 lg:px-12 border-t transition-colors duration-500 ${
        isDarkTheme
          ? 'bg-[#150D12] border-rose-950/40 text-stone-100'
          : 'bg-[#FAF6F4] border-rose-100 text-[#2C2224]'
      }`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase mb-2 text-rose-500">
            <span>Thư Viện Ngọt Ngào</span>
            <span aria-hidden="true">·</span>
            <span>27+ Lời Chúc 20·10 Chọn Lọc</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Kho Lời Chúc 20·10 Ngọt Ngào Cho Mọi Đối Tượng
          </h2>
          <p
            className={`mt-2 text-xs sm:text-sm leading-relaxed ${
              isDarkTheme ? 'text-stone-300' : 'text-stone-600'
            }`}
          >
            Sắp xếp gọn gàng theo đối tượng, câu chữ súc tích đong đầy tình cảm. Bạn có thể sao chép nhanh hoặc gắn thẳng vào thiệp chúc chỉ với 1 cú chạm.
          </p>
        </div>

        {/* Filter Controls & Search Bar - Tidy & Compact */}
        <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div
            className={`flex flex-wrap items-center gap-1 p-1 rounded-xl border backdrop-blur-sm ${
              isDarkTheme
                ? 'bg-stone-900/60 border-stone-800'
                : 'bg-white/80 border-rose-100 shadow-sm'
            }`}
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playPluckChime(523.25, 0.5, 0.04);
                    setSelectedCategory(cat.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? isDarkTheme
                        ? 'bg-rose-400 text-stone-950 font-semibold shadow-sm'
                        : 'bg-[#4A1D28] text-rose-50 shadow-sm'
                      : isDarkTheme
                      ? 'text-stone-300 hover:text-white'
                      : 'text-stone-600 hover:text-[#4A1D28]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? isDarkTheme
                          ? 'bg-stone-900/30 text-stone-900'
                          : 'bg-white/20 text-white'
                        : isDarkTheme
                        ? 'bg-stone-800 text-stone-400'
                        : 'bg-rose-50 text-stone-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search & Grid Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search
                size={13}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDarkTheme ? 'text-stone-400' : 'text-stone-400'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm từ khóa, ý thơ..."
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none transition-colors ${
                  isDarkTheme
                    ? 'bg-stone-900/60 border-stone-800 text-stone-100 focus:border-rose-400'
                    : 'bg-white border-rose-200 text-stone-800 focus:border-rose-400 shadow-sm'
                }`}
              />
            </div>

            {/* View Mode Toggle: Dense Grid (3 cols) vs Standard (2 cols) */}
            <button
              onClick={() => setIsDenseGrid(!isDenseGrid)}
              title={isDenseGrid ? 'Xem dạng 2 cột rộng' : 'Xem dạng lưới gọn 3 cột'}
              className={`p-2 rounded-xl border transition-colors hidden sm:flex items-center justify-center ${
                isDarkTheme
                  ? 'border-stone-800 bg-stone-900/60 text-stone-300 hover:text-white'
                  : 'border-rose-200 bg-white text-stone-600 hover:text-[#4A1D28] shadow-sm'
              }`}
            >
              {isDenseGrid ? <ListFilter size={14} /> : <LayoutGrid size={14} />}
            </button>
          </div>
        </div>

        {/* Wishes Grid - Compact, tidy, well-organized cards */}
        {filteredWishes.length === 0 ? (
          <div className="py-12 text-center">
            <Filter size={24} className="mx-auto text-rose-400 opacity-60 mb-2" />
            <p className="text-xs font-medium">Không tìm thấy lời chúc phù hợp với từ khóa này.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 text-xs text-rose-500 underline underline-offset-4"
            >
              Xem lại tất cả lời chúc
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-4.5 ${
              isDenseGrid
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {displayedWishes.map((wish) => {
              const isCopied = copiedId === wish.id;
              return (
                <div
                  key={wish.id}
                  className={`rounded-xl p-4.5 sm:p-5 border flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    isDarkTheme
                      ? 'bg-[#1C1217]/65 border-stone-800/80 hover:border-rose-900/60 hover:shadow-rose-950/25'
                      : 'bg-white/90 border-rose-100/90 hover:border-rose-200 hover:shadow-rose-100/50'
                  }`}
                >
                  <div>
                    {/* Header: Category and Tone info */}
                    <div className="flex items-center justify-between text-[11px] mb-2 font-medium">
                      <span className="text-rose-500 font-semibold">{wish.categoryLabel}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isDarkTheme
                            ? 'bg-rose-950/50 text-rose-300 border border-rose-900/30'
                            : 'bg-rose-50 text-rose-800 border border-rose-100'
                        }`}
                      >
                        {wish.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif-luxury text-base sm:text-lg font-bold mb-2 tracking-tight line-clamp-1">
                      {wish.title}
                    </h3>

                    {/* Content */}
                    <p
                      className={`text-xs sm:text-[13px] leading-relaxed mb-3 font-light ${
                        isDarkTheme ? 'text-stone-300' : 'text-stone-700'
                      }`}
                    >
                      {wish.content}
                    </p>

                    {/* Verse if present */}
                    {wish.verse && (
                      <div
                        className={`p-2 sm:p-2.5 rounded-lg mb-3 text-[11px] italic font-serif-luxury leading-relaxed border ${
                          isDarkTheme
                            ? 'bg-rose-950/20 border-rose-900/30 text-rose-200/90'
                            : 'bg-rose-50/60 border-rose-100/80 text-[#4A1D28]'
                        }`}
                      >
                        "{wish.verse}"
                      </div>
                    )}
                  </div>

                  {/* Compact Bottom Action Bar */}
                  <div
                    className={`pt-3 border-t border-dashed flex items-center justify-between gap-2 text-xs ${
                      isDarkTheme ? 'border-stone-800' : 'border-rose-100'
                    }`}
                  >
                    {/* Flower hint */}
                    <div className="flex items-center gap-1 opacity-75 text-[11px] truncate">
                      <Heart size={10} className="fill-current text-rose-500 shrink-0" />
                      <span className="truncate max-w-[110px] font-serif-luxury font-medium">
                        {wish.suggestedFlower}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyWish(wish)}
                        title="Sao chép câu chúc này"
                        className={`p-1.5 rounded-lg border transition-all text-xs flex items-center gap-1 ${
                          isCopied
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : isDarkTheme
                            ? 'border-stone-700 hover:bg-stone-800 text-stone-300'
                            : 'border-rose-200 hover:bg-rose-50 text-[#4A1D28]'
                        }`}
                      >
                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                        <span className="text-[10px] hidden sm:inline">
                          {isCopied ? 'Đã chép' : 'Chép'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          playAffirmationSound();
                          onApplyWishToCard(wish);
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide transition-all ${
                          isDarkTheme
                            ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-stone-950'
                            : 'bg-rose-100 text-[#4A1D28] hover:bg-[#4A1D28] hover:text-rose-50'
                        }`}
                      >
                        <Sparkles size={11} />
                        <span>Gắn thiệp</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Expand / Collapse Button (Keeps page neat and prevents endless scrolling) */}
        {selectedCategory === 'all' && searchQuery.trim() === '' && filteredWishes.length > 9 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                playPluckChime(587.33, 0.4, 0.04);
                setIsExpanded(!isExpanded);
              }}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase border transition-all duration-200 ${
                isDarkTheme
                  ? 'border-stone-700 bg-stone-900/60 text-stone-200 hover:bg-stone-800'
                  : 'border-rose-200 bg-white text-[#4A1D28] hover:bg-rose-50 shadow-sm'
              }`}
            >
              {isExpanded ? (
                <>
                  <span>Thu Gọn Lại</span>
                  <ChevronUp size={14} />
                </>
              ) : (
                <>
                  <span>Xem Thêm Tất Cả ({filteredWishes.length} lời chúc)</span>
                  <ChevronDown size={14} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
