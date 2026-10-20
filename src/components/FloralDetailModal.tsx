import React from 'react';
import { X, Sparkles, Heart } from 'lucide-react';
import { FlowerItem, FloralNode } from '../types.ts';

interface FloralDetailModalProps {
  item: FlowerItem | FloralNode | null;
  onClose: () => void;
  onSelectForCard: (flowerName: string) => void;
}

export const FloralDetailModal: React.FC<FloralDetailModalProps> = ({
  item,
  onClose,
  onSelectForCard,
}) => {
  if (!item) return null;

  // Normalize between FlowerItem and FloralNode
  const isFlowerItem = 'botanicalName' in item;
  const title = isFlowerItem ? item.name : item.flowerName;
  const subtitle = isFlowerItem ? item.botanicalName : `Đặc tính: ${item.title}`;
  const meaning = isFlowerItem ? item.description : item.meaning;
  const poem = isFlowerItem ? item.poemQuote : item.poem;
  const image = isFlowerItem ? item.image : item.imagePath;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md transition-opacity">
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-[#FAF6F4] dark:bg-[#1A1217] text-[#2C2224] dark:text-stone-100 overflow-hidden shadow-2xl border border-rose-200/50 dark:border-rose-900/40 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
          aria-label="Đóng cửa sổ"
        >
          <X size={18} />
        </button>

        {/* Header Hero Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-rose-100">
          <img
            src={image}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-xs uppercase tracking-widest text-rose-300 font-mono">
              {subtitle}
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold mt-1">
              {title}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-500 mb-2">
              Ý nghĩa trong ngày 20/10
            </h4>
            <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300 font-light">
              {meaning}
            </p>
          </div>

          {/* Poetic Quote Box */}
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-center">
            <p className="font-serif-luxury italic text-base sm:text-lg text-[#4A1D28] dark:text-rose-200">
              "{poem}"
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-rose-100 dark:border-stone-800">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                onSelectForCard(title);
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#4A1D28] dark:bg-rose-400 text-rose-50 dark:text-stone-950 hover:opacity-90 transition-all shadow-md"
            >
              <Sparkles size={13} />
              <span>Gắn Hoa Vào Thiệp Chúc</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
