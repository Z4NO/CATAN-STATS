import './Ledger.css'

export function LWordmark({ size = 24 }) {
  return (
    <span className="l-wordmark" style={{ fontSize: size }}>
      catan<span className="l-wordmark__dot">·</span>stats
    </span>
  )
}

export function LTopBar({ title, subtitle, onBack, right }) {
  return (
    <header className="l-topbar">
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0' }}>
        {onBack && (
          <span className="l-topbar__back" onClick={onBack}>
            ←
          </span>
        )}
        <div>
          <div className="l-topbar__title">{title}</div>
          {subtitle && <div className="l-topbar__subtitle">{subtitle}</div>}
        </div>
      </div>
      <div style={{ fontSize: 13, color: 'var(--ink2)' }}>{right}</div>
    </header>
  )
}

export function LField({ label, hint, error, children }) {
  return (
    <label className="l-field">
      <div className={`l-field__label ${error ? 'l-field__label--error' : ''}`}>
        <span>{label}</span>
        {hint && <span className="l-field__hint">{hint}</span>}
      </div>
      <div className={`l-field__control ${error ? 'l-field__control--error' : ''}`}>{children}</div>
      {error && <div className="error-text">{error}</div>}
    </label>
  )
}

export function LButton({
  children,
  variant = 'primary',
  size = 'md',
  full,
  type = 'button',
  ...rest
}) {
  const cls = [
    'l-button',
    `l-button--${variant}`,
    `l-button--${size}`,
    full ? 'l-button--full' : '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  )
}

export function LChip({ children, tone = 'neutral' }) {
  return <span className={`l-chip l-chip--${tone}`}>{children}</span>
}

export function LStat({ big, label, tone }) {
  return (
    <div>
      <div className={`l-stat__big ${tone === 'accent' ? 'l-stat__big--accent' : ''}`}>{big}</div>
      <div className="l-stat__label">{label}</div>
    </div>
  )
}

export function LAvatar({ name, size = 32, color }) {
  const initial = (name || '?').charAt(0)
  const style = {
    width: size,
    height: size,
    fontSize: Math.round(size * 0.45),
    background: color || undefined,
    color: color ? '#fff' : undefined,
  }
  return (
    <div className="l-avatar" style={style}>
      {initial}
    </div>
  )
}

export function LSectionLabel({ children, right }) {
  return (
    <div className="section-label">
      <span>── {children}</span>
      {right && <span style={{ fontSize: 11 }}>{right}</span>}
    </div>
  )
}

export function LCard({ children, style }) {
  return (
    <div className="l-card" style={style}>
      {children}
    </div>
  )
}

export function LTabBar({ active, onChange, items }) {
  const tabs =
    items || [
      { id: 'home', label: 'Grupos' },
      { id: 'play', label: 'Jugar' },
      { id: 'stats', label: 'Stats' },
      { id: 'me', label: 'Yo' },
    ]
  return (
    <nav className="l-tabbar">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`l-tabbar__item ${active === t.id ? 'l-tabbar__item--active' : ''}`}
          onClick={() => onChange?.(t.id)}
        >
          <span className="l-tabbar__item-dot" />
          {t.label}
        </button>
      ))}
    </nav>
  )
}
