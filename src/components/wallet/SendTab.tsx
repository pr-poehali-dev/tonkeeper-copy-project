import { useState } from "react";
import Icon from "@/components/ui/icon";

const recent = [
  { address: "UQBv...3kF2", name: "Алексей", amount: "50 TON" },
  { address: "EQAp...9mX1", name: "Биржа OKX", amount: "200 TON" },
  { address: "UQCn...7tR8", name: "Сохранённый", amount: "10 USDT" },
];

export default function SendTab() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("TON");
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 animate-scale-in">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(0,255,148,0.15)", border: "2px solid rgba(0,255,148,0.4)", boxShadow: "0 0 40px rgba(0,255,148,0.2)" }}>
          <Icon name="Check" size={36} style={{ color: "#00FF94" }} />
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-white mb-1">Отправлено!</div>
          <div className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Транзакция подтверждена в сети TON</div>
        </div>
        <div className="w-full p-4 rounded-xl" style={{ background: "rgba(0,255,148,0.06)", border: "1px solid rgba(0,255,148,0.15)" }}>
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Сумма</span>
            <span className="font-semibold text-white font-mono-wallet">{amount} {token}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Адрес</span>
            <span className="font-mono-wallet text-xs" style={{ color: "#00D4FF" }}>{address || "UQBv...3kF2"}</span>
          </div>
        </div>
        <button onClick={() => { setStep("form"); setAmount(""); setAddress(""); }} className="w-full py-3.5 rounded-xl font-semibold text-sm btn-primary">
          Новый перевод
        </button>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="flex flex-col gap-5 animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep("form")} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
            <Icon name="ArrowLeft" size={16} style={{ color: "rgba(255,255,255,0.7)" }} />
          </button>
          <span className="font-semibold text-white">Подтверждение</span>
        </div>

        <div className="p-5 rounded-2xl flex flex-col gap-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="text-center py-4">
            <div className="text-4xl font-bold font-mono-wallet" style={{ color: "#fff" }}>{amount || "0"}</div>
            <div className="text-lg mt-1" style={{ color: "#00D4FF" }}>{token}</div>
          </div>
          {[["Получатель", address || "UQBv...3kF2"], ["Комиссия сети", "≈ 0.005 TON"], ["Время", "~3 секунды"]].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm py-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>{k}</span>
              <span className="font-medium text-white font-mono-wallet text-right max-w-[180px] truncate">{v}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl flex gap-3" style={{ background: "rgba(255,193,7,0.08)", border: "1px solid rgba(255,193,7,0.15)" }}>
          <Icon name="ShieldCheck" size={16} style={{ color: "#FFC107", flexShrink: 0, marginTop: 2 }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Требуется подтверждение биометрией или 2FA кодом</span>
        </div>

        <button onClick={() => setStep("success")} className="w-full py-4 rounded-xl font-bold text-sm btn-primary">
          Подтвердить отправку
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <h2 className="text-lg font-bold text-white">Отправить</h2>

      {/* Token selector */}
      <div>
        <label className="text-xs font-medium mb-2 block" style={{ color: "rgba(255,255,255,0.4)" }}>Токен</label>
        <div className="flex gap-2">
          {["TON", "USDT", "NOT"].map((t) => (
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
      </div>

      {/* Address */}
      <div>
        <label className="text-xs font-medium mb-2 block" style={{ color: "rgba(255,255,255,0.4)" }}>Адрес получателя</label>
        <div className="relative">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="UQ... или ENS имя"
            className="w-full px-4 py-3.5 rounded-xl text-sm font-mono-wallet outline-none transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", caretColor: "#00D4FF" }}
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg" style={{ background: "rgba(0,212,255,0.1)" }}>
            <Icon name="QrCode" size={16} style={{ color: "#00D4FF" }} />
          </button>
        </div>
      </div>

      {/* Amount */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Сумма</label>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Баланс: 1,284.50 TON</span>
        </div>
        <div className="relative">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            type="number"
            className="w-full px-4 py-3.5 rounded-xl text-lg font-bold font-mono-wallet outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", caretColor: "#00D4FF" }}
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-xs font-bold" style={{ background: "rgba(0,212,255,0.15)", color: "#00D4FF" }}>
            МАКС
          </button>
        </div>
      </div>

      {/* Recent */}
      <div>
        <span className="text-xs font-medium block mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Недавние</span>
        <div className="flex flex-col gap-2">
          {recent.map((r) => (
            <button
              key={r.address}
              onClick={() => setAddress(r.address)}
              className="flex items-center justify-between p-3 rounded-xl card-hover text-left"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(0,212,255,0.1)", color: "#00D4FF" }}>
                  {r.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{r.name}</div>
                  <div className="text-xs font-mono-wallet" style={{ color: "rgba(255,255,255,0.3)" }}>{r.address}</div>
                </div>
              </div>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{r.amount}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setStep("confirm")}
        disabled={!amount}
        className="w-full py-4 rounded-xl font-bold text-sm btn-primary disabled:opacity-40 disabled:cursor-not-allowed mt-2"
      >
        Продолжить
      </button>
    </div>
  );
}
