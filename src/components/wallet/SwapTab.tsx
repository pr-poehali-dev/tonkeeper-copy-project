import { useState } from "react";
import Icon from "@/components/ui/icon";

const tokens = ["TON", "USDT", "NOT", "STON", "USDC"];

export default function SwapTab() {
  const [from, setFrom] = useState("TON");
  const [to, setTo] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [swapping, setSwapping] = useState(false);
  const [done, setDone] = useState(false);

  const rate = from === "TON" && to === "USDT" ? 5.0 : from === "USDT" && to === "TON" ? 0.2 : 1.2;
  const received = amount ? (parseFloat(amount) * rate).toFixed(2) : "0.00";

  const handleSwap = () => {
    setSwapping(true);
    setTimeout(() => { setSwapping(false); setDone(true); setTimeout(() => setDone(false), 3000); }, 2000);
  };

  const flip = () => { setFrom(to); setTo(from); };

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Swap</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Icon name="Settings2" size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Slippage: {slippage}%</span>
        </div>
      </div>

      {/* From */}
      <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex justify-between mb-3">
          <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Отдаёте</span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Баланс: 1,284.50</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            type="number"
            className="flex-1 bg-transparent text-2xl font-bold font-mono-wallet outline-none text-white"
            style={{ caretColor: "#00D4FF" }}
          />
          <div className="flex items-center gap-2">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="px-3 py-2 rounded-xl text-sm font-bold outline-none cursor-pointer"
              style={{ background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.2)", color: "#00D4FF" }}
            >
              {tokens.filter((t) => t !== to).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Flip button */}
      <div className="flex items-center justify-center -my-2 z-10">
        <button
          onClick={flip}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
          style={{ background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)" }}
        >
          <Icon name="ArrowUpDown" size={16} style={{ color: "#00D4FF" }} />
        </button>
      </div>

      {/* To */}
      <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex justify-between mb-3">
          <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Получаете</span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>≈ ${(parseFloat(received) || 0).toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 text-2xl font-bold font-mono-wallet" style={{ color: amount ? "#00FF94" : "rgba(255,255,255,0.2)" }}>
            {received}
          </div>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm font-bold outline-none cursor-pointer"
            style={{ background: "rgba(0,255,148,0.08)", border: "1px solid rgba(0,255,148,0.15)", color: "#00FF94" }}
          >
            {tokens.filter((t) => t !== from).map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Route info */}
      {amount && (
        <div className="p-4 rounded-xl flex flex-col gap-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {[
            ["Курс", `1 ${from} = ${rate} ${to}`],
            ["Комиссия", "~0.001 TON"],
            ["Маршрут", `${from} → STON.fi → ${to}`],
            ["Мин. получение", `${(parseFloat(received) * 0.995).toFixed(2)} ${to}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs">
              <span style={{ color: "rgba(255,255,255,0.35)" }}>{k}</span>
              <span className="font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>{v}</span>
            </div>
          ))}
        </div>
      )}

      {/* Slippage */}
      <div>
        <span className="text-xs font-medium block mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Slippage tolerance</span>
        <div className="flex gap-2">
          {["0.1", "0.5", "1.0"].map((s) => (
            <button
              key={s}
              onClick={() => setSlippage(s)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={slippage === s
                ? { background: "rgba(0,212,255,0.2)", border: "1px solid rgba(0,212,255,0.4)", color: "#00D4FF" }
                : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }
              }
            >
              {s}%
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSwap}
        disabled={!amount || swapping}
        className="w-full py-4 rounded-xl font-bold text-sm btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {swapping ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(0,0,0,0.3)", borderTopColor: "transparent" }} />
            Обмен...
          </>
        ) : done ? (
          <><Icon name="Check" size={16} /> Обменяно!</>
        ) : (
          <>Обменять {from} → {to}</>
        )}
      </button>
    </div>
  );
}
