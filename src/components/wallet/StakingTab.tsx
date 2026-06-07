import { useState } from "react";
import Icon from "@/components/ui/icon";

const pools = [
  { name: "TON Whales", apy: "5.2%", tvl: "3.2M TON", min: "50 TON", color: "#00D4FF", badge: "Популярный" },
  { name: "TON Nominators", apy: "4.8%", tvl: "1.8M TON", min: "10,001 TON", color: "#8B5CF6", badge: null },
  { name: "Bemo Finance", apy: "6.1%", tvl: "800K TON", min: "1 TON", color: "#00FF94", badge: "Высокий APY" },
];

export default function StakingTab() {
  const [selected, setSelected] = useState(0);
  const [stakeAmount, setStakeAmount] = useState("");
  const [tab, setTab] = useState<"stake" | "my">("stake");

  const myStakes = [
    { pool: "TON Whales", amount: "100 TON", reward: "+0.52 TON", days: "14 дней", color: "#00D4FF" },
  ];

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Стейкинг</h2>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {(["stake", "my"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={tab === t
                ? { background: "rgba(0,212,255,0.2)", color: "#00D4FF" }
                : { color: "rgba(255,255,255,0.4)" }
              }
            >
              {t === "stake" ? "Пулы" : "Мои позиции"}
            </button>
          ))}
        </div>
      </div>

      {tab === "stake" ? (
        <>
          {/* Pools */}
          <div className="flex flex-col gap-3">
            {pools.map((pool, i) => (
              <button
                key={pool.name}
                onClick={() => setSelected(i)}
                className="w-full p-4 rounded-2xl text-left transition-all"
                style={{
                  background: selected === i ? `${pool.color}10` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selected === i ? `${pool.color}40` : "rgba(255,255,255,0.07)"}`,
                  boxShadow: selected === i ? `0 0 20px ${pool.color}15` : "none",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black" style={{ background: `${pool.color}20`, color: pool.color }}>
                      {pool.name[0]}
                    </div>
                    <span className="font-semibold text-sm text-white">{pool.name}</span>
                    {pool.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${pool.color}20`, color: pool.color, border: `1px solid ${pool.color}30` }}>
                        {pool.badge}
                      </span>
                    )}
                  </div>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ border: `2px solid ${selected === i ? pool.color : "rgba(255,255,255,0.15)"}` }}>
                    {selected === i && <div className="w-2.5 h-2.5 rounded-full" style={{ background: pool.color }} />}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[["APY", pool.apy, pool.color], ["TVL", pool.tvl, "rgba(255,255,255,0.5)"], ["Мин.", pool.min, "rgba(255,255,255,0.5)"]].map(([k, v, c]) => (
                    <div key={k}>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{k}</div>
                      <div className="text-sm font-bold font-mono-wallet" style={{ color: c }}>{v}</div>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Stake input */}
          <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Сумма стейкинга</span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Доступно: 1,284.50 TON</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="0.00"
                type="number"
                className="flex-1 bg-transparent text-xl font-bold font-mono-wallet outline-none text-white"
                style={{ caretColor: "#00D4FF" }}
              />
              <button className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: "rgba(0,212,255,0.12)", color: "#00D4FF" }}>МАКС</button>
            </div>
            {stakeAmount && (
              <div className="mt-3 pt-3 flex justify-between text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "rgba(255,255,255,0.35)" }}>Ожидаемый доход в год</span>
                <span className="font-semibold" style={{ color: "#00FF94" }}>
                  ~{(parseFloat(stakeAmount) * parseFloat(pools[selected].apy) / 100).toFixed(2)} TON
                </span>
              </div>
            )}
          </div>

          <button disabled={!stakeAmount} className="w-full py-4 rounded-xl font-bold text-sm btn-primary disabled:opacity-40">
            Застейкать TON
          </button>
        </>
      ) : (
        <>
          {myStakes.length > 0 ? (
            <div className="flex flex-col gap-3">
              {myStakes.map((s, i) => (
                <div key={i} className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black" style={{ background: `${s.color}20`, color: s.color }}>{s.pool[0]}</div>
                      <span className="font-semibold text-sm text-white">{s.pool}</span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(0,255,148,0.1)", color: "#00FF94", border: "1px solid rgba(0,255,148,0.2)" }}>Активен</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[["Сумма", s.amount, "#fff"], ["Доход", s.reward, "#00FF94"], ["Период", s.days, "rgba(255,255,255,0.5)"]].map(([k, v, c]) => (
                      <div key={k}>
                        <div className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{k}</div>
                        <div className="text-sm font-semibold font-mono-wallet" style={{ color: c }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold btn-secondary">Забрать награды</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Icon name="TrendingUp" size={28} style={{ color: "rgba(255,255,255,0.2)" }} />
              </div>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Нет активных позиций</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
