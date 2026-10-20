import React, { useState, useEffect, useRef } from 'react';
import {
  Copy,
  Check,
  Download,
  RotateCcw,
  Heart,
  Sparkles,
  Feather,
  Share2,
  Image as ImageIcon,
  Loader2,
  X,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { PRESET_WISHES } from '../data/floralData.ts';
import { playAffirmationSound, playPluckChime } from '../utils/soundEffects.ts';
import { getTransparentCutout } from '../utils/transparentCutout.ts';

import { WishItem } from '../types.ts';

interface CardStudioProps {
  isDarkTheme: boolean;
  selectedFlowerName?: string;
  selectedWish?: WishItem | null;
}

type CardStyleOption = 'blush' | 'champagne' | 'pearl' | 'velvet';
type FloralDecoType = 'rose' | 'peony' | 'branch' | 'duo';

const RAW_ROSE_SRC = '/src/assets/images/floral_cutout_rose_1792422501281.jpg';
const RAW_PEONY_SRC = '/src/assets/images/floral_cutout_peony_1792422502296.jpg';
const RAW_BRANCH_SRC = '/src/assets/images/floral_cutout_branch_1792422501881.jpg';

export const CardStudio: React.FC<CardStudioProps> = ({
  isDarkTheme,
  selectedFlowerName = 'Hoa Hồng Juliet Pastel',
  selectedWish = null,
}) => {
  const [recipientCategory, setRecipientCategory] = useState<'mom' | 'lover' | 'sister' | 'mentor'>('mom');
  const [recipientName, setRecipientName] = useState<string>('Mẹ kính yêu');
  const [senderName, setSenderName] = useState<string>('Con của Mẹ');
  const [flowerAttribution, setFlowerAttribution] = useState<string>(selectedFlowerName);
  const [cardStyle, setCardStyle] = useState<CardStyleOption>('blush');
  const [floralDeco, setFloralDeco] = useState<FloralDecoType>('rose');
  const [waxSealActive, setWaxSealActive] = useState<boolean>(true);
  const [sealMonogram, setSealMonogram] = useState<string>('20·10');

  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportedImageUrl, setExportedImageUrl] = useState<string | null>(null);
  const [fontEmbedCSS, setFontEmbedCSS] = useState<string>('');

  // Cutout images
  const [roseCutout, setRoseCutout] = useState<string>(RAW_ROSE_SRC);
  const [peonyCutout, setPeonyCutout] = useState<string>(RAW_PEONY_SRC);
  const [branchCutout, setBranchCutout] = useState<string>(RAW_BRANCH_SRC);

  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getTransparentCutout(RAW_ROSE_SRC).then(setRoseCutout);
    getTransparentCutout(RAW_PEONY_SRC).then(setPeonyCutout);
    getTransparentCutout(RAW_BRANCH_SRC).then(setBranchCutout);

    // Pre-fetch Google Fonts CSS to embed directly into SVG export, avoiding SecurityError and font mismatch
    fetch(
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'
    )
      .then((res) => res.text())
      .then((css) => setFontEmbedCSS(css))
      .catch((err) => console.debug('Pre-fetching font embed CSS skipped:', err));
  }, []);

  // Sync selectedFlowerName prop when user clicks "Chọn hoa này" in Vườn Hoa
  useEffect(() => {
    if (selectedFlowerName) {
      setFlowerAttribution(selectedFlowerName);
      if (selectedFlowerName.includes('Hồng')) setFloralDeco('rose');
      else if (selectedFlowerName.includes('Mẫu Đơn')) setFloralDeco('peony');
      else setFloralDeco('branch');
    }
  }, [selectedFlowerName]);

  // Sync selectedWish when user clicks "Gắn vào thiệp" from WishesVault
  useEffect(() => {
    if (selectedWish) {
      setCustomMessage(selectedWish.content);
      setPoeticVerse(selectedWish.verse || '');
      setFlowerAttribution(selectedWish.suggestedFlower);

      if (selectedWish.category === 'colleague') {
        setRecipientCategory('mentor');
        setRecipientName('Chị em đồng nghiệp');
        setSenderName('Chúng tôi');
      } else {
        setRecipientCategory(selectedWish.category);
        const defaultNames: Record<string, { recipient: string; sender: string }> = {
          mom: { recipient: 'Mẹ kính yêu', sender: 'Con của Mẹ' },
          lover: { recipient: 'Em yêu', sender: 'Anh' },
          sister: { recipient: 'Chị gái thân thương', sender: 'Em của chị' },
          mentor: { recipient: 'Cô giáo kính mến', sender: 'Học trò' },
        };
        if (defaultNames[selectedWish.category]) {
          setRecipientName(defaultNames[selectedWish.category].recipient);
          setSenderName(defaultNames[selectedWish.category].sender);
        }
      }

      if (selectedWish.suggestedFlower.includes('Hồng')) setFloralDeco('rose');
      else if (selectedWish.suggestedFlower.includes('Mẫu Đơn')) setFloralDeco('peony');
      else setFloralDeco('branch');
    }
  }, [selectedWish]);

  // Default content matching first preset
  const [customMessage, setCustomMessage] = useState<string>(
    PRESET_WISHES[0].content
  );
  const [poeticVerse, setPoeticVerse] = useState<string>(
    PRESET_WISHES[0].verse || ''
  );

  const handleCategoryChange = (cat: 'mom' | 'lover' | 'sister' | 'mentor') => {
    setRecipientCategory(cat);
    playPluckChime(523.25, 0.7, 0.04);

    const defaultNames = {
      mom: { recipient: 'Mẹ kính yêu', sender: 'Con của Mẹ', flower: 'Hoa Mẫu Đơn Bạch Ngọc', deco: 'peony' as FloralDecoType },
      lover: { recipient: 'Em yêu', sender: 'Anh', flower: 'Hoa Hồng Juliet Pastel', deco: 'rose' as FloralDecoType },
      sister: { recipient: 'Chị gái thân thương', sender: 'Em của chị', flower: 'Cẩm Tú Cầu Lam Ngọc', deco: 'branch' as FloralDecoType },
      mentor: { recipient: 'Cô giáo kính mến', sender: 'Học trò', flower: 'Sen Hồng Bách Diệp', deco: 'rose' as FloralDecoType },
    };

    setRecipientName(defaultNames[cat].recipient);
    setSenderName(defaultNames[cat].sender);
    setFlowerAttribution(defaultNames[cat].flower);
    setFloralDeco(defaultNames[cat].deco);

    const matchingWish = PRESET_WISHES.find((w) => w.recipientCategory === cat);
    if (matchingWish) {
      setCustomMessage(matchingWish.content);
      setPoeticVerse(matchingWish.verse || '');
    }
  };

  const handleCopy = () => {
    const fullText = `[Thiệp Chúc 20/10]\nThân gửi: ${recipientName}\n\n${customMessage}\n\n${
      poeticVerse ? `"${poeticVerse}"\n\n` : ''
    }Kèm đóa: ${flowerAttribution}\nKính chúc từ: ${senderName}`;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedToast(true);
      playAffirmationSound();
      setTimeout(() => setCopiedToast(false), 2500);
    });
  };

  // High-Resolution Image Export (for Desktop & Mobile download)
  const handleExportImage = async () => {
    if (!cardRef.current || isExporting) return;

    try {
      setIsExporting(true);
      playAffirmationSound();

      // Ensure fonts are fully loaded before rendering
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Small tick for layout stabilization
      await new Promise((resolve) => setTimeout(resolve, 80));

      // Render high-res PNG with embedded Google Fonts for 100% faithful typography
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        fontEmbedCSS: fontEmbedCSS || undefined,
        skipFonts: !fontEmbedCSS, // If fontEmbedCSS is ready, uses it without cross-origin error!
      });

      setExportedImageUrl(dataUrl);

      // Trigger instant automatic file download
      const link = document.createElement('a');
      link.download = `Thiep_20-10_${recipientName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();

      playAffirmationSound();
    } catch (error) {
      console.error('Failed to export card image with html-to-image:', error);
      // Fallback attempt with scale 2
      try {
        if (cardRef.current) {
          const fallbackUrl = await toPng(cardRef.current, { pixelRatio: 2, skipFonts: true });
          setExportedImageUrl(fallbackUrl);
        }
      } catch (err2) {
        console.error('Fallback export error:', err2);
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Native Mobile Web Share API support
  const handleNativeShare = async () => {
    if (!exportedImageUrl) return;

    try {
      const blob = await (await fetch(exportedImageUrl)).blob();
      const file = new File([blob], `Thiep_20-10_${recipientName}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Thiệp mừng 20/10 - Gửi ${recipientName}`,
          text: `Chúc mừng Ngày Phụ Nữ Việt Nam 20/10!`,
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `Thiệp mừng 20/10 - Gửi ${recipientName}`,
          text: `${customMessage}\n\nTừ: ${senderName}`,
        });
      }
    } catch (err) {
      console.debug('Share cancelled or not supported', err);
    }
  };

  const cardStyleConfig = {
    blush: {
      bg: 'bg-gradient-to-br from-[#FFF5F7] via-[#FDE8ED] to-[#F8D2DC]',
      border: 'border-[#F1B6C4]',
      innerBg: 'bg-white/85 shadow-sm',
      innerBorder: 'border-[#E2959D]/60',
      textMain: 'text-[#4A1D28]',
      textSub: 'text-[#702A3B]',
      accent: 'text-[#9F2D48]',
      sealBg: 'bg-gradient-to-tr from-[#9B223E] to-[#C43859] text-rose-100 shadow-rose-900/40',
      goldDecor: 'text-[#B8860B]',
      tag: 'Lụa Hồng Pastel',
    },
    champagne: {
      bg: 'bg-gradient-to-br from-[#FEFCF7] via-[#F8F2E2] to-[#EFE2C2]',
      border: 'border-[#DEC89B]',
      innerBg: 'bg-[#FFFFFC]/90 shadow-sm',
      innerBorder: 'border-[#C9AA6A]/60',
      textMain: 'text-[#3B2F1E]',
      textSub: 'text-[#5A4832]',
      accent: 'text-[#875C21]',
      sealBg: 'bg-gradient-to-tr from-[#8A5B20] to-[#B37E36] text-amber-100 shadow-amber-900/40',
      goldDecor: 'text-[#996515]',
      tag: 'Hoàng Kim Champagne',
    },
    pearl: {
      bg: 'bg-gradient-to-br from-[#FFFFFF] via-[#FAF9F7] to-[#EDE7DF]',
      border: 'border-[#D9D1C7]',
      innerBg: 'bg-white/95 shadow-sm',
      innerBorder: 'border-[#B8AEA2]/60',
      textMain: 'text-[#2B2326]',
      textSub: 'text-[#4F4448]',
      accent: 'text-[#6B555D]',
      sealBg: 'bg-gradient-to-tr from-[#3D3338] to-[#5C4F55] text-stone-100 shadow-stone-800/40',
      goldDecor: 'text-[#A07830]',
      tag: 'Bạch Ngọc Tinh Khôi',
    },
    velvet: {
      bg: 'bg-gradient-to-br from-[#25121B] via-[#1A0C13] to-[#10070B]',
      border: 'border-rose-400/50',
      innerBg: 'bg-[#1E0E16]/95 shadow-sm',
      innerBorder: 'border-rose-400/40',
      textMain: 'text-[#FFF0F4]',
      textSub: 'text-rose-200/90',
      accent: 'text-rose-300',
      sealBg: 'bg-gradient-to-tr from-[#8E1734] to-[#B92A4D] text-rose-100 ring-1 ring-rose-300/40 shadow-rose-950/60',
      goldDecor: 'text-amber-300',
      tag: 'Nhung Tím Huyền Ảo',
    },
  };

  const currentTheme = cardStyleConfig[cardStyle];

  return (
    <section
      id="thiep-chuc"
      className={`relative w-full py-20 px-6 lg:px-12 transition-colors duration-500 ${
        isDarkTheme ? 'bg-[#120A0E] text-stone-100' : 'bg-[#FAF5F3] text-[#2C2224]'
      }`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase mb-3 text-rose-500">
            <span>Bespoke Greeting Studio</span>
            <span aria-hidden="true">·</span>
            <span>Thiệp Chúc Tinh Tế</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Xưởng Thiết Kế Thiệp Chúc 20·10
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
            isDarkTheme ? 'text-stone-300' : 'text-stone-600'
          }`}>
            Tùy biến lời chúc chân thành, đính kèm hoa trang trí sang trọng và xuất ảnh thiệp độ nét cao gửi tặng qua điện thoại hoặc máy tính.
          </p>
        </div>

        {/* 2-Column Split: Controls Editor & Live Card Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Customization Controls (lg:col-span-5) */}
          <div className={`lg:col-span-5 rounded-2xl p-6 sm:p-8 border flex flex-col justify-between ${
            isDarkTheme
              ? 'bg-[#1A1116]/85 border-stone-800 shadow-xl'
              : 'bg-white border-rose-100 shadow-md'
          }`}>
            <div className="space-y-6">
              {/* Recipient Category Tabs */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5 text-rose-500">
                  1. Đối Tượng Nhận Thiệp
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'mom', label: 'Mẹ Yêu' },
                      { id: 'lover', label: 'Người Thương' },
                      { id: 'sister', label: 'Chị / Em' },
                      { id: 'mentor', label: 'Cô Giáo' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleCategoryChange(item.id)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all truncate ${
                        recipientCategory === item.id
                          ? isDarkTheme
                            ? 'bg-rose-400 text-stone-950 border-rose-400 font-semibold shadow-sm'
                            : 'bg-[#4A1D28] text-rose-50 border-[#4A1D28] shadow-sm'
                          : isDarkTheme
                          ? 'border-stone-800 text-stone-300 hover:border-stone-700'
                          : 'border-rose-100 text-stone-700 hover:border-rose-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Names Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5 opacity-80">
                    Gửi đến (Người nhận)
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="VD: Mẹ kính yêu..."
                    className={`w-full px-3.5 py-2.5 rounded-lg text-sm border focus:outline-none transition-colors ${
                      isDarkTheme
                        ? 'bg-stone-900/60 border-stone-800 text-white focus:border-rose-400'
                        : 'bg-rose-50/40 border-rose-200 text-stone-900 focus:border-rose-400'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 opacity-80">
                    Người gửi (Tên của bạn)
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="VD: Con của Mẹ..."
                    className={`w-full px-3.5 py-2.5 rounded-lg text-sm border focus:outline-none transition-colors ${
                      isDarkTheme
                        ? 'bg-stone-900/60 border-stone-800 text-white focus:border-rose-400'
                        : 'bg-rose-50/40 border-rose-200 text-stone-900 focus:border-rose-400'
                    }`}
                  />
                </div>
              </div>

              {/* Message Content */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-rose-500">
                    2. Lời Chúc Yêu Thương
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const pool = PRESET_WISHES.filter((w) => w.recipientCategory === recipientCategory);
                      const rand = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : PRESET_WISHES[0];
                      setCustomMessage(rand.content);
                      setPoeticVerse(rand.verse || '');
                      playPluckChime(659.25, 0.8, 0.04);
                    }}
                    className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-500 transition-colors"
                  >
                    <RotateCcw size={11} />
                    <span>Đổi mẫu khác</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Viết tâm tư chân thành của bạn tại đây..."
                  className={`w-full px-3.5 py-2.5 rounded-lg text-sm border leading-relaxed focus:outline-none transition-colors ${
                    isDarkTheme
                      ? 'bg-stone-900/60 border-stone-800 text-stone-100 focus:border-rose-400'
                      : 'bg-rose-50/40 border-rose-200 text-stone-900 focus:border-rose-400'
                  }`}
                />
              </div>

              {/* Poetic Verse / Couple Note */}
              <div>
                <label className="block text-xs font-medium mb-1.5 opacity-80 flex items-center gap-1.5">
                  <Feather size={12} className="text-rose-400" />
                  <span>Câu thơ gửi gắm</span>
                </label>
                <input
                  type="text"
                  value={poeticVerse}
                  onChange={(e) => setPoeticVerse(e.target.value)}
                  placeholder="VD: Đi khắp thế gian không ai tốt bằng Mẹ..."
                  className={`w-full px-3.5 py-2.5 rounded-lg text-sm border focus:outline-none transition-colors ${
                    isDarkTheme
                      ? 'bg-stone-900/60 border-stone-800 text-stone-100 focus:border-rose-400'
                      : 'bg-rose-50/40 border-rose-200 text-stone-900 focus:border-rose-400'
                  }`}
                />
              </div>

              {/* Flower Decoration Choice on Card */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-rose-500">
                  3. Hoa Trang Trí Đính Trên Thiệp
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'rose', label: '🌹 Đóa Hồng' },
                      { id: 'peony', label: '🌸 Mẫu Đơn' },
                      { id: 'branch', label: '🌿 Cành Đào' },
                      { id: 'duo', label: '💐 Cặp Đôi Hoa' },
                    ] as const
                  ).map((deco) => (
                    <button
                      key={deco.id}
                      type="button"
                      onClick={() => {
                        setFloralDeco(deco.id);
                        playPluckChime(587.33, 0.5, 0.04);
                      }}
                      className={`px-2 py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                        floralDeco === deco.id
                          ? 'border-rose-400 bg-rose-500/20 text-rose-500 font-bold ring-1 ring-rose-400'
                          : isDarkTheme
                          ? 'border-stone-800 text-stone-400 hover:text-white'
                          : 'border-rose-100 text-stone-600 hover:text-rose-900'
                      }`}
                    >
                      {deco.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Aesthetic Styling */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-rose-500">
                  4. Chất Liệu Giấy Thiệp
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['blush', 'champagne', 'pearl', 'velvet'] as CardStyleOption[]).map((styleKey) => (
                    <button
                      key={styleKey}
                      type="button"
                      onClick={() => {
                        setCardStyle(styleKey);
                        playPluckChime(587.33, 0.6, 0.04);
                      }}
                      className={`h-9 rounded-lg border text-[11px] font-medium transition-all ${
                        cardStyle === styleKey
                          ? 'ring-2 ring-rose-400 font-bold scale-[1.03] shadow-sm'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      title={cardStyleConfig[styleKey].tag}
                    >
                      {styleKey === 'blush'
                        ? '🌸 Lụa Hồng'
                        : styleKey === 'champagne'
                        ? '✨ Hoàng Kim'
                        : styleKey === 'pearl'
                        ? '🤍 Bạch Ngọc'
                        : '🖤 Nhung Tím'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wax Seal Monogram Select */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-rose-500">
                  5. Khắc Dấu Sáp Niêm Phong
                </label>
                <div className="flex gap-2">
                  {['20·10', 'Yêu Thương', 'Tri Ân', '♥ Hạnh Phúc'].map((mono) => (
                    <button
                      key={mono}
                      type="button"
                      onClick={() => {
                        setSealMonogram(mono);
                        setWaxSealActive(true);
                        playPluckChime(659.25, 0.4, 0.04);
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                        sealMonogram === mono && waxSealActive
                          ? 'border-rose-400 bg-rose-500/20 text-rose-400 font-bold'
                          : 'border-stone-700/40 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {mono}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Studio Action Buttons */}
            <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center gap-3 ${
              isDarkTheme ? 'border-stone-800' : 'border-rose-100'
            }">
              {/* PRIMARY EXPORT BUTTON: Downloads image to PC or Phone! */}
              <button
                type="button"
                onClick={handleExportImage}
                disabled={isExporting}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg shadow-rose-500/25 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {isExporting ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" />
                    <span>Đang Tạo Ảnh Siêu Nét...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon size={16} />
                    <span>Xuất Ảnh Thiệp (.PNG)</span>
                  </>
                )}
              </button>

              {/* Copy Text Button */}
              <button
                type="button"
                onClick={handleCopy}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase border transition-all ${
                  isDarkTheme
                    ? 'border-stone-700 bg-stone-800/80 text-stone-200 hover:bg-stone-700'
                    : 'border-rose-200 bg-white text-[#4A1D28] hover:bg-rose-50 shadow-sm'
                }`}
              >
                {copiedToast ? (
                  <>
                    <Check size={14} className="text-emerald-500" />
                    <span className="text-emerald-500">Đã chép!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Chép Chữ</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Live Luxury Card Canvas with Real Flowers Attached (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            
            {/* The Actual Printable DOM Card Element captured by html-to-image */}
            <div
              ref={cardRef}
              id="printable-card"
              className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-500 border ${currentTheme.bg} ${currentTheme.border}`}
            >
              {/* === FLOWERS IN DEEPEST LAYER (z-0) - Gracefully positioned in background === */}
              {floralDeco === 'rose' && (
                <div className="pointer-events-none absolute -top-4 -right-4 w-44 sm:w-52 aspect-square z-0 opacity-85 transition-all duration-500 drop-shadow-[0_8px_20px_rgba(244,114,182,0.25)]">
                  <img
                    src={roseCutout}
                    alt="Đóa hồng Juliet trên thiệp"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain rotate-12"
                  />
                </div>
              )}

              {floralDeco === 'peony' && (
                <div className="pointer-events-none absolute -top-4 -right-4 w-44 sm:w-56 aspect-square z-0 opacity-85 transition-all duration-500 drop-shadow-[0_8px_20px_rgba(251,191,36,0.2)]">
                  <img
                    src={peonyCutout}
                    alt="Đóa mẫu đơn vương giả trên thiệp"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain -rotate-6"
                  />
                </div>
              )}

              {floralDeco === 'branch' && (
                <div className="pointer-events-none absolute -top-3 -right-3 w-48 sm:w-60 aspect-square z-0 opacity-85 transition-all duration-500 drop-shadow-[0_8px_18px_rgba(244,114,182,0.2)]">
                  <img
                    src={branchCutout}
                    alt="Cành hoa đào thanh nhã trên thiệp"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain rotate-15"
                  />
                </div>
              )}

              {floralDeco === 'duo' && (
                <>
                  <div className="pointer-events-none absolute -top-4 -right-4 w-36 sm:w-44 aspect-square z-0 opacity-85 drop-shadow-[0_8px_20px_rgba(244,114,182,0.25)]">
                    <img
                      src={roseCutout}
                      alt="Đóa hồng trên thiệp"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rotate-12"
                    />
                  </div>
                  <div className="pointer-events-none absolute -bottom-4 -left-4 w-32 sm:w-40 aspect-square z-0 opacity-75 drop-shadow-[0_8px_20px_rgba(251,191,36,0.18)]">
                    <img
                      src={peonyCutout}
                      alt="Đóa mẫu đơn dưới góc thiệp"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rotate-45"
                    />
                  </div>
                </>
              )}

              {/* Vintage Corner Botanical Flourishes */}
              <div className={`absolute top-4 left-4 text-xl select-none opacity-40 z-10 ${currentTheme.goldDecor}`}>
                ❧
              </div>
              <div className={`absolute bottom-4 right-4 text-xl select-none opacity-40 z-10 ${currentTheme.goldDecor}`}>
                ☙
              </div>
              <div className={`absolute bottom-4 left-4 text-xl select-none opacity-40 z-10 ${currentTheme.goldDecor}`}>
                ❧
              </div>

              {/* Elegant Double Hairline Inner Border (z-10, uses currentTheme.innerBg strictly) */}
              <div className={`border ${currentTheme.innerBorder} rounded-2xl p-6 sm:p-8 relative z-10 ${currentTheme.innerBg} backdrop-blur-[1px]`}>
                {/* French Ornate Top Bar */}
                <div className="text-center mb-6 relative z-20">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className={`text-xs ${currentTheme.goldDecor}`}>✧</span>
                    <span className={`font-mono text-[10px] tracking-[0.25em] uppercase opacity-85 font-semibold ${currentTheme.textSub}`}>
                      20 · 10 · NGÀY PHỤ NỮ VIỆT NAM
                    </span>
                    <span className={`text-xs ${currentTheme.goldDecor}`}>✧</span>
                  </div>
                  <div className="w-16 h-[1px] mx-auto my-2.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                  
                  {/* Salutation */}
                  <h3 className={`font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight mt-3 ${currentTheme.textMain}`}>
                    Kính gửi {recipientName}
                  </h3>
                </div>

                {/* Main Body Message - Relative z-20 with high contrast */}
                <div className="mb-6 space-y-4 relative z-20">
                  <p className={`text-sm sm:text-base leading-relaxed text-justify font-serif-luxury break-words font-medium ${currentTheme.textMain}`}>
                    {customMessage}
                  </p>

                  {poeticVerse && (
                    <blockquote className={`border-t border-b border-[#D4AF37]/40 py-3 text-center italic text-xs sm:text-sm font-serif-luxury break-words ${currentTheme.accent}`}>
                      "{poeticVerse}"
                    </blockquote>
                  )}
                </div>

                {/* Flower Info & Sender Signature */}
                <div className="pt-4 flex items-end justify-between gap-4 border-t border-[#D4AF37]/35 text-xs relative z-20">
                  <div>
                    <span className={`text-[10px] uppercase tracking-wider block opacity-75 font-semibold ${currentTheme.textSub}`}>
                      Đóa hoa trao tặng
                    </span>
                    <span className={`font-serif-luxury font-semibold text-sm flex items-center gap-1.5 mt-0.5 ${currentTheme.accent}`}>
                      <Heart size={13} className="fill-current text-rose-500" />
                      <span>{flowerAttribution}</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] uppercase tracking-wider block opacity-75 font-semibold ${currentTheme.textSub}`}>
                      Trân trọng & Yêu thương,
                    </span>
                    <span className={`font-serif-luxury text-lg font-bold italic tracking-wide block mt-0.5 ${currentTheme.textMain}`}>
                      {senderName}
                    </span>
                  </div>
                </div>

                {/* Interactive Wax Seal Stamp (Nicely centered inside card bounds) */}
                {waxSealActive && (
                  <div className="flex justify-center mt-6 pt-3 border-t border-dashed border-[#D4AF37]/30 relative z-20">
                    <button
                      type="button"
                      onClick={() => {
                        setWaxSealActive(!waxSealActive);
                        playPluckChime(waxSealActive ? 392 : 587.33, 1, 0.05);
                      }}
                      title="Con dấu sáp vàng hoàng gia"
                      className={`h-12 w-12 rounded-full flex flex-col items-center justify-center font-serif-luxury font-bold text-xs shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                        currentTheme.sealBg
                      } ring-2 ring-amber-300/80`}
                    >
                      <span className="text-[10px] tracking-tight">{sealMonogram}</span>
                      <span className="text-[7px] tracking-widest uppercase opacity-85">VIỆT NAM</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Helper tips for Desktop & Mobile users */}
            <div className={`mt-8 text-xs font-light flex flex-wrap items-center justify-center gap-4 ${
              isDarkTheme ? 'text-stone-400' : 'text-stone-600'
            }`}>
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-rose-400" />
                <span>Nhấn <strong>"Xuất Ảnh Thiệp (.PNG)"</strong> để tải ảnh trực tiếp về máy tính hoặc điện thoại.</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Success & Mobile Share Modal */}
      {exportedImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg rounded-3xl bg-[#FAF6F4] dark:bg-[#1A1116] p-6 sm:p-8 text-[#2C2224] dark:text-stone-100 shadow-2xl border border-rose-200 dark:border-rose-900/50 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setExportedImageUrl(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:opacity-80 transition-opacity"
              aria-label="Đóng"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-2">
                <Check size={20} />
              </span>
              <h3 className="font-serif-luxury text-2xl font-bold">
                Đã Xuất Ảnh Thiệp Thành Công!
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Ảnh chất lượng cao đã được chuẩn bị sẵn sàng cho máy tính & điện thoại của bạn.
              </p>
            </div>

            {/* Generated Image Preview */}
            <div className="rounded-2xl overflow-hidden border border-rose-200 dark:border-stone-700 shadow-lg mb-6 bg-stone-100 dark:bg-stone-900">
              <img
                src={exportedImageUrl}
                alt="Thiệp 20/10 xuất ra"
                className="w-full h-auto object-contain max-h-[50vh] mx-auto"
              />
            </div>

            {/* Instructions for Phone & Computer */}
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-xs leading-relaxed text-stone-600 dark:text-stone-300 mb-6">
              💡 <strong>Dành cho điện thoại:</strong> Bạn có thể <em>nhấn giữ lên ảnh trên</em> rồi chọn <strong>"Lưu hình ảnh"</strong> hoặc <strong>"Chia sẻ"</strong> qua Zalo, Messenger, Facebook!
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={exportedImageUrl}
                download={`Thiep_20-10_${recipientName.replace(/\s+/g, '_')}.png`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-500 hover:bg-rose-600 text-white shadow-md transition-all"
              >
                <Download size={14} />
                <span>Tải Lại Ảnh (.PNG)</span>
              </a>

              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#4A1D28] dark:bg-rose-400 text-rose-50 dark:text-stone-950 shadow-md transition-all hover:opacity-90"
                >
                  <Share2 size={14} />
                  <span>Chia Sẻ Điện Thoại</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setExportedImageUrl(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
