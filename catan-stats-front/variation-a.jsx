// ──────────────────────────────────────────────────────────────
// Variation A · "Ledger"
// Warm minimal. Off-white parchment, serif display, mono numerics.
// Resource icons used as discreet decorative motifs.
// ──────────────────────────────────────────────────────────────

const A = {
  // surfaces
  paper:    '#f6f1e7',
  card:     '#fbf8f1',
  ink:      '#1c1a16',
  ink2:     '#52483a',
  ink3:     '#8a7e6a',
  rule:     '#ddd3bf',
  ruleS:    '#ebe2cd',
  // accent (terracotta — neutral warm)
  accent:   '#b54a2a',
  accentBg: '#f3d8c8',
  // semantic
  win:      '#5a7a3a',
  winBg:    '#e3ead0',
  // resource ink
  wood:     '#5a6f3a',
  brick:    '#a14a32',
  sheep:    '#c4d18d',
  wheat:    '#d4a93a',
  ore:      '#5d6b78',
  fontDisp: 'Fraunces, "Cormorant Garamond", Georgia, serif',
  fontText: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  fontMono: '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
};

// Tiny SVG resource glyphs — used as decoration in headers
const ResourceGlyph = ({ kind, size = 14, color }) => {
  const stroke = color || A.ink2;
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'wood':  return <svg {...props}><path d="M12 3v18M9 6l3-3 3 3M8 10l4-3 4 3M7 14l5-3 5 3"/></svg>;
    case 'brick': return <svg {...props}><rect x="3" y="6" width="18" height="5"/><rect x="3" y="13" width="18" height="5"/><path d="M9 6v5M15 6v5M6 13v5M12 13v5M18 13v5"/></svg>;
    case 'sheep': return <svg {...props}><circle cx="10" cy="13" r="5"/><circle cx="16" cy="11" r="2.5"/><path d="M7 16l-2 2M13 16l-1 3M16 13.5l2 1"/></svg>;
    case 'wheat': return <svg {...props}><path d="M12 21V8M12 8c0-2 1.5-3 3-3M12 8c0-2-1.5-3-3-3M12 12c0-2 2-3 4-3M12 12c0-2-2-3-4-3M12 16c0-2 2-3 4-3M12 16c0-2-2-3-4-3"/></svg>;
    case 'ore':   return <svg {...props}><path d="M5 14l4-7h6l4 7-7 7zM9 7l3 7M15 7l-3 7"/></svg>;
    default: return null;
  }
};

// Hex pip — for stat decorations
const HexPip = ({ size = 10, fill = A.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}><path d="M12 2l8.66 5v10L12 22 3.34 17V7z"/></svg>
);

// Phone frame — generic for both mobile & desktop screens
const Frame = ({ w = 360, h = 760, children, label, sub }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 0, fontFamily: A.fontText }}>
    <div style={{
      width: w, height: h, background: A.paper, color: A.ink,
      borderRadius: 28, overflow: 'hidden', position: 'relative',
      boxShadow: '0 1px 0 rgba(0,0,0,.04), 0 24px 48px -24px rgba(40,30,20,.18)',
      border: `1px solid ${A.rule}`,
    }}>
      {/* status bar */}
      <div style={{
        height: 40, padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: A.fontMono, fontSize: 12, color: A.ink, letterSpacing: 0.2,
      }}>
        <span>21:14</span>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 10 }}>●●●●●</span>
          <span>5G</span>
          <span style={{ display: 'inline-block', width: 22, height: 10, border: `1px solid ${A.ink}`, borderRadius: 2, position: 'relative' }}>
            <span style={{ position: 'absolute', inset: 1, right: 4, background: A.ink, borderRadius: 1 }} />
          </span>
        </span>
      </div>
      {children}
    </div>
  </div>
);

// Top bar with brand
const TopBar = ({ title, back, right }) => (
  <div style={{
    height: 56, padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderBottom: `1px solid ${A.ruleS}`, background: A.paper,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {back && <span style={{ fontSize: 18, color: A.ink2 }}>←</span>}
      <span style={{
        fontFamily: A.fontDisp, fontSize: 17, fontWeight: 500, letterSpacing: -0.3, color: A.ink,
      }}>{title}</span>
    </div>
    <div style={{ fontSize: 13, color: A.ink2 }}>{right}</div>
  </div>
);

// Brand wordmark
const Wordmark = ({ size = 22 }) => (
  <span style={{
    fontFamily: A.fontDisp, fontWeight: 500, fontSize: size, letterSpacing: -0.6, color: A.ink,
    fontStyle: 'italic',
  }}>
    catan<span style={{ color: A.accent, fontStyle: 'normal' }}>·</span>stats
  </span>
);

// ─── 1. LOGIN ────────────────────────────────────────────────
const A_Login = () => (
  <Frame label="Login">
    <div style={{ height: 'calc(100% - 40px)', padding: '24px 26px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 64 }}>
        <Wordmark size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: A.fontDisp, fontSize: 38, lineHeight: 1.05, letterSpacing: -1.2, color: A.ink, marginBottom: 12 }}>
          Tu peña,<br/><span style={{ fontStyle: 'italic', color: A.accent }}>en cifras.</span>
        </div>
        <div style={{ fontSize: 14, color: A.ink2, lineHeight: 1.5, marginBottom: 36, maxWidth: 280 }}>
          Registra cada partida de Catán con tu grupo y descubre patrones reales en vuestras victorias.
        </div>

        {/* form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Email">tu@email.com</Field>
          <Field label="Contraseña" muted>••••••••••</Field>

          <button style={{
            marginTop: 8, height: 50, background: A.ink, color: A.paper, border: 'none',
            borderRadius: 14, fontSize: 15, fontWeight: 500, fontFamily: A.fontText, letterSpacing: -0.1,
            cursor: 'pointer',
          }}>Entrar</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0' }}>
            <div style={{ flex: 1, height: 1, background: A.ruleS }} />
            <span style={{ fontFamily: A.fontMono, fontSize: 11, color: A.ink3, letterSpacing: 0.4 }}>O</span>
            <div style={{ flex: 1, height: 1, background: A.ruleS }} />
          </div>

          <button style={{
            height: 46, background: 'transparent', color: A.ink, border: `1px solid ${A.rule}`,
            borderRadius: 14, fontSize: 14, fontFamily: A.fontText, cursor: 'pointer',
          }}>Crear cuenta nueva</button>
        </div>
      </div>

      {/* footer with resource ink */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 18, paddingTop: 24, marginTop: 12,
        borderTop: `1px solid ${A.ruleS}`, opacity: .55,
      }}>
        {['wood','brick','sheep','wheat','ore'].map((r) =>
          <ResourceGlyph key={r} kind={r} color={A[r]} size={16} />
        )}
      </div>
    </div>
  </Frame>
);

const Field = ({ label, children, muted }) => (
  <label style={{ display: 'block' }}>
    <div style={{ fontFamily: A.fontMono, fontSize: 10, letterSpacing: 0.6, color: A.ink3, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
    <div style={{
      height: 48, borderRadius: 12, border: `1px solid ${A.rule}`, background: A.card,
      padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 15, color: muted ? A.ink2 : A.ink,
      fontFamily: A.fontMono, letterSpacing: muted ? 4 : 0,
    }}>{children}</div>
  </label>
);

// ─── 2. HOME (groups list) ───────────────────────────────────
const A_Home = () => (
  <Frame label="Home">
    <div style={{ height: 'calc(100% - 40px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 22px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Wordmark size={18} />
        <div style={{
          width: 32, height: 32, borderRadius: 16, background: A.accentBg, color: A.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: A.fontDisp, fontSize: 14, fontWeight: 600,
        }}>A</div>
      </div>

      <div style={{ padding: '8px 22px 16px' }}>
        <div style={{ fontFamily: A.fontDisp, fontSize: 28, letterSpacing: -0.8, color: A.ink, lineHeight: 1.1 }}>
          Hola, Alba.
        </div>
        <div style={{ fontSize: 13, color: A.ink2, marginTop: 4 }}>
          <span style={{ fontFamily: A.fontMono }}>3</span> grupos · <span style={{ fontFamily: A.fontMono }}>77</span> partidas en total
        </div>
      </div>

      <div style={{ flex: 1, padding: '4px 22px 0', overflow: 'hidden' }}>
        <div style={{ fontFamily: A.fontMono, fontSize: 10, letterSpacing: 0.8, color: A.ink3, textTransform: 'uppercase', marginBottom: 10 }}>
          ── Tus grupos
        </div>

        {GROUPS.map((g, i) => (
          <div key={g.id} style={{
            padding: '14px 0', borderBottom: i < GROUPS.length - 1 ? `1px solid ${A.ruleS}` : 'none',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: A.fontDisp, fontSize: 18, color: A.ink, letterSpacing: -0.3, marginBottom: 2 }}>
                {g.name}
              </div>
              <div style={{ fontSize: 12, color: A.ink3, marginBottom: 8 }}>{g.desc}</div>
              <div style={{ display: 'flex', gap: 14, fontFamily: A.fontMono, fontSize: 11, color: A.ink2 }}>
                <span><b style={{ color: A.ink }}>{g.matches}</b> partidas</span>
                <span><b style={{ color: A.ink }}>{g.members}</b> jugadores</span>
                <span style={{ color: A.ink3 }}>· {g.last}</span>
              </div>
            </div>
            <span style={{ fontSize: 18, color: A.ink3, marginTop: 4 }}>›</span>
          </div>
        ))}

        <button style={{
          marginTop: 18, width: '100%', height: 48, background: 'transparent', color: A.ink,
          border: `1.5px dashed ${A.rule}`, borderRadius: 14, fontSize: 14, cursor: 'pointer',
          fontFamily: A.fontText, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>+</span> Crear o unirse a un grupo
        </button>
      </div>

      {/* tab bar */}
      <TabBar active="home" />
    </div>
  </Frame>
);

const TabBar = ({ active }) => (
  <div style={{
    height: 64, borderTop: `1px solid ${A.ruleS}`, background: A.card,
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
        color: active === t.id ? A.ink : A.ink3,
        fontFamily: A.fontMono, fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase',
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: 3, background: active === t.id ? A.accent : 'transparent',
        }} />
        {t.label}
      </div>
    ))}
  </div>
);

// ─── 3. CREATE / JOIN GROUP ──────────────────────────────────
const A_CreateGroup = () => (
  <Frame label="Crear grupo">
    <TopBar title="Nuevo grupo" back />
    <div style={{ padding: '20px 22px', height: 'calc(100% - 96px)', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 18 }}>

      <div>
        <div style={{ fontFamily: A.fontDisp, fontSize: 22, letterSpacing: -0.5, color: A.ink, marginBottom: 6 }}>
          Empieza una peña.
        </div>
        <div style={{ fontSize: 13, color: A.ink2, lineHeight: 1.5 }}>
          Un grupo es donde se guardan las partidas y stats. Invita después por código o enlace.
        </div>
      </div>

      <div style={{
        background: A.card, border: `1px solid ${A.rule}`, borderRadius: 16, padding: 4,
        display: 'flex', gap: 4,
      }}>
        <div style={{ flex: 1, padding: '10px 12px', borderRadius: 12, background: A.paper, textAlign: 'center', fontSize: 13, color: A.ink, fontWeight: 500 }}>
          Crear
        </div>
        <div style={{ flex: 1, padding: '10px 12px', borderRadius: 12, textAlign: 'center', fontSize: 13, color: A.ink3 }}>
          Unirse con código
        </div>
      </div>

      <Field label="Nombre del grupo">Peña del jueves</Field>
      <Field label="Descripción (opcional)">Sesión semanal en casa de Marc</Field>

      <div>
        <div style={{ fontFamily: A.fontMono, fontSize: 10, letterSpacing: 0.6, color: A.ink3, textTransform: 'uppercase', marginBottom: 8 }}>
          Color del grupo
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[A.accent, '#3b82a4', '#7a8c47', '#b08642', '#8b5a8c', '#1c1a16'].map((c, i) => (
            <div key={c} style={{
              width: 32, height: 32, borderRadius: 16, background: c,
              boxShadow: i === 0 ? `0 0 0 2px ${A.paper}, 0 0 0 4px ${A.ink}` : 'none',
            }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <button style={{
        height: 52, background: A.ink, color: A.paper, border: 'none',
        borderRadius: 14, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: A.fontText,
      }}>
        Crear grupo →
      </button>
    </div>
  </Frame>
);

// ─── 4. GROUP DETAIL ─────────────────────────────────────────
const A_GroupDetail = () => (
  <Frame label="Grupo">
    <TopBar title="Peña del jueves" back right="···" />

    <div style={{ height: 'calc(100% - 96px - 64px)', overflow: 'hidden', padding: '0 0 20px' }}>

      {/* hero stats */}
      <div style={{ padding: '20px 22px 22px', borderBottom: `1px solid ${A.ruleS}` }}>
        <div style={{ fontFamily: A.fontMono, fontSize: 10, letterSpacing: 0.8, color: A.ink3, textTransform: 'uppercase', marginBottom: 10 }}>
          ── La peña del jueves
        </div>
        <div style={{ display: 'flex', gap: 22, alignItems: 'baseline' }}>
          <Stat big="47"  label="partidas" />
          <Stat big="3"   label="meses activa" />
          <Stat big="5"   label="jugadores" />
        </div>

        {/* leader card */}
        <div style={{
          marginTop: 18, padding: 14, background: A.card, border: `1px solid ${A.rule}`, borderRadius: 14,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 22, background: A.accentBg, color: A.accent,
            fontFamily: A.fontDisp, fontSize: 18, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>A</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: A.fontMono, fontSize: 9, letterSpacing: 0.8, color: A.ink3, textTransform: 'uppercase' }}>Líder · racha activa</div>
            <div style={{ fontFamily: A.fontDisp, fontSize: 17, color: A.ink, marginTop: 1 }}>
              Alba, <span style={{ fontStyle: 'italic', color: A.accent }}>3 victorias seguidas</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {[1,1,1].map((_,i) => <HexPip key={i} size={9} fill={A.accent} />)}
          </div>
        </div>
      </div>

      {/* winrates */}
      <div style={{ padding: '16px 22px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontFamily: A.fontMono, fontSize: 10, letterSpacing: 0.8, color: A.ink3, textTransform: 'uppercase' }}>Win rates</div>
          <div style={{ fontSize: 11, color: A.ink3 }}>ver todo →</div>
        </div>
        {PLAYER_STATS.map((p) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
            <div style={{ width: 60, fontSize: 13, color: A.ink, fontFamily: A.fontDisp }}>{p.name}</div>
            <div style={{ flex: 1, height: 6, background: A.ruleS, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${p.winrate * 2}%`, background: p.id === 'a' ? A.accent : A.ink, opacity: p.id === 'a' ? 1 : .55 }} />
            </div>
            <div style={{ width: 36, textAlign: 'right', fontFamily: A.fontMono, fontSize: 12, color: A.ink }}>{p.winrate}%</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontFamily: A.fontMono, fontSize: 10, letterSpacing: 0.8, color: A.ink3, textTransform: 'uppercase' }}>Últimas partidas</div>
          <div style={{ fontSize: 11, color: A.ink3 }}>ver todas →</div>
        </div>
        {RECENT_MATCHES.slice(0, 3).map((m, i) => (
          <div key={m.id} style={{
            padding: '10px 0', borderBottom: i < 2 ? `1px solid ${A.ruleS}` : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 13, color: A.ink, fontFamily: A.fontDisp }}>
                Ganó <span style={{ fontStyle: 'italic' }}>{m.winner}</span> con {m.points} pts
              </div>
              <div style={{ fontSize: 11, color: A.ink3, fontFamily: A.fontMono, marginTop: 2 }}>
                {m.date} · {m.expansion} · {m.players}j · {m.duration}
              </div>
            </div>
            <span style={{ color: A.ink3 }}>›</span>
          </div>
        ))}
      </div>
    </div>

    {/* sticky CTA */}
    <div style={{
      position: 'absolute', bottom: 64, left: 0, right: 0, padding: '14px 22px',
      background: `linear-gradient(180deg, transparent, ${A.paper} 30%)`,
    }}>
      <button style={{
        width: '100%', height: 50, background: A.ink, color: A.paper, border: 'none',
        borderRadius: 14, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: A.fontText,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        + Registrar partida
      </button>
    </div>

    <TabBar active="home" />
  </Frame>
);

const Stat = ({ big, label }) => (
  <div>
    <div style={{ fontFamily: A.fontDisp, fontSize: 32, color: A.ink, letterSpacing: -1, lineHeight: 1 }}>{big}</div>
    <div style={{ fontFamily: A.fontMono, fontSize: 10, letterSpacing: 0.8, color: A.ink3, textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
  </div>
);

// ─── 5. NEW MATCH WIZARD (step 2 of 4: expansion + points) ───
const A_NewMatch = () => (
  <Frame label="Nueva partida">
    <TopBar title="Nueva partida" back right="2 / 4" />

    <div style={{ padding: '14px 22px 0', display: 'flex', gap: 4 }}>
      {[1,1,0,0].map((on, i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: on ? A.accent : A.ruleS }} />
      ))}
    </div>

    <div style={{ padding: '20px 22px', height: 'calc(100% - 96px - 17px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      <div style={{ fontFamily: A.fontDisp, fontSize: 24, letterSpacing: -0.6, color: A.ink, marginBottom: 4 }}>
        Puntuaciones finales
      </div>
      <div style={{ fontSize: 13, color: A.ink2, marginBottom: 18 }}>
        Navegantes · 4 jugadores · llega a 13 pts.
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { name: 'Alba',  pts: 13, win: true,  road: true,  army: false },
          { name: 'Marc',  pts: 11, win: false, road: false, army: true  },
          { name: 'Lucia', pts: 9,  win: false },
          { name: 'Pau',   pts: 7,  win: false },
        ].map((p) => (
          <div key={p.name} style={{
            background: p.win ? A.winBg : A.card,
            border: `1px solid ${p.win ? A.win : A.rule}`,
            borderRadius: 14, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 16,
              background: p.win ? A.win : A.ruleS, color: p.win ? '#fff' : A.ink2,
              fontFamily: A.fontDisp, fontSize: 14, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{p.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: A.fontDisp, fontSize: 16, color: A.ink, lineHeight: 1.1 }}>{p.name}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                {p.win && <Chip text="ganador" color={A.win} />}
                {p.road && <Chip text="ruta más larga" />}
                {p.army && <Chip text="ejército" />}
              </div>
            </div>
            {/* stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button style={stepBtn}>−</button>
              <div style={{
                width: 38, textAlign: 'center', fontFamily: A.fontMono, fontSize: 18, color: A.ink, fontWeight: 600,
              }}>{p.pts}</div>
              <button style={stepBtn}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button style={{
          flex: 1, height: 50, background: 'transparent', color: A.ink, border: `1px solid ${A.rule}`,
          borderRadius: 14, fontSize: 14, cursor: 'pointer', fontFamily: A.fontText,
        }}>Atrás</button>
        <button style={{
          flex: 2, height: 50, background: A.ink, color: A.paper, border: 'none',
          borderRadius: 14, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: A.fontText,
        }}>Siguiente →</button>
      </div>
    </div>
  </Frame>
);

const stepBtn = {
  width: 30, height: 30, borderRadius: 15, border: `1px solid ${A.rule}`,
  background: A.paper, color: A.ink, fontSize: 16, cursor: 'pointer', fontFamily: A.fontText,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
};
const Chip = ({ text, color }) => (
  <span style={{
    fontFamily: A.fontMono, fontSize: 9, letterSpacing: 0.5, textTransform: 'uppercase',
    padding: '2px 6px', borderRadius: 4, background: color || A.ruleS, color: color ? '#fff' : A.ink2,
  }}>{text}</span>
);

// ─── 6. MATCH DETAIL ─────────────────────────────────────────
const A_MatchDetail = () => (
  <Frame label="Detalle partida">
    <TopBar title="Partida" back right="editar" />

    <div style={{ padding: '20px 22px', height: 'calc(100% - 96px)', overflow: 'hidden' }}>
      <div style={{ fontFamily: A.fontMono, fontSize: 10, letterSpacing: 0.8, color: A.ink3, textTransform: 'uppercase', marginBottom: 6 }}>
        {MATCH_DETAIL.date} · {MATCH_DETAIL.time}
      </div>
      <div style={{ fontFamily: A.fontDisp, fontSize: 26, letterSpacing: -0.6, color: A.ink, lineHeight: 1.15, marginBottom: 4 }}>
        Ganó <span style={{ fontStyle: 'italic', color: A.accent }}>Alba</span> con 13 pts.
      </div>
      <div style={{ fontSize: 13, color: A.ink2, marginBottom: 20 }}>
        Navegantes · 4 jugadores · {MATCH_DETAIL.duration}
      </div>

      {/* score table */}
      <div style={{ background: A.card, border: `1px solid ${A.rule}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{
          padding: '8px 14px', fontFamily: A.fontMono, fontSize: 10, letterSpacing: 0.6, color: A.ink3,
          textTransform: 'uppercase', display: 'flex', borderBottom: `1px solid ${A.ruleS}`,
        }}>
          <span style={{ flex: 1 }}>Jugador</span>
          <span style={{ width: 70, textAlign: 'right' }}>Logros</span>
          <span style={{ width: 40, textAlign: 'right' }}>Pts</span>
        </div>
        {MATCH_DETAIL.scores.map((s, i) => (
          <div key={s.name} style={{
            padding: '12px 14px', display: 'flex', alignItems: 'center',
            borderBottom: i < MATCH_DETAIL.scores.length - 1 ? `1px solid ${A.ruleS}` : 'none',
            background: s.isWinner ? A.winBg : 'transparent',
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 13, background: A.ruleS, color: A.ink2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: A.fontDisp, fontSize: 12, fontWeight: 600,
              }}>{s.name[0]}</div>
              <span style={{ fontFamily: A.fontDisp, fontSize: 15, color: A.ink }}>{s.name}</span>
              {s.isWinner && <span style={{ color: A.win, fontSize: 11 }}>★</span>}
            </div>
            <div style={{ width: 70, display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
              {s.longestRoad && <ResourceGlyph kind="wood" size={14} color={A.wood} />}
              {s.largestArmy && <span style={{ fontSize: 12 }}>⚔︎</span>}
            </div>
            <span style={{ width: 40, textAlign: 'right', fontFamily: A.fontMono, fontSize: 16, color: A.ink, fontWeight: 600 }}>{s.score}</span>
          </div>
        ))}
      </div>

      {/* notes */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontFamily: A.fontMono, fontSize: 10, letterSpacing: 0.8, color: A.ink3, textTransform: 'uppercase', marginBottom: 6 }}>Notas</div>
        <div style={{
          fontFamily: A.fontDisp, fontSize: 14, fontStyle: 'italic', color: A.ink2, lineHeight: 1.5,
          paddingLeft: 12, borderLeft: `2px solid ${A.accent}`,
        }}>
          “{MATCH_DETAIL.notes}”
        </div>
      </div>

      {/* timeline preview */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontFamily: A.fontMono, fontSize: 10, letterSpacing: 0.8, color: A.ink3, textTransform: 'uppercase', marginBottom: 10 }}>Línea temporal</div>
        {[
          { t: '0:24', e: 'Marc reclama el ejército más grande', who: 'Marc' },
          { t: '0:51', e: 'Lucia llega a 7 puntos',              who: 'Lucia' },
          { t: '1:18', e: 'Alba toma la ruta más larga (longitud 6)', who: 'Alba' },
          { t: '1:42', e: 'Alba cierra con 13 puntos',           who: 'Alba' },
        ].map((ev, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '6px 0' }}>
            <div style={{ width: 36, fontFamily: A.fontMono, fontSize: 11, color: A.ink3 }}>{ev.t}</div>
            <div style={{
              width: 8, height: 8, borderRadius: 4, background: ev.who === 'Alba' ? A.accent : A.ink3, marginTop: 5,
            }} />
            <div style={{ flex: 1, fontSize: 13, color: A.ink2, lineHeight: 1.4 }}>{ev.e}</div>
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

// ─── 7. PLAYER PROFILE ───────────────────────────────────────
const A_Profile = () => (
  <Frame label="Perfil jugador">
    <TopBar title="Perfil" back />
    <div style={{ height: 'calc(100% - 96px)', overflow: 'hidden' }}>

      {/* hero */}
      <div style={{ padding: '20px 22px 18px', borderBottom: `1px solid ${A.ruleS}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 30, background: A.accentBg, color: A.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: A.fontDisp, fontSize: 26, fontWeight: 600,
          }}>A</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: A.fontDisp, fontSize: 24, letterSpacing: -0.5, color: A.ink, lineHeight: 1.1 }}>Alba</div>
            <div style={{ fontSize: 12, color: A.ink3, marginTop: 4 }}>en <i>Peña del jueves</i></div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, marginTop: 18 }}>
          <Stat big="40%" label="win rate" />
          <Stat big="19"  label="victorias" />
          <Stat big="3"   label="racha" />
          <Stat big="8.4" label="pts media" />
        </div>
      </div>

      {/* form */}
      <div style={{ padding: '16px 22px 0' }}>
        <div style={{ fontFamily: A.fontMono, fontSize: 10, letterSpacing: 0.8, color: A.ink3, textTransform: 'uppercase', marginBottom: 10 }}>
          Últimas 10 partidas
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {PROFILE_TIMELINE.map((r, i) => (
            <div key={i} style={{
              flex: 1, height: 34, borderRadius: 6,
              background: r === 'W' ? A.win : A.ruleS,
              color: r === 'W' ? '#fff' : A.ink3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: A.fontMono, fontSize: 12, fontWeight: 600,
            }}>{r}</div>
          ))}
        </div>
      </div>

      {/* nemesis & partner */}
      <div style={{ padding: '20px 22px 0', display: 'flex', gap: 10 }}>
        <Card2 label="Némesis" name="Marc" sub="te ha ganado 5 veces" tone="dark" />
        <Card2 label="Compañera" name="Lucia" sub="quedáis arriba juntas" />
      </div>

      {/* breakdown */}
      <div style={{ padding: '20px 22px 0' }}>
        <div style={{ fontFamily: A.fontMono, fontSize: 10, letterSpacing: 0.8, color: A.ink3, textTransform: 'uppercase', marginBottom: 10 }}>
          Desempeño por expansión
        </div>
        <RowBar name="Catán Base"   pct={48} pts="9 / 19" />
        <RowBar name="Navegantes"   pct={31} pts="10 / 19" />
      </div>
    </div>
  </Frame>
);

const Card2 = ({ label, name, sub, tone }) => (
  <div style={{
    flex: 1, padding: 12, borderRadius: 12,
    background: tone === 'dark' ? A.ink : A.card,
    color: tone === 'dark' ? A.paper : A.ink,
    border: tone === 'dark' ? 'none' : `1px solid ${A.rule}`,
  }}>
    <div style={{ fontFamily: A.fontMono, fontSize: 9, letterSpacing: 0.6, textTransform: 'uppercase', opacity: .7 }}>{label}</div>
    <div style={{ fontFamily: A.fontDisp, fontSize: 18, marginTop: 3 }}>{name}</div>
    <div style={{ fontSize: 11, opacity: .7, marginTop: 2 }}>{sub}</div>
  </div>
);

const RowBar = ({ name, pct, pts }) => (
  <div style={{ padding: '8px 0', borderBottom: `1px solid ${A.ruleS}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontFamily: A.fontDisp, fontSize: 14, color: A.ink }}>{name}</span>
      <span style={{ fontFamily: A.fontMono, fontSize: 12, color: A.ink2 }}>{pts} · <b style={{ color: A.ink }}>{pct}%</b></span>
    </div>
    <div style={{ height: 5, background: A.ruleS, borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct * 2}%`, background: A.accent }} />
    </div>
  </div>
);

Object.assign(window, {
  A_Login, A_Home, A_CreateGroup, A_GroupDetail, A_NewMatch, A_MatchDetail, A_Profile,
});
