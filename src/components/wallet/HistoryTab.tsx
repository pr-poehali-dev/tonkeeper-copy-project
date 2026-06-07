import { useState } from "react";
import Icon from "@/components/ui/icon";

const txs = [
  { id: 1, type: "receive", symbol: "TON", amount: "+500.00", usd: "+$2,500", from: "Binance", time: "2 мин назад", hash: "5f3a...8c2d", status: "confirmed" },
  { id: 2, type: "send", symbol: "USDT", amount: "-200.00", usd: "-$200", to: "OKX Биржа", time: "1 час назад", hash: "9b1e...4f7a", status: "confirmed" },
  { id: 3, type: "swap", symbol: "NOT→TON", amount: "50,000 NOT", usd: "+75 TON", from: "STON.fi", time: "3 часа назад", hash: "2c8f...1a5b", status: "confirmed" },
  { id: 4, type: "stake", symbol: "TON", amount: "-100.00", usd: "-$500", to: "Staking Pool", time: "1 день назад", hash: "7d4e...3c9f", status: "confirmed" },
  { id: 5, type: "receive", symbol: "STON", amount: "+5,000", usd: "+$300", from: "Airdrop", time: "2 дня назад", hash: "1a7b...6e2c", status: "confirmed" },
  { id: 6, type: "send", symbol: "TON", amount: "-30.00", usd: "-$150", to: "Алексей", time: "3 дня назад", hash: "4f9d...8b1a", status: "confirmed" },
  { id: 7, type: "receive", symbol: "TON", amount: "+12.50", usd: "+$62.5", from: "Staking reward", time: "5 дней назад", hash: "3e6c...7d4f", status: "confirmed" },
];

const typeConfig = {
  receive: { icon: "ArrowDownLeft", color: "#00FF94", bg: "rgba(0,255,148,0.1)", label: "Получено" },
  send: { icon: "ArrowUpRight", color: "#FF6B6B", bg: "rgba(255,107,107,0.1)", label: "Отправлено" },
  swap: { icon: "ArrowLeftRight", color: "#00D4FF", bg: "rgba(0,212,255,0.1)", label: "Обмен" },
  stake: { icon: "TrendingUp", color: "#8B5CF6", bg: "rgba(139,92,246,0.1)", label: "Стейкинг" },
};

type TxType = keyof typeof typeConfig;
type FilterType = "all" | TxType;

export default function HistoryTab() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = filter === "all" ? txs : txs.filter((t) => t.type === filter);

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <h2 className="text-lg font-bold text-white">История</h2>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {(["all", "receive", "send", "swap", "stake"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0"
            style={filter === f
              ? { background: "rgba(0,212,255,0.2)", border: "1px solid rgba(0,212,255,0.4)", color: "#00D4FF" }
              : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }
            }
          >
            {f === "all" ? "Все" : typeConfig[f as TxType].label}
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div className="flex flex-col gap-2">
        {filtered.map((tx) => {
          const cfg = typeConfig[tx.type as TxType];
          const isExp = expanded === tx.id;
          return (
            <div key={tx.id}>
              <button
                onClick={() => setExpanded(isExp ? null : tx.id)}
                className="w-full flex items-center justify-between p-4 rounded-xl card-hover text-left"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${isExp ? "rgba(0,212,255,0.2)" : "rgba(255,255,255,0.06)"}` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                    <Icon name={cfg.icon} fallback="Circle" size={15} style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{cfg.label}</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {tx.from ? `от ${tx.from}` : `на ${tx.to}`} · {tx.time}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold font-mono-wallet" style={{ color: tx.type === "receive" ? "#00FF94" : tx.type === "send" ? "#FF6B6B" : "#fff" }}>
                    {tx.amount}
                  </div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{tx.symbol}</div>
                </div>
              </button>

              {isExp && (
                <div className="px-4 py-3 rounded-b-xl -mt-1 flex flex-col gap-2" style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.15)", borderTop: "none" }}>
                  {[["Хеш транзакции", tx.hash], ["USD эквивалент", tx.usd], ["Статус", "✓ Подтверждено"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span style={{ color: "rgba(255,255,255,0.35)" }}>{k}</span>
                      <span className="font-mono-wallet" style={{ color: k === "Статус" ? "#00FF94" : "rgba(255,255,255,0.7)" }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
