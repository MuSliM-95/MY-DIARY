import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  val: string;
  label: string;
  isDarkTheme: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, val, label, isDarkTheme }) => (
  <div className={`${isDarkTheme ? 'bg-[#1a1a1a]' : 'bg-[#0b1f17]'} border ${isDarkTheme ? 'border-[#2d2d2d]' : 'border-[#123d2c]'} p-6 rounded-[2.5rem] flex flex-col items-center`}>
    <div className="mb-1">{icon}</div>
    <span className="text-2xl font-black italic">{val}</span>
    <span className={`text-[9px] ${isDarkTheme ? 'text-amber-300/60' : 'text-emerald-200/60'} uppercase tracking-widest font-black`}>
      {label}
    </span>
  </div>
);

export default StatCard;
