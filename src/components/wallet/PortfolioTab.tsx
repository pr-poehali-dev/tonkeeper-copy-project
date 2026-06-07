import Icon from "@/components/ui/icon";

const assets = [
  { symbol: "TON", name: "Toncoin", amount: "1,284.50", usd: 6422.50, pct: 58.4, color: "#00D4FF", change: "+5.2%" },
  { symbol: "USDT", name: "Tether USD", amount: "2,400.00", usd: 2400.00, pct: 21.8, color: "#26A17B", change: "+0.01%" },
  { symbol: "NOT", name: "Notcoin", amount: "840,000", usd: 1260.00, pct: 11.4, color: "#FF9500", change: "-2.4%" },
  { symbol: "STON", name: "STON.fi", amount: "15,320", usd: 920.00, pct: 8.4, color: "#8B5CF6", change: "+8.1%" },
];

const total = assets.reduce((s, a) => s + a.usd, 0);

const stats = [
  { label: "За 24 часа", value: "+$418.30", positive: true },
  { label: "За неделю", value: "+$1,240.00", positive: true },
  { label: "За месяц", value: "-$320.50", positive: false },
  { label: "Всего активов", value: "4 токена", positive: null },
];

export default function PortfolioTab() {
  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <h2 className="text-lg font-bold text-white">Портфолио</h2>

      {/* Donut chart area */}
      <div className="p-5 rounded-2xl flex items-center gap-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {/* SVG Donut */}
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />
            {/* TON 58.4% */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#00D4FF" strokeWidth="16"
              strokeDasharray={`${58.4 * 2.388} ${238.76}`} strokeDashoffset="0" transform="rotate(-90 50 50)" />
            {/* USDT 21.8% */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#26A17B" strokeWidth="16"
              strokeDasharray={`${21.8 * 2.388} ${238.76}`} strokeDashoffset={`${-(58.4) * 2.388}`} transform="rotate(-90 50 50)" />
            {/* NOT 11.4% */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#FF9500" strokeWidth="16"
              strokeDasharray={`${11.4 * 2.388} ${238.76}`} strokeDashoffset={`${-(58.4 + 21.8) * 2.388}`} transform="rotate(-90 50 50)" />
            {/* STON 8.4% */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5CF6" strokeWidth="16"
              strokeDasharray={`${8.4 * 2.388} ${238.76}`} strokeDashoffset={`${-(58.4 + 21.8 + 11.4) * 2.388}`} transform="rotate(-90 50 50)" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-white">$11K</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1">
          {assets.map((a) => (
            <div key={a.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: a.color }} />
                <span className="text-xs font-medium text-white">{a.symbol}</span>
              </div>
              <span className="text-xs font-mono-wallet" style={{ color: "rgba(255,255,255,0.4)" }}>{a.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
            <div className="text-sm font-bold font-mono-wallet" style={{
              color: s.positive === true ? "#00FF94" : s.positive === false ? "#FF6B6B" : "#fff"
            }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Asset list */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>Распределение</span>
        </div>
        <div className="flex flex-col gap-2">
          {assets.map((asset) => (
            <div key={asset.symbol} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: `${asset.color}20`, color: asset.color }}>
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{asset.symbol}</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{asset.amount}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold font-mono-wallet text-white">${asset.usd.toLocaleString()}</div>
                  <div className="text-xs font-medium" style={{ color: asset.change.startsWith("+") ? "#00FF94" : "#FF6B6B" }}>{asset.change}</div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${asset.pct}%`, background: `linear-gradient(90deg, ${asset.color}90, ${asset.color})` }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Доля</span>
                <span className="text-xs font-mono-wallet" style={{ color: "rgba(255,255,255,0.3)" }}>{asset.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
