"use client";

import { motion } from "framer-motion";
import { ChevronRight, ExternalLink, Heart, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  theme: boolean;
};

export const PartnersSection = ({ theme }: Props) => {
  const pageBg = theme ? "bg-[#0b0c10]" : "bg-[#06130f]";

  const card = theme
    ? "bg-[#171717]/95 border-[#2d2d2d]"
    : "bg-[#071a14]/95 border-[#15392c]";

  const title = theme ? "text-white" : "text-emerald-50";

  const muted = theme ? "text-zinc-400" : "text-emerald-100/70";

  const accent = theme
    ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";

  const services = [
    {
      id: 1,
      title: "Halal Tools: скачать видео, аудио",
      description: "Программа, которая скачивает видео, убирает музыку и мат, переводит аудио в текст, делает MP3 и кружочки и т. д.",
      image: "/photo_2025-12-21_15-13-22.jpg",
      href: "https://t.me/HalalToolsBot?start=ref_ZVY1dQzRMPTJ",
    }
  ];

  return (
    <div className={cn("min-h-screen px-4 py-6", pageBg)}>
      <div className="mx-auto max-w-3xl">
        <motion.a
          href={process.env.NEXT_PUBLIC_CLOUD_TIPS}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "group mb-6 block overflow-hidden rounded-3xl border transition-all duration-300",
            card
          )}
        >
          <div
            className={cn(
              "relative h-44 overflow-hidden",
              theme
                ? "bg-gradient-to-br from-amber-500/20 via-[#171717] to-[#171717]"
                : "bg-gradient-to-br from-emerald-500/20 via-[#071a14] to-[#071a14]"
            )}
          >
            <Heart
              size={130}
              className={cn(
                "absolute -right-8 -top-8 opacity-10",
                theme ? "text-amber-300" : "text-emerald-300"
              )}
            />

            <div className="absolute inset-0 flex items-end justify-between p-6">
              <div>
                <h1 className={cn("text-3xl font-bold", title)}>
                  Поддержать проект
                </h1>

                <p className={cn("mt-2 text-sm", muted)}>
                  Помогите развитию приложения
                </p>
              </div>

              <ChevronRight
                className={cn(
                  muted,
                  "transition-transform group-hover:translate-x-1"
                )}
              />
            </div>
          </div>
        </motion.a>

        <motion.a
          href={process.env.NEXT_PUBLIC_TELEGRAM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "group flex items-center justify-between rounded-3xl border p-5 transition-all duration-300",
            card
          )}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl border",
                accent
              )}
            >
              <Send size={18} />
            </div>

            <div>
              <div className={cn("font-semibold", title)}>Telegram</div>

              <div className={cn("text-sm", muted)}>Новости проекта</div>
            </div>
          </div>

          <ChevronRight
            className={cn(
              muted,
              "transition-transform group-hover:translate-x-1"
            )}
          />
        </motion.a>

        <div className="mt-10 mb-5">
          <h2 className={cn("text-xl font-semibold", title)}>
            Полезные сервисы
          </h2>
          <span>Реклама</span>
        </div>

        <div className="space-y-5">
          {services.map((item) => (
            <motion.a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "group block overflow-hidden rounded-3xl border transition-all duration-300",
                card
              )}
            >
              <div className="relative aspect-[16/7] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              <div className="flex items-center justify-between p-5">
                <div>
                  <div className={cn("font-semibold", title)}>{item.title}</div>

                  <div className={cn("mt-1 text-sm", muted)}>
                    {item.description}
                  </div>
                </div>

                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-105",
                    accent
                  )}
                >
                  <ExternalLink size={18} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};
