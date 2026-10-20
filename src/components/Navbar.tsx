import React from 'react';
import { Volume2, VolumeX, Sparkles, Moon, Sun } from 'lucide-react';
import { playAffirmationSound } from '../utils/soundEffects.ts';

interface NavbarProps {
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onOpenCardStudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDarkTheme,
  onToggleTheme,
  isPlayingMusic,
  onToggleMusic,
  onOpenCardStudio,
}) => {
  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-300 backdrop-blur-md ${
        isDarkTheme
          ? 'bg-[#181114]/85 border-b border-rose-950/40 text-stone-200'
          : 'bg-[#FAF6F4]/85 border-b border-rose-100/70 text-[#2C2224]'
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-8 px-6 lg:px-12">
        {/* Zone 1: Single text element wordmark in luxury serif */}
        <a
          href="#"
          className={`font-serif-luxury text-2xl font-bold tracking-tight whitespace-nowrap shrink-0 transition-opacity hover:opacity-85 ${
            isDarkTheme ? 'text-rose-200' : 'text-[#4A1D28]'
          }`}
        >
          Élégance 20·10
        </a>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <a
            href="#ton-vinh"
            className="whitespace-nowrap shrink-0 hover:text-rose-500 transition-colors"
          >
            Tôn Vinh
          </a>
          <a
            href="#hoat-anh"
            className="whitespace-nowrap shrink-0 hover:text-rose-500 transition-colors"
          >
            Xưởng Hoạt Ảnh
          </a>
          <a
            href="#thiep-chuc"
            className="whitespace-nowrap shrink-0 hover:text-rose-500 transition-colors"
          >
            Tạo Thiệp Chúc
          </a>
          <a
            href="#kho-cau-chuc"
            className="whitespace-nowrap shrink-0 hover:text-rose-500 transition-colors"
          >
            Kho Lời Chúc
          </a>
        </nav>

        {/* Zone 3: 1 primary action + subtle secondary sensory switches */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Ambient Music Toggle */}
          <button
            onClick={onToggleMusic}
            aria-label={isPlayingMusic ? 'Tắt âm nhạc' : 'Phát âm nhạc êm dịu'}
            title={isPlayingMusic ? 'Tắt nhạc nền' : 'Bật nhạc nền êm dịu'}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
              isPlayingMusic
                ? 'bg-rose-500/20 text-rose-500 ring-1 ring-rose-400/50'
                : isDarkTheme
                ? 'bg-stone-800/60 text-stone-300 hover:text-rose-300'
                : 'bg-rose-50 text-stone-600 hover:text-rose-600'
            }`}
          >
            {isPlayingMusic ? <Volume2 size={16} className="animate-pulse" /> : <VolumeX size={16} />}
          </button>

          {/* Theme Mood Switch (Pastel Rose / Dark Velvet) */}
          <button
            onClick={onToggleTheme}
            aria-label="Đổi sắc thái giao diện"
            title="Đổi tông màu Ngày/Đêm"
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
              isDarkTheme
                ? 'bg-stone-800/60 text-amber-300 hover:bg-stone-700/60'
                : 'bg-rose-50 text-stone-600 hover:text-amber-600'
            }`}
          >
            {isDarkTheme ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Primary CTA button */}
          <button
            onClick={() => {
              playAffirmationSound();
              onOpenCardStudio();
            }}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider uppercase whitespace-nowrap shrink-0 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${
              isDarkTheme
                ? 'bg-gradient-to-r from-rose-400 to-rose-300 text-stone-950 font-medium'
                : 'bg-[#4A1D28] text-rose-50 hover:bg-[#3D141F]'
            }`}
          >
            <Sparkles size={13} />
            <span>Tạo Thiệp Ngay</span>
          </button>
        </div>
      </div>
    </header>
  );
};
