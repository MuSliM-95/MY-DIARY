import React from "react";

type MetricCardProps = {
  title: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  min = 0,
  max = 120,
  step = 5,
  unit = "мин",
  onChange,
}) => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f3d2e, #0a2a20)",
        padding: "24px",
        borderRadius: "20px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <span
          style={{
            color: "#9aa6a0",
            fontSize: "14px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {title}
        </span>

        <span
          style={{
            color: "#ff9f1c",
            fontSize: "20px",
            fontWeight: 700,
          }}
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
        style={{
          width: "100%",
          accentColor: "#ff9f1c",
          cursor: "pointer",
        }}
      />
    </div>
  );
};
