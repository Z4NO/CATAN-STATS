// ──────────────────────────────────────────────────────────────
// LEDGER · Shared design system (extracted from variation A, expanded)
// ──────────────────────────────────────────────────────────────

const L = {
  paper:    '#f6f1e7',
  card:     '#fbf8f1',
  surface2: '#efe8d7',
  ink:      '#1c1a16',
  ink2:     '#52483a',
  ink3:     '#8a7e6a',
  rule:     '#ddd3bf',
  ruleS:    '#ebe2cd',
  accent:   '#b54a2a',
  accentBg: '#f3d8c8',
  win:      '#5a7a3a',
  winBg:    '#e3ead0',
  alert:    '#a14a2a',
  alertBg:  '#f6dccd',
  wood:  '#5a6f3a',
  brick: '#a14a32',
  sheep: '#c4d18d',
  wheat: '#d4a93a',
  ore:   '#5d6b78',
  fontDisp: 'Fraunces, "Cormorant Garamond", Georgia, serif',
  fontText: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  fontMono: '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
};

const LResource = ({ kind, size = 14, color }) => {
  const stroke = color || L.ink2;
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'wood':  return <svg {...p}><path d="M12 3v18M9 6l3-3 3 3M8 10l4-3 4 3M7 14l5-3 5 3"/></svg>;
    case 'brick': return <svg {...p}><rect x="3" y="6" width="18" height="5"/><rect x="3" y="13" width="18" height="5"/><path d="M9 6v5M15 6v5M6 13v5M12 13v5M18 13v5"/></svg>;
    case 'sheep': return <svg {...p}><circle cx="10" cy="13" r="5"/><circle cx="16" cy="11" r="2.5"/><path d="M7 16l-2 2M13 16l-1 3M16 13.5l2 1"/></svg>;
    case 'wheat': return <svg {...p}><path d="M12 21V8M12 8c0-2 1.5-3 3-3M12 8c0-2-1.5-3-3-3M12 12c0-2 2-3 4-3M12 12c0-2-2-3-4-3M12 16c0-2 2-3 4-3M12 16c0-2-2-3-4-3"/></svg>;
    case 'ore':   return <svg {...p}><path d="M5 14l4-7h6l4 7-7 7zM9 7l3 7M15 7l-3 7"/></svg>;
    default: return null;
  }
};

const HexPip = ({ size = 10, fill = L.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}><path d="M12 2l8.66 5v10L12 22 3.34 17V7z"/></svg>
);

// Frame for mobile screens
const LFrame = ({ w = 360, h = 760, children, noChrome, bg }) => (
  <div style={{
    width: w, height: h, background: bg || L.paper, color: L.ink,
    borderRadius: 28, overflow: 'hidden', position: 'relative',
    boxShadow: '0 1px 0 rgba(0,0,0,.04), 0 24px 48px -24px rgba(40,30,20,.18)',
    border: `1px solid ${L.rule}`, fontFamily: L.fontText,
  }}>
    {!noChrome && (
      <div style={{
        height: 40, padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: L.fontMono, fontSize: 12, color: L.ink, letterSpacing: 0.2,
      }}>
        <span>21:14</span>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 10 }}>●●●●●</span>
          <span>5G</span>
          <span style={{ display: 'inline-block', width: 22, height: 10, border: `1px solid ${L.ink}`, borderRadius: 2, position: 'relative' }}>
            <span style={{ position: 'absolute', inset: 1, right: 4, background: L.ink, borderRadius: 1 }} />
          </span>
        </span>
      </div>
    )}
    {children}
  </div>
);

