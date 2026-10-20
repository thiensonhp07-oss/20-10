import React from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  isDarkTheme: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDarkTheme }) => {
  return (
    <footer
      className={`w-full py-12 px-6 lg:px-12 border-t transition-colors duration-500 ${
        isDarkTheme
          ? 'bg-[#10070B] border-stone-800 text-stone-400'
          : 'bg-[#FAF4F2] border-rose-100 text-stone-600'
      }`}
    >
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <a
            href="#"
            className={`font-serif-luxury text-2xl font-bold tracking-tight block mb-1 ${
              isDarkTheme ? 'text-rose-200' : 'text-[#4A1D28]'
            }`}
          >
            Élégance 20·10
          </a>
          <p className="text-xs font-light">
            Tôn vinh vẻ đẹp, sự dịu dàng và bản lĩnh người Phụ nữ Việt Nam.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium">
          <a href="#ton-vinh" className="hover:text-rose-500 transition-colors">
            Tôn Vinh
          </a>
          <a href="#vuon-hoa" className="hover:text-rose-500 transition-colors">
            Vườn Hoa
          </a>
          <a href="#thiep-chuc" className="hover:text-rose-500 transition-colors">
            Thiệp Chúc
          </a>
          <a href="#kho-cau-chuc" className="hover:text-rose-500 transition-colors">
            Kho Lời Chúc
          </a>
        </div>

        <div className="text-center md:text-right text-xs opacity-75 flex items-center gap-1 justify-center md:justify-end">
          <span>Gửi trọn yêu thương</span>
          <Heart size={12} className="text-rose-400 fill-current" />
          <span>20·10</span>
        </div>
      </div>
    </footer>
  );
};
