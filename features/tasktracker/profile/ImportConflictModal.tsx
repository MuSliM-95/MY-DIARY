import { useAppDispatch } from "@/store/hooks";
import { importTracker } from "@/store/hooks/trackerSlice";
import { FileUp, CopyPlus, Save } from "lucide-react";
import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  theme: boolean;
  exportData: () => void;
};

export const ImportConflictModal: React.FC<Props> = ({
  open,
  onClose,
  theme,
  exportData,
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  const muted = theme ? "text-zinc-400" : "text-emerald-100/70";

  const card = theme
    ? "bg-[#171717]/95 border-[#2d2d2d] shadow-[0_10px_30px_rgba(245,158,11,0.25)]"
    : "bg-[#071a14]/95 border-[#15392c] shadow-[0_10px_30px_rgba(16,185,129,0.35)]";

  const surface = theme
    ? "bg-white/[0.03] border-white/10"
    : "bg-emerald-950/20 border-emerald-800/30";

  const importData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);

      const text = await file.text();
      const parsed = JSON.parse(text);

      const ok = window.confirm("Заменить текущие данные?");

      if (!ok) return;

      dispatch(importTracker(parsed));
	  toast.message("Данные добавлены");
      onClose();
    } catch {
      toast.error("Ошибка импорта файла");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      // dispatch(importMerge(parsed));
      onClose();
      toast.message("Данные объединены");
    } catch (error) {
      toast.error("Ошибка синхронизации данных");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />

      {/* GLOW */}
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
            "animate-in fade-in zoom-in-95 duration-300",
            card
          )}
        >
          {/* GLASS */}
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
                  import
                </p>

                <h2 className="mt-2 text-[30px] font-bold tracking-tight text-white">
                  Импорт данных
                </h2>
              </div>

              {/* ICON */}
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center",
                  "border shadow-lg",
                  theme
                    ? "bg-amber-500/10 border-amber-500/20"
                    : "bg-emerald-500/10 border-emerald-500/20"
                )}
              >
                <FileUp
                  size={24}
                  className={theme ? "text-amber-400" : "text-emerald-400"}
                />
              </div>
            </div>

            {/* CONTENT */}
            <div className="mt-6 space-y-4">
              {/* IMPORT */}
              <label
                className={cn(
                  "rounded-2xl border p-4 flex items-center gap-4 cursor-pointer transition",
                  "hover:scale-[1.01] active:scale-[0.99]",
                  surface
                )}
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-2xl flex items-center justify-center",
                    theme ? "bg-amber-500/10" : "bg-emerald-500/10"
                  )}
                >
                  <FileUp
                    size={20}
                    className={theme ? "text-amber-400" : "text-emerald-400"}
                  />
                </div>

                <div className="flex-1">
                  <p className="text-white text-sm font-medium">
                    {loading ? "Импорт..." : "Загрузить JSON"}
                  </p>

                  <p className={cn("text-xs mt-1", muted)}>
                    заменить текущие данные
                  </p>
                </div>

                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  disabled={loading}
                  onChange={importData}
                />
              </label>

              {/* MERGE */}
              <div
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition",
                  "hover:scale-[1.01] active:scale-[0.99]",
                  surface
                )}
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-2xl flex items-center justify-center",
                    theme ? "bg-amber-500/10" : "bg-emerald-500/10"
                  )}
                >
                  <CopyPlus
                    size={20}
                    className={theme ? "text-amber-400" : "text-emerald-400"}
                  />
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="text-left">
                  <p className="text-white text-sm font-medium">Объединить</p>
                  <p className={cn("text-xs mt-1", muted)}>
                    сохранить старые данные
                  </p>
                </div>
              </div>

              {/* BACKUP */}
              <button
                onClick={() => {
                  exportData();
                  onClose();
                }}
                className={cn(
                  "w-full rounded-2xl border p-4 flex items-center gap-4 transition",
                  "hover:scale-[1.01] active:scale-[0.99]",
                  surface
                )}
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-2xl flex items-center justify-center",
                    theme ? "bg-amber-500/10" : "bg-emerald-500/10"
                  )}
                >
                  <Save
                    size={20}
                    className={theme ? "text-amber-400" : "text-emerald-400"}
                  />
                </div>

                <div className="text-left">
                  <p className="text-white text-sm font-medium">Backup</p>

                  <p className={cn("text-xs mt-1", muted)}>
                    создать резервную копию
                  </p>
                </div>
              </button>
            </div>

            {/* FOOTER */}
            <div className="mt-7">
              <button
                onClick={onClose}
                className={cn(
                  "w-full py-3 rounded-2xl border font-medium transition",
                  "hover:scale-[1.01] active:scale-[0.98]",
                  theme
                    ? "border-white/10 hover:bg-white/5"
                    : "border-emerald-800/40 hover:bg-emerald-900/20"
                )}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