// Desktop frame
const LDesktopFrame = ({ w = 1200, h = 780, children }) => (
  <div style={{
    width: w, height: h, background: L.paper, color: L.ink, borderRadius: 12,
    overflow: 'hidden', position: 'relative', fontFamily: L.fontText,
    boxShadow: '0 24px 48px -24px rgba(40,30,20,.2)', border: `1px solid ${L.rule}`,
  }}>
    <div style={{
      height: 36, background: L.surface2, borderBottom: `1px solid ${L.rule}`,
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8,
    }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <span style={{ width: 11, height: 11, borderRadius: 6, background: '#d4a93a' }} />
        <span style={{ width: 11, height: 11, borderRadius: 6, background: '#b54a2a' }} />
        <span style={{ width: 11, height: 11, borderRadius: 6, background: '#5a7a3a' }} />
      </div>
      <div style={{ flex: 1, textAlign: 'center', fontFamily: L.fontMono, fontSize: 11, color: L.ink3 }}>
        catan-stats.app
      </div>
      <div style={{ width: 48 }} />
    </div>
    {children}
  </div>
);

const LTopBar = ({ title, back, right, subtitle }) => (
  <div style={{
    padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderBottom: `1px solid ${L.ruleS}`, background: L.paper, minHeight: 56,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0' }}>
      {back && <span style={{ fontSize: 18, color: L.ink2 }}>←</span>}
      <div>
        <div style={{ fontFamily: L.fontDisp, fontSize: 17, fontWeight: 500, letterSpacing: -0.3, color: L.ink, lineHeight: 1.1 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: L.ink3, fontFamily: L.fontMono, marginTop: 1 }}>{subtitle}</div>}
      </div>
    </div>
    <div style={{ fontSize: 13, color: L.ink2 }}>{right}</div>
  </div>
);

const LWordmark = ({ size = 22 }) => (
  <span style={{
    fontFamily: L.fontDisp, fontWeight: 500, fontSize: size, letterSpacing: -0.6, color: L.ink,
    fontStyle: 'italic',
  }}>
    catan<span style={{ color: L.accent, fontStyle: 'normal' }}>·</span>stats
  </span>
);

const LField = ({ label, children, muted, hint, error }) => (
  <label style={{ display: 'block' }}>
    <div style={{
      fontFamily: L.fontMono, fontSize: 10, letterSpacing: 0.6, color: error ? L.alert : L.ink3,
      textTransform: 'uppercase', marginBottom: 6, display: 'flex', justifyContent: 'space-between',
    }}>
      <span>{label}</span>
      {hint && <span style={{ textTransform: 'none', letterSpacing: 0, color: L.ink3 }}>{hint}</span>}
    </div>
    <div style={{
      minHeight: 48, borderRadius: 12, border: `1px solid ${error ? L.alert : L.rule}`, background: L.card,
      padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 15, color: muted ? L.ink2 : L.ink,
      fontFamily: L.fontMono, letterSpacing: muted ? 4 : 0,
    }}>{children}</div>
  </label>
);

const LButton = ({ children, variant = 'primary', size = 'md', full, style }) => {
  const base = {
    border: 'none', borderRadius: 14, cursor: 'pointer', fontFamily: L.fontText, fontWeight: 500,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    width: full ? '100%' : 'auto',
  };
  const sizes = {
    sm: { height: 38, padding: '0 14px', fontSize: 13 },
    md: { height: 50, padding: '0 18px', fontSize: 15 },
    lg: { height: 54, padding: '0 22px', fontSize: 16 },
  };
  const variants = {
    primary: { background: L.ink, color: L.paper },
    secondary: { background: 'transparent', color: L.ink, border: `1px solid ${L.rule}` },
    accent: { background: L.accent, color: '#fff' },
    ghost: { background: 'transparent', color: L.ink },
    danger: { background: 'transparent', color: L.alert, border: `1px solid ${L.alert}` },
  };
  return <button style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>{children}</button>;
};

const LChip = ({ text, tone = 'neutral' }) => {
  const tones = {
    neutral: { bg: L.ruleS, fg: L.ink2 },
    win:     { bg: L.win,   fg: '#fff' },
    accent:  { bg: L.accent, fg: '#fff' },
    soft:    { bg: L.accentBg, fg: L.accent },
    wheat:   { bg: '#f7ebbf', fg: '#7a5e20' },
    road:    { bg: '#e0e6cb', fg: L.wood },
    army:    { bg: '#f3dcd0', fg: L.brick },
  };
  const t = tones[tone];
  return (
    <span style={{
      fontFamily: L.fontMono, fontSize: 9, letterSpacing: 0.5, textTransform: 'uppercase',
      padding: '2px 6px', borderRadius: 4, background: t.bg, color: t.fg, fontWeight: 500,
    }}>{text}</span>
  );
};

const LStat = ({ big, label, tone }) => (
  <div>
    <div style={{
      fontFamily: L.fontDisp, fontSize: 32, color: tone === 'accent' ? L.accent : L.ink,
      letterSpacing: -1, lineHeight: 1,
    }}>{big}</div>
    <div style={{
      fontFamily: L.fontMono, fontSize: 10, letterSpacing: 0.8, color: L.ink3,
      textTransform: 'uppercase', marginTop: 4,
    }}>{label}</div>
  </div>
);

const LSectionLabel = ({ children, right }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
    <span style={{
      fontFamily: L.fontMono, fontSize: 10, letterSpacing: 0.8, color: L.ink3, textTransform: 'uppercase',
    }}>── {children}</span>
    {right && <span style={{ fontSize: 11, color: L.ink3 }}>{right}</span>}
  </div>
);

const LTabBar = ({ active }) => (
  <div style={{
    height: 64, borderTop: `1px solid ${L.ruleS}`, background: L.card,
    display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 24px',
  }}>
    {[
      { id: 'home',  label: 'Grupos' },
      { id: 'play',  label: 'Jugar' },
      { id: 'stats', label: 'Stats' },
      { id: 'me',    label: 'Yo' },
    ].map((t) => (
      <div key={t.id} style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        color: active === t.id ? L.ink : L.ink3,
        fontFamily: L.fontMono, fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase',
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: 3, background: active === t.id ? L.accent : 'transparent',
        }} />
        {t.label}
      </div>
    ))}
  </div>
);

const LAvatar = ({ name, size = 32, color }) => (
  <div style={{
    width: size, height: size, borderRadius: size / 2,
    background: color || L.accentBg, color: color ? '#fff' : L.accent,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: L.fontDisp, fontSize: size * 0.45, fontWeight: 600, flexShrink: 0,
  }}>{name[0]}</div>
);

const LStepButton = ({ children }) => (
  <button style={{
    width: 30, height: 30, borderRadius: 15, border: `1px solid ${L.rule}`,
    background: L.paper, color: L.ink, fontSize: 16, cursor: 'pointer', fontFamily: L.fontText,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
  }}>{children}</button>
);

Object.assign(window, {
  L, LResource, HexPip, LFrame, LDesktopFrame, LTopBar, LWordmark,
  LField, LButton, LChip, LStat, LSectionLabel, LTabBar, LAvatar, LStepButton,
});
