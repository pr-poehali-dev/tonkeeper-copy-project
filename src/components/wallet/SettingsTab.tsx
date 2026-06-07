import { useState } from "react";
import Icon from "@/components/ui/icon";

export default function SettingsTab() {
  const [biometric, setBiometric] = useState(true);
  const [twofa, setTwofa] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [hideBalance, setHideBalance] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [twofaModal, setTwofaModal] = useState(false);
  const [twofaCode, setTwofaCode] = useState("");

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
      style={{ background: value ? "linear-gradient(135deg, #00D4FF, #0099CC)" : "rgba(255,255,255,0.12)", boxShadow: value ? "0 0 10px rgba(0,212,255,0.3)" : "none" }}
    >
      <div className="w-4.5 h-4.5 w-[18px] h-[18px] rounded-full bg-white absolute top-[3px] transition-all" style={{ left: value ? "26px" : "3px", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </button>
  );

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <h2 className="text-lg font-bold text-white">Настройки</h2>

      {/* Profile */}
      <div className="p-4 rounded-2xl flex items-center gap-4" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(139,92,246,0.08))", border: "1px solid rgba(0,212,255,0.15)" }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black" style={{ background: "linear-gradient(135deg, #00D4FF20, #8B5CF620)", border: "1px solid rgba(0,212,255,0.2)", color: "#00D4FF" }}>
          А
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white">Мой кошелёк</div>
          <div className="text-xs font-mono-wallet mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>UQBv...7vC</div>
        </div>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <Icon name="Pencil" size={14} style={{ color: "rgba(255,255,255,0.6)" }} />
        </button>
      </div>

      {/* Security section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Shield" size={14} style={{ color: "#00D4FF" }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Безопасность</span>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          {[
            {
              icon: "Fingerprint", label: "Биометрия", desc: "Face ID / Отпечаток пальца",
              control: <Toggle value={biometric} onChange={() => setBiometric(!biometric)} />
            },
            {
              icon: "KeyRound", label: "Двухфакторная аутентификация", desc: twofa ? "Включено · Google Authenticator" : "Отключено",
              control: (
                <button
                  onClick={() => { if (!twofa) setTwofaModal(true); else setTwofa(false); }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={twofa
                    ? { background: "rgba(0,255,148,0.12)", border: "1px solid rgba(0,255,148,0.2)", color: "#00FF94" }
                    : { background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", color: "#00D4FF" }
                  }
                >
                  {twofa ? "Вкл" : "Настроить"}
                </button>
              )
            },
            {
              icon: "Lock", label: "Шифрование ключей", desc: "AES-256-GCM · Активно",
              control: <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(0,255,148,0.1)", color: "#00FF94", border: "1px solid rgba(0,255,148,0.2)" }}>Активно</span>
            },
            {
              icon: "Eye", label: "Скрыть баланс", desc: "Скрывать суммы на экране",
              control: <Toggle value={hideBalance} onChange={() => setHideBalance(!hideBalance)} />
            },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-4"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,212,255,0.08)" }}>
                  <Icon name={item.icon} fallback="Circle" size={15} style={{ color: "rgba(0,212,255,0.8)" }} />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{item.desc}</div>
                </div>
              </div>
              {item.control}
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Icon name="SlidersHorizontal" size={14} style={{ color: "#8B5CF6" }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Настройки</span>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          {[
            {
              icon: "Bell", label: "Уведомления", desc: "Push о транзакциях",
              control: <Toggle value={notifications} onChange={() => setNotifications(!notifications)} />
            },
            {
              icon: "DollarSign", label: "Валюта", desc: "Отображение цен",
              control: (
                <div className="flex gap-1">
                  {["USD", "EUR", "RUB"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className="px-2 py-1 rounded-lg text-xs font-semibold transition-all"
                      style={currency === c
                        ? { background: "rgba(0,212,255,0.2)", color: "#00D4FF" }
                        : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)" }
                      }
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )
            },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-4"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.08)" }}>
                  <Icon name={item.icon} fallback="Circle" size={15} style={{ color: "rgba(139,92,246,0.8)" }} />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{item.desc}</div>
                </div>
              </div>
              {item.control}
            </div>
          ))}
        </div>
      </div>

      {/* Danger */}
      <button className="w-full p-4 rounded-xl flex items-center gap-3" style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.15)" }}>
        <Icon name="LogOut" size={16} style={{ color: "#FF6B6B" }} />
        <span className="text-sm font-semibold" style={{ color: "#FF6B6B" }}>Выйти из кошелька</span>
      </button>

      {/* 2FA Modal */}
      {twofaModal && (
        <div className="fixed inset-0 flex items-end justify-center z-50 animate-fade-in" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-sm m-4 p-6 rounded-2xl animate-slide-up" style={{ background: "#111118", border: "1px solid rgba(0,212,255,0.2)" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-white">Включить 2FA</span>
              <button onClick={() => setTwofaModal(false)}><Icon name="X" size={18} style={{ color: "rgba(255,255,255,0.5)" }} /></button>
            </div>
            <div className="p-3 rounded-xl mb-4 text-center" style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)" }}>
              <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Секретный ключ</div>
              <div className="font-mono-wallet text-sm font-bold tracking-wider" style={{ color: "#00D4FF" }}>JBSW Y3DP EHPK 3PXP</div>
            </div>
            <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Отсканируйте QR в Google Authenticator и введите код подтверждения:</p>
            <input
              value={twofaCode}
              onChange={(e) => setTwofaCode(e.target.value)}
              placeholder="000 000"
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl text-center text-xl font-bold font-mono-wallet outline-none mb-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", caretColor: "#00D4FF", letterSpacing: "0.3em" }}
            />
            <button
              onClick={() => { if (twofaCode.length === 6) { setTwofa(true); setTwofaModal(false); setTwofaCode(""); } }}
              disabled={twofaCode.length !== 6}
              className="w-full py-3.5 rounded-xl font-bold btn-primary disabled:opacity-40"
            >
              Подтвердить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
