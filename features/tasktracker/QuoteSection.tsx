'use client';

import React from 'react';
import { View } from './types/types';

interface QuoteSectionProps {
  dayNumber: number;
  setView: React.Dispatch<React.SetStateAction<View>>
}

const QuoteSection: React.FC<QuoteSectionProps> = ({ dayNumber, setView }) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Верхняя плашка с номером дня */}
      <div className="bg-[#0d1a14] border border-white/5 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
        <button onClick={() => setView('BOARD')} className="text-gray-500 cursor-pointer hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <span className="text-[#f4a01c] font-black uppercase text-[12px] tracking-[0.2em] absolute left-1/2 -translate-x-1/2">
          День {dayNumber}
        </span>
        <div className="w-5" /> {/* Распорка для центровки */}
      </div>

      {/* Основной блок с цитатой */}
      <div className="bg-[#0d1a14] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden flex items-start gap-5 shadow-2xl">
        {/* Оранжевая линия слева */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-[#f4a01c] rounded-r-full" />
        
        <div className="space-y-4 relative z-10">
          <p className="text-gray-200 italic text-[15px] leading-relaxed font-medium">
            «О те, которые уверовали! Вам предписан пост...»
          </p>
          <div className="flex items-center gap-2">
             <div className="w-4 h-[2px] bg-[#f4a01c] opacity-60" />
             <span className="text-[#f4a01c] text-[10px] font-black uppercase tracking-[0.2em]">
               Коран 2:183
             </span>
          </div>
        </div>

        {/* Фоновая иконка книги (водяной знак) */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 text-[#f4a01c] rotate-12">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        </div>
      </div>
    </div>
  );
};

export default QuoteSection;
