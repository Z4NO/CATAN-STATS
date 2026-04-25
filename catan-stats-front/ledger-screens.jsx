// ──────────────────────────────────────────────────────────────
// LEDGER · Expanded screens for CATAN-STATS MVP (Fase 1-4)
// Mapped to repo entities: User, Group, GroupMember, GroupLog, and
// planned: Match, MatchPlayer, MatchEvent, Ruleset, PlayerStats.
// ──────────────────────────────────────────────────────────────

// ═══ 1 · AUTH ═══════════════════════════════════════════════
const L_Register = () => (
  <LFrame>
    <div style={{ height: 'calc(100% - 40px)', padding: '20px 26px 24px', display: 'flex', flexDirection: 'column' }}>
      <LWordmark size={18} />
      <div style={{ marginTop: 28 }}>
        <div style={{ fontFamily: L.fontDisp, fontSize: 32, letterSpacing: -1, color: L.ink, lineHeight: 1.05, marginBottom: 6 }}>
          Crea tu cuenta.
        </div>
        <div style={{ fontSize: 13, color: L.ink2, marginBottom: 24 }}>
          Gratis, sin anuncios. Sólo tus partidas.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <LField label="Nombre para mostrar" hint="público en tus grupos">Alba Martín</LField>
          <LField label="Usuario" hint="único, sin espacios">alba_m</LField>
          <LField label="Email">alba@example.com</LField>
          <LField label="Contraseña" muted hint="mín. 8 caracteres">••••••••••</LField>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: L.ink2, marginTop: 4 }}>
            <div style={{ width: 16, height: 16, border: `1.5px solid ${L.ink}`, borderRadius: 4, background: L.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', color: L.paper, fontSize: 11, marginTop: 1 }}>✓</div>
            <span>Acepto los términos y la política de privacidad.</span>
          </div>
          <LButton variant="primary" size="lg" full style={{ marginTop: 4 }}>Crear cuenta</LButton>
          <div style={{ textAlign: 'center', fontSize: 12, color: L.ink3, marginTop: 4 }}>
            ¿Ya tienes cuenta? <span style={{ color: L.accent, fontWeight: 500 }}>Inicia sesión</span>
          </div>
        </div>
      </div>
    </div>
  </LFrame>
);

// ═══ 2 · RECOVER PASSWORD ═══════════════════════════════════
const L_Recover = () => (
  <LFrame>
    <LTopBar title="Recuperar acceso" back />
    <div style={{ padding: '28px 26px', height: 'calc(100% - 96px)' }}>
      <div style={{ fontFamily: L.fontDisp, fontSize: 26, letterSpacing: -0.7, color: L.ink, lineHeight: 1.1, marginBottom: 8 }}>
        Te mandamos un enlace mágico.
      </div>
      <div style={{ fontSize: 13, color: L.ink2, marginBottom: 24, lineHeight: 1.5 }}>
        Escribe tu email y recibirás un enlace para entrar sin contraseña.
      </div>
      <LField label="Email de tu cuenta">alba@example.com</LField>
      <LButton variant="primary" size="lg" full style={{ marginTop: 16 }}>Enviar enlace</LButton>
      <div style={{ marginTop: 20, padding: 14, background: L.winBg, borderRadius: 12, fontSize: 12, color: L.ink2, lineHeight: 1.5, borderLeft: `3px solid ${L.win}` }}>
        <span style={{ fontWeight: 600, color: L.win, fontFamily: L.fontMono, fontSize: 10, letterSpacing: 0.6 }}>ENVIADO</span><br/>
        Revisa tu bandeja. El enlace caduca en 15 min.
      </div>
    </div>
  </LFrame>
);

// ═══ 3 · JOIN WITH CODE ═════════════════════════════════════
const L_JoinWithCode = () => (
  <LFrame>
    <LTopBar title="Unirse a grupo" back />
    <div style={{ padding: '20px 26px', height: 'calc(100% - 96px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        background: L.card, border: `1px solid ${L.rule}`, borderRadius: 16, padding: 4,
        display: 'flex', gap: 4, marginBottom: 20,
      }}>
        <div style={{ flex: 1, padding: '10px 12px', borderRadius: 12, textAlign: 'center', fontSize: 13, color: L.ink3 }}>Crear</div>
        <div style={{ flex: 1, padding: '10px 12px', borderRadius: 12, background: L.paper, textAlign: 'center', fontSize: 13, color: L.ink, fontWeight: 500 }}>Unirse con código</div>
      </div>

      <div style={{ fontFamily: L.fontDisp, fontSize: 22, letterSpacing: -0.5, color: L.ink, marginBottom: 6 }}>
        Pega el código.
      </div>
      <div style={{ fontSize: 13, color: L.ink2, marginBottom: 24, lineHeight: 1.5 }}>
        Pídeselo a quien creó el grupo. 6 caracteres, mayúsculas.
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
        {['K','3','R','9','B','2'].map((c, i) => (
          <div key={i} style={{
            width: 42, height: 54, borderRadius: 12, border: `1.5px solid ${i === 5 ? L.accent : L.rule}`,
            background: L.card, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: L.fontMono, fontSize: 22, color: L.ink, fontWeight: 600,
          }}>{c}</div>
        ))}
      </div>

      <div style={{
        padding: 14, background: L.card, borderRadius: 12, border: `1px solid ${L.rule}`,
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14,
      }}>
        <LAvatar name="Peña del jueves" />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: L.fontDisp, fontSize: 15, color: L.ink }}>Peña del jueves</div>
          <div style={{ fontSize: 11, color: L.ink3, fontFamily: L.fontMono, marginTop: 2 }}>5 jugadores · 47 partidas</div>
        </div>
        <LChip text="encontrado" tone="soft" />
      </div>

      <div style={{ flex: 1 }} />
      <LButton variant="primary" size="lg" full>Unirme al grupo</LButton>
    </div>
  </LFrame>
);

