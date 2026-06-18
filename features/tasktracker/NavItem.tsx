import React from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isDarkTheme: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  active, 
  onClick, 
  isDarkTheme 
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 transition-all ${
      active 
        ? `${isDarkTheme ? 'text-amber-400' : 'text-emerald-400'} scale-105` 
        : `${isDarkTheme ? 'text-gray-500' : 'text-emerald-200/40'} ${isDarkTheme ? 'hover:text-amber-400' : 'hover:text-emerald-400'}`
    }`}
  >
    {icon}
    <span className="text-[8px] uppercase font-black tracking-widest">
      {label}
    </span>
  </button>
);

export default NavItem;
