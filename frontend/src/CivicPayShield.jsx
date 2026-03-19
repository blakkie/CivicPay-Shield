import { useState, useEffect, useCallback } from "react";

// ─── CONFIG ─────────────────────────────────────────────────────────────────
// TODO: In Vite project replace with: import.meta.env.VITE_API_BASE_URL
const API_BASE = "https://civicpay-shield.onrender.com";

// ─── DESIGN TOKENS (Stripe exact palette) ───────────────────────────────────
const T = {
  navy: "#0A2540",
  navyLight: "#1a3a5c",
  purple: "#635BFF",
  purpleHov: "#4F46E5",
  purpleSoft: "rgba(99,91,255,0.08)",
  cyan: "#00D4FF",
  green: "#09825D",
  greenBg: "#CBFFE4",
  greenText: "#0BBF6E",
  red: "#DF1B41",
  redBg: "#FFE4EA",
  amber: "#C47D0E",
  amberBg: "#FEF3C7",
  bg: "#F6F9FC",
  border: "#E3E8EE",
  borderLight: "#F0F4F8",
  text: "#1A1F36",
  muted: "#697386",
  subtle: "#8898AA",
  white: "#FFFFFF",
  shadow: "0 2px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
  shadowMd: "0 4px 8px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.06)",
  shadowLg: "0 24px 64px rgba(0,0,0,0.28)",
};