// ═══ 4 · GROUP MEMBERS (admin view) ═════════════════════════
const L_GroupMembers = () => (
  <LFrame>
    <LTopBar title="Miembros" back subtitle="Peña del jueves" right="+" />
    <div style={{ padding: '16px 22px', height: 'calc(100% - 96px)', overflow: 'hidden' }}>
      <LSectionLabel right="5 activos">Miembros</LSectionLabel>
      {[
        { name: 'Alba',  role: 'Admin',      since: 'ene 2024', active: true },
        { name: 'Marc',  role: 'Moderador',  since: 'ene 2024', active: true },
        { name: 'Lucia', role: 'Miembro',    since: 'feb 2024', active: true },
        { name: 'Pau',   role: 'Miembro',    since: 'mar 2024', active: true },
        { name: 'Nora',  role: 'Miembro',    since: 'oct 2024', active: true },
      ].map((m, i) => (
        <div key={m.name} style={{
          padding: '12px 0', borderBottom: `1px solid ${L.ruleS}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <LAvatar name={m.name} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: L.fontDisp, fontSize: 15, color: L.ink }}>{m.name} {i === 0 && <span style={{ color: L.ink3, fontSize: 11, fontFamily: L.fontMono }}>· tú</span>}</div>
            <div style={{ fontSize: 11, color: L.ink3, fontFamily: L.fontMono, marginTop: 2 }}>
              desde {m.since}
            </div>
          </div>
          <LChip text={m.role} tone={m.role === 'Admin' ? 'accent' : m.role === 'Moderador' ? 'soft' : 'neutral'} />
        </div>
      ))}

      <LSectionLabel>Código de invitación</LSectionLabel>
      <div style={{
        padding: 14, background: L.card, border: `1px dashed ${L.rule}`, borderRadius: 12,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ flex: 1, fontFamily: L.fontMono, fontSize: 22, color: L.ink, letterSpacing: 4, fontWeight: 600 }}>K3R9B2</div>
        <LButton variant="secondary" size="sm">Copiar</LButton>
      </div>
      <div style={{ fontSize: 11, color: L.ink3, marginTop: 8 }}>
        Comparte este código o el enlace con tus amigos para que se unan.
      </div>
    </div>
  </LFrame>
);

// ═══ 5 · NEW MATCH WIZARD - step 1: players ═════════════════
const L_NewMatchStep1 = () => (
  <LFrame>
    <LTopBar title="Nueva partida" back right="1 / 4" />
    <div style={{ padding: '14px 22px 0', display: 'flex', gap: 4 }}>
      {[1,0,0,0].map((on, i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: on ? L.accent : L.ruleS }} />
      ))}
    </div>
    <div style={{ padding: '20px 22px', height: 'calc(100% - 96px - 17px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontFamily: L.fontDisp, fontSize: 24, letterSpacing: -0.6, color: L.ink, marginBottom: 4 }}>
        ¿Quién jugó?
      </div>
      <div style={{ fontSize: 13, color: L.ink2, marginBottom: 18 }}>
        Marca entre 3 y 6 miembros del grupo.
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { name: 'Alba',  sel: true },
          { name: 'Marc',  sel: true },
          { name: 'Lucia', sel: true },
          { name: 'Pau',   sel: true },
          { name: 'Nora',  sel: false },
        ].map((p) => (
          <div key={p.name} style={{
            padding: '10px 14px', borderRadius: 14,
            border: `1px solid ${p.sel ? L.ink : L.rule}`,
            background: p.sel ? L.card : 'transparent',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <LAvatar name={p.name} />
            <div style={{ flex: 1, fontFamily: L.fontDisp, fontSize: 16, color: L.ink }}>{p.name}</div>
            <div style={{
              width: 22, height: 22, borderRadius: 11,
              border: `1.5px solid ${p.sel ? L.ink : L.rule}`,
              background: p.sel ? L.ink : 'transparent',
              color: L.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
            }}>{p.sel && '✓'}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: L.ink3, textAlign: 'center', margin: '12px 0 10px', fontFamily: L.fontMono }}>
        4 seleccionados · válido para Base y Navegantes
      </div>
      <LButton variant="primary" size="lg" full>Siguiente →</LButton>
    </div>
  </LFrame>
);

// ═══ 6 · NEW MATCH WIZARD - step 3: expansion ═══════════════
const L_NewMatchStep3 = () => (
  <LFrame>
    <LTopBar title="Nueva partida" back right="3 / 4" />
    <div style={{ padding: '14px 22px 0', display: 'flex', gap: 4 }}>
      {[1,1,1,0].map((on, i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: on ? L.accent : L.ruleS }} />
      ))}
    </div>
    <div style={{ padding: '20px 22px', height: 'calc(100% - 96px - 17px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontFamily: L.fontDisp, fontSize: 24, letterSpacing: -0.6, color: L.ink, marginBottom: 4 }}>
        ¿Quién ganó y con cuántos puntos?
      </div>
      <div style={{ fontSize: 13, color: L.ink2, marginBottom: 18 }}>
        Elige el ganador y marca sus bonus. Los demás lo rellenas ahora o después.
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { name: 'Alba',  sel: true },
          { name: 'Marc',  sel: false },
          { name: 'Lucia', sel: false },
          { name: 'Pau',   sel: false },
        ].map((p) => (
          <div key={p.name} style={{
            padding: '12px 14px', borderRadius: 14,
            border: `1px solid ${p.sel ? L.win : L.rule}`,
            background: p.sel ? L.winBg : L.card,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 11,
              border: `1.5px solid ${p.sel ? L.win : L.rule}`,
              background: p.sel ? L.win : 'transparent',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
            }}>{p.sel && '★'}</div>
            <LAvatar name={p.name} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: L.fontDisp, fontSize: 16, color: L.ink, lineHeight: 1.1 }}>{p.name}</div>
              {p.sel && (
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <LChip text="ruta más larga" tone="road" />
                  <LChip text="ejército" tone="army" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 12, padding: 12, background: L.card, border: `1px solid ${L.ruleS}`,
        borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 11, color: L.ink3, fontFamily: L.fontMono, letterSpacing: 0.4 }}>PUNTOS ALBA</div>
          <div style={{ fontFamily: L.fontDisp, fontSize: 24, color: L.ink, lineHeight: 1, marginTop: 2 }}>13 / 13</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LStepButton>−</LStepButton>
          <LStepButton>+</LStepButton>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <LButton variant="secondary" style={{ flex: 1 }}>Atrás</LButton>
        <LButton variant="primary" style={{ flex: 2 }}>Siguiente →</LButton>
      </div>
    </div>
  </LFrame>
);

// ═══ 7 · NEW MATCH WIZARD - step 4: confirm ═════════════════
const L_NewMatchStep4 = () => (
  <LFrame>
    <LTopBar title="Nueva partida" back right="4 / 4" />
    <div style={{ padding: '14px 22px 0', display: 'flex', gap: 4 }}>
      {[1,1,1,1].map((on, i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: L.accent }} />
      ))}
    </div>
    <div style={{ padding: '20px 22px', height: 'calc(100% - 96px - 17px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontFamily: L.fontDisp, fontSize: 24, letterSpacing: -0.6, color: L.ink, marginBottom: 4 }}>
        Revisa y guarda.
      </div>
      <div style={{ fontSize: 13, color: L.ink2, marginBottom: 18 }}>
        Todo correcto? También puedes añadir duración y notas.
      </div>

      <div style={{
        background: L.card, border: `1px solid ${L.rule}`, borderRadius: 14, padding: 14, marginBottom: 14,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: L.fontMono, fontSize: 10, color: L.ink3, letterSpacing: 0.6 }}>24 ABR 2026</div>
            <div style={{ fontFamily: L.fontDisp, fontSize: 18, color: L.ink, marginTop: 2 }}>
              Ganó <i style={{ color: L.accent }}>Alba</i> con 13 pts
            </div>
          </div>
          <LChip text="navegantes" tone="soft" />
        </div>

        {MATCH_DETAIL.scores.map((s, i) => (
          <div key={s.name} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 0', borderTop: i === 0 ? `1px solid ${L.ruleS}` : 'none',
            borderBottom: i < 3 ? `1px solid ${L.ruleS}` : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <LAvatar name={s.name} size={24} />
              <span style={{ fontFamily: L.fontDisp, fontSize: 14, color: L.ink }}>{s.name}</span>
              {s.isWinner && <span style={{ color: L.win }}>★</span>}
              {s.longestRoad && <LResource kind="wood" size={12} color={L.wood} />}
              {s.largestArmy && <span style={{ fontSize: 11 }}>⚔︎</span>}
            </div>
            <span style={{ fontFamily: L.fontMono, fontSize: 14, color: L.ink, fontWeight: 600 }}>{s.score}</span>
          </div>
        ))}
      </div>

      <LField label="Duración (opcional)">1h 42m</LField>
      <div style={{ marginTop: 12 }}>
        <div style={{ fontFamily: L.fontMono, fontSize: 10, letterSpacing: 0.6, color: L.ink3, textTransform: 'uppercase', marginBottom: 6 }}>
          Notas (opcional)
        </div>
        <div style={{
          minHeight: 60, borderRadius: 12, border: `1px solid ${L.rule}`, background: L.card,
          padding: 12, fontSize: 13, color: L.ink2, fontStyle: 'italic', fontFamily: L.fontDisp,
        }}>
          Partida cerradísima. Alba la cierra con la ruta más larga al final.
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <LButton variant="secondary" style={{ flex: 1 }}>Atrás</LButton>
        <LButton variant="primary" style={{ flex: 2 }}>Guardar partida ✓</LButton>
      </div>
    </div>
  </LFrame>
);

// ═══ 8 · MATCH LIST (full history) ══════════════════════════
const L_MatchList = () => (
  <LFrame>
    <LTopBar title="Historial" back subtitle="Peña del jueves · 47 partidas" right="⚲" />
    <div style={{ padding: '14px 22px', height: 'calc(100% - 96px)', overflow: 'hidden' }}>
      <div style={{
        display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto',
      }}>
        {['Todas', 'Base', 'Navegantes', 'Últ. mes'].map((f, i) => (
          <span key={f} style={{
            padding: '6px 12px', borderRadius: 14,
            background: i === 0 ? L.ink : 'transparent',
            color: i === 0 ? L.paper : L.ink2,
            border: i === 0 ? 'none' : `1px solid ${L.rule}`,
            fontSize: 11, fontFamily: L.fontMono, letterSpacing: 0.4, whiteSpace: 'nowrap',
          }}>{f}</span>
        ))}
      </div>

      {[
        { date: 'Abril 2026', items: RECENT_MATCHES.slice(0, 3) },
        { date: 'Marzo 2026', items: RECENT_MATCHES.slice(3, 6) },
      ].map((group) => (
        <div key={group.date}>
          <div style={{
            fontFamily: L.fontMono, fontSize: 10, letterSpacing: 0.8, color: L.ink3,
            textTransform: 'uppercase', marginTop: 14, marginBottom: 8, paddingLeft: 2,
          }}>{group.date}</div>
          {group.items.map((m, i) => (
            <div key={m.id} style={{
              padding: '12px 14px', marginBottom: 6, borderRadius: 12,
              background: L.card, border: `1px solid ${L.ruleS}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ textAlign: 'center', width: 32 }}>
                <div style={{ fontFamily: L.fontDisp, fontSize: 18, color: L.ink, lineHeight: 1 }}>
                  {m.date.split(' ')[0]}
                </div>
                <div style={{ fontSize: 9, color: L.ink3, fontFamily: L.fontMono, marginTop: 2 }}>
                  {m.date.split(' ')[1]}
                </div>
              </div>
              <div style={{ width: 1, height: 34, background: L.ruleS }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: L.fontDisp, fontSize: 14, color: L.ink }}>
                  Ganó <i>{m.winner}</i> · {m.points} pts
                </div>
                <div style={{ fontSize: 10, color: L.ink3, fontFamily: L.fontMono, marginTop: 2 }}>
                  {m.expansion} · {m.players}j · {m.duration}
                </div>
              </div>
              <span style={{ color: L.ink3, fontSize: 16 }}>›</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  </LFrame>
);

// ═══ 9 · LIVE MODE (en juego) ═══════════════════════════════
const L_LiveMode = () => (
  <LFrame bg="#1c1a16">
    <div style={{ color: L.paper, height: 'calc(100% - 40px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid rgba(255,255,255,.1)`,
      }}>
        <div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontFamily: L.fontMono, letterSpacing: 1 }}>EN JUEGO · NAVEGANTES</div>
          <div style={{ fontFamily: L.fontDisp, fontSize: 18, marginTop: 2, color: L.paper }}>00:42:15</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: '#e74c3c', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontFamily: L.fontMono }}>REC</span>
        </div>
      </div>

      {/* current standings */}
      <div style={{ padding: '14px 22px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { name: 'Alba', pts: 9, road: true, army: false, knights: 2 },
          { name: 'Marc', pts: 7, road: false, army: true, knights: 3 },
          { name: 'Lucia', pts: 6, road: false, army: false, knights: 1 },
          { name: 'Pau', pts: 5, road: false, army: false, knights: 0 },
        ].map((p, i) => (
          <div key={p.name} style={{
            background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: '10px 12px',
            display: 'flex', alignItems: 'center', gap: 10,
            border: i === 0 ? `1px solid ${L.accent}` : `1px solid rgba(255,255,255,.06)`,
          }}>
            <div style={{ fontFamily: L.fontDisp, fontSize: 13, color: i === 0 ? L.accent : 'rgba(255,255,255,.4)', width: 14 }}>{i+1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: L.fontDisp, fontSize: 15, color: L.paper }}>{p.name}</div>
              <div style={{ display: 'flex', gap: 4, marginTop: 3 }}>
                {p.road && <LChip text="ruta" tone="road" />}
                {p.army && <LChip text="ejército" tone="army" />}
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', fontFamily: L.fontMono, padding: '2px 0' }}>
                  ⚔ {p.knights}
                </span>
              </div>
            </div>
            <div style={{ fontFamily: L.fontDisp, fontSize: 24, color: L.paper, fontWeight: 500 }}>{p.pts}</div>
          </div>
        ))}
      </div>

      {/* quick actions */}
      <div style={{ padding: '8px 22px', flex: 1 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontFamily: L.fontMono, letterSpacing: 0.8, marginBottom: 8 }}>
          ── ACCIÓN RÁPIDA
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: '+1 pto', sub: 'asentamiento' },
            { label: '+2 pts', sub: 'ciudad' },
            { label: 'ruta +larga', sub: 'cambio' },
            { label: 'ejército', sub: 'cambio' },
            { label: '+1 ⚔', sub: 'caballero' },
            { label: 'carta VP', sub: '+1 oculto' },
          ].map((a) => (
            <div key={a.label} style={{
              padding: 12, background: 'rgba(255,255,255,.06)', borderRadius: 10,
              border: `1px solid rgba(255,255,255,.08)`,
            }}>
              <div style={{ fontFamily: L.fontDisp, fontSize: 14, color: L.paper }}>{a.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', fontFamily: L.fontMono, marginTop: 2 }}>{a.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontFamily: L.fontMono, letterSpacing: 0.8, marginTop: 14, marginBottom: 6 }}>
          ── TIMELINE (3 eventos)
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', fontFamily: L.fontMono, lineHeight: 1.8 }}>
          0:24 · Marc · ejército más grande<br/>
          0:38 · Alba · +2 (ciudad)<br/>
          0:41 · Alba · ruta más larga (l=5)
        </div>
      </div>

      <div style={{ padding: 14, borderTop: `1px solid rgba(255,255,255,.1)` }}>
        <button style={{
          width: '100%', height: 48, background: L.accent, color: '#fff', border: 'none',
          borderRadius: 14, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: L.fontText,
        }}>Terminar partida →</button>
      </div>
    </div>
  </LFrame>
);

// ═══ 10 · DESKTOP DASHBOARD ═════════════════════════════════
const L_Dashboard = () => (
  <LDesktopFrame>
    <div style={{ height: 'calc(100% - 36px)', display: 'flex' }}>
      {/* sidebar */}
      <div style={{ width: 240, borderRight: `1px solid ${L.ruleS}`, padding: 22, background: L.paper }}>
        <LWordmark size={18} />
        <div style={{ marginTop: 28 }}>
          <div style={{ fontFamily: L.fontMono, fontSize: 10, color: L.ink3, letterSpacing: 0.8, marginBottom: 10 }}>TUS GRUPOS</div>
          {GROUPS.map((g, i) => (
            <div key={g.id} style={{
              padding: '10px 12px', borderRadius: 10, marginBottom: 4,
              background: i === 0 ? L.card : 'transparent',
              border: i === 0 ? `1px solid ${L.rule}` : '1px solid transparent',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: 3, background: i === 0 ? L.accent : L.ink3,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: L.ink, fontWeight: 500 }}>{g.name}</div>
                <div style={{ fontSize: 10, color: L.ink3, fontFamily: L.fontMono, marginTop: 1 }}>{g.matches}g · {g.members}j</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28 }}>
          <div style={{ fontFamily: L.fontMono, fontSize: 10, color: L.ink3, letterSpacing: 0.8, marginBottom: 10 }}>VISTAS</div>
          {['Resumen', 'Jugadores', 'Partidas', 'Matchups', 'Catán puro'].map((v, i) => (
            <div key={v} style={{
              padding: '8px 12px', fontSize: 13, color: i === 0 ? L.ink : L.ink2,
              fontWeight: i === 0 ? 500 : 400, cursor: 'pointer',
            }}>{v}</div>
          ))}
        </div>
      </div>

      {/* main */}
      <div style={{ flex: 1, padding: '28px 32px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: L.fontMono, fontSize: 10, color: L.ink3, letterSpacing: 0.8, marginBottom: 6 }}>
              ── PEÑA DEL JUEVES · RESUMEN
            </div>
            <div style={{ fontFamily: L.fontDisp, fontSize: 38, color: L.ink, letterSpacing: -1.2, lineHeight: 1 }}>
              47 partidas, <i style={{ color: L.accent }}>3 meses</i> de datos.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <LButton variant="secondary" size="sm">Exportar</LButton>
            <LButton variant="accent" size="sm">+ Partida</LButton>
          </div>
        </div>

        {/* 4 stats */}
        <div style={{ display: 'flex', gap: 20, padding: '18px 0', borderTop: `1px solid ${L.ruleS}`, borderBottom: `1px solid ${L.ruleS}`, marginBottom: 24 }}>
          <LStat big="47" label="partidas" />
          <div style={{ width: 1, background: L.ruleS }} />
          <LStat big="Alba" label="líder" tone="accent" />
          <div style={{ width: 1, background: L.ruleS }} />
          <LStat big="1h 34m" label="duración media" />
          <div style={{ width: 1, background: L.ruleS }} />
          <LStat big="8.7" label="pts media" />
          <div style={{ width: 1, background: L.ruleS }} />
          <LStat big="3W" label="racha activa" tone="accent" />
        </div>

        {/* grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
          {/* Win rates bars */}
          <div style={{ background: L.card, border: `1px solid ${L.rule}`, borderRadius: 14, padding: 18 }}>
            <LSectionLabel right="total · 47 partidas">Win rate por jugador</LSectionLabel>
            {PLAYER_STATS.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                <LAvatar name={p.name} size={28} color={i === 0 ? L.accent : undefined} />
                <div style={{ width: 60, fontFamily: L.fontDisp, fontSize: 14, color: L.ink }}>{p.name}</div>
                <div style={{ flex: 1, height: 8, background: L.ruleS, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.winrate * 2}%`, background: i === 0 ? L.accent : L.ink, opacity: i === 0 ? 1 : 0.4, borderRadius: 4 }} />
                </div>
                <div style={{ width: 40, textAlign: 'right', fontFamily: L.fontMono, fontSize: 12, color: L.ink, fontWeight: 600 }}>
                  {p.winrate}%
                </div>
                <div style={{ width: 36, textAlign: 'right', fontFamily: L.fontMono, fontSize: 10, color: L.ink3 }}>
                  {p.won}/{p.played}
                </div>
              </div>
            ))}
          </div>

          {/* Matches per month */}
          <div style={{ background: L.card, border: `1px solid ${L.rule}`, borderRadius: 14, padding: 18 }}>
            <LSectionLabel right="12 meses">Ritmo del grupo</LSectionLabel>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
              {MATCHES_PER_MONTH.map((n, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{
                      width: '100%', height: `${n * 12}%`,
                      background: i >= 9 ? L.accent : L.ink, opacity: i >= 9 ? 1 : 0.25, borderRadius: '4px 4px 0 0',
                    }} />
                  </div>
                  <div style={{ fontSize: 9, color: L.ink3, fontFamily: L.fontMono }}>
                    {['m','a','m','j','j','a','s','o','n','d','e','f'][i]}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: L.ink3, marginTop: 10, fontFamily: L.fontMono }}>
              pico · feb · 7 partidas
            </div>
          </div>

          {/* Catán puro */}
          <div style={{ background: L.card, border: `1px solid ${L.rule}`, borderRadius: 14, padding: 18 }}>
            <LSectionLabel>Catán puro · logros del ganador</LSectionLabel>
            {[
              { label: 'tenía Ruta Más Larga', pct: 52, hint: 'media comunidad ~50%' },
              { label: 'tenía Ejército más Grande', pct: 28, hint: 'media comunidad ~25-30%' },
              { label: 'tenía AMBOS bonus', pct: 11, hint: 'correlación alta con victoria' },
            ].map((row) => (
              <div key={row.label} style={{ padding: '10px 0', borderTop: `1px solid ${L.ruleS}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: L.ink, fontFamily: L.fontDisp }}>{row.label}</span>
                  <span style={{ fontFamily: L.fontMono, fontSize: 18, color: L.accent, fontWeight: 600 }}>{row.pct}%</span>
                </div>
                <div style={{ fontSize: 10, color: L.ink3 }}>{row.hint}</div>
              </div>
            ))}
          </div>

          {/* Expansion split */}
          <div style={{ background: L.card, border: `1px solid ${L.rule}`, borderRadius: 14, padding: 18 }}>
            <LSectionLabel>Win rate por expansión</LSectionLabel>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
              borderTop: `1px solid ${L.ruleS}`, paddingTop: 12,
            }}>
              <div>
                <div style={{ fontSize: 11, color: L.ink3, fontFamily: L.fontMono, marginBottom: 6 }}>CATÁN BASE · 28 partidas</div>
                {PLAYER_STATS.slice(0, 4).map((p) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12 }}>
                    <span style={{ fontFamily: L.fontDisp, color: L.ink }}>{p.name}</span>
                    <span style={{ fontFamily: L.fontMono, color: L.ink2 }}>{p.winrate + 8}%</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: L.ink3, fontFamily: L.fontMono, marginBottom: 6 }}>NAVEGANTES · 19 partidas</div>
                {PLAYER_STATS.slice(0, 4).map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12 }}>
                    <span style={{ fontFamily: L.fontDisp, color: L.ink }}>{p.name}</span>
                    <span style={{ fontFamily: L.fontMono, color: L.ink2 }}>{[32, 28, 24, 11][i]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LDesktopFrame>
);

