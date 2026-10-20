export interface FloralNode {
  id: string;
  title: string;
  subValue: string;
  flowerName: string;
  meaning: string;
  poem: string;
  position: { x: number; y: number }; // Percentage 0-100
  imagePath: string;
  colorTone: string;
}

export interface FlowerItem {
  id: string;
  name: string;
  botanicalName: string;
  category: 'mom' | 'lover' | 'sister' | 'mentor' | 'all';
  categoryLabel: string;
  symbolism: string;
  palette: string;
  hexCode: string;
  poemQuote: string;
  description: string;
  image: string;
  badge: string;
}

export interface PresetWish {
  id: string;
  recipientCategory: 'mom' | 'lover' | 'sister' | 'mentor';
  recipientLabel: string;
  title: string;
  content: string;
  verse?: string;
}

export type WishCategory = 'all' | 'mom' | 'lover' | 'sister' | 'mentor' | 'colleague';

export interface WishItem {
  id: string;
  category: 'mom' | 'lover' | 'sister' | 'mentor' | 'colleague';
  categoryLabel: string;
  tag: string;
  title: string;
  content: string;
  verse?: string;
  tone: string;
  suggestedFlower: string;
}

export type ThemeStyle = 'blush' | 'velvet-noir' | 'champagne';

export type MotionTemplateId =
  | 'mom-child'
  | 'couple-romance'
  | 'teacher-student'
  | 'sisters-bff'
  | 'rose-cascade'
  | 'royal-envelope';

export interface MotionTemplate {
  id: MotionTemplateId;
  name: string;
  subtitle: string;
  storyTitle: string;
  themeColor: string;
  badge: string;
  icon: string;
  accentHex: string;
  desc: string;
  imageSrc: string;
  defaultRecipient: string;
  defaultSender: string;
  defaultMessage: string;
  storyNarrative: string;
}
