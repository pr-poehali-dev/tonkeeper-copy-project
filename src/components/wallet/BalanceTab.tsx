import { useState } from "react";
import Icon from "@/components/ui/icon";

const tokens = [
  { symbol: "TON", name: "Toncoin", amount: "1,284.50", usd: "$6,422.50", change: "+5.2%", up: true, color: "#00D4FF" },
  { symbol: "USDT", name: "Tether USD", amount: "2,400.00", usd: "$2,400.00", change: "+0.01%", up: true, color: "#26A17B" },
  { symbol: "NOT", name: "Notcoin", amount: "840,000", usd: "$1,260.00", change: "-2.4%", up: false, color: "#FF9500" },
  { symbol: "STON", name: "STON.fi", amount: "15,320", usd: "$920.00", change: "+8.1%", up: true, color: "#8B5CF6" },
];

const quickActions = [
  { icon: "ArrowUpRight", label: "Отправить", tab: "send" },
  { icon: "ArrowDownLeft", label: "Получить", tab: "receive" },
  { icon: "ArrowLeftRight", label: "Обменять", tab: "swap" },
  { icon: "TrendingUp", label: "Стейкинг", tab: "staking" },
];

interface Props {
  onTabChange: (tab: string) => void;
  hideBalance?: boolean;
}

export default function BalanceTab({ onTabChange, hideBalance }: Props) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleTokens = showAll ? tokens : tokens.slice(0, 4);

  const handleTokenClick = (symbol: string) => {
    setSelectedToken(selectedToken === symbol ? null : symbol);
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-4">
      {/* Hero balance card */}
      <div className="relative overflow-hidden rounded-2xl p-6" style={{
        background: "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(139,92,246,0.15) 100%)",
        border: "1px solid rgba(0,212,255,0.2)",
        boxShadow: "0 0 60px rgba(0,212,255,0.1), inset 0 1px 0 rgba(255,255,255,0.08)"
      }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #00D4FF 0%, transparent 70%)" }} />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full animate-pulse-slow" style={{ background: "#00FF94" }} />
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Общий баланс</span>
          </div>
          <div className="text-4xl font-bold mb-1 font-mono-wallet" style={{ color: "#fff", letterSpacing: "-1px" }}>
            {hideBalance ? (
              <span style={{ letterSpacing: "4px" }}>••••••</span>
            ) : (
              <>$11,002<span className="text-2xl" style={{ color: "rgba(255,255,255,0.4)" }}>.50</span></>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              {hideBalance ? "••••• TON" : "≈ 2,200.5 TON"}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(0,255,148,0.15)", color: "#00FF94", border: "1px solid rgba(0,255,148,0.2)" }}>
              +3.8% за 24ч
            </span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.tab}
            onClick={() => onTabChange(action.tab)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl card-hover active:scale-95 transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.15)" }}>
              <Icon name={action.icon} fallback="Circle" size={18} style={{ color: "#00D4FF" }} />
            </div>
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Tokens list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>Активы</span>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-medium transition-colors"
            style={{ color: "#00D4FF" }}
          >
            {showAll ? "Свернуть" : "Все токены"}
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {visibleTokens.map((token, i) => (
            <div key={token.symbol}>
              <button
                onClick={() => handleTokenClick(token.symbol)}
                className="w-full flex items-center justify-between p-4 rounded-xl card-hover active:scale-[0.98] transition-all text-left"
                style={{
                  background: selectedToken === token.symbol ? `${token.color}08` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selectedToken === token.symbol ? `${token.color}30` : "rgba(255,255,255,0.06)"}`,
                  animationDelay: `${i * 0.07}s`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: `${token.color}20`, border: `1px solid ${token.color}30`, color: token.color }}>
                    {token.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "#fff" }}>{token.symbol}</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{token.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold font-mono-wallet" style={{ color: "#fff" }}>
                    {hideBalance ? "•••••" : token.usd}
                  </div>
                  <div className="text-xs font-medium" style={{ color: token.up ? "#00FF94" : "#FF6B6B" }}>
                    {token.change}
                  </div>
                </div>
              </button>

              {/* Expanded token actions */}
              {selectedToken === token.symbol && (
                <div className="flex gap-2 px-1 pb-1 -mt-1 animate-fade-in">
                  <button
                    onClick={() => onTabChange("send")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-b-xl text-xs font-semibold"
                    style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)", borderTop: "none", color: "#00D4FF" }}
                  >
                    <Icon name="ArrowUpRight" size={13} />
                    Отправить
                  </button>
                  <button
                    onClick={() => onTabChange("swap")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-b-xl text-xs font-semibold"
                    style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)", borderTop: "none", color: "#8B5CF6" }}
                  >
                    <Icon name="ArrowLeftRight" size={13} />
                    Обменять
                  </button>
                  <button
                    onClick={() => onTabChange("receive")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-b-xl text-xs font-semibold"
                    style={{ background: "rgba(0,255,148,0.06)", border: "1px solid rgba(0,255,148,0.12)", borderTop: "none", color: "#00FF94" }}
                  >
                    <Icon name="ArrowDownLeft" size={13} />
                    Получить
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
