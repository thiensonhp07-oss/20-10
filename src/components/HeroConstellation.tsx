import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowDown, Heart, Eye, Film } from 'lucide-react';
import { HERO_NODES } from '../data/floralData.ts';
import { FloralNode } from '../types.ts';
import { playAffirmationSound, playPluckChime } from '../utils/soundEffects.ts';
import { getTransparentCutout } from '../utils/transparentCutout.ts';

interface HeroConstellationProps {
  isDarkTheme: boolean;
  onSelectNode: (node: FloralNode) => void;
  onExploreFlowers: () => void;
  onOpenCardStudio: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
}

import rawRoseSrc from '../assets/images/floral_cutout_rose_1792422501281.jpg';
import rawPeonySrc from '../assets/images/floral_cutout_peony_1792422502296.jpg';
import rawBranchSrc from '../assets/images/floral_cutout_branch_1792422501881.jpg';

const RAW_ROSE_SRC = rawRoseSrc;
const RAW_PEONY_SRC = rawPeonySrc;
const RAW_BRANCH_SRC = rawBranchSrc;

export const HeroConstellation: React.FC<HeroConstellationProps> = ({
  isDarkTheme,
  onSelectNode,
  onExploreFlowers,
  onOpenCardStudio,
  isPlayingMusic,
  onToggleMusic,
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Transparent cutout images state
  const [roseCutout, setRoseCutout] = useState<string>(RAW_ROSE_SRC);
  const [peonyCutout, setPeonyCutout] = useState<string>(RAW_PEONY_SRC);
  const [branchCutout, setBranchCutout] = useState<string>(RAW_BRANCH_SRC);

  useEffect(() => {
    // Process black background into transparent cutouts
    getTransparentCutout(RAW_ROSE_SRC).then(setRoseCutout);
    getTransparentCutout(RAW_PEONY_SRC).then(setPeonyCutout);
    getTransparentCutout(RAW_BRANCH_SRC).then(setBranchCutout);
  }, []);

  return (
    <section
      id="ton-vinh"
      className={`relative min-h-[96vh] w-full overflow-hidden flex flex-col justify-between pt-10 pb-8 transition-colors duration-500 ${
        isDarkTheme
          ? 'bg-[#120B0F] text-stone-100'
          : 'bg-[#FAF6F4] text-[#2C2224]'
      }`}
    >
      {/* Background Ambient Glow & Light Spheres */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-right soft blur sphere */}
        <div
          className={`absolute -top-24 -right-24 h-[580px] w-[580px] rounded-full blur-[130px] transition-opacity duration-700 ${
            isDarkTheme
              ? 'bg-gradient-to-br from-rose-900/40 via-amber-900/20 to-transparent opacity-80'
              : 'bg-gradient-to-br from-[#FCE4EC] via-[#F8BBD0]/40 to-transparent opacity-75'
          }`}
        />
        {/* Bottom-left soft blur sphere */}
        <div
          className={`absolute -bottom-32 -left-20 h-[520px] w-[520px] rounded-full blur-[130px] transition-opacity duration-700 ${
            isDarkTheme
              ? 'bg-gradient-to-tr from-pink-950/30 via-rose-900/25 to-transparent opacity-70'
              : 'bg-gradient-to-tr from-[#FFF3E0] via-[#FCE4EC]/50 to-transparent opacity-80'
          }`}
        />
        {/* Center glowing focal aura */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[720px] w-[720px] rounded-full blur-[150px] pointer-events-none transition-opacity duration-700 ${
            isDarkTheme ? 'bg-rose-950/40 opacity-60' : 'bg-rose-200/35 opacity-50'
          }`}
        />

        {/* Diagonal Soft Shimmer Ray */}
        <div
          className={`absolute -top-32 right-1/4 h-[850px] w-[450px] -rotate-25 rounded-full blur-[90px] transition-all duration-1000 ${
            isDarkTheme ? 'bg-white/[0.04]' : 'bg-white/70'
          }`}
        />
      </div>

      {/* Floating Transparent Cutout Flowers (Positioned at deepest layer z-0) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {/* 1. Large Blooming English Rose (Top-Left Floating Luxury Cutout) */}
        <div className="absolute top-10 left-3 md:left-14 w-44 md:w-60 lg:w-72 aspect-square animate-float-gentle opacity-90 transition-transform duration-700 drop-shadow-[0_15px_30px_rgba(244,114,182,0.18)]">
          <img
            src={roseCutout}
            alt="Đóa hồng Juliet sang trọng"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter contrast-105"
            style={{
              mixBlendMode: isDarkTheme ? 'screen' : 'normal',
            }}
          />
        </div>

        {/* 2. Full Peony Bloom (Bottom-Right Floating Luxury Cutout) */}
        <div
          className="absolute bottom-16 right-4 md:right-16 w-48 md:w-64 lg:w-80 aspect-square animate-float-gentle opacity-85 transition-transform duration-700 drop-shadow-[0_15px_35px_rgba(251,191,36,0.14)]"
          style={{ animationDelay: '-3.5s' }}
        >
          <img
            src={peonyCutout}
            alt="Đóa mẫu đơn vương giả"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter contrast-105"
            style={{
              mixBlendMode: isDarkTheme ? 'screen' : 'normal',
            }}
          />
        </div>

        {/* 3. Delicate Blossom Branch (Top-Right Framing Cutout) */}
        <div
          className="hidden md:block absolute -top-8 right-10 lg:right-28 w-56 lg:w-72 aspect-square opacity-75 animate-float-gentle"
          style={{ animationDelay: '-1.8s' }}
        >
          <img
            src={branchCutout}
            alt="Cành hoa anh đào thanh nhã"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain rotate-12"
            style={{
              mixBlendMode: isDarkTheme ? 'screen' : 'normal',
            }}
          />
        </div>

        {/* 4. Secondary Soft Rose Accent (Bottom-Left Depth Element) */}
        <div
          className="hidden lg:block absolute bottom-12 left-28 w-36 aspect-square opacity-60 animate-float-gentle blur-[0.6px]"
          style={{ animationDelay: '-5s' }}
        >
          <img
            src={roseCutout}
            alt="Đóa hoa phụ mờ nhẹ"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain -rotate-45"
            style={{
              mixBlendMode: isDarkTheme ? 'screen' : 'normal',
            }}
          />
        </div>
      </div>

      {/* SVG Floral Connection Constellation Lines */}
      <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="lineGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                stopColor={isDarkTheme ? '#FDA4AF' : '#E2959D'}
                stopOpacity="0.5"
              />
              <stop
                offset="100%"
                stopColor={isDarkTheme ? '#F43F5E' : '#B85064'}
                stopOpacity="0.12"
              />
            </linearGradient>
            <linearGradient id="lineGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                stopColor={isDarkTheme ? '#FDA4AF' : '#E2959D'}
                stopOpacity="0.5"
              />
              <stop
                offset="100%"
                stopColor={isDarkTheme ? '#F43F5E' : '#B85064'}
                stopOpacity="0.12"
              />
            </linearGradient>
          </defs>

          {/* Node 1: Top Left -> Center Branch */}
          <path
            d="M 5,32 L 18,32 C 30,32 35,42 45,45"
            fill="none"
            stroke="url(#lineGradLeft)"
            strokeWidth="0.18"
            strokeDasharray={hoveredNodeId === 'tam-hon' ? 'none' : '0.4 0.3'}
            className="transition-all duration-300"
          />

          {/* Node 2: Top Right -> Center Branch */}
          <path
            d="M 95,35 L 82,35 C 70,35 65,42 55,45"
            fill="none"
            stroke="url(#lineGradRight)"
            strokeWidth="0.18"
            strokeDasharray={hoveredNodeId === 'yeu-thuong' ? 'none' : '0.4 0.3'}
            className="transition-all duration-300"
          />

          {/* Node 3: Bottom Left -> Center Branch */}
          <path
            d="M 5,68 L 16,68 C 28,68 34,58 45,55"
            fill="none"
            stroke="url(#lineGradLeft)"
            strokeWidth="0.18"
            strokeDasharray={hoveredNodeId === 'ban-linh' ? 'none' : '0.4 0.3'}
            className="transition-all duration-300"
          />

          {/* Node 4: Bottom Right -> Center Branch */}
          <path
            d="M 95,66 L 84,66 C 72,66 66,58 55,55"
            fill="none"
            stroke="url(#lineGradRight)"
            strokeWidth="0.18"
            strokeDasharray={hoveredNodeId === 'rang-ngoi' ? 'none' : '0.4 0.3'}
            className="transition-all duration-300"
          />
        </svg>
      </div>

      {/* Floating Interactive Floral Nodes and Central Marquee */}
      <div className="pointer-events-auto relative z-50 mx-auto w-full max-w-7xl px-6 lg:px-12 my-auto">
        <div className="relative min-h-[480px] md:min-h-[540px] flex items-center justify-center">

          {/* Central Hero Typography and Action Core - Highest Stacking Priority */}
          <div className="text-center max-w-3xl relative z-50 px-4">
            {/* Top Interactive Sub-Action / Ambient Trigger */}
            <div className="flex justify-center mb-6 relative z-50">
              <button
                onClick={() => {
                  playAffirmationSound();
                  onToggleMusic();
                }}
                className={`group flex items-center gap-3 px-4 py-2 rounded-full border text-xs font-medium tracking-wide transition-all duration-300 backdrop-blur-md ${
                  isDarkTheme
                    ? 'border-white/10 bg-white/5 text-rose-200 hover:bg-white/10 hover:border-rose-400/40'
                    : 'border-rose-200 bg-white/85 text-rose-900 hover:bg-white hover:border-rose-300 shadow-sm'
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                  <Sparkles size={11} className={isPlayingMusic ? 'animate-spin' : ''} />
                </span>
                <span>20.10 · Tôn Vinh Người Phụ Nữ Tôi Yêu</span>
                <span className="text-rose-400 font-sans group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            </div>

            {/* Marquee Headline - Guaranteed top layer, never covered */}
            <h1
              className={`relative z-50 font-serif-luxury text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-balance mb-6 transition-colors duration-300 select-none ${
                isDarkTheme
                  ? 'text-transparent bg-clip-text bg-gradient-to-b from-stone-50 via-rose-100 to-rose-300 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]'
                  : 'text-[#3E1B24] drop-shadow-[0_2px_12px_rgba(255,255,255,0.9)]'
              }`}
            >
              Nét Đẹp Vượt Thời Gian
            </h1>

            {/* Poetic Subtitle */}
            <p
              className={`mx-auto max-w-2xl text-base sm:text-lg leading-relaxed font-light mb-9 text-balance ${
                isDarkTheme ? 'text-stone-300/85' : 'text-[#684C54]'
              }`}
            >
              Dành trọn những đóa hoa thơm ngát và tâm tư chân thành nhất gửi trao đến người phụ nữ tuyệt vời nhân ngày 20/10.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  playAffirmationSound();
                  onOpenCardStudio();
                }}
                className={`px-7 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 ${
                  isDarkTheme
                    ? 'bg-stone-100 text-stone-950 hover:bg-white shadow-rose-950/40'
                    : 'bg-[#4A1D28] text-rose-50 hover:bg-[#38131D]'
                }`}
              >
                <Heart size={14} className="fill-current text-rose-400" />
                <span>Gửi Thiệp Yêu Thương</span>
              </button>

              <button
                onClick={() => {
                  playPluckChime(440, 1.2);
                  onExploreFlowers();
                }}
                className={`px-7 py-3 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 border backdrop-blur-md hover:scale-105 active:scale-95 flex items-center gap-2 ${
                  isDarkTheme
                    ? 'border-white/15 bg-white/5 text-stone-200 hover:bg-white/10 hover:border-white/30'
                    : 'border-rose-200/90 bg-white/70 text-[#4A1D28] hover:bg-white shadow-sm'
                }`}
              >
                <Film size={14} className="text-rose-400" />
                <span>Xưởng Hoạt Ảnh Video</span>
              </button>
            </div>
          </div>

          {/* 4 Interactive Constellation Nodes */}
          {HERO_NODES.map((node) => {
            const isHovered = hoveredNodeId === node.id;
            return (
              <div
                key={node.id}
                onMouseEnter={() => {
                  setHoveredNodeId(node.id);
                  playPluckChime(587.33, 0.9, 0.04);
                }}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={() => {
                  playAffirmationSound();
                  onSelectNode(node);
                }}
                className="hidden md:block absolute cursor-pointer select-none z-30 transition-all duration-300"
                style={{
                  left: `${node.position.x}%`,
                  top: `${node.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className={`group relative flex items-center gap-3.5 px-3 py-2 rounded-2xl transition-all duration-300 ${
                    isHovered
                      ? isDarkTheme
                        ? 'bg-rose-950/80 ring-1 ring-rose-400/70 shadow-lg shadow-rose-950/60 backdrop-blur-md scale-105'
                        : 'bg-white/95 ring-1 ring-rose-300 shadow-md backdrop-blur-md scale-105'
                      : isDarkTheme
                      ? 'bg-stone-900/40 ring-1 ring-white/10 backdrop-blur-sm'
                      : 'bg-white/75 ring-1 ring-rose-100 backdrop-blur-sm'
                  }`}
                >
                  {/* Glowing Node Dot */}
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`h-4 w-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                        isHovered
                          ? 'scale-125 bg-rose-400 text-stone-900 shadow-md shadow-rose-400/50'
                          : isDarkTheme
                          ? 'border border-rose-300/40 bg-white/10'
                          : 'border border-rose-300 bg-rose-50'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
                    </span>
                  </div>

                  {/* Typography & Subvalue */}
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm font-semibold tracking-wide font-serif-luxury ${
                          isDarkTheme ? 'text-rose-100' : 'text-[#3E1B24]'
                        }`}
                      >
                        {node.title}
                      </span>
                    </div>
                    <div
                      className={`text-[11px] font-mono tracking-tight ${
                        isDarkTheme ? 'text-stone-400' : 'text-stone-500'
                      }`}
                    >
                      {node.subValue}
                    </div>
                  </div>

                  {/* Hover tooltip hint */}
                  {isHovered && (
                    <div
                      className={`absolute left-1/2 -top-11 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-medium shadow-md transition-all duration-200 ${
                        isDarkTheme
                          ? 'bg-stone-800 text-rose-200 border border-stone-700'
                          : 'bg-white text-rose-900 border border-rose-200'
                      }`}
                    >
                      {node.flowerName}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Center Vertical Glowing Light Streaks */}
      <div className="relative w-full flex flex-col items-center justify-end z-20 mt-4 pointer-events-none">
        <div className="flex items-end justify-center gap-3 h-20 opacity-80">
          <div
            className={`w-[1px] h-10 rounded-full transition-all duration-700 ${
              isDarkTheme
                ? 'bg-gradient-to-t from-white/70 via-rose-300/40 to-transparent animate-pulse'
                : 'bg-gradient-to-t from-rose-500/70 via-rose-300/40 to-transparent'
            }`}
          />
          <div
            className={`w-[1.5px] h-18 rounded-full transition-all duration-700 ${
              isDarkTheme
                ? 'bg-gradient-to-t from-white via-rose-200 to-transparent shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                : 'bg-gradient-to-t from-[#B85064] via-rose-300 to-transparent'
            }`}
          />
          <div
            className={`w-[1px] h-12 rounded-full transition-all duration-700 ${
              isDarkTheme
                ? 'bg-gradient-to-t from-white/80 via-amber-200/40 to-transparent'
                : 'bg-gradient-to-t from-rose-400/80 via-amber-200/40 to-transparent'
            }`}
          />
        </div>

        {/* Bottom Horizontal Bar */}
        <div className="pointer-events-auto w-full max-w-7xl mx-auto px-6 lg:px-12 pt-4 flex items-center justify-between text-xs tracking-wider">
          <button
            onClick={onExploreFlowers}
            className={`flex items-center gap-2 group transition-colors ${
              isDarkTheme ? 'text-stone-400 hover:text-stone-200' : 'text-stone-500 hover:text-[#4A1D28]'
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border transition-transform group-hover:translate-y-0.5 ${
                isDarkTheme ? 'border-stone-700 bg-stone-900/60' : 'border-rose-200 bg-white'
              }`}
            >
              <ArrowDown size={12} />
            </span>
            <span className="font-mono text-[11px]">20.10 · Cuộn xuống để xem vườn hoa</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`font-serif-luxury italic text-sm ${
                isDarkTheme ? 'text-rose-300/80' : 'text-rose-900/80'
              }`}
            >
              Hương sắc Việt Nam
            </span>
            <div className="flex gap-1">
              <span className="h-1 w-5 rounded-full bg-rose-400" />
              <span className={`h-1 w-2 rounded-full ${isDarkTheme ? 'bg-stone-700' : 'bg-rose-200'}`} />
              <span className={`h-1 w-2 rounded-full ${isDarkTheme ? 'bg-stone-700' : 'bg-rose-200'}`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
