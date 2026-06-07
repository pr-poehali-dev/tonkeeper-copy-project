import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  onLogout: () => void;
  hideBalance: boolean;
  onToggleHideBalance: () => void;
}

export default function SettingsTab({ onLogout, hideBalance, onToggleHideBalance }: Props) {
  const [biometric, setBiometric] = useState(true);
  const [twofa, setTwofa] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [twofaModal, setTwofaModal] = useState(false);
  const [twofaCode, setTwofaCode] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [walletName, setWalletName] = useState("Мой кошелёк");
  const [tempName, setTempName] = useState("");
  const [logoutModal, setLogoutModal] = useState(false);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
      style={{
        background: value ? "linear-gradient(135deg, #00D4FF, #0099CC)" : "rgba(255,255,255,0.12)",
        boxShadow: value ? "0 0 10px rgba(0,212,255,0.3)" : "none",
      }}
    >
      <div
        className="w-[18px] h-[18px] rounded-full bg-white absolute top-[3px] transition-all duration-200"
        style={{ left: value ? "26px" : "3px", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
      />
    </button>
  );

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <h2 className="text-lg font-bold text-white">Настройки</h2>

      {/* Profile */}
      <div className="p-4 rounded-2xl flex items-center gap-4" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(139,92,246,0.08))", border: "1px solid rgba(0,212,255,0.15)" }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(139,92,246,0.15))", border: "1px solid rgba(0,212,255,0.2)", color: "#00D4FF" }}>
          {walletName[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white truncate">{walletName}</div>
          <div className="text-xs font-mono-wallet mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>UQBv...7vC</div>
        </div>
        <button
          onClick={() => { setTempName(walletName); setEditModal(true); }}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-90 transition-all"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <Icon name="Pencil" size={14} style={{ color: "rgba(255,255,255,0.6)" }} />
        </button>
      </div>

      {/* Security */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Shield" size={14} style={{ color: "#00D4FF" }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Безопасность</span>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          {[
            {
              icon: "Fingerprint",
              label: "Биометрия",
              desc: biometric ? "Включено · Face ID / Touch ID" : "Отключено",
              control: <Toggle value={biometric} onChange={() => setBiometric(!biometric)} />,
            },
            {
              icon: "KeyRound",
              label: "2FA аутентификация",
              desc: twofa ? "Включено · Google Authenticator" : "Отключено",
              control: (
                <button
                  onClick={() => { if (!twofa) setTwofaModal(true); else setTwofa(false); }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-90"
                  style={twofa
                    ? { background: "rgba(0,255,148,0.12)", border: "1px solid rgba(0,255,148,0.2)", color: "#00FF94" }
                    : { background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", color: "#00D4FF" }
                  }
                >
                  {twofa ? "Откл" : "Настроить"}
                </button>
              ),
            },
            {
              icon: "Lock",
              label: "Шифрование ключей",
              desc: "AES-256-GCM · Активно",
              control: (
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(0,255,148,0.1)", color: "#00FF94", border: "1px solid rgba(0,255,148,0.2)" }}>
                  Активно
                </span>
              ),
            },
            {
              icon: "Eye",
              label: "Скрыть баланс",
              desc: hideBalance ? "Суммы скрыты" : "Суммы видны",
              control: <Toggle value={hideBalance} onChange={onToggleHideBalance} />,
            },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-4"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,212,255,0.08)" }}>
                  <Icon name={item.icon} fallback="Circle" size={15} style={{ color: "rgba(0,212,255,0.8)" }} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.3)" }}>{item.desc}</div>
                </div>
              </div>
              <div className="flex-shrink-0">{item.control}</div>
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
              icon: "Bell",
              label: "Уведомления",
              desc: "Push о транзакциях",
              control: <Toggle value={notifications} onChange={() => setNotifications(!notifications)} />,
            },
            {
              icon: "DollarSign",
              label: "Валюта",
              desc: "Отображение цен",
              control: (
                <div className="flex gap-1">
                  {["USD", "EUR", "RUB"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className="px-2 py-1 rounded-lg text-xs font-semibold transition-all active:scale-90"
                      style={currency === c
                        ? { background: "rgba(0,212,255,0.2)", color: "#00D4FF" }
                        : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)" }
                      }
                    >
                      {c}
                    </button>
                  ))}
                </div>
              ),
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

      {/* Logout button */}
      <button
        onClick={() => setLogoutModal(true)}
        className="w-full p-4 rounded-xl flex items-center gap-3 active:scale-[0.98] transition-all"
        style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.15)" }}
      >
        <Icon name="LogOut" size={16} style={{ color: "#FF6B6B" }} />
        <span className="text-sm font-semibold" style={{ color: "#FF6B6B" }}>Выйти из кошелька</span>
      </button>

      {/* Edit name modal */}
      {editModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 animate-fade-in" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-sm p-6 rounded-2xl animate-scale-in" style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-white">Имя кошелька</span>
              <button onClick={() => setEditModal(false)} className="active:scale-90 transition-all">
                <Icon name="X" size={18} style={{ color: "rgba(255,255,255,0.5)" }} />
              </button>
            </div>
            <input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Название кошелька"
              maxLength={30}
              className="w-full px-4 py-3 rounded-xl outline-none mb-4 text-sm font-medium"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", caretColor: "#00D4FF" }}
            />
            <button
              onClick={() => { if (tempName.trim()) { setWalletName(tempName.trim()); } setEditModal(false); }}
              className="w-full py-3 rounded-xl font-bold btn-primary"
            >
              Сохранить
            </button>
          </div>
        </div>
      )}

      {/* Logout confirm modal */}
      {logoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 animate-fade-in" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-sm p-6 rounded-2xl animate-scale-in" style={{ background: "#111118", border: "1px solid rgba(255,107,107,0.2)" }}>
            <div className="flex flex-col items-center gap-4 mb-6 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(255,107,107,0.12)", border: "1px solid rgba(255,107,107,0.25)" }}>
                <Icon name="LogOut" size={24} style={{ color: "#FF6B6B" }} />
              </div>
              <div>
                <div className="font-bold text-white text-base mb-1">Выйти из кошелька?</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Вы сможете войти снова используя PIN-код или биометрию</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setLogoutModal(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm btn-secondary"
              >
                Отмена
              </button>
              <button
                onClick={() => { setLogoutModal(false); onLogout(); }}
                className="flex-1 py-3 rounded-xl font-bold text-sm active:scale-[0.98] transition-all"
                style={{ background: "rgba(255,107,107,0.15)", border: "1px solid rgba(255,107,107,0.3)", color: "#FF6B6B" }}
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {twofaModal && (
        <div className="fixed inset-0 flex items-end justify-center z-50 animate-fade-in" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-sm m-4 p-6 rounded-2xl animate-slide-up" style={{ background: "#111118", border: "1px solid rgba(0,212,255,0.2)" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-white">Включить 2FA</span>
              <button onClick={() => { setTwofaModal(false); setTwofaCode(""); }} className="active:scale-90 transition-all">
                <Icon name="X" size={18} style={{ color: "rgba(255,255,255,0.5)" }} />
              </button>
            </div>
            <div className="p-3 rounded-xl mb-4 text-center" style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)" }}>
              <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Секретный ключ</div>
              <div className="font-mono-wallet text-sm font-bold tracking-wider" style={{ color: "#00D4FF" }}>JBSW Y3DP EHPK 3PXP</div>
            </div>
            <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Отсканируйте ключ в Google Authenticator и введите 6-значный код:
            </p>
            <input
              value={twofaCode}
              onChange={(e) => setTwofaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000 000"
              inputMode="numeric"
              className="w-full px-4 py-3 rounded-xl text-center text-xl font-bold font-mono-wallet outline-none mb-4"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${twofaCode.length === 6 ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.1)"}`, color: "#fff", caretColor: "#00D4FF", letterSpacing: "0.3em" }}
            />
            <button
              onClick={() => { if (twofaCode.length === 6) { setTwofa(true); setTwofaModal(false); setTwofaCode(""); } }}
              disabled={twofaCode.length !== 6}
              className="w-full py-3.5 rounded-xl font-bold btn-primary disabled:opacity-40 active:scale-[0.98] transition-all"
            >
              Подтвердить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
