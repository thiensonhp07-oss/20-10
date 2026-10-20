/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { PetalCanvas } from './components/PetalCanvas.tsx';
import { HeroConstellation } from './components/HeroConstellation.tsx';
import { MotionStudio } from './components/MotionStudio.tsx';
import { CardStudio } from './components/CardStudio.tsx';
import { WishesVault } from './components/WishesVault.tsx';
import { Footer } from './components/Footer.tsx';
import { FloralDetailModal } from './components/FloralDetailModal.tsx';
import { FlowerItem, FloralNode, WishItem } from './types.ts';
import { toggleAmbientSoundtrack, playAffirmationSound } from './utils/soundEffects.ts';

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [selectedFlowerForCard, setSelectedFlowerForCard] = useState<string>('Hoa Hồng Juliet Pastel');
  const [selectedWishForCard, setSelectedWishForCard] = useState<WishItem | null>(null);
  const [inspectedItem, setInspectedItem] = useState<FlowerItem | FloralNode | null>(null);

  const handleToggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  const handleToggleMusic = () => {
    toggleAmbientSoundtrack((state) => {
      setIsPlayingMusic(state);
    });
  };

  const handleApplyWishToCard = (wish: WishItem) => {
    setSelectedWishForCard(wish);
    setSelectedFlowerForCard(wish.suggestedFlower);
    const element = document.getElementById('thiep-chuc');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectNode = (node: FloralNode) => {
    setInspectedItem(node);
  };

  const handleOpenCardStudio = () => {
    const element = document.getElementById('thiep-chuc');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenMotionStudio = () => {
    const element = document.getElementById('hoat-anh');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen w-full relative selection:bg-rose-200 selection:text-[#4A1D28] ${
      isDarkTheme ? 'dark bg-[#120B0F]' : 'bg-[#FAF6F4]'
    }`}>
      {/* Floating Gentle Blossom Petals Canvas */}
      <PetalCanvas isActive={true} />

      {/* Top Navigation Bar */}
      <Navbar
        isDarkTheme={isDarkTheme}
        onToggleTheme={handleToggleTheme}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
        onOpenCardStudio={handleOpenCardStudio}
      />

      <main className="relative">
        {/* Hero Section inspired by user reference image */}
        <HeroConstellation
          isDarkTheme={isDarkTheme}
          onSelectNode={handleSelectNode}
          onExploreFlowers={handleOpenMotionStudio}
          onOpenCardStudio={handleOpenCardStudio}
          isPlayingMusic={isPlayingMusic}
          onToggleMusic={handleToggleMusic}
        />

        {/* 20/10 Animated Motion Video Studio with Names & Templates */}
        <MotionStudio
          isDarkTheme={isDarkTheme}
          onOpenCardStudio={handleOpenCardStudio}
        />

        {/* Interactive Greeting Card Studio */}
        <CardStudio
          isDarkTheme={isDarkTheme}
          selectedFlowerName={selectedFlowerForCard}
          selectedWish={selectedWishForCard}
        />

        {/* Comprehensive Sweet Wishes Vault for all recipients */}
        <WishesVault
          isDarkTheme={isDarkTheme}
          onApplyWishToCard={handleApplyWishToCard}
        />
      </main>

      {/* Quiet Footer */}
      <Footer isDarkTheme={isDarkTheme} />

      {/* Inspection Modal for Constellation Nodes & Flowers */}
      <FloralDetailModal
        item={inspectedItem}
        onClose={() => setInspectedItem(null)}
        onSelectForCard={(name) => {
          setSelectedFlowerForCard(name);
          playAffirmationSound();
          handleOpenCardStudio();
        }}
      />
    </div>
  );
}
