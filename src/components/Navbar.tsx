import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Moon, Sun, Menu, X } from 'lucide-react';
import { playAffirmationSound, playPluckChime } from '../utils/soundEffects.ts';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#ton-vinh', label: 'Tôn Vinh' },
    { href: '#hoat-anh', label: 'Xưởng Hoạt Ảnh' },
    { href: '#thiep-chuc', label: 'Tạo Thiệp Chúc' },
    { href: '#kho-cau-chuc', label: 'Kho Lời Chúc' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    playPluckChime(523.25, 0.4, 0.03);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-300 backdrop-blur-md ${
        isDarkTheme
          ? 'bg-[#181114]/90 border-b border-rose-950/40 text-stone-200'
          : 'bg-[#FAF6F4]/90 border-b border-rose-100/80 text-[#2C2224]'
      }`}
    >
      <div className="mx-auto flex h-16 sm:h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
        {/* Zone 1: Wordmark & Creator Credit */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <a
            href="#"
            className={`font-serif-luxury text-xl sm:text-2xl font-bold tracking-tight whitespace-nowrap shrink-0 transition-opacity hover:opacity-85 ${
              isDarkTheme ? 'text-rose-200' : 'text-[#4A1D28]'
            }`}
          >
            Élégance 20·10
          </a>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide uppercase border border-rose-400/30 bg-rose-500/10 text-rose-500">
            by NK TECH CLUB
          </span>
        </div>

        {/* Zone 2: 4 concise single-line text navigation links for tablet landscape & desktop */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium tracking-wide">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 hover:text-rose-500 transition-colors py-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Sensory switches + Primary CTA button + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Ambient Music Toggle */}
          <button
            onClick={onToggleMusic}
            aria-label={isPlayingMusic ? 'Tắt âm nhạc' : 'Phát âm nhạc êm dịu'}
            title={isPlayingMusic ? 'Tắt nhạc nền' : 'Bật nhạc nền êm dịu'}
            className={`flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-all active:scale-95 ${
              isPlayingMusic
                ? 'bg-rose-500/20 text-rose-500 ring-1 ring-rose-400/50'
                : isDarkTheme
                ? 'bg-stone-800/70 text-stone-300 hover:text-rose-300'
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
            className={`flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-all active:scale-95 ${
              isDarkTheme
                ? 'bg-stone-800/70 text-amber-300 hover:bg-stone-700/60'
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
            className={`flex items-center gap-1.5 sm:gap-2 rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold tracking-wider uppercase whitespace-nowrap shrink-0 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${
              isDarkTheme
                ? 'bg-gradient-to-r from-rose-400 to-rose-300 text-stone-950 font-medium'
                : 'bg-[#4A1D28] text-rose-50 hover:bg-[#3D141F]'
            }`}
          >
            <Sparkles size={13} />
            <span>Tạo Thiệp <span className="hidden sm:inline">Ngay</span></span>
          </button>

          {/* Mobile Hamburger Menu Button (visible on < md) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Mở menu di động"
            className={`md:hidden flex h-10 w-10 items-center justify-center rounded-xl border transition-colors active:scale-95 ${
              isDarkTheme
                ? 'border-stone-800 bg-stone-900/80 text-stone-200'
                : 'border-rose-200/80 bg-white/80 text-stone-800 shadow-sm'
            }`}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu with Smooth Blur */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-b px-4 py-4 animate-in slide-in-from-top-2 duration-200 shadow-lg ${
            isDarkTheme
              ? 'bg-[#181114]/98 border-stone-800/80 text-stone-200'
              : 'bg-[#FAF6F4]/98 border-rose-200/80 text-[#2C2224]'
          }`}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isDarkTheme
                    ? 'hover:bg-stone-800/60 active:bg-stone-800'
                    : 'hover:bg-rose-50 active:bg-rose-100/60 text-[#4A1D28]'
                }`}
              >
                <span>{link.label}</span>
                <span className="text-rose-400 text-xs">→</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
