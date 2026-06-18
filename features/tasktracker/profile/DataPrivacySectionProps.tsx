"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { resetTracker } from "@/store/hooks/trackerSlice";

interface DataPrivacySectionProps {
  theme: boolean;
}

export function DataPrivacySection({ theme }: DataPrivacySectionProps) {
  const dispatch = useAppDispatch();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const muted = theme ? "text-zinc-400" : "text-emerald-100/70";

  const card = theme
    ? "bg-[#1a1a1a] border-[#2d2d2d]"
    : "bg-[#0b1f17] border-[#123d2c]";

  const accent = theme ? "text-amber-600" : "text-emerald-500";

  const clearHistory = async () => {
    try {
      dispatch(resetTracker());
      toast.message("История очищено");
    } catch (e) {
      toast.error("Ошибка при удалении данных");
    }
  };

  return (
    <>
      {/* SECTION */}
      <div className={cn("rounded-3xl border p-5", card)}>
        <p className={cn("text-xs tracking-[0.3em] uppercase", accent)}>
          данные и приватность
        </p>

        <p className={cn("text-sm mt-3 leading-relaxed", muted)}>
          Все данные хранятся локально в браузере. Рекомендуем регулярно
          скачивать резервную копию.
        </p>

        {/* WARNING */}
        <button
          onClick={() => setShowWarningModal(true)}
          className={cn(
            "mt-4 w-full py-3 rounded-2xl border text-sm transition",
            theme
              ? "border-white/10 hover:bg-white/5"
              : "border-[#184734] hover:bg-[#123324]"
          )}
        >
          ⚠ Показать предупреждение
        </button>

        {/* DELETE */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className={cn(
            "mt-3 w-full py-3 rounded-2xl border transition",
            theme
              ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
              : "border-red-800/40 text-red-500 hover:bg-red-500/10"
          )}
        >
          Очистить всю историю
        </button>
      </div>

      {/* WARNING MODAL */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />

          {/* AMBIENT GLOW */}
          <div
            className={cn(
              "absolute top-[-120px] left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full blur-3xl opacity-20",
              theme ? "bg-amber-500" : "bg-emerald-500"
            )}
          />

          {/* MODAL */}
          <div className="relative flex min-h-screen items-center justify-center p-4">
            <div
              className={cn(
                "relative w-full max-w-md overflow-hidden rounded-[36px] border",
                "shadow-[0_20px_80px_rgba(0,0,0,0.45)]",
                "animate-in fade-in zoom-in-95 duration-300",
                theme
                  ? "bg-[#171717]/95 border-[#2d2d2d]"
                  : "bg-[#071a14]/95 border-[#15392c]"
              )}
            >
              {/* NOISE / GLASS */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />

              {/* TOP LINE */}
              <div
                className={cn(
                  "absolute top-0 inset-x-0 h-[2px]",
                  theme
                    ? "bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                    : "bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                )}
              />

              <div className="relative p-6">
                {/* HEADER */}
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className={cn(
                        "text-[11px] uppercase tracking-[0.35em]",
                        theme ? "text-amber-500" : "text-emerald-400"
                      )}
                    >
                      local storage
                    </p>

                    <h2 className="mt-2 text-[28px] font-bold tracking-tight text-white">
                      Важно
                    </h2>
                  </div>

                  {/* ICON */}
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl",
                      "border shadow-lg",
                      theme
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    )}
                  >
                    ⚠
                  </div>
                </div>

                {/* CONTENT */}
                <div className="mt-6 space-y-4">
                  <div
                    className={cn(
                      "rounded-2xl border p-4",
                      theme
                        ? "bg-white/[0.03] border-white/10"
                        : "bg-emerald-950/20 border-emerald-800/30"
                    )}
                  >
                    <p className="text-sm leading-relaxed text-white/80">
                      Все данные сохраняются только локально на вашем
                      устройстве.
                    </p>
                  </div>

                  <div
                    className={cn(
                      "rounded-2xl border p-4",
                      theme
                        ? "bg-red-500/[0.04] border-red-500/10"
                        : "bg-red-950/20 border-red-800/20"
                    )}
                  >
                    <p className="text-sm leading-relaxed text-white/70">
                      Если очистить браузер, удалить сайт или сменить устройство
                      — данные могут быть потеряны.
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-white/60">
                    Перед очисткой рекомендуется скачать резервную копию JSON.
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="grid grid-cols-2 gap-3 mt-7">
                  <button
                    onClick={() => setShowWarningModal(false)}
                    className={cn(
                      "py-3 rounded-2xl border font-medium transition",
                      "hover:scale-[1.01] active:scale-[0.98]",
                      theme
                        ? "border-white/10 hover:bg-white/5"
                        : "border-emerald-800/40 hover:bg-emerald-900/20"
                    )}
                  >
                    Закрыть
                  </button>

                  <button
                    onClick={() => {
                      // exportData();
                      setShowWarningModal(false);
                    }}
                    className={cn(
                      "py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-black transition",
                      "hover:scale-[1.01] active:scale-[0.98]",
                      "shadow-lg",
                      theme
                        ? "bg-amber-600 hover:bg-amber-500 shadow-amber-900/30"
                        : "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-900/30"
                    )}
                  >
                    <FileDown /> <p>Backup</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div
            className={cn(
              "w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-2xl",
              "p-6 animate-in fade-in slide-in-from-bottom-6 duration-200"
            )}
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="mt-1 h-10 w-10 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <span className="text-red-400 text-lg">⚠</span>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-red-400">
                  Удалить все данные?
                </h2>
                <p className={cn("mt-1 text-sm leading-relaxed", muted)}>
                  Это действие затронет все ваши данные в приложении
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-4">
              <p className={cn("text-sm", muted)}>Будут удалены:</p>

              <ul className={cn("mt-3 space-y-2 text-sm", muted)}>
                <li className="flex items-center gap-2">• привычки</li>
                <li className="flex items-center gap-2">• задания</li>
                <li className="flex items-center gap-2">• статистика</li>
                <li className="flex items-center gap-2">
                  • история активности
                </li>
              </ul>

              <p className="mt-4 text-sm text-red-400 font-medium">
                Это действие нельзя отменить.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={cn(
                  "py-3 rounded-2xl border border-white/10 bg-white/5",
                  "hover:bg-white/10 transition active:scale-[0.98]"
                )}
              >
                Отмена
              </button>

              <button
                onClick={() => {
                  clearHistory();
                  setShowDeleteModal(false);
                }}
                className="py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium
                   hover:from-red-400 hover:to-red-500 transition active:scale-[0.98]
                   shadow-lg shadow-red-500/20"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