// ═══ 11 · MATCHUPS (head to head) ═══════════════════════════
const L_Matchups = () => (
  <LFrame>
    <LTopBar title="Matchups" back subtitle="Alba vs Marc" />
    <div style={{ padding: '18px 22px', height: 'calc(100% - 96px)', overflow: 'hidden' }}>
      {/* head-to-head hero */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: 16,
        background: L.card, border: `1px solid ${L.rule}`, borderRadius: 14, marginBottom: 16,
      }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <LAvatar name="Alba" size={44} color={L.accent} />
          <div style={{ fontFamily: L.fontDisp, fontSize: 16, color: L.ink, marginTop: 6 }}>Alba</div>
          <div style={{ fontFamily: L.fontDisp, fontSize: 28, color: L.accent, marginTop: 2, lineHeight: 1 }}>14</div>
          <div style={{ fontSize: 10, color: L.ink3, fontFamily: L.fontMono, marginTop: 2 }}>VICTORIAS</div>
        </div>
        <div style={{ width: 1, background: L.ruleS, alignSelf: 'stretch' }} />
        <div style={{ textAlign: 'center', flex: 1 }}>
          <LAvatar name="Marc" size={44} />
          <div style={{ fontFamily: L.fontDisp, fontSize: 16, color: L.ink, marginTop: 6 }}>Marc</div>
          <div style={{ fontFamily: L.fontDisp, fontSize: 28, color: L.ink, marginTop: 2, lineHeight: 1 }}>9</div>
          <div style={{ fontSize: 10, color: L.ink3, fontFamily: L.fontMono, marginTop: 2 }}>VICTORIAS</div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: L.ink2, textAlign: 'center', marginBottom: 14 }}>
        En sus <b>23 partidas juntos</b>, Alba gana <b>61%</b>.
      </div>

      {/* split bar */}
      <div style={{ height: 10, borderRadius: 5, overflow: 'hidden', display: 'flex', marginBottom: 18 }}>
        <div style={{ flex: 14, background: L.accent }} />
        <div style={{ flex: 9, background: L.ink }} />
      </div>

      <LSectionLabel>Comparación</LSectionLabel>
      {[
        { label: 'puntos · media', a: '8.9', b: '8.1' },
        { label: 'ruta + larga', a: '8', b: '4' },
        { label: 'ejército', a: '3', b: '9' },
        { label: 'racha más larga', a: '4W', b: '3W' },
      ].map((row) => (
        <div key={row.label} style={{
          display: 'flex', alignItems: 'center', padding: '10px 0',
          borderBottom: `1px solid ${L.ruleS}`,
        }}>
          <div style={{ flex: 1, fontFamily: L.fontDisp, fontSize: 20, color: L.accent, textAlign: 'right', paddingRight: 16 }}>{row.a}</div>
          <div style={{ fontSize: 10, color: L.ink3, fontFamily: L.fontMono, letterSpacing: 0.6, textAlign: 'center', minWidth: 100, textTransform: 'uppercase' }}>
            {row.label}
          </div>
          <div style={{ flex: 1, fontFamily: L.fontDisp, fontSize: 20, color: L.ink, textAlign: 'left', paddingLeft: 16 }}>{row.b}</div>
        </div>
      ))}
    </div>
  </LFrame>
);

