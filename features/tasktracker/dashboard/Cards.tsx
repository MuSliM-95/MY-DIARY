import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import { motion } from "framer-motion";
import { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExportBlockKey } from "../types/dashboard.type";

interface Props {
  className?: string;
  card: string;
  muted: string;
  muted2: string;
  titleText: string;
  accentSoft: string;
  exportConfig: Record<ExportBlockKey, boolean>;
  cards: {
    title: string;
    value: number;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    color: string;
    desc: string;
  }[];
}

export const Cards: React.FC<Props> = ({
  className,
  card,
  muted,
  muted2,
  titleText,
  accentSoft,
  exportConfig,
  cards,
}) => {
  return (
    <>
      {exportConfig.cards && (
        <div className="grid grid-cols-2 gap-3">
          {cards.map((cardItem, i) => {
            const Icon = cardItem.icon;

            return (
              <motion.div
                key={cardItem.title}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: i * 0.05,
                }}
                whileHover={{
                  y: -2,
                }}
                className={cn(
                  "rounded-[28px] border p-4 relative overflow-hidden",
                  card
                )}
              >
                <div
                  className={cn(
                    "absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-10",
                    cardItem.color.replace("text-", "bg-")
                  )}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn("text-xs truncate flex-1", muted)}>
                      {cardItem.title}
                    </span>

                    <div
                      className={cn(
                        "w-8 h-8 rounded-2xl flex items-center justify-center",
                        accentSoft
                      )}
                    >
                      <Icon size={16} className={cardItem.color} />
                    </div>
                  </div>

                  <div
                    className={cn(
                      "text-3xl font-bold tracking-tight",
                      titleText
                    )}
                  >
                    {cardItem.value}
                  </div>

                  <div
                    className={cn("text-[10px] mt-2 leading-relaxed", muted2)}
                  >
                    {cardItem.desc}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
};
