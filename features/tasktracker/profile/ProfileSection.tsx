"use client";

import { cn } from "@/lib/utils";
import { InstallGuide } from "./InstallGuide";
import { DataPrivacySection } from "./DataPrivacySectionProps";
import { FileDown, FileUp } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { ImportConflictModal } from "./ImportConflictModal";
import { useState } from "react";

interface ProfileSectionProps {
  theme: boolean;
}

export function ProfileSection({ theme }: ProfileSectionProps) {
  const text = "text-white";
  const muted = "text-white/60";

  const [open, setOpen] = useState(false);


  const tracker = useAppSelector((state) => state.tracker);

  const exportData = () => {
    const dataStr = JSON.stringify(tracker, null, 2);

    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };



  return (
    <div className={cn(`min-h-screen px-4 py-8 ${text}`)}>
      <div className="max-w-md mx-auto space-y-6">
        {/* INSTALL APP */}
        <InstallGuide theme={theme} />

        {/* BACKUP */}
        <div
          className={cn(
            `rounded-3xl p-5`,
            `${theme ? "bg-[#1a1a1a]" : "bg-[#0b1f17]"} border ${
              theme ? "border-[#2d2d2d]" : "border-[#123d2c]"
            }`
          )}
        >
          <p
            className={cn(
              "text-xs tracking-[0.3em] uppercase text-amber-400",
              theme ? "text-amber-600" : "text-emerald-500"
            )}
          >
            резервная копия
          </p>

          <h2 className="mt-2 text-lg font-semibold">Backup данных</h2>

          <p className={`text-sm mt-2 ${muted}`}>
            Сохраните прогресс в файл, чтобы не потерять данные. Восстановите из
            файла на любом устройстве.
          </p>

          <div className="space-y-3 mt-5">
            <button
              onClick={exportData}
              className={`${`cursor-pointer w-full py-4 ${
                theme
                  ? "bg-amber-600 hover:bg-amber-500"
                  : "bg-emerald-500 hover:bg-emerald-400"
              } ${
                theme ? "text-white" : "text-black"
              } font-black rounded-2xl flex items-center justify-center gap-2 uppercase text-sm tracking-widest active:scale-95 transition-all ${
                theme
                  ? "shadow-[0_10px_30px_rgba(245,158,11,0.25)]"
                  : "shadow-[0_10px_30px_rgba(16,185,129,0.35)]"
              }`}`}
            >
              <FileDown /> Скачать бэкап (JSON)
            </button>

            <label className="w-full py-3 flex justify-center gap-4 rounded-2xl border  border-white/10 text-center cursor-pointer hover:bg-white/5 transition">
              <FileUp /> Загрузить бэкап (JSON)
              <input
                // type="file"
                // accept="application/json"
                className="hidden"
                onClick={() => setOpen(true)}
                // onChange={}
              />
            </label>
          </div>
        </div>
        <ImportConflictModal
          open={open}
          theme={theme}
          onClose={() => setOpen(false)}
          exportData={exportData}
        />

        {/* DATA & PRIVACY */}
        <DataPrivacySection theme={theme} />
      </div>
    </div>
  );
}