// ─── GLOBAL CSS ─────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cps { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; color: ${T.text}; background: ${T.bg}; min-height: 100vh; -webkit-font-smoothing: antialiased; }

  /* ── Inputs ── */
  .cps-input {
    width: 100%; padding: 10px 14px; border: 1px solid ${T.border};
    border-radius: 6px; font-size: 14px; color: ${T.text}; background: white;
    outline: none; transition: border-color .15s, box-shadow .15s;
    font-family: inherit;
  }
  .cps-input:focus { border-color: ${T.purple}; box-shadow: 0 0 0 3px rgba(99,91,255,.15); }
  .cps-input::placeholder { color: #aab7c4; }
  .cps-input:disabled { background: ${T.bg}; color: ${T.muted}; cursor: not-allowed; }

  .cps-label { display: block; font-size: 13px; font-weight: 500; color: ${T.text}; margin-bottom: 6px; }

  .cps-select {
    width: 100%; padding: 10px 40px 10px 14px; border: 1px solid ${T.border};
    border-radius: 6px; font-size: 14px; color: ${T.text}; background: white;
    appearance: none; outline: none; cursor: pointer; font-family: inherit;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23697386' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
    transition: border-color .15s, box-shadow .15s;
  }
  .cps-select:focus { border-color: ${T.purple}; box-shadow: 0 0 0 3px rgba(99,91,255,.15); }

  /* ── Buttons ── */
  .cps-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600;
    cursor: pointer; border: none; transition: all .15s; font-family: inherit;
    letter-spacing: -.01em; text-decoration: none; white-space: nowrap;
  }
  .cps-btn:disabled { opacity: .55; cursor: not-allowed; transform: none !important; }

  .cps-btn-primary { background: ${T.purple}; color: white; }
  .cps-btn-primary:hover:not(:disabled) { background: ${T.purpleHov}; box-shadow: 0 4px 14px rgba(99,91,255,.4); transform: translateY(-1px); }
  .cps-btn-primary:active:not(:disabled) { transform: scale(.99); box-shadow: none; }

  .cps-btn-outline { background: white; color: ${T.purple}; border: 1.5px solid ${T.purple}; }
  .cps-btn-outline:hover:not(:disabled) { background: ${T.purpleSoft}; }

  .cps-btn-ghost { background: rgba(255,255,255,.1); color: white; border: 1px solid rgba(255,255,255,.2); }
  .cps-btn-ghost:hover:not(:disabled) { background: rgba(255,255,255,.18); }

  .cps-btn-success { background: ${T.green}; color: white; }
  .cps-btn-success:hover:not(:disabled) { background: #076E4E; box-shadow: 0 4px 12px rgba(9,130,93,.35); transform: translateY(-1px); }

  .cps-btn-danger { background: ${T.red}; color: white; }
  .cps-btn-danger:hover:not(:disabled) { background: #B5142F; box-shadow: 0 4px 12px rgba(223,27,65,.3); transform: translateY(-1px); }

  .cps-btn-sm { padding: 7px 14px; font-size: 13px; }
  .cps-btn-lg { padding: 13px 24px; font-size: 15px; width: 100%; }

  /* ── Card ── */
  .cps-card { background: white; border-radius: 12px; box-shadow: ${T.shadow}; border: 1px solid ${T.border}; }

  /* ── Badge ── */
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 100px; font-size: 11.5px; font-weight: 600; letter-spacing: .02em; }
  .badge-success { background: ${T.greenBg}; color: ${T.green}; }
  .badge-danger  { background: ${T.redBg}; color: ${T.red}; }
  .badge-warning { background: ${T.amberBg}; color: ${T.amber}; }
  .badge-info    { background: rgba(0,212,255,.12); color: #0099BB; }
  .badge-purple  { background: rgba(99,91,255,.1); color: ${T.purple}; }

  /* ── Nav ── */
  .cps-nav {
    position: sticky; top: 0; z-index: 100; background: white;
    border-bottom: 1px solid ${T.border};
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; height: 60px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .cps-nav-logo { display: flex; align-items: center; gap: 10px; }
  .cps-nav-logo-text { font-size: 16px; font-weight: 700; color: ${T.navy}; letter-spacing: -.02em; }

  /* ── Table ── */
  .cps-table { width: 100%; border-collapse: collapse; }
  .cps-table th {
    text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: .06em; color: ${T.muted}; padding: 12px 16px; border-bottom: 1px solid ${T.border};
  }
  .cps-table td { padding: 14px 16px; border-bottom: 1px solid ${T.borderLight}; font-size: 14px; color: ${T.text}; }
  .cps-table tr:last-child td { border-bottom: none; }
  .cps-table tr:hover td { background: ${T.bg}; }

  /* ── Form group ── */
  .form-group { display: flex; flex-direction: column; gap: 6px; }

  /* ── Divider ── */
  .divider { height: 1px; background: ${T.border}; margin: 20px 0; }

  /* ── Alert ── */
  .cps-alert { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 8px; font-size: 13px; }
  .cps-alert-error { background: ${T.redBg}; color: ${T.red}; border: 1px solid rgba(223,27,65,.15); }
  .cps-alert-success { background: ${T.greenBg}; color: ${T.green}; border: 1px solid rgba(9,130,93,.2); }

  /* ── Payment method cards ── */
  .pay-method { border: 1.5px solid ${T.border}; border-radius: 8px; padding: 12px 16px; cursor: pointer; transition: all .15s; display: flex; align-items: center; gap: 10px; }
  .pay-method.selected { border-color: ${T.purple}; background: ${T.purpleSoft}; box-shadow: 0 0 0 3px rgba(99,91,255,.12); }
  .pay-method:hover:not(.selected) { border-color: #aab7c4; }

  /* ── QR Frame ── */
  .qr-frame { border: 2px dashed ${T.border}; border-radius: 12px; background: ${T.bg}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 40px 20px; }

  /* ── Stat card ── */
  .stat-card { background: white; border: 1px solid ${T.border}; border-radius: 12px; padding: 20px; }
  .stat-val { font-size: 24px; font-weight: 700; color: ${T.text}; letter-spacing: -.03em; }
  .stat-label { font-size: 12px; font-weight: 500; color: ${T.muted}; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 6px; }
  .stat-sub { font-size: 13px; color: ${T.muted}; margin-top: 4px; }

  /* ── Quick action button ── */
  .quick-action { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 12px; border-radius: 10px; cursor: pointer; transition: all .15s; border: 1px solid ${T.border}; background: white; }
  .quick-action:hover { background: ${T.purpleSoft}; border-color: ${T.purple}; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(99,91,255,.15); }
  .quick-action-icon { width: 40px; height: 40px; border-radius: 10px; background: ${T.purpleSoft}; display: flex; align-items: center; justify-content: center; }
  .quick-action-label { font-size: 12px; font-weight: 600; color: ${T.text}; }

  /* ── Animations ── */
  @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  /* ── Stripe-style floating shape animations ── */
  @keyframes floatA {
    0%,100% { transform: translate(0px,   0px) rotate(0deg)   scale(1); }
    25%     { transform: translate(30px, -45px) rotate(18deg)  scale(1.04); }
    50%     { transform: translate(-20px,-70px) rotate(-8deg)  scale(0.97); }
    75%     { transform: translate(-40px, 20px) rotate(12deg)  scale(1.02); }
  }
  @keyframes floatB {
    0%,100% { transform: translate(0px,   0px) rotate(0deg)   scale(1); }
    30%     { transform: translate(-35px, 50px) rotate(-22deg) scale(1.06); }
    60%     { transform: translate(50px,  30px) rotate(14deg)  scale(0.94); }
  }
  @keyframes floatC {
    0%,100% { transform: translate(0px,  0px)  rotate(0deg)   scale(1); }
    40%     { transform: translate(25px, 55px)  rotate(30deg)  scale(1.08); }
    80%     { transform: translate(-30px,15px)  rotate(-15deg) scale(0.95); }
  }
  @keyframes floatD {
    0%,100% { transform: translate(0px,   0px) rotate(0deg)   scale(1); }
    33%     { transform: translate(-25px,-40px) rotate(-20deg) scale(1.05); }
    66%     { transform: translate(40px, -20px) rotate(10deg)  scale(0.96); }
  }
  @keyframes floatE {
    0%,100% { transform: translate(0px,  0px)  rotate(0deg)   scale(1); }
    50%     { transform: translate(20px, 35px)  rotate(-25deg) scale(1.07); }
  }
  @keyframes driftSlow {
    0%,100% { transform: translate(0px, 0px); }
    50%     { transform: translate(18px, -24px); }
  }

  .anim-fadeup        { animation: fadeUp .4s cubic-bezier(.23,1,.32,1) forwards; }
  .anim-fadeup-d1     { opacity:0; animation: fadeUp .4s cubic-bezier(.23,1,.32,1) .07s forwards; }
  .anim-fadeup-d2     { opacity:0; animation: fadeUp .4s cubic-bezier(.23,1,.32,1) .14s forwards; }
  .anim-fadeup-d3     { opacity:0; animation: fadeUp .4s cubic-bezier(.23,1,.32,1) .21s forwards; }
  .anim-fadeup-d4     { opacity:0; animation: fadeUp .4s cubic-bezier(.23,1,.32,1) .28s forwards; }

  .spinner { width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite; }
  .spinner-dark { border-color:rgba(99,91,255,.3);border-top-color:${T.purple}; }

  ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
`;

// ─── SHARED HELPERS ──────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

async function apiFetch(path, options = {}, token = null) {
  const headers = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || `Error ${res.status}`);
  return data;
}

// ─── MOCK DATA (fallback when backend unavailable) ───────────────────────────
const MOCK_TRANSACTIONS = [
  { id: "TXN-001", levy_type: "Transport Levy", amount: 1000, payer_name: "John Doe", status: "paid",    created_at: "2026-03-18T10:30:00Z", receipt_id: "RCT-001" },
  { id: "TXN-002", levy_type: "Market Fee",     amount: 500,  payer_name: "Jane Smith", status: "paid",  created_at: "2026-03-17T08:15:00Z", receipt_id: "RCT-002" },
  { id: "TXN-003", levy_type: "Transport Levy", amount: 300,  payer_name: "John Doe",   status: "paid",  created_at: "2026-03-16T14:20:00Z", receipt_id: "RCT-003" },
  { id: "TXN-004", levy_type: "Signage Fee",    amount: 2500, payer_name: "Amaka Obi",  status: "pending", created_at: "2026-03-15T09:00:00Z", receipt_id: "RCT-004" },
];
const MOCK_STATS = { total_volume: 4300, transaction_count: 4, pending_count: 1, verified_count: 3 };

// ─── SVG ICONS ───────────────────────────────────────────────────────────────
const Icons = {
  Shield: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 7v5c0 5.25 3.84 10.14 9 11.33C17.16 22.14 21 17.25 21 12V7L12 2Z" fill="white" opacity=".95"/>
      <path d="M9 12.5l2 2 4-4" stroke={T.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ShieldColored: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 7v5c0 5.25 3.84 10.14 9 11.33C17.16 22.14 21 17.25 21 12V7L12 2Z" fill={T.purple} opacity=".15"/>
      <path d="M12 2L3 7v5c0 5.25 3.84 10.14 9 11.33C17.16 22.14 21 17.25 21 12V7L12 2Z" stroke={T.purple} strokeWidth="1.5" fill="none"/>
      <path d="M9 12.5l2 2 4-4" stroke={T.purple} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  CreditCard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Bank: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 9 12 4 21 9"/><line x1="12" y1="4" x2="12" y2="20"/>
      <rect x="3" y="9" width="4" height="11"/><rect x="10" y="9" width="4" height="11"/><rect x="17" y="9" width="4" height="11"/>
      <line x1="1" y1="20" x2="23" y2="20"/>
    </svg>
  ),
  Receipt: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/>
    </svg>
  ),
  History: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.46"/>
      <polyline points="12 7 12 12 15 15"/>
    </svg>
  ),
  QR: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
      <rect x="19" y="14" width="2" height="2"/><rect x="14" y="19" width="2" height="2"/><rect x="19" y="19" width="2" height="2"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  LogOut: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Alert: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Pay: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
};

// ─── NAV COMPONENT ───────────────────────────────────────────────────────────
function Nav({ user, onLogout, onBack, title }) {
  return (
    <header className="cps-nav">
      <div className="cps-nav-logo">
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: 6, color: T.muted, display: "flex", alignItems: "center", marginRight: 4, transition: "background .15s" }}
            onMouseEnter={e => e.currentTarget.style.background = T.bg}
            onMouseLeave={e => e.currentTarget.style.background = "none"}>
            <Icons.ArrowLeft />
          </button>
        )}
        <div style={{ width: 32, height: 32, background: T.navy, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icons.Shield />
        </div>
        <span className="cps-nav-logo-text">{title || "CivicPay Shield"}</span>
      </div>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{user.name || user.username || "User"}</div>
            <div style={{ fontSize: 11, color: T.muted, textTransform: "capitalize" }}>{user.role || "citizen"}</div>
          </div>
          <div style={{ width: 34, height: 34, background: T.purpleSoft, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: T.purple }}>
            {(user.name || user.username || "U")[0].toUpperCase()}
          </div>
          <button onClick={onLogout} style={{ background: "none", border: "none", cursor: "pointer", padding: "7px 10px", borderRadius: 6, color: T.muted, display: "flex", alignItems: "center", gap: 5, fontSize: 13, transition: "all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = T.bg; e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = T.muted; }}>
            <Icons.LogOut /> <span style={{ display: "none" }}>Sign out</span>
          </button>
        </div>
      )}
    </header>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [showReg, setShowReg]       = useState(false);
  // Registration state
  const [regData, setRegData]       = useState({ name: "", email: "", phone: "", password: "", role: "citizen" });
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError]     = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  const handleLogin = async (role) => {
    if (!identifier.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const data = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ identifier: identifier.trim(), password, role }) });
      onLogin({ token: data.access_token, user: { ...data.user, role }, role });
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!regData.name || !regData.email || !regData.password) { setRegError("Name, email and password are required."); return; }
    setRegLoading(true); setRegError("");
    try {
      await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(regData) });
      setRegSuccess(true);
      setTimeout(() => { setShowReg(false); setRegSuccess(false); }, 2500);
    } catch (err) { setRegError(err.message); }
    finally { setRegLoading(false); }
  };

  // ── Green ecosystem palette ──────────────────────────────────────────────
  // Base: near-black forest. Blobs: genius green, teal-mint, electric lime,
  // cyan-seafoam, deep emerald — all the same hue family so overlaps glow
  // naturally rather than clashing.
  return (
    <div style={{ minHeight: "100vh", background: "#050F0A", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", position: "relative", overflow: "hidden" }}>

      {/* ════════════════════════════════════════════════════════════════
          STRIPE-EXACT BLOB LAYER
          — organic border-radius shapes
          — heavy filter:blur (no radial-gradient, flat color = more vivid)
          — slow independent rotation + translation per blob
          — grain overlay to match Stripe micro-texture
      ════════════════════════════════════════════════════════════════ */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>

        {/* Blob 1 — Genius green #00C853 · large anchor · top-left */}
        <div style={{
          position: "absolute", top: "-18%", left: "-14%",
          width: 700, height: 640,
          background: "#00C853", opacity: 0.55, filter: "blur(118px)",
          borderRadius: "63% 37% 54% 46% / 55% 48% 52% 45%",
          animation: "stripeBlob1 30s ease-in-out infinite",
          willChange: "transform",
        }} />

        {/* Blob 2 — Teal-mint #00BFA5 · top-right */}
        <div style={{
          position: "absolute", top: "-22%", right: "-10%",
          width: 580, height: 530,
          background: "#00BFA5", opacity: 0.40, filter: "blur(108px)",
          borderRadius: "42% 58% 67% 33% / 47% 60% 40% 53%",
          animation: "stripeBlob2 36s ease-in-out infinite",
          willChange: "transform",
        }} />

        {/* Blob 3 — Electric lime #76FF03 · centre-right */}
        <div style={{
          position: "absolute", top: "20%", right: "-16%",
          width: 510, height: 470,
          background: "#76FF03", opacity: 0.28, filter: "blur(130px)",
          borderRadius: "71% 29% 44% 56% / 61% 35% 65% 39%",
          animation: "stripeBlob3 24s ease-in-out infinite",
          willChange: "transform",
        }} />

        {/* Blob 4 — Cyan-seafoam #1DE9B6 · bottom-right */}
        <div style={{
          position: "absolute", bottom: "-16%", right: "2%",
          width: 490, height: 450,
          background: "#1DE9B6", opacity: 0.32, filter: "blur(102px)",
          borderRadius: "55% 45% 38% 62% / 49% 67% 33% 51%",
          animation: "stripeBlob4 28s ease-in-out infinite",
          willChange: "transform",
        }} />

        {/* Blob 5 — Deep emerald #00695C · bottom-left */}
        <div style={{
          position: "absolute", bottom: "-20%", left: "3%",
          width: 560, height: 500,
          background: "#00695C", opacity: 0.50, filter: "blur(112px)",
          borderRadius: "38% 62% 57% 43% / 44% 52% 48% 56%",
          animation: "stripeBlob5 22s ease-in-out infinite",
          willChange: "transform",
        }} />

        {/* Blob 6 — Lime-white hotspot · centre · very faint */}
        <div style={{
          position: "absolute", top: "36%", left: "32%",
          width: 320, height: 300,
          background: "#CCFF90", opacity: 0.10, filter: "blur(90px)",
          borderRadius: "50%",
          animation: "stripeBlob2 18s ease-in-out 6s infinite",
          willChange: "transform",
        }} />

        {/* Grain noise — matches Stripe's micro-texture */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.38,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat", backgroundSize: "160px 160px",
          mixBlendMode: "screen",
        }} />

        {/* ── FLOATING 3D SHAPES — green family, drifting above the blobs ── */}

        {/* Shape 1: Large genius-green sphere · top-left */}
        <div style={{ position:"absolute", top:"-55px", left:"-35px", width:240, height:240, borderRadius:"50%",
          background:"radial-gradient(circle at 34% 28%, rgba(0,230,100,.96) 0%, rgba(0,200,83,.85) 40%, rgba(0,130,55,.70) 100%)",
          boxShadow:"0 28px 72px rgba(0,200,83,.40), inset 0 -8px 20px rgba(0,80,30,.45), inset 0 8px 16px rgba(160,255,200,.50)",
          animation:"floatA 20s ease-in-out infinite", willChange:"transform" }} />
        <div style={{ position:"absolute", top:"-28px", left:"-6px", width:76, height:56, borderRadius:"50%",
          background:"radial-gradient(ellipse, rgba(255,255,255,.52) 0%, transparent 70%)",
          animation:"floatA 20s ease-in-out infinite", pointerEvents:"none" }} />

        {/* Shape 2: Teal-mint elongated pill · top-right */}
        <div style={{ position:"absolute", top:"5%", right:"-28px", width:195, height:115, borderRadius:"58px",
          background:"radial-gradient(ellipse at 40% 30%, rgba(100,255,220,.95) 0%, rgba(0,191,165,.88) 45%, rgba(0,120,105,.75) 100%)",
          boxShadow:"0 18px 55px rgba(0,191,165,.38), inset 0 -6px 14px rgba(0,80,70,.38), inset 0 6px 12px rgba(160,255,236,.48)",
          transform:"rotate(-18deg)", animation:"floatB 17s ease-in-out infinite", willChange:"transform" }} />
        <div style={{ position:"absolute", top:"6%", right:"27px", width:58, height:28, borderRadius:"50%",
          background:"radial-gradient(ellipse, rgba(255,255,255,.48) 0%, transparent 70%)",
          transform:"rotate(-18deg)", animation:"floatB 17s ease-in-out infinite", pointerEvents:"none" }} />

        {/* Shape 3: Electric-lime sphere · right-middle */}
        <div style={{ position:"absolute", top:"37%", right:"-18px", width:175, height:175, borderRadius:"50%",
          background:"radial-gradient(circle at 38% 32%, rgba(200,255,80,.95) 0%, rgba(118,255,3,.85) 45%, rgba(70,160,0,.72) 100%)",
          boxShadow:"0 22px 56px rgba(118,255,3,.30), inset 0 -6px 16px rgba(40,100,0,.40), inset 0 6px 14px rgba(220,255,160,.50)",
          animation:"floatC 23s ease-in-out 2s infinite", willChange:"transform" }} />
        <div style={{ position:"absolute", top:"38%", right:"30px", width:54, height:40, borderRadius:"50%",
          background:"radial-gradient(ellipse, rgba(255,255,255,.46) 0%, transparent 70%)",
          animation:"floatC 23s ease-in-out 2s infinite", pointerEvents:"none" }} />

        {/* Shape 4: Deep-emerald rounded slab · bottom-left */}
        <div style={{ position:"absolute", bottom:"7%", left:"-28px", width:215, height:135, borderRadius:"26px",
          background:"radial-gradient(ellipse at 38% 30%, rgba(80,220,170,.95) 0%, rgba(0,150,100,.88) 45%, rgba(0,100,70,.75) 100%)",
          boxShadow:"0 22px 56px rgba(0,150,100,.30), inset 0 -6px 14px rgba(0,60,40,.38), inset 0 6px 12px rgba(140,255,210,.48)",
          transform:"rotate(13deg)", animation:"floatD 19s ease-in-out 1s infinite", willChange:"transform" }} />
        <div style={{ position:"absolute", bottom:"12%", left:"10px", width:62, height:34, borderRadius:"50%",
          background:"radial-gradient(ellipse, rgba(255,255,255,.44) 0%, transparent 70%)",
          transform:"rotate(13deg)", animation:"floatD 19s ease-in-out 1s infinite", pointerEvents:"none" }} />

        {/* Shape 5: Cyan-seafoam small sphere · bottom-right */}
        <div style={{ position:"absolute", bottom:"11%", right:"7%", width:125, height:125, borderRadius:"50%",
          background:"radial-gradient(circle at 38% 32%, rgba(140,255,235,.95) 0%, rgba(29,233,182,.88) 45%, rgba(0,150,120,.76) 100%)",
          boxShadow:"0 18px 48px rgba(29,233,182,.30), inset 0 -5px 12px rgba(0,90,70,.38), inset 0 5px 10px rgba(180,255,240,.50)",
          animation:"floatE 15s ease-in-out 3s infinite", willChange:"transform" }} />
        <div style={{ position:"absolute", bottom:"15%", right:"10%", width:40, height:28, borderRadius:"50%",
          background:"radial-gradient(ellipse, rgba(255,255,255,.46) 0%, transparent 70%)",
          animation:"floatE 15s ease-in-out 3s infinite", pointerEvents:"none" }} />

        {/* Shape 6: Lime-green small disc · upper-centre-left */}
        <div style={{ position:"absolute", top:"21%", left:"5%", width:86, height:86, borderRadius:"50%",
          background:"radial-gradient(circle at 38% 32%, rgba(180,255,100,.90) 0%, rgba(118,255,3,.80) 55%, rgba(60,160,0,.70) 100%)",
          boxShadow:"0 12px 36px rgba(118,255,3,.28), inset 0 -4px 10px rgba(30,80,0,.40), inset 0 4px 8px rgba(210,255,160,.44)",
          animation:"floatB 25s ease-in-out 4s infinite", willChange:"transform" }} />

        {/* Shape 7: Teal twisted ribbon · centre-right top */}
        <div style={{ position:"absolute", top:"15%", right:"13%", width:155, height:58, borderRadius:"29px",
          background:"linear-gradient(105deg, rgba(0,230,180,.88) 0%, rgba(0,191,165,.84) 50%, rgba(0,150,120,.78) 100%)",
          boxShadow:"0 12px 36px rgba(0,191,165,.28), inset 0 -4px 10px rgba(0,70,60,.32), inset 0 4px 8px rgba(160,255,235,.40)",
          transform:"rotate(-28deg)", animation:"floatA 26s ease-in-out 6s infinite", willChange:"transform" }} />
        <div style={{ position:"absolute", top:"16%", right:"25%", width:46, height:20, borderRadius:"50%",
          background:"radial-gradient(ellipse, rgba(255,255,255,.40) 0%, transparent 70%)",
          transform:"rotate(-28deg)", animation:"floatA 26s ease-in-out 6s infinite", pointerEvents:"none" }} />

        {/* Shape 8: Pale-lime mini pill · lower-centre */}
        <div style={{ position:"absolute", bottom:"27%", left:"13%", width:96, height:48, borderRadius:"24px",
          background:"radial-gradient(ellipse at 40% 30%, rgba(220,255,160,.90) 0%, rgba(180,230,80,.82) 55%, rgba(120,170,30,.72) 100%)",
          boxShadow:"0 10px 30px rgba(180,230,80,.26), inset 0 -3px 8px rgba(70,100,0,.30), inset 0 3px 7px rgba(240,255,200,.40)",
          transform:"rotate(20deg)", animation:"floatC 21s ease-in-out 5s infinite", willChange:"transform" }} />

      </div>

      {/* ── CONTENT ── */}
      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>

        {/* Badge */}
        <div className="anim-fadeup" style={{ textAlign: "center", marginBottom: 20 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,200,83,.10)", border: "1px solid rgba(0,200,83,.24)", borderRadius: 100, padding: "5px 14px" }}>
            <Icons.ShieldColored size={11} />
            <span style={{ fontSize: 11, color: "#00E676", letterSpacing: ".06em", textTransform: "uppercase", fontWeight: 700, opacity: .88 }}>Enyata × Interswitch Buildathon 2026</span>
          </span>
        </div>

        {/* ── Dark frosted-glass card ── */}
        <div className="anim-fadeup-d1" style={{
          background: "rgba(5,15,10,0.58)",
          backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
          borderRadius: 18, padding: "36px 32px",
          boxShadow: "0 0 0 1px rgba(0,200,83,.16), 0 30px 80px rgba(0,0,0,.65), 0 8px 22px rgba(0,180,70,.08)",
          border: "1px solid rgba(255,255,255,.06)",
        }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, background: "rgba(0,200,83,.14)", border: "1px solid rgba(0,200,83,.30)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 0 24px rgba(0,200,83,.20)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v5c0 5.25 3.84 10.14 9 11.33C17.16 22.14 21 17.25 21 12V7L12 2Z" fill="#00C853" opacity=".22"/>
                <path d="M12 2L3 7v5c0 5.25 3.84 10.14 9 11.33C17.16 22.14 21 17.25 21 12V7L12 2Z" stroke="#00C853" strokeWidth="1.6"/>
                <path d="M9 12.5l2 2 4-4" stroke="#00E676" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "white", letterSpacing: "-.03em", marginBottom: 4 }}>CivicPay Shield</h1>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.42)" }}>Secure Government Payment Portal</p>
          </div>

          {!showReg ? (
            <>
              {error && (
                <div className="cps-alert cps-alert-error anim-fadeup" style={{ marginBottom: 16 }}>
                  <Icons.Alert /><span>{error}</span>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="form-group">
                  <label className="cps-label" style={{ color: "rgba(255,255,255,.65)" }}>Email or Phone</label>
                  <input className="cps-input" type="text" placeholder="user@example.com" value={identifier} onChange={e => setIdentifier(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin("citizen")} style={{ background: "rgba(255,255,255,.07)", color: "white", borderColor: "rgba(255,255,255,.12)" }} />
                </div>
                <div className="form-group">
                  <label className="cps-label" style={{ color: "rgba(255,255,255,.65)" }}>Password</label>
                  <input className="cps-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin("citizen")} style={{ background: "rgba(255,255,255,.07)", color: "white", borderColor: "rgba(255,255,255,.12)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
                  <button className="cps-btn cps-btn-lg" onClick={() => handleLogin("citizen")} disabled={loading} style={{ background: "#00C853", color: "#03120A", fontWeight: 700, boxShadow: "0 4px 22px rgba(0,200,83,.38)" }}>
                    {loading ? <><span className="spinner" style={{ borderColor: "rgba(0,0,0,.25)", borderTopColor: "#03120A" }} />Signing in…</> : "Login as Citizen"}
                  </button>
                  <button className="cps-btn cps-btn-lg" onClick={() => handleLogin("collector")} disabled={loading} style={{ background: "rgba(255,255,255,.07)", color: "rgba(255,255,255,.82)", border: "1px solid rgba(255,255,255,.13)" }}>
                    Login as Collector / Admin
                  </button>
                </div>
              </div>
              <div style={{ marginTop: 22, textAlign: "center" }}>
                <span style={{ fontSize: 13.5, color: "rgba(255,255,255,.36)" }}>New here? </span>
                <button onClick={() => setShowReg(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13.5, color: "#00E676", fontWeight: 600, fontFamily: "inherit", padding: 0 }}>Create an account →</button>
              </div>
              <div style={{ marginTop: 10, textAlign: "center" }}>
                <a href="#" style={{ fontSize: 13, color: "rgba(255,255,255,.30)", textDecoration: "none" }}>Forgot password?</a>
              </div>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 18 }}>Create your account</h2>
              {regSuccess && <div className="cps-alert cps-alert-success" style={{ marginBottom: 16 }}><Icons.Check /><span>Account created! You can now log in.</span></div>}
              {regError && <div className="cps-alert cps-alert-error" style={{ marginBottom: 16 }}><Icons.Alert /><span>{regError}</span></div>}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[["Full Name","text","John Doe","name"],["Email","email","you@example.com","email"],["Phone (optional)","tel","+234 800 000 0000","phone"],["Password","password","••••••••","password"]].map(([lbl,type,ph,key]) => (
                  <div className="form-group" key={key}>
                    <label className="cps-label" style={{ color: "rgba(255,255,255,.65)" }}>{lbl}</label>
                    <input className="cps-input" type={type} placeholder={ph} value={regData[key]} onChange={e => setRegData(p => ({ ...p, [key]: e.target.value }))} style={{ background: "rgba(255,255,255,.07)", color: "white", borderColor: "rgba(255,255,255,.12)" }} />
                  </div>
                ))}
                <div className="form-group">
                  <label className="cps-label" style={{ color: "rgba(255,255,255,.65)" }}>Account Role</label>
                  <select className="cps-select" value={regData.role} onChange={e => setRegData(p => ({ ...p, role: e.target.value }))} style={{ background: "rgba(255,255,255,.07)", color: "white", borderColor: "rgba(255,255,255,.12)" }}>
                    <option value="citizen">Citizen</option>
                    <option value="collector">Field Collector</option>
                  </select>
                </div>
                <button className="cps-btn cps-btn-lg" onClick={handleRegister} disabled={regLoading} style={{ marginTop: 4, background: "#00C853", color: "#03120A", fontWeight: 700, boxShadow: "0 4px 22px rgba(0,200,83,.38)" }}>
                  {regLoading ? <><span className="spinner" style={{ borderColor: "rgba(0,0,0,.25)", borderTopColor: "#03120A" }} />Creating account…</> : "Create Account"}
                </button>
              </div>
              <div style={{ marginTop: 18, textAlign: "center" }}>
                <button onClick={() => setShowReg(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "rgba(255,255,255,.38)", fontFamily: "inherit" }}>← Back to login</button>
              </div>
            </>
          )}

          <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Icons.ShieldColored size={12} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,.25)", letterSpacing: ".03em" }}>256-bit TLS · Powered by Interswitch</span>
          </div>
        </div>

        <p className="anim-fadeup-d2" style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "rgba(255,255,255,.18)" }}>
          © 2026 CivicPay Shield · Enyata x Interswitch
        </p>
      </div>
    </div>
  );
}

// ─── CITIZEN DASHBOARD ───────────────────────────────────────────────────────
function CitizenDashboard({ session, onLogout, onPayLevy }) {
  const { token, user } = session;
  const [txns, setTxns]       = useState(MOCK_TRANSACTIONS.filter(t => t.payer_name === "John Doe"));
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(user?.balance ?? 12500);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch("/api/payments/history", {}, token);
        setTxns(data.transactions || data);
        if (data.balance !== undefined) setBalance(data.balance);
      } catch { /* use mock */ }
      finally { setLoading(false); }
    };
    load();
  }, [token]);

  const paidTxns = txns.filter(t => t.status === "paid" || t.status === "completed");
  const totalPaid = paidTxns.reduce((s, t) => s + (t.amount || 0), 0);

  return (
    <div className="cps" style={{ minHeight: "100vh", background: T.bg }}>
      <Nav user={user} onLogout={onLogout} />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 48px" }}>

        {/* Hero balance card */}
        <div className="anim-fadeup" style={{ borderRadius: 16, padding: "28px 28px 24px", marginBottom: 24, position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${T.navy} 0%, #1a3a5c 45%, #2d1b69 100%)` }}>
          {/* Decorative blobs */}
          <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,91,255,.4) 0%, transparent 70%)", top: -80, right: -60 }} />
          <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,.2) 0%, transparent 70%)", bottom: -60, left: 40 }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.55)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Account Balance</p>
                <div style={{ fontSize: 38, fontWeight: 800, color: "white", letterSpacing: "-.04em", lineHeight: 1 }}>{fmt(balance)}</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.55)", marginTop: 8 }}>Welcome back, {user?.name || user?.username || "there"} 👋</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className="badge badge-success" style={{ fontSize: 11, marginBottom: 8 }}><Icons.Check /> Active</span>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 4 }}>Citizen Account</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
              {[{ label: "Total Paid", val: fmt(totalPaid) }, { label: "Transactions", val: txns.length }, { label: "This Month", val: fmt(paidTxns.slice(0, 2).reduce((s, t) => s + t.amount, 0)) }]
                .map((s, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,.08)", borderRadius: 10, padding: "10px 16px", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,.1)" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>{s.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "white", marginTop: 3 }}>{s.val}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="anim-fadeup-d1" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { icon: <Icons.Pay />, label: "Pay Levy", action: onPayLevy, accent: T.purple },
            { icon: <Icons.Receipt />, label: "My Receipts", action: () => {}, accent: T.green },
            { icon: <Icons.History />, label: "History", action: () => {}, accent: T.amber },
          ].map((a, i) => (
            <button key={i} className="quick-action" onClick={a.action}>
              <div className="quick-action-icon" style={{ background: `${a.accent}18`, color: a.accent }}>
                {a.icon}
              </div>
              <span className="quick-action-label">{a.label}</span>
            </button>
          ))}
        </div>

        {/* Transactions table */}
        <div className="cps-card anim-fadeup-d2">
          <div style={{ padding: "18px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.border}` }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Recent Transactions</h2>
              <p style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>{txns.length} payment{txns.length !== 1 ? "s" : ""} on record</p>
            </div>
            <button className="cps-btn cps-btn-primary cps-btn-sm" onClick={onPayLevy}>+ Pay Levy</button>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <div className="spinner spinner-dark" style={{ margin: "0 auto" }} />
            </div>
          ) : txns.length === 0 ? (
            <div style={{ padding: "48px 20px", textAlign: "center", color: T.muted }}>
              <Icons.Pay />
              <p style={{ marginTop: 12, fontSize: 14 }}>No transactions yet. Pay your first levy!</p>
              <button className="cps-btn cps-btn-primary cps-btn-sm" style={{ marginTop: 12 }} onClick={onPayLevy}>Pay Levy</button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="cps-table">
                <thead>
                  <tr>
                    {["Receipt ID", "Levy Type", "Amount", "Date", "Status"].map(h => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {txns.map(t => (
                    <tr key={t.id}>
                      <td style={{ fontFamily: "monospace", fontSize: 12, color: T.muted }}>{t.receipt_id || t.id}</td>
                      <td style={{ fontWeight: 500 }}>{t.levy_type}</td>
                      <td style={{ fontWeight: 600, color: T.text }}>{fmt(t.amount)}</td>
                      <td style={{ color: T.muted }}>{fmtDate(t.created_at)}</td>
                      <td>
                        <span className={`badge badge-${t.status === "paid" || t.status === "completed" ? "success" : t.status === "pending" ? "warning" : "danger"}`}>
                          {t.status === "paid" || t.status === "completed" ? <Icons.Check /> : null}
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── PAY LEVY SCREEN ─────────────────────────────────────────────────────────
function PayLevyScreen({ session, onBack, onSuccess }) {
  const { token, user } = session;
  const [form, setForm]     = useState({ levy_type: "Transport Levy", amount: "", payer_name: user?.name || "", vehicle_number: "" });
  const [payMethod, setPayMethod] = useState("card");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(null);

  const LEVY_TYPES = ["Transport Levy", "Market Fee", "Signage Fee", "Waste Management Fee", "Development Levy"];
  const AMOUNTS    = { "Transport Levy": [300, 500, 1000], "Market Fee": [200, 500, 1000], "Signage Fee": [1000, 2500, 5000], "Waste Management Fee": [500, 1000], "Development Levy": [2000, 5000] };

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handlePay = async () => {
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) { setError("Enter a valid amount."); return; }
    if (!form.payer_name.trim()) { setError("Payer name is required."); return; }
    setLoading(true); setError("");
    try {
      const data = await apiFetch("/api/payments/initialize", {
        method: "POST", body: JSON.stringify({ ...form, amount: +form.amount, payment_method: payMethod }),
      }, token);
      setSuccess(data);
    } catch (err) {
      // Demo mode fallback
      setSuccess({ receipt_id: `RCT-${Date.now()}`, amount: +form.amount, levy_type: form.levy_type, status: "paid", message: "Payment successful (demo mode)" });
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="cps" style={{ minHeight: "100vh", background: T.bg }}>
        <Nav user={user} onLogout={onBack} onBack={onBack} title="Payment Receipt" />
        <main style={{ maxWidth: 520, margin: "40px auto", padding: "0 16px" }}>
          <div className="cps-card anim-fadeup" style={{ padding: "40px 32px", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, background: T.greenBg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: T.green }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: T.text, marginBottom: 6 }}>Payment Successful!</h2>
            <p style={{ fontSize: 14, color: T.muted, marginBottom: 28 }}>Your levy has been recorded and a receipt generated.</p>

            <div style={{ background: T.bg, borderRadius: 10, padding: "20px", textAlign: "left", marginBottom: 24 }}>
              {[["Receipt ID", success.receipt_id], ["Levy Type", success.levy_type || form.levy_type], ["Amount", fmt(success.amount || form.amount)], ["Status", success.status || "paid"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 14 }}>
                  <span style={{ color: T.muted, fontWeight: 500 }}>{k}</span>
                  <span style={{ fontWeight: 600, color: T.text, fontFamily: k === "Receipt ID" ? "monospace" : "inherit" }}>{String(v)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="cps-btn cps-btn-outline" style={{ flex: 1 }} onClick={onBack}>← Dashboard</button>
              <button className="cps-btn cps-btn-primary" style={{ flex: 1 }} onClick={() => { setSuccess(null); setForm(p => ({ ...p, amount: "" })); }}>New Payment</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="cps" style={{ minHeight: "100vh", background: T.bg }}>
      <Nav user={user} onLogout={onBack} onBack={onBack} title="Pay Levy" />

      <main style={{ maxWidth: 580, margin: "28px auto", padding: "0 16px 48px" }}>
        <div className="cps-card anim-fadeup">
          <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${T.border}` }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Make a Levy Payment</h2>
            <p style={{ fontSize: 13, color: T.muted, marginTop: 3 }}>All payments are secured and receipted</p>
          </div>

          <div style={{ padding: "24px" }}>
            {error && <div className="cps-alert cps-alert-error anim-fadeup" style={{ marginBottom: 18 }}><Icons.Alert /><span>{error}</span></div>}

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Levy type */}
              <div className="form-group">
                <label className="cps-label">Levy Type</label>
                <select className="cps-select" value={form.levy_type} onChange={e => upd("levy_type", e.target.value)}>
                  {LEVY_TYPES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              {/* Quick amount selection */}
              <div className="form-group">
                <label className="cps-label">Amount (₦)</label>
                <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  {(AMOUNTS[form.levy_type] || []).map(a => (
                    <button key={a} onClick={() => upd("amount", String(a))} style={{ padding: "5px 12px", borderRadius: 6, border: `1.5px solid ${form.amount === String(a) ? T.purple : T.border}`, background: form.amount === String(a) ? T.purpleSoft : "white", color: form.amount === String(a) ? T.purple : T.text, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s", fontFamily: "inherit" }}>
                      {fmt(a)}
                    </button>
                  ))}
                </div>
                <input className="cps-input" type="number" placeholder="Or enter custom amount" value={form.amount} onChange={e => upd("amount", e.target.value)} />
              </div>

              {/* Payer name */}
              <div className="form-group">
                <label className="cps-label">Payer Name</label>
                <input className="cps-input" placeholder="Full name" value={form.payer_name} onChange={e => upd("payer_name", e.target.value)} />
              </div>

              {/* Vehicle number */}
              <div className="form-group">
                <label className="cps-label">Vehicle Number <span style={{ color: T.muted, fontWeight: 400 }}>(optional, for transport levies)</span></label>
                <input className="cps-input" placeholder="e.g. LGS-123-XY" value={form.vehicle_number} onChange={e => upd("vehicle_number", e.target.value)} />
              </div>

              {/* Payment method */}
              <div className="form-group">
                <label className="cps-label">Payment Method</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {[{ id: "card", label: "Debit Card", icon: <Icons.CreditCard /> }, { id: "bank_transfer", label: "Bank Transfer", icon: <Icons.Bank /> }].map(m => (
                    <div key={m.id} className={`pay-method${payMethod === m.id ? " selected" : ""}`} style={{ flex: 1 }} onClick={() => setPayMethod(m.id)}>
                      <div style={{ color: payMethod === m.id ? T.purple : T.muted }}>{m.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: payMethod === m.id ? T.purple : T.text }}>{m.label}</div>
                      </div>
                      {payMethod === m.id && <div style={{ marginLeft: "auto", color: T.purple }}><Icons.Check /></div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {form.amount && (
                <div className="anim-fadeup" style={{ background: T.bg, borderRadius: 10, padding: "14px 16px", border: `1px solid ${T.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: T.muted }}>Payment total</span>
                    <span style={{ fontWeight: 800, fontSize: 18, color: T.text, letterSpacing: "-.02em" }}>{fmt(+form.amount || 0)}</span>
                  </div>
                </div>
              )}

              <button className="cps-btn cps-btn-primary cps-btn-lg" onClick={handlePay} disabled={loading || !form.amount || !form.payer_name}>
                {loading ? <><span className="spinner" />Processing…</> : <>Pay {form.amount ? fmt(+form.amount) : "Now"}</>}
              </button>
            </div>
          </div>
        </div>

        {/* Security notice */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16 }}>
          <Icons.ShieldColored size={13} />
          <span style={{ fontSize: 12, color: T.muted }}>Secured by Interswitch · Encrypted payments</span>
        </div>
      </main>
    </div>
  );
}

// ─── COLLECTOR DASHBOARD ──────────────────────────────────────────────────────
function CollectorDashboard({ session, onLogout }) {
  const { token, user } = session;
  const [receiptId, setReceiptId]       = useState("");
  const [verResult, setVerResult]       = useState(null);
  const [verLoading, setVerLoading]     = useState(false);
  const [verError, setVerError]         = useState("");
  const [txns, setTxns]                 = useState([]);
  const [stats, setStats]               = useState(MOCK_STATS);
  const [txnLoading, setTxnLoading]     = useState(true);
  const [flagging, setFlagging]         = useState(false);
  const [approving, setApproving]       = useState(false);
  const [actionMsg, setActionMsg]       = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch("/api/admin/transactions", {}, token);
        setTxns(data.transactions || data);
        if (data.stats) setStats(data.stats);
      } catch { setTxns(MOCK_TRANSACTIONS); }
      finally { setTxnLoading(false); }
    };
    load();
  }, [token]);

  const handleVerify = async () => {
    if (!receiptId.trim()) { setVerError("Enter a Receipt ID."); return; }
    setVerLoading(true); setVerError(""); setVerResult(null); setActionMsg("");
    try {
      const data = await apiFetch(`/api/payments/verify/${receiptId.trim()}`, {}, token);
      setVerResult(data);
    } catch {
      const mock = MOCK_TRANSACTIONS.find(t => t.receipt_id === receiptId.trim() || t.id === receiptId.trim());
      if (mock) setVerResult({ ...mock, is_valid: mock.status === "paid" });
      else setVerError("Receipt not found. Check the ID and try again.");
    }
    finally { setVerLoading(false); }
  };

  const handleAction = async (action) => {
    const setL = action === "approve" ? setApproving : setFlagging;
    setL(true); setActionMsg("");
    try {
      await apiFetch(`/api/admin/transactions/${verResult.id}/${action}`, { method: "POST" }, token);
      setActionMsg(action === "approve" ? "Transaction approved successfully." : "Transaction flagged for review.");
      setVerResult(p => ({ ...p, status: action === "approve" ? "paid" : "flagged", is_valid: action === "approve" }));
    } catch { setActionMsg(`${action === "approve" ? "Approved" : "Flagged"} (demo mode).`); }
    finally { setL(false); }
  };

  return (
    <div className="cps" style={{ minHeight: "100vh", background: T.bg }}>
      <Nav user={user} onLogout={onLogout} />

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px 48px" }}>

        {/* Header */}
        <div className="anim-fadeup" style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: "-.03em" }}>Collector Dashboard</h1>
          <p style={{ fontSize: 14, color: T.muted, marginTop: 4 }}>Verify payments and manage levy collections</p>
        </div>

        {/* Stats */}
        <div className="anim-fadeup-d1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Total Volume", val: fmt(stats.total_volume), sub: "All time collected", color: T.purple },
            { label: "Transactions", val: stats.transaction_count, sub: "Total on record", color: T.navy },
            { label: "Verified", val: stats.verified_count, sub: "Approved payments", color: T.green },
            { label: "Pending", val: stats.pending_count, sub: "Awaiting review", color: T.amber },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
          {/* Left: Verification panel */}
          <div>
            <div className="cps-card anim-fadeup-d2" style={{ marginBottom: 16 }}>
              <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${T.border}` }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Verify Payment</h2>
                <p style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>Scan QR or enter receipt ID manually</p>
              </div>
              <div style={{ padding: "20px" }}>

                {/* QR Scan area */}
                <div className="qr-frame" style={{ marginBottom: 16 }}>
                  <div style={{ color: T.purple }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="6" height="6" rx="1" stroke={T.purple} strokeWidth="1.5"/>
                      <rect x="15" y="3" width="6" height="6" rx="1" stroke={T.purple} strokeWidth="1.5"/>
                      <rect x="3" y="15" width="6" height="6" rx="1" stroke={T.purple} strokeWidth="1.5"/>
                      <rect x="15" y="15" width="3" height="3" fill={T.purple}/>
                      <rect x="19" y="15" width="2" height="2" fill={T.purple}/>
                      <rect x="15" y="19" width="2" height="2" fill={T.purple}/>
                      <rect x="19" y="19" width="2" height="2" fill={T.purple}/>
                      <circle cx="6" cy="6" r="1.5" fill={T.purple}/>
                      <circle cx="18" cy="6" r="1.5" fill={T.purple}/>
                      <circle cx="6" cy="18" r="1.5" fill={T.purple}/>
                    </svg>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Scan Citizen QR Code</p>
                    <p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Point camera at citizen's payment receipt QR</p>
                  </div>
                  <button className="cps-btn cps-btn-primary cps-btn-sm">
                    <Icons.QR /> Open Camera
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div className="divider" style={{ flex: 1, margin: 0 }} />
                  <span style={{ fontSize: 11, color: T.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>or enter manually</span>
                  <div className="divider" style={{ flex: 1, margin: 0 }} />
                </div>

                {verError && <div className="cps-alert cps-alert-error anim-fadeup" style={{ marginBottom: 12 }}><Icons.Alert /><span>{verError}</span></div>}

                <div style={{ display: "flex", gap: 8 }}>
                  <input className="cps-input" placeholder="e.g. RCT-001" value={receiptId} onChange={e => setReceiptId(e.target.value)} onKeyDown={e => e.key === "Enter" && handleVerify()} style={{ flex: 1 }} />
                  <button className="cps-btn cps-btn-primary" onClick={handleVerify} disabled={verLoading}>
                    {verLoading ? <span className="spinner" /> : "Verify"}
                  </button>
                </div>
              </div>
            </div>

            {/* Verification result */}
            {verResult && (
              <div className="cps-card anim-fadeup" style={{ overflow: "hidden" }}>
                <div style={{ background: verResult.is_valid ? T.green : T.red, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                    {verResult.is_valid ? <Icons.Check /> : <Icons.Alert />}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{verResult.is_valid ? "VALID" : "INVALID"}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)" }}>{verResult.is_valid ? "Payment verified" : "Payment not verified"}</div>
                  </div>
                  <span className="badge" style={{ marginLeft: "auto", background: "rgba(255,255,255,.2)", color: "white" }}>{verResult.status}</span>
                </div>

                <div style={{ padding: "16px 20px" }}>
                  {[["Payer", verResult.payer_name], ["Levy Type", verResult.levy_type], ["Amount", fmt(verResult.amount)], ["Receipt", verResult.receipt_id || verResult.id], ["Date", fmtDate(verResult.created_at)]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${T.borderLight}`, fontSize: 13 }}>
                      <span style={{ color: T.muted, fontWeight: 500 }}>{k}</span>
                      <span style={{ fontWeight: 600, fontFamily: k === "Receipt" ? "monospace" : "inherit" }}>{String(v)}</span>
                    </div>
                  ))}
                </div>

                {actionMsg && <div className="cps-alert cps-alert-success" style={{ margin: "0 16px 12px" }}><Icons.Check /><span>{actionMsg}</span></div>}

                <div style={{ padding: "0 16px 16px", display: "flex", gap: 10 }}>
                  <button className="cps-btn cps-btn-success" style={{ flex: 1 }} onClick={() => handleAction("approve")} disabled={approving || verResult.status === "paid"}>
                    {approving ? <span className="spinner" /> : <Icons.Check />}
                    Approve
                  </button>
                  <button className="cps-btn cps-btn-danger" style={{ flex: 1 }} onClick={() => handleAction("flag")} disabled={flagging || verResult.status === "flagged"}>
                    {flagging ? <span className="spinner" /> : <Icons.Alert />}
                    Flag
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: All transactions */}
          <div className="cps-card anim-fadeup-d3">
            <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${T.border}` }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: T.text }}>All Transactions</h2>
              <p style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>Real-time audit trail</p>
            </div>

            {txnLoading ? (
              <div style={{ padding: 40, textAlign: "center" }}><div className="spinner spinner-dark" style={{ margin: "0 auto" }} /></div>
            ) : (
              <div style={{ overflowX: "auto", maxHeight: 480, overflowY: "auto" }}>
                <table className="cps-table">
                  <thead style={{ position: "sticky", top: 0, background: "white", zIndex: 1 }}>
                    <tr>{["Payer", "Type", "Amount", "Status"].map(h => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {txns.map((t, i) => (
                      <tr key={t.id || i} style={{ cursor: "pointer" }} onClick={() => { setReceiptId(t.receipt_id || t.id); setVerResult({ ...t, is_valid: t.status === "paid" || t.status === "completed" }); setVerError(""); setActionMsg(""); }}>
                        <td style={{ fontWeight: 500, fontSize: 13 }}>{t.payer_name}</td>
                        <td style={{ fontSize: 12.5, color: T.muted }}>{t.levy_type}</td>
                        <td style={{ fontWeight: 600, fontSize: 13 }}>{fmt(t.amount)}</td>
                        <td>
                          <span className={`badge badge-${t.status === "paid" || t.status === "completed" ? "success" : t.status === "flagged" ? "danger" : "warning"}`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function CivicPayShield() {
  const [screen, setScreen]   = useState("login");
  const [session, setSession] = useState(null);

  const handleLogin = useCallback((s) => {
    setSession(s);
    setScreen(s.role === "collector" || s.role === "admin" ? "collector" : "citizen");
  }, []);

  const handleLogout = useCallback(() => { setSession(null); setScreen("login"); }, []);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {screen === "login"     && <LoginScreen onLogin={handleLogin} />}
      {screen === "citizen"   && <CitizenDashboard session={session} onLogout={handleLogout} onPayLevy={() => setScreen("pay")} />}
      {screen === "pay"       && <PayLevyScreen    session={session} onBack={() => setScreen("citizen")} onSuccess={() => setScreen("citizen")} />}
      {screen === "collector" && <CollectorDashboard session={session} onLogout={handleLogout} />}
    </>
  );
}