// ═══ 12 · EMPTY STATE ═══════════════════════════════════════
const L_EmptyState = () => (
  <LFrame>
    <LTopBar title="Catán de la facu" back right="···" />
    <div style={{ padding: '40px 28px', height: 'calc(100% - 96px - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, opacity: 0.4 }}>
        {['wood','brick','sheep','wheat','ore'].map((r) =>
          <LResource key={r} kind={r} color={L[r]} size={28} />
        )}
      </div>
      <div style={{ fontFamily: L.fontDisp, fontSize: 28, letterSpacing: -0.8, color: L.ink, lineHeight: 1.1, marginBottom: 10 }}>
        Aún no hay<br/>partidas aquí.
      </div>
      <div style={{ fontSize: 13, color: L.ink2, lineHeight: 1.5, marginBottom: 24, maxWidth: 260 }}>
        Registra la primera partida del grupo. Después podrás ver rachas, win rates y matchups.
      </div>
      <LButton variant="primary" size="md">+ Registrar primera partida</LButton>
      <div style={{ fontSize: 11, color: L.ink3, marginTop: 14, fontFamily: L.fontMono }}>
        o <span style={{ color: L.accent, textDecoration: 'underline' }}>ver cómo funciona</span>
      </div>
    </div>
    <LTabBar active="home" />
  </LFrame>
);

Object.assign(window, {
  L_Register, L_Recover, L_JoinWithCode, L_GroupMembers,
  L_NewMatchStep1, L_NewMatchStep3, L_NewMatchStep4, L_MatchList,
  L_LiveMode, L_Dashboard, L_Matchups, L_EmptyState,
});
