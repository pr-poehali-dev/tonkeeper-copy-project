import { useState } from "react";
import Icon from "@/components/ui/icon";
import BalanceTab from "@/components/wallet/BalanceTab";
import SendTab from "@/components/wallet/SendTab";
import ReceiveTab from "@/components/wallet/ReceiveTab";
import PortfolioTab from "@/components/wallet/PortfolioTab";
import HistoryTab from "@/components/wallet/HistoryTab";
import SwapTab from "@/components/wallet/SwapTab";
import StakingTab from "@/components/wallet/StakingTab";
import SettingsTab from "@/components/wallet/SettingsTab";

type Tab = "balance" | "send" | "receive" | "portfolio" | "history" | "swap" | "staking" | "settings";

const navItems: { id: Tab; icon: string; label: string }[] = [
  { id: "balance", icon: "Wallet", label: "Кошелёк" },
  { id: "portfolio", icon: "PieChart", label: "Портфолио" },
  { id: "history", icon: "Clock", label: "История" },
  { id: "staking", icon: "TrendingUp", label: "Стейкинг" },
  { id: "settings", icon: "Settings", label: "Настройки" },
];

function AuthScreen({ onAuth }: { onAuth: () => void }) {
  const [pin, setPin] = useState("");

  const handlePin = (d: string) => {
    if (d === "del") { setPin((p) => p.slice(0, -1)); return; }
    const next = pin + d;
    setPin(next);
    if (next.length === 6) { setTimeout(() => onAuth(), 400); }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-between py-12 px-6" style={{ background: "#0A0A0F" }}>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)" }} />

      <div className="flex flex-col items-center gap-3 z-10 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(139,92,246,0.2))", border: "1px solid rgba(0,212,255,0.3)", boxShadow: "0 0 30px rgba(0,212,255,0.15)" }}>
          <span className="text-2xl font-black" style={{ color: "#00D4FF" }}>T</span>
        </div>
        <h1 className="text-xl font-bold text-white">TonWallet</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>Введите PIN-код для входа</p>
      </div>

      <div className="flex flex-col items-center gap-8 z-10 w-full max-w-xs animate-slide-up">
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 rounded-full transition-all duration-200"
              style={{
                background: i < pin.length ? "#00D4FF" : "rgba(255,255,255,0.12)",
                boxShadow: i < pin.length ? "0 0 10px rgba(0,212,255,0.5)" : "none",
                transform: i < pin.length ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {["1","2","3","4","5","6","7","8","9","bio","0","del"].map((d) => (
            <button
              key={d}
              onClick={() => d === "bio" ? onAuth() : handlePin(d)}
              className="aspect-square rounded-2xl flex flex-col items-center justify-center transition-all active:scale-90"
              style={{
                background: d === "bio" || d === "del" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {d === "del" ? (
                <Icon name="Delete" fallback="ChevronLeft" size={20} style={{ color: "rgba(255,255,255,0.6)" }} />
              ) : d === "bio" ? (
                <Icon name="Fingerprint" size={22} style={{ color: "#00D4FF" }} />
              ) : (
                <span className="text-xl font-semibold text-white">{d}</span>
              )}
            </button>
          ))}
        </div>

        <button onClick={onAuth} className="text-sm" style={{ color: "#00D4FF" }}>
          Войти другим способом
        </button>
      </div>

      <div className="z-10" />
    </div>
  );
}

export default function Index() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("balance");
  const [hideBalance, setHideBalance] = useState(false);

  if (!authed) return <AuthScreen onAuth={() => setAuthed(true)} />;

  const isNested = tab === "send" || tab === "receive" || tab === "swap";

  const renderTab = () => {
    switch (tab) {
      case "balance": return <BalanceTab onTabChange={(t) => setTab(t as Tab)} hideBalance={hideBalance} />;
      case "send": return <SendTab />;
      case "receive": return <ReceiveTab />;
      case "portfolio": return <PortfolioTab />;
      case "history": return <HistoryTab />;
      case "swap": return <SwapTab />;
      case "staking": return <StakingTab />;
      case "settings": return (
        <SettingsTab
          onLogout={() => { setAuthed(false); setTab("balance"); }}
          hideBalance={hideBalance}
          onToggleHideBalance={() => setHideBalance((v) => !v)}
        />
      );
      default: return <BalanceTab onTabChange={(t) => setTab(t as Tab)} hideBalance={hideBalance} />;
    }
  };

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#0A0A0F" }}>
      {/* Ambient glows */}
      <div className="fixed top-0 left-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="w-full max-w-sm flex flex-col min-h-screen relative">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 sticky top-0 z-30" style={{ background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.25), rgba(139,92,246,0.25))", border: "1px solid rgba(0,212,255,0.25)" }}>
              <span className="text-sm font-black" style={{ color: "#00D4FF" }}>T</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-none">TonWallet</div>
              <div className="text-xs leading-none mt-0.5 font-mono-wallet" style={{ color: "rgba(255,255,255,0.3)" }}>UQBv...7vC</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Hide balance toggle */}
            <button
              onClick={() => setHideBalance((v) => !v)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
              style={{
                background: hideBalance ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${hideBalance ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.08)"}`,
              }}
              title={hideBalance ? "Показать баланс" : "Скрыть баланс"}
            >
              <Icon name={hideBalance ? "EyeOff" : "Eye"} size={15} style={{ color: hideBalance ? "#00D4FF" : "rgba(255,255,255,0.45)" }} />
            </button>
            {/* Network */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ background: "rgba(0,255,148,0.08)", border: "1px solid rgba(0,255,148,0.15)" }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: "#00FF94" }} />
              <span className="text-xs font-semibold" style={{ color: "#00FF94" }}>TON</span>
            </div>
            {/* Send */}
            <button
              onClick={() => setTab("send")}
              className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-all"
              style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.15)" }}
            >
              <Icon name="ArrowUpRight" size={16} style={{ color: "#00D4FF" }} />
            </button>
          </div>
        </header>

        {/* Back for nested tabs */}
        {isNested && (
          <div className="px-4 pt-3">
            <button
              onClick={() => setTab("balance")}
              className="flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <Icon name="ChevronLeft" size={14} />
              Назад
            </button>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 px-4 py-4 overflow-y-auto" style={{ paddingBottom: "88px" }}>
          {renderTab()}
        </main>

        {/* Bottom nav */}
        <nav
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm z-30"
          style={{ background: "rgba(10,10,15,0.95)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-around px-1 py-2">
            {navItems.map((item) => {
              const isActive = tab === item.id || (item.id === "balance" && isNested);
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all"
                  style={{
                    color: isActive ? "#00D4FF" : "rgba(255,255,255,0.3)",
                    background: isActive ? "rgba(0,212,255,0.08)" : "transparent",
                  }}
                >
                  <Icon name={item.icon} fallback="Circle" size={20} />
                  <span className="text-[10px] font-semibold leading-none">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}