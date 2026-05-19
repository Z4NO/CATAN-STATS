// ──────────────────────────────────────────────────────────────
// LEDGER · In-game flow (Fase 3)
// Selector de grupo (host) → Config host → Invitación → Lobby
// → Modo en juego (player / host) → Modal carta especial → Resumen
// ──────────────────────────────────────────────────────────────

// ════════════════════════════════════════════════════════════
// HELPERS específicos del modo en juego
// ════════════════════════════════════════════════════════════

const IGFrame = ({ children, w = 360, h = 760 }) => (
  <div style={{
    width: w, height: h, background: '#15130f', color: '#f6f1e7',
    borderRadius: 28, overflow: 'hidden', position: 'relative',
    boxShadow: '0 1px 0 rgba(0,0,0,.04), 0 24px 48px -24px rgba(40,30,20,.18)',
    border: `1px solid #2a2620`, fontFamily: L.fontText,
  }}>
    {/* status bar oscuro */}
    <div style={{
      height: 40, padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: L.fontMono, fontSize: 12, color: '#f6f1e7', letterSpacing: 0.2,
    }}>
      <span>21:14</span>
      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 10 }}>●●●●●</span>
        <span>5G</span>
        <span style={{ display: 'inline-block', width: 22, height: 10, border: `1px solid #f6f1e7`, borderRadius: 2, position: 'relative' }}>
          <span style={{ position: 'absolute', inset: 1, right: 4, background: '#f6f1e7', borderRadius: 1 }} />
        </span>
      </span>
    </div>
    {children}
  </div>
);

const DARK = {
  paper:   '#15130f',
  card:    '#201c16',
  card2:   '#28231b',
  rule:    '#3a342a',
  ruleS:   '#2a2620',
  ink:     '#f6f1e7',
  ink2:    '#c9bfa8',
  ink3:    '#857b66',
  accent:  '#d97757',
  accentS: '#f3d8c8',
  win:     '#9bb56a',
  winBg:   '#3a4528',
  alert:   '#c4624a',
  // colores semánticos para los 3 grupos del mockup
  build:   '#7a8c47',     // verde · contadores generales (manual)
  auto:    '#5a8aa6',     // azul  · info auto-llevada
  special: '#a8854a',     // ocre  · cartas especiales / eventos
};

// Counter row (etiqueta + - número +) ── el patrón base del modo en juego
const IGCounter = ({ label, value, sub, tone = 'build', size = 'md', readonly, mini }) => {
  const accentBy = { build: DARK.build, auto: DARK.auto, special: DARK.special };
  const accent = accentBy[tone];
  const numSize = size === 'lg' ? 28 : size === 'sm' ? 18 : 22;
  return (
    <div style={{
      background: DARK.card, borderRadius: 12, padding: mini ? '8px 10px' : '10px 12px',
      border: `1px solid ${DARK.ruleS}`,
      display: 'flex', flexDirection: 'column', gap: mini ? 4 : 6,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: accent,
      }} />
      <div style={{
        fontFamily: L.fontMono, fontSize: 9, letterSpacing: 0.6, color: DARK.ink3,
        textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <span>{label}</span>
        {sub && <span style={{ color: DARK.ink3, opacity: 0.7 }}>{sub}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        {!readonly && (
          <button style={{
            width: mini ? 26 : 30, height: mini ? 26 : 30, borderRadius: 8, border: `1px solid ${DARK.rule}`,
            background: 'transparent', color: DARK.ink, fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, fontFamily: L.fontText,
          }}>−</button>
        )}
        <div style={{
          fontFamily: L.fontDisp, fontSize: numSize, color: DARK.ink, lineHeight: 1, fontWeight: 500,
          flex: readonly ? 'none' : 1, textAlign: 'center',
        }}>{value}</div>
        {!readonly && (
          <button style={{
            width: mini ? 26 : 30, height: mini ? 26 : 30, borderRadius: 8, border: `1px solid ${accent}`,
            background: accent, color: '#fff', fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, fontFamily: L.fontText,
          }}>+</button>
        )}
      </div>
    </div>
  );
};

// Toggle/check para "tengo X" (carretera más larga, ejército más grande)
const IGCheck = ({ label, sub, active, locked, tone = 'special', icon }) => {
  const accentBy = { build: DARK.build, auto: DARK.auto, special: DARK.special };
  const accent = accentBy[tone];
  return (
    <div style={{
      background: active ? `${accent}1f` : DARK.card, borderRadius: 12, padding: '10px 12px',
      border: `1px solid ${active ? accent : DARK.ruleS}`,
      display: 'flex', alignItems: 'center', gap: 10, position: 'relative',
    }}>
      {icon && (
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: active ? accent : DARK.card2,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: active ? '#fff' : DARK.ink2,
          flexShrink: 0,
        }}>{icon}</div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: L.fontDisp, fontSize: 14, color: DARK.ink, lineHeight: 1.15 }}>{label}</div>
        {sub && (
          <div style={{ fontSize: 10, color: DARK.ink3, fontFamily: L.fontMono, marginTop: 2, letterSpacing: 0.3 }}>
            {sub}
          </div>
        )}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: 11, border: `1.5px solid ${active ? accent : DARK.rule}`,
        background: active ? accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 11,
      }}>{active && '✓'}{locked && !active && <span style={{ color: DARK.ink3, fontSize: 9 }}>🔒</span>}</div>
    </div>
  );
};

const IGSectionHead = ({ label, tone, right }) => {
  const accentBy = { build: DARK.build, auto: DARK.auto, special: DARK.special };
  const accent = accentBy[tone];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 8, marginTop: 4,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: accent }} />
        <span style={{
          fontFamily: L.fontMono, fontSize: 9, letterSpacing: 0.8, color: DARK.ink2,
          textTransform: 'uppercase', fontWeight: 500,
        }}>{label}</span>
      </div>
      {right && <span style={{ fontFamily: L.fontMono, fontSize: 9, color: DARK.ink3, letterSpacing: 0.5 }}>{right}</span>}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// 22 · SELECTOR DE GRUPO (HOST) — al darle a "Jugar"
// ════════════════════════════════════════════════════════════
const IG_GroupSelect = () => (
  <LFrame>
    <LTopBar title="Jugar" subtitle="Elige un grupo donde eres host" />
    <div style={{ padding: '18px 22px', height: 'calc(100% - 96px - 64px)', overflow: 'hidden' }}>

      <div style={{
        padding: 14, background: L.accentBg, borderRadius: 12, marginBottom: 16,
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <div style={{ width: 4, alignSelf: 'stretch', background: L.accent, borderRadius: 2 }} />
        <div>
          <div style={{ fontFamily: L.fontDisp, fontSize: 14, color: L.ink, lineHeight: 1.2 }}>
            Solo el host arranca la partida.
          </div>
          <div style={{ fontSize: 11, color: L.ink2, marginTop: 4, lineHeight: 1.5 }}>
            Los demás reciben una invitación cuando configures las reglas.
          </div>
        </div>
      </div>

      <LSectionLabel right={`${GROUPS.length} grupos`}>Grupos donde eres host</LSectionLabel>

      {GROUPS.map((g, i) => (
        <div key={g.id} style={{
          padding: '14px', marginBottom: 8, borderRadius: 14,
          background: L.card, border: `1px solid ${i === 0 ? L.ink : L.ruleS}`,
          display: 'flex', alignItems: 'center', gap: 12,
          position: 'relative',
        }}>
          <LAvatar name={g.name} size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontFamily: L.fontDisp, fontSize: 16, color: L.ink }}>{g.name}</span>
              <LChip text="host" tone="accent" />
            </div>
            <div style={{ fontSize: 11, color: L.ink3, fontFamily: L.fontMono, letterSpacing: 0.3 }}>
              {g.members}j · {g.matches}p · {g.last}
            </div>
          </div>
          <span style={{ color: L.ink2, fontSize: 18 }}>›</span>
        </div>
      ))}

      <div style={{
        marginTop: 14, padding: 12, background: 'transparent', borderRadius: 12,
        border: `1px dashed ${L.rule}`, textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: L.ink3, fontFamily: L.fontMono, letterSpacing: 0.4 }}>
          ¿No eres host de un grupo?
        </div>
        <div style={{ fontSize: 12, color: L.ink2, marginTop: 4 }}>
          Espera a que tu host inicie · llegará un aviso.
        </div>
      </div>
    </div>
    <LTabBar active="play" />
  </LFrame>
);

// ════════════════════════════════════════════════════════════
// 23 · CONFIG DE PARTIDA (HOST) — los 3 bloques del mockup
// ════════════════════════════════════════════════════════════
const IG_HostConfig = () => {
  const [exp, setExp] = React.useState('navegantes');
  const [vp, setVp] = React.useState(13);

  return (
    <LFrame>
      <LTopBar title="Configurar partida" back subtitle="Peña del jueves · host" />
      <div style={{ padding: '14px 22px', height: 'calc(100% - 96px - 72px)', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* EXPANSIÓN */}
        <div>
          <LSectionLabel>Expansión del juego</LSectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { id: 'base',       name: 'Base',        sub: '10 pts · 3-4j', vp: 10 },
              { id: 'navegantes', name: 'Navegantes',  sub: '13 pts · 3-4j', vp: 13 },
            ].map((e) => (
              <div key={e.id} style={{
                padding: 12, borderRadius: 12,
                background: exp === e.id ? L.card : 'transparent',
                border: `1.5px solid ${exp === e.id ? L.ink : L.rule}`,
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: L.fontDisp, fontSize: 15, color: L.ink }}>{e.name}</span>
                  {exp === e.id && <span style={{ color: L.accent }}>●</span>}
                </div>
                <div style={{ fontSize: 10, color: L.ink3, fontFamily: L.fontMono, letterSpacing: 0.3 }}>{e.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            {[
              { id: 'cyk',     name: 'Ciudades & Caballeros', sub: 'próximamente', dis: true },
              { id: 'mb',      name: 'Mercaderes & Bárbaros', sub: 'próximamente', dis: true },
            ].map((e) => (
              <div key={e.id} style={{
                padding: 12, borderRadius: 12, opacity: 0.4,
                background: 'transparent', border: `1px dashed ${L.rule}`,
              }}>
                <div style={{ fontFamily: L.fontDisp, fontSize: 13, color: L.ink2 }}>{e.name}</div>
                <div style={{ fontSize: 9, color: L.ink3, fontFamily: L.fontMono, letterSpacing: 0.3, marginTop: 2 }}>{e.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* JUGADORES */}
        <div>
          <LSectionLabel right="4 / 6 seleccionados">Jugadores</LSectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { name: 'Alba',  sel: true,  host: true },
              { name: 'Marc',  sel: true },
              { name: 'Lucia', sel: true },
              { name: 'Pau',   sel: true },
              { name: 'Nora',  sel: false },
            ].map((p) => (
              <div key={p.name} style={{
                padding: '8px 12px', borderRadius: 10,
                border: `1px solid ${p.sel ? L.ink : L.rule}`,
                background: p.sel ? L.card : 'transparent',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <LAvatar name={p.name} size={28} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: L.fontDisp, fontSize: 14, color: L.ink }}>{p.name}</span>
                  {p.host && <LChip text="tú · host" tone="accent" />}
                </div>
                <div style={{
                  width: 18, height: 18, borderRadius: 9,
                  border: `1.5px solid ${p.sel ? L.ink : L.rule}`,
                  background: p.sel ? L.ink : 'transparent',
                  color: L.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
                }}>{p.sel && '✓'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* REGLAS BÁSICAS */}
        <div>
          <LSectionLabel>Reglas básicas</LSectionLabel>
          <div style={{
            background: L.card, border: `1px solid ${L.ruleS}`, borderRadius: 12, overflow: 'hidden',
          }}>
            {[
              { l: 'Puntos para ganar', v: `${vp}`, ctrl: true },
              { l: 'Tablero',           v: 'Aleatorio' },
              { l: 'Carretera más larga', v: 'Activa', tone: 'soft' },
              { l: 'Ejército más grande', v: 'Activa', tone: 'soft' },
              { l: 'Cartas de progreso',  v: 'Estándar' },
            ].map((r, i) => (
              <div key={r.l} style={{
                padding: '11px 14px',
                borderTop: i ? `1px solid ${L.ruleS}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 13, color: L.ink2 }}>{r.l}</span>
                {r.ctrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <LStepButton>−</LStepButton>
                    <span style={{ fontFamily: L.fontMono, fontSize: 14, color: L.ink, fontWeight: 600, minWidth: 22, textAlign: 'center' }}>{r.v}</span>
                    <LStepButton>+</LStepButton>
                  </div>
                ) : r.tone === 'soft' ? (
                  <LChip text={r.v} tone="soft" />
                ) : (
                  <span style={{ fontSize: 12, color: L.ink, fontFamily: L.fontMono }}>{r.v}</span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
      <div style={{ padding: '12px 22px 16px', borderTop: `1px solid ${L.ruleS}` }}>
        <LButton variant="primary" size="lg" full>Enviar invitaciones · 3 jugadores</LButton>
      </div>
    </LFrame>
  );
};

// ════════════════════════════════════════════════════════════
// 24 · INVITACIÓN (POP-UP) — modal sobre la pantalla actual
// ════════════════════════════════════════════════════════════
const IG_Invitation = () => (
  <LFrame>
    {/* fondo: la pantalla home con scrim */}
    <div style={{ height: 'calc(100% - 40px)', position: 'relative' }}>
      <LTopBar title="Tus grupos" right="+" />
      <div style={{ padding: '16px 22px', opacity: 0.4, filter: 'blur(1px)' }}>
        {GROUPS.slice(0, 2).map((g) => (
          <div key={g.id} style={{
            padding: '14px', marginBottom: 8, borderRadius: 14,
            background: L.card, border: `1px solid ${L.ruleS}`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <LAvatar name={g.name} size={36} />
            <div>
              <div style={{ fontFamily: L.fontDisp, fontSize: 15, color: L.ink }}>{g.name}</div>
              <div style={{ fontSize: 11, color: L.ink3, fontFamily: L.fontMono }}>{g.matches}p · {g.last}</div>
            </div>
          </div>
        ))}
      </div>

      {/* scrim */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(28, 26, 22, 0.55)' }} />

      {/* sheet */}
      <div style={{
        position: 'absolute', left: 16, right: 16, top: 90,
        background: L.paper, borderRadius: 18, padding: 22,
        border: `1px solid ${L.rule}`,
        boxShadow: '0 20px 40px -12px rgba(28,26,22,.45)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontFamily: L.fontMono, fontSize: 9, color: L.accent, letterSpacing: 1.2 }}>
            ── INVITACIÓN A PARTIDA
          </span>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: L.accent }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <LAvatar name="Alba" size={40} color={L.accent} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: L.fontDisp, fontSize: 18, color: L.ink, lineHeight: 1.2 }}>
              <i>Alba</i> te invita a jugar
            </div>
            <div style={{ fontSize: 12, color: L.ink2, marginTop: 2 }}>
              en <b>Peña del jueves</b>
            </div>
          </div>
        </div>

        <div style={{
          padding: '10px 12px', background: L.card, borderRadius: 10, border: `1px solid ${L.ruleS}`,
          marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          {[
            { l: 'Expansión', v: 'Navegantes' },
            { l: 'Puntos',    v: '13' },
            { l: 'Jugadores', v: 'Alba, Marc, Lucia, Pau' },
          ].map((r) => (
            <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, lineHeight: 1.4 }}>
              <span style={{ color: L.ink3, fontFamily: L.fontMono, letterSpacing: 0.4, textTransform: 'uppercase' }}>{r.l}</span>
              <span style={{ color: L.ink, fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{r.v}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <LButton variant="secondary" style={{ flex: 1 }}>Ahora no</LButton>
          <LButton variant="primary" style={{ flex: 2 }}>Unirme ✓</LButton>
        </div>

        <div style={{ fontSize: 10, color: L.ink3, textAlign: 'center', marginTop: 10, fontFamily: L.fontMono, letterSpacing: 0.4 }}>
          la invitación caduca en 04:53
        </div>
      </div>
    </div>
  </LFrame>
);

// ════════════════════════════════════════════════════════════
// 25 · LOBBY PRE-PARTIDA — todos esperando
// ════════════════════════════════════════════════════════════
const IG_Lobby = () => (
  <LFrame>
    <LTopBar title="Lobby" subtitle="Peña del jueves" right="···" />
    <div style={{ padding: '18px 22px', height: 'calc(100% - 96px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* hero */}
      <div style={{
        padding: 16, borderRadius: 14, background: L.card, border: `1px solid ${L.rule}`,
        marginBottom: 14,
      }}>
        <div style={{ fontFamily: L.fontMono, fontSize: 9, letterSpacing: 1, color: L.accent, marginBottom: 6 }}>
          ── PARTIDA · NAVEGANTES
        </div>
        <div style={{ fontFamily: L.fontDisp, fontSize: 26, color: L.ink, letterSpacing: -0.6, lineHeight: 1.05 }}>
          Esperando a <i>Pau</i>…
        </div>
        <div style={{
          marginTop: 12, height: 4, borderRadius: 2, background: L.ruleS, overflow: 'hidden',
        }}>
          <div style={{ width: '75%', height: '100%', background: L.accent, borderRadius: 2 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 10, color: L.ink3, fontFamily: L.fontMono, letterSpacing: 0.4 }}>3 / 4 LISTOS</span>
          <span style={{ fontSize: 10, color: L.ink3, fontFamily: L.fontMono, letterSpacing: 0.4 }}>00:42 ESPERANDO</span>
        </div>
      </div>

      {/* jugadores */}
      <LSectionLabel>Jugadores</LSectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {[
          { name: 'Alba',  state: 'ready', host: true },
          { name: 'Marc',  state: 'ready' },
          { name: 'Lucia', state: 'ready' },
          { name: 'Pau',   state: 'pending' },
        ].map((p) => (
          <div key={p.name} style={{
            padding: '10px 12px', borderRadius: 12, background: L.card,
            border: `1px solid ${L.ruleS}`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <LAvatar name={p.name} size={32} />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: L.fontDisp, fontSize: 15, color: L.ink }}>{p.name}</span>
              {p.host && <LChip text="host" tone="accent" />}
            </div>
            {p.state === 'ready'
              ? <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: L.win, fontFamily: L.fontMono, letterSpacing: 0.3 }}>● LISTO</span>
              : <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: L.ink3, fontFamily: L.fontMono, letterSpacing: 0.3 }}>◐ ESPERANDO</span>
            }
          </div>
        ))}
      </div>

      {/* reglas resumidas */}
      <LSectionLabel>Reglas</LSectionLabel>
      <div style={{
        background: L.card, border: `1px solid ${L.ruleS}`, borderRadius: 12,
        padding: '10px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px',
        fontSize: 11,
      }}>
        {[
          ['Expansión', 'Navegantes'],
          ['Para ganar', '13 pts'],
          ['Tablero', 'Aleatorio'],
          ['Bonus', 'Ruta · Ejército'],
        ].map(([l, v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: L.ink3, fontFamily: L.fontMono, letterSpacing: 0.4, textTransform: 'uppercase', fontSize: 9 }}>{l}</span>
            <span style={{ color: L.ink, fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <LButton variant="primary" size="lg" full style={{ background: L.ink3, opacity: 0.6 }}>
        Comenzar partida · 1 falta
      </LButton>
      <div style={{ fontSize: 10, color: L.ink3, textAlign: 'center', marginTop: 8, fontFamily: L.fontMono, letterSpacing: 0.4 }}>
        El host arranca cuando todos estén listos
      </div>
    </div>
  </LFrame>
);

// ════════════════════════════════════════════════════════════
// 26 · MODO IN GAME · jugador normal
//      3 bloques del mockup: build · auto · special
// ════════════════════════════════════════════════════════════
const IG_PlayerLive = ({ asHost = false }) => (
  <IGFrame>
    <div style={{ height: 'calc(100% - 40px)', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER · partida */}
      <div style={{
        padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${DARK.ruleS}`,
      }}>
        <div>
          <div style={{ fontSize: 9, color: DARK.ink3, fontFamily: L.fontMono, letterSpacing: 1 }}>
            EN JUEGO · NAVEGANTES
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
            <span style={{ fontFamily: L.fontDisp, fontSize: 17, color: DARK.ink }}>Marc</span>
            {asHost && <span style={{ fontSize: 9, color: DARK.accent, fontFamily: L.fontMono, letterSpacing: 0.6 }}>· HOST</span>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: L.fontMono, fontSize: 16, color: DARK.ink, letterSpacing: 0.5,
          }}>00:42:15</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: '#e74c3c' }} />
            <span style={{ fontSize: 9, color: DARK.ink3, fontFamily: L.fontMono, letterSpacing: 0.6 }}>REC</span>
          </div>
        </div>
      </div>

      {/* CONTENIDO · 3 bloques */}
      <div style={{ flex: 1, padding: '10px 14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* AUTO · puntos llevados por la app (lo más importante visualmente) */}
        <div>
          <IGSectionHead label="Llevado por la app" tone="auto" right="auto" />
          <div style={{
            background: DARK.card, borderRadius: 12, border: `1px solid ${DARK.ruleS}`, padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ width: 2, alignSelf: 'stretch', background: DARK.auto, borderRadius: 1 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: DARK.ink3, fontFamily: L.fontMono, letterSpacing: 0.6, textTransform: 'uppercase' }}>
                Puntos de victoria
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                <span style={{ fontFamily: L.fontDisp, fontSize: 38, color: DARK.ink, lineHeight: 1, fontWeight: 500 }}>7</span>
                <span style={{ fontFamily: L.fontMono, fontSize: 12, color: DARK.ink3 }}>/ 13</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
              <div style={{ fontSize: 9, color: DARK.ink3, fontFamily: L.fontMono, letterSpacing: 0.6 }}>POSICIÓN</div>
              <div style={{ fontFamily: L.fontDisp, fontSize: 18, color: DARK.auto }}>2º</div>
            </div>
          </div>
          <div style={{
            marginTop: 6, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6,
          }}>
            {[
              { l: 'Recursos gastados', v: '37' },
              { l: 'Cartas compradas',  v: '4' },
              { l: 'Tiradas tuyas',     v: '12' },
            ].map((s) => (
              <div key={s.l} style={{
                background: DARK.card, borderRadius: 10, border: `1px solid ${DARK.ruleS}`, padding: '8px 10px',
              }}>
                <div style={{ fontSize: 8, color: DARK.ink3, fontFamily: L.fontMono, letterSpacing: 0.5, textTransform: 'uppercase' }}>{s.l}</div>
                <div style={{ fontFamily: L.fontDisp, fontSize: 16, color: DARK.ink, marginTop: 2 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BUILD · contadores generales (manuales) */}
        <div>
          <IGSectionHead label="Construcciones" tone="build" right="manual" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <IGCounter label="Aldeas"    value="3" sub="/ 5" tone="build" />
            <IGCounter label="Ciudades"  value="2" sub="/ 4" tone="build" />
            <IGCounter label="Carreteras" value="9" sub="/ 15" tone="build" />
            <IGCounter label="Barcos"    value="3" sub="navegantes" tone="build" />
          </div>
        </div>

        {/* SPECIAL · contadores y checks principales (cartas únicas + ladrón) */}
        <div>
          <IGSectionHead label="Hitos · cartas únicas" tone="special" right="solicita al host" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <IGCheck
              label="Carretera más larga"
              sub="Marc lleva 8 carreteras · solicita la carta"
              icon="🛣"
              tone="special"
            />
            <IGCheck
              label="Ejército más grande"
              sub="Tienes 3 caballeros — ya disponible"
              icon="⚔"
              active
              tone="special"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 6 }}>
            <IGCounter label="Caballeros jugados" value="3" tone="special" mini />
            <IGCounter label="Robos del ladrón"   value="2" tone="special" mini />
          </div>
        </div>

      </div>

      {/* FOOTER · acción rápida + standings mini */}
      <div style={{
        padding: '10px 14px 14px', borderTop: `1px solid ${DARK.ruleS}`,
        display: 'flex', flexDirection: 'column', gap: 8, background: DARK.paper,
      }}>
        <div style={{ display: 'flex', gap: 6, fontSize: 10, fontFamily: L.fontMono, color: DARK.ink3, letterSpacing: 0.5 }}>
          <span>STANDINGS</span>
          <span style={{ flex: 1, height: 1, background: DARK.ruleS, alignSelf: 'center' }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { name: 'Alba',  pts: 9, lead: true },
            { name: 'Marc',  pts: 7, you: true },
            { name: 'Lucia', pts: 6 },
            { name: 'Pau',   pts: 5 },
          ].map((p) => (
            <div key={p.name} style={{
              flex: 1, padding: '6px 8px', borderRadius: 8,
              background: p.you ? `${DARK.auto}1f` : DARK.card,
              border: `1px solid ${p.lead ? DARK.accent : p.you ? DARK.auto : DARK.ruleS}`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 9, color: DARK.ink3, fontFamily: L.fontMono, letterSpacing: 0.3, textTransform: 'uppercase' }}>{p.name}</div>
              <div style={{ fontFamily: L.fontDisp, fontSize: 18, color: p.lead ? DARK.accent : DARK.ink, lineHeight: 1, marginTop: 2 }}>{p.pts}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </IGFrame>
);

// ════════════════════════════════════════════════════════════
// 27 · MODO IN GAME · host (con badge + acceso a panel host)
// ════════════════════════════════════════════════════════════
const IG_HostLive = () => (
  <IGFrame>
    <div style={{ height: 'calc(100% - 40px)', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER · host */}
      <div style={{
        padding: '12px 18px', borderBottom: `1px solid ${DARK.ruleS}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `linear-gradient(180deg, ${DARK.accent}14 0%, transparent 100%)`,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 9, color: DARK.ink3, fontFamily: L.fontMono, letterSpacing: 1 }}>EN JUEGO · NAVEGANTES</span>
            <span style={{
              padding: '1px 6px', background: DARK.accent, color: '#fff',
              borderRadius: 4, fontSize: 8, fontFamily: L.fontMono, letterSpacing: 0.8,
            }}>HOST</span>
          </div>
          <div style={{ fontFamily: L.fontDisp, fontSize: 17, color: DARK.ink, marginTop: 2 }}>Alba</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: L.fontMono, fontSize: 16, color: DARK.ink }}>00:42:15</div>
          <div style={{ fontSize: 9, color: DARK.ink3, fontFamily: L.fontMono, letterSpacing: 0.6, marginTop: 2 }}>1 PETICIÓN ●</div>
        </div>
      </div>

      {/* AVISO · petición pendiente */}
      <div style={{
        margin: '10px 14px 0', padding: '10px 12px', borderRadius: 12,
        background: `${DARK.accent}1a`, border: `1px solid ${DARK.accent}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 14, background: DARK.accent, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
        }}>!</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: L.fontDisp, fontSize: 13, color: DARK.ink, lineHeight: 1.2 }}>
            <i>Marc</i> pide carretera más larga
          </div>
          <div style={{ fontSize: 10, color: DARK.ink2, fontFamily: L.fontMono, letterSpacing: 0.4, marginTop: 2 }}>
            llega 8 · supera el actual (Alba · 5)
          </div>
        </div>
        <button style={{
          padding: '6px 12px', borderRadius: 8, border: 'none', background: DARK.ink, color: DARK.paper,
          fontFamily: L.fontMono, fontSize: 10, letterSpacing: 0.6, cursor: 'pointer',
        }}>REVISAR</button>
      </div>

      {/* mismo contenido que jugador, abreviado */}
      <div style={{ flex: 1, padding: '10px 14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10 }}>

        <div>
          <IGSectionHead label="Llevado por la app" tone="auto" right="auto" />
          <div style={{
            background: DARK.card, borderRadius: 12, border: `1px solid ${DARK.ruleS}`, padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ width: 2, alignSelf: 'stretch', background: DARK.auto, borderRadius: 1 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: DARK.ink3, fontFamily: L.fontMono, letterSpacing: 0.6, textTransform: 'uppercase' }}>
                Puntos de victoria
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                <span style={{ fontFamily: L.fontDisp, fontSize: 38, color: DARK.ink, lineHeight: 1, fontWeight: 500 }}>9</span>
                <span style={{ fontFamily: L.fontMono, fontSize: 12, color: DARK.ink3 }}>/ 13</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
              <div style={{ fontSize: 9, color: DARK.ink3, fontFamily: L.fontMono, letterSpacing: 0.6 }}>POSICIÓN</div>
              <div style={{ fontFamily: L.fontDisp, fontSize: 18, color: DARK.accent }}>1º</div>
            </div>
          </div>
        </div>

        <div>
          <IGSectionHead label="Construcciones" tone="build" right="manual" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
            <IGCounter label="Aldeas"     value="2" tone="build" mini />
            <IGCounter label="Ciudades"   value="3" tone="build" mini />
            <IGCounter label="Carret."    value="5" tone="build" mini />
            <IGCounter label="Barcos"     value="2" tone="build" mini />
          </div>
        </div>

        <div>
          <IGSectionHead label="Hitos · cartas únicas" tone="special" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <IGCheck label="Carretera más larga" sub="la tienes · longitud 5" icon="🛣" active tone="special" />
            <IGCheck label="Ejército más grande" sub="Marc tiene 3 caballeros" icon="⚔" tone="special" />
          </div>
        </div>
      </div>

      {/* footer host con accesos a panel host */}
      <div style={{
        padding: '10px 14px 14px', borderTop: `1px solid ${DARK.ruleS}`,
        display: 'flex', gap: 6, background: DARK.paper,
      }}>
        <button style={{
          flex: 1, padding: '10px', borderRadius: 10, border: `1px solid ${DARK.ruleS}`, background: DARK.card,
          color: DARK.ink, fontFamily: L.fontText, fontSize: 12, cursor: 'pointer',
        }}>Estadísticas en vivo</button>
        <button style={{
          flex: 1, padding: '10px', borderRadius: 10, border: `1px solid ${DARK.accent}`, background: DARK.accent,
          color: '#fff', fontFamily: L.fontText, fontSize: 12, cursor: 'pointer', fontWeight: 500,
        }}>Terminar partida</button>
      </div>
    </div>
  </IGFrame>
);

// ════════════════════════════════════════════════════════════
// 28 · MODAL ACEPTACIÓN CARTA ESPECIAL — el del 4º mockup
// ════════════════════════════════════════════════════════════
const IG_SpecialCardModal = () => (
  <IGFrame>
    <div style={{ height: 'calc(100% - 40px)', position: 'relative' }}>
      {/* fondo · vista del host en juego, atenuada */}
      <div style={{ padding: '12px 18px', borderBottom: `1px solid ${DARK.ruleS}`, opacity: 0.35 }}>
        <div style={{ fontSize: 9, color: DARK.ink3, fontFamily: L.fontMono, letterSpacing: 1 }}>EN JUEGO · NAVEGANTES</div>
        <div style={{ fontFamily: L.fontDisp, fontSize: 17, color: DARK.ink, marginTop: 2 }}>Alba · host</div>
      </div>
      <div style={{ padding: 14, opacity: 0.25 }}>
        <div style={{ height: 80, background: DARK.card, borderRadius: 12, marginBottom: 8 }} />
        <div style={{ height: 60, background: DARK.card, borderRadius: 12, marginBottom: 8 }} />
        <div style={{ height: 90, background: DARK.card, borderRadius: 12 }} />
      </div>

      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />

      {/* modal */}
      <div style={{
        position: 'absolute', left: 18, right: 18, top: 80,
        background: '#3b1d18', color: '#fff5e9', borderRadius: 18,
        border: `1px solid #6a3024`, padding: 22,
        boxShadow: '0 24px 48px -12px rgba(0,0,0,.5)',
      }}>
        <div style={{
          fontFamily: L.fontMono, fontSize: 9, letterSpacing: 1.2, color: '#e8a585',
          marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>── PETICIÓN DE CARTA ÚNICA</span>
          <span>15s</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <LAvatar name="Marc" size={42} color="#a14a32" />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: L.fontDisp, fontSize: 19, lineHeight: 1.15 }}>
              <i>Marc</i> está solicitando
            </div>
            <div style={{ fontFamily: L.fontDisp, fontSize: 22, color: '#f3d8c8', marginTop: 2, lineHeight: 1.1 }}>
              Carretera más larga
            </div>
          </div>
        </div>

        <div style={{
          padding: '12px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: 12,
          border: `1px solid rgba(255,255,255,0.1)`, marginBottom: 14,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
            <span style={{ color: '#e8a585', fontFamily: L.fontMono, letterSpacing: 0.4, fontSize: 10, textTransform: 'uppercase' }}>Marc declara</span>
            <span style={{ fontFamily: L.fontMono, color: '#fff5e9', fontWeight: 600 }}>8 carreteras</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: '#e8a585', fontFamily: L.fontMono, letterSpacing: 0.4, fontSize: 10, textTransform: 'uppercase' }}>Actual · Alba</span>
            <span style={{ fontFamily: L.fontMono, color: '#fff5e9', opacity: 0.7 }}>5 carreteras</span>
          </div>
        </div>

        <div style={{ fontSize: 12, color: '#fff5e9', opacity: 0.85, lineHeight: 1.5, marginBottom: 18 }}>
          ¿Es correcto? Si aceptas, la carretera más larga pasa a Marc <b>(+2 pts)</b>.
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            flex: 1, height: 50, borderRadius: 12, border: `1px solid rgba(255,255,255,0.2)`,
            background: 'transparent', color: '#fff5e9', fontFamily: L.fontText, fontSize: 14, cursor: 'pointer',
          }}>No</button>
          <button style={{
            flex: 2, height: 50, borderRadius: 12, border: 'none',
            background: '#fff5e9', color: '#3b1d18', fontFamily: L.fontText, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Sí, aceptar ✓</button>
        </div>
      </div>
    </div>
  </IGFrame>
);

// ════════════════════════════════════════════════════════════
// 29 · ESPERANDO RESPUESTA — vista del jugador que pidió
// ════════════════════════════════════════════════════════════
const IG_PlayerWaiting = () => (
  <IGFrame>
    <div style={{ height: 'calc(100% - 40px)', position: 'relative' }}>
      {/* la pantalla del jugador atenuada de fondo */}
      <div style={{ opacity: 0.3, pointerEvents: 'none' }}>
        <div style={{ padding: '12px 18px', borderBottom: `1px solid ${DARK.ruleS}` }}>
          <div style={{ fontSize: 9, color: DARK.ink3, fontFamily: L.fontMono, letterSpacing: 1 }}>EN JUEGO · NAVEGANTES</div>
          <div style={{ fontFamily: L.fontDisp, fontSize: 17, color: DARK.ink, marginTop: 2 }}>Marc</div>
        </div>
        <div style={{ padding: 14 }}>
          <div style={{ height: 90, background: DARK.card, borderRadius: 12, marginBottom: 8 }} />
          <div style={{ height: 60, background: DARK.card, borderRadius: 12 }} />
        </div>
      </div>

      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />

      <div style={{
        position: 'absolute', left: 24, right: 24, top: 180,
        textAlign: 'center', color: DARK.ink,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 32, margin: '0 auto 18px',
          border: `2px solid ${DARK.accent}`, borderTopColor: 'transparent',
          animation: 'spin 1.4s linear infinite',
        }} />
        <div style={{ fontFamily: L.fontMono, fontSize: 9, color: DARK.accent, letterSpacing: 1.2, marginBottom: 8 }}>
          ── ESPERANDO AL HOST
        </div>
        <div style={{ fontFamily: L.fontDisp, fontSize: 24, lineHeight: 1.2, color: DARK.ink, marginBottom: 8 }}>
          Pediste la <i>carretera más larga</i>
        </div>
        <div style={{ fontSize: 12, color: DARK.ink2, lineHeight: 1.5, marginBottom: 22 }}>
          Alba está revisando tu petición. Si la acepta, sumarás <b>+2 puntos</b> automáticamente.
        </div>

        <div style={{
          display: 'inline-block', padding: '10px 18px', borderRadius: 12,
          background: DARK.card, border: `1px solid ${DARK.ruleS}`,
          fontFamily: L.fontMono, fontSize: 11, color: DARK.ink2, letterSpacing: 0.5,
        }}>
          declaraste: <span style={{ color: DARK.ink, fontWeight: 600 }}>8 carreteras</span>
        </div>

        <div style={{ marginTop: 22 }}>
          <button style={{
            padding: '10px 16px', borderRadius: 10, background: 'transparent',
            border: `1px solid ${DARK.rule}`, color: DARK.ink2, fontFamily: L.fontText, fontSize: 12, cursor: 'pointer',
          }}>Cancelar petición</button>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </div>
  </IGFrame>
);

// ════════════════════════════════════════════════════════════
// 30 · RESUMEN DE PARTIDA — al finalizar
// ════════════════════════════════════════════════════════════
const IG_MatchSummary = () => (
  <LFrame>
    <LTopBar title="Partida terminada" right="✕" />
    <div style={{ padding: '14px 22px', height: 'calc(100% - 96px)', overflow: 'hidden' }}>

      {/* hero · ganador */}
      <div style={{
        padding: 18, borderRadius: 16, background: L.winBg, border: `1px solid ${L.win}`,
        textAlign: 'center', marginBottom: 14, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          fontFamily: L.fontMono, fontSize: 9, color: L.win, letterSpacing: 1.4, marginBottom: 8,
        }}>★ GANADOR ★</div>
        <LAvatar name="Alba" size={56} color={L.win} />
        <div style={{ fontFamily: L.fontDisp, fontSize: 28, color: L.ink, letterSpacing: -0.8, lineHeight: 1.05, marginTop: 8 }}>
          Alba con <i style={{ color: L.win }}>13 puntos</i>
        </div>
        <div style={{ fontSize: 11, color: L.ink2, fontFamily: L.fontMono, letterSpacing: 0.4, marginTop: 6 }}>
          NAVEGANTES · 1H 42M · 4 JUGADORES
        </div>
      </div>

      {/* tabla puestos */}
      <LSectionLabel>Clasificación final</LSectionLabel>
      <div style={{
        background: L.card, border: `1px solid ${L.ruleS}`, borderRadius: 12,
        marginBottom: 14, overflow: 'hidden',
      }}>
        {[
          { pos: 1, name: 'Alba',  pts: 13, road: true,  army: false },
          { pos: 2, name: 'Marc',  pts: 11, road: false, army: true },
          { pos: 3, name: 'Lucia', pts: 9,  road: false, army: false },
          { pos: 4, name: 'Pau',   pts: 7,  road: false, army: false },
        ].map((p, i) => (
          <div key={p.name} style={{
            padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
            borderTop: i ? `1px solid ${L.ruleS}` : 'none',
            background: p.pos === 1 ? L.winBg : 'transparent',
          }}>
            <div style={{
              width: 22, fontFamily: L.fontDisp, fontSize: 16,
              color: p.pos === 1 ? L.win : L.ink3, textAlign: 'center',
            }}>{p.pos}</div>
            <LAvatar name={p.name} size={28} />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: L.fontDisp, fontSize: 14, color: L.ink }}>{p.name}</span>
              {p.road && <LChip text="ruta" tone="road" />}
              {p.army && <LChip text="ejército" tone="army" />}
            </div>
            <div style={{ fontFamily: L.fontMono, fontSize: 16, color: L.ink, fontWeight: 600 }}>{p.pts}</div>
          </div>
        ))}
      </div>

      {/* highlights */}
      <LSectionLabel>Momentos clave</LSectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
        {[
          { t: '0:24', who: 'Marc',  ev: 'consigue Ejército más grande' },
          { t: '0:38', who: 'Alba',  ev: 'construye su 2ª ciudad · 7 pts' },
          { t: '1:12', who: 'Marc',  ev: 'pide carretera más larga (l=8) · denegada' },
          { t: '1:38', who: 'Alba',  ev: 'consigue Carretera más larga · 11 pts' },
          { t: '1:42', who: 'Alba',  ev: 'cierra con carta de victoria' },
        ].map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12, padding: '4px 0' }}>
            <span style={{ fontFamily: L.fontMono, color: L.ink3, letterSpacing: 0.4, minWidth: 36 }}>{e.t}</span>
            <span style={{ color: L.ink2, lineHeight: 1.4 }}>
              <b style={{ color: L.ink, fontFamily: L.fontDisp, fontWeight: 500 }}>{e.who}</b> {e.ev}
            </span>
          </div>
        ))}
      </div>

      {/* MVP awards */}
      <LSectionLabel>Reconocimientos</LSectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14 }}>
        {[
          { l: 'Constructor',   v: 'Alba',  sub: '11 construcciones' },
          { l: 'Más caballeros', v: 'Marc', sub: '5 jugados' },
          { l: 'Más cartas',    v: 'Lucia', sub: '7 compradas' },
          { l: 'Más robos',     v: 'Pau',   sub: '4 al ladrón' },
        ].map((a) => (
          <div key={a.l} style={{
            padding: '8px 10px', background: L.card, border: `1px solid ${L.ruleS}`, borderRadius: 10,
          }}>
            <div style={{ fontSize: 9, color: L.ink3, fontFamily: L.fontMono, letterSpacing: 0.5, textTransform: 'uppercase' }}>{a.l}</div>
            <div style={{ fontFamily: L.fontDisp, fontSize: 14, color: L.ink, marginTop: 2 }}>{a.v}</div>
            <div style={{ fontSize: 10, color: L.ink3, fontFamily: L.fontMono, marginTop: 1 }}>{a.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <LButton variant="secondary" style={{ flex: 1 }}>Compartir</LButton>
        <LButton variant="primary" style={{ flex: 2 }}>Guardar y volver</LButton>
      </div>
    </div>
  </LFrame>
);

// ════════════════════════════════════════════════════════════

Object.assign(window, {
  IG_GroupSelect,
  IG_HostConfig,
  IG_Invitation,
  IG_Lobby,
  IG_PlayerLive,
  IG_HostLive,
  IG_SpecialCardModal,
  IG_PlayerWaiting,
  IG_MatchSummary,
});
