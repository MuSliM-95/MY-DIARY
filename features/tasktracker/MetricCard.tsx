'use client';

import React from 'react';

type MetricCardProps = {
  title: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  isDarkTheme: boolean;
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  min = 0,
  max = 120,
  step = 5,
  unit = 'мин',
  onChange,
  isDarkTheme,
}) => {
  const accentColor = isDarkTheme ? 'amber' : 'emerald';
  const accentHex = isDarkTheme ? '#f59e0b' : '#10b981';

  return (
    <div
      className={`${isDarkTheme ? 'bg-[#1a1a1a]' : 'bg-[#0b1f17]'} border ${isDarkTheme ? 'border-[#2d2d2d]' : 'border-[#123d2c]'} p-6 rounded-2xl w-full`}
    >
      <div className="flex justify-between items-center mb-5">
        <span
          className={`${isDarkTheme ? 'text-amber-300/60' : 'text-emerald-200/60'} text-[14px] uppercase tracking-widest font-semibold`}
        >
          {title}
        </span>

        <span
          className={`text-${accentColor}-500 text-[20px] font-bold`}
        >
          {value} {unit}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
        style={{
          accentColor: accentHex
        }}
      />
    </div>
  );
};
