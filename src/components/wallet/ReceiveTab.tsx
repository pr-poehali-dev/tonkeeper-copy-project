import { useState } from "react";
import Icon from "@/components/ui/icon";

const address = "UQBvZ3kF2mXp9R7tN4sW1cL8dE6jH0aK5fM2nQ3bY7vC";
const shortAddress = "UQBv...7vC";

export default function ReceiveTab() {
  const [copied, setCopied] = useState(false);
  const [token, setToken] = useState("TON");

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <h2 className="text-lg font-bold text-white">Получить</h2>

      {/* Token selector */}
      <div className="flex gap-2">
        {["TON", "USDT", "NOT", "STON"].map((t) => (
          <button
            key={t}
            onClick={() => setToken(t)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={token === t
              ? { background: "rgba(0,212,255,0.2)", border: "1px solid rgba(0,212,255,0.4)", color: "#00D4FF" }
              : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* QR Code area */}
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="relative p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          {/* Fake QR Grid */}
          <div className="w-44 h-44 relative" style={{ imageRendering: "pixelated" }}>
            <div className="absolute inset-0 grid grid-cols-11 grid-rows-11 gap-0.5 p-2">
              {Array.from({ length: 121 }).map((_, i) => {
                const corners = [0,1,2,3,4,5,6,7,14,21,28,35,42,11,18,25,32,39,46,
                  55,56,57,58,59,60,61,62,63,66,70,74,78,82,
                  90,97,104,111,118,91,92,93,94,95,96,
                  77,84,100,107,114,120,115,110,109,108];
                const isDark = corners.includes(i) || (Math.sin(i * 2.3) > 0.3);
                return (
                  <div key={i} className="w-full h-full rounded-sm" style={{ background: isDark ? "rgba(0,212,255,0.9)" : "transparent" }} />
                );
              })}
            </div>
            {/* Center logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#0A0A14", border: "2px solid rgba(0,212,255,0.4)" }}>
                <span className="text-lg font-black" style={{ color: "#00D4FF" }}>T</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>TON адрес · {token}</div>
          <div className="font-mono-wallet text-sm" style={{ color: "#00D4FF" }}>{shortAddress}</div>
        </div>
      </div>

      {/* Address block */}
      <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="text-xs mb-2 font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Полный адрес</div>
        <div className="font-mono-wallet text-xs break-all leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{address}</div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all"
          style={copied
            ? { background: "rgba(0,255,148,0.15)", border: "1px solid rgba(0,255,148,0.3)", color: "#00FF94" }
            : { background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.2)", color: "#00D4FF" }
          }
        >
          <Icon name={copied ? "Check" : "Copy"} size={16} />
          {copied ? "Скопировано!" : "Копировать адрес"}
        </button>
        <button
          className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm btn-secondary"
        >
          <Icon name="Share2" size={16} />
          Поделиться
        </button>
      </div>

      {/* Warning */}
      <div className="p-4 rounded-xl flex gap-3" style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.12)" }}>
        <Icon name="AlertTriangle" size={15} style={{ color: "#FFC107", flexShrink: 0, marginTop: 1 }} />
        <span className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          Отправляйте только <strong style={{ color: "#FFC107" }}>{token}</strong> и совместимые токены TON на этот адрес. Другие активы будут безвозвратно утеряны.
        </span>
      </div>
    </div>
  );
}
