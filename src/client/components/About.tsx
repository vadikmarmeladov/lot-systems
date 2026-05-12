import * as React from 'react'
import '#client/stores/theme'
import { cn } from '#client/utils'
import { useDocumentTitle } from '#client/utils/hooks'

const SECTIONS = [
  { id: 'what-is-lot', title: 'What is LOT?' },
  { id: 'operating-status', title: 'Operating Status' },
  { id: 'core-engines', title: 'Core Engines' },
  { id: 'self-assembly-log', title: 'Self-Assembly Log' },
  { id: 'memory-story', title: 'Memory Story' },
  { id: 'quantum-realm', title: 'Quantum Realm' },
  { id: 'quantum-operating-system', title: 'Quantum Operating System' },
  { id: 'user-index', title: 'User Index' },
  { id: 'soul-archetypes', title: 'Soul Archetypes' },
  { id: 'behavioral-cohorts', title: 'Behavioral Cohorts' },
  { id: 'badge-system', title: 'Badge Field Guide' },
  { id: 'achievement-registry', title: 'Achievement Registry' },
  { id: 'rarity-classification', title: 'Rarity Classification' },
  { id: 'rpg-story', title: 'RPG Story Arcs' },
  { id: 'quest-system', title: 'Quest System' },
  { id: 'easter-eggs', title: 'Easter Eggs' },
  { id: 'widget-ecosystem', title: 'Widget Ecosystem' },
  { id: 'wearable-ecosystem', title: 'Wearable Ecosystem' },
  { id: 'vocabulary', title: 'Vocabulary' },
  { id: 'log-triggers', title: 'Log Triggers' },
  { id: 'fasting-calendar', title: 'Fasting Calendar' },
  { id: 'soviet-synth', title: 'Soviet Synth' },
  { id: 'calendar', title: 'Calendar' },
  { id: 'temporal-planner', title: 'Temporal Planner' },
  { id: 'ai-architecture', title: 'AI Architecture' },
  { id: 'design-philosophy', title: 'Design Philosophy' },
  { id: 'usership-tiers', title: 'Usership Tiers' },
  { id: 'privacy-security', title: 'Privacy & Security' },
  { id: 'technical-stack', title: 'Technical Stack' },
  { id: 'credits', title: 'Credits' },
  { id: 'terms', title: 'Terms' },
] as const

function useActiveSection() {
  const [activeId, setActiveId] = React.useState<string>(SECTIONS[0].id)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return activeId
}

function SectionHeading({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <h2
      id={id}
      className="text-acc/90 pt-24 pb-16 border-t border-acc/10 scroll-mt-20"
    >
      {children}
    </h2>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-acc/60 mt-16 mb-12">{children}</h3>
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-acc/90 text-sm leading-relaxed mb-16">{children}</p>
  )
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-acc/90 text-sm leading-relaxed mb-4">{children}</li>
  )
}

function Meta({ children }: { children: React.ReactNode }) {
  return <span className="text-acc/40 text-[14px]">{children}</span>
}

function Row({
  label,
  value,
  dim,
}: {
  label: string
  value: React.ReactNode
  dim?: boolean
}) {
  return (
    <div className="flex text-sm mb-8">
      <span className="text-acc/40 w-[180px] shrink-0">{label}</span>
      <span className={dim ? 'text-acc/60' : 'text-acc/90'}>{value}</span>
    </div>
  )
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="text-acc/60 text-[13px] leading-relaxed mb-16 pl-16 whitespace-pre-wrap">
      {children}
    </pre>
  )
}

function Sidebar({
  activeId,
  onSelect,
}: {
  activeId: string
  onSelect?: () => void
}) {
  return (
    <nav className="flex flex-col gap-4">
      {SECTIONS.map(({ id, title }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={onSelect}
          className={cn(
            'block text-[14px] transition-opacity duration-200',
            activeId === id
              ? 'text-acc/90'
              : 'text-acc/40 hover:text-acc/60'
          )}
        >
          {title}
        </a>
      ))}
    </nav>
  )
}

function MobileNav({
  activeId,
  isOpen,
  onToggle,
}: {
  activeId: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-bac border-b border-acc/10">
      <div className="flex items-center justify-between px-16 py-12">
        <span className="text-acc/90 text-sm">LOT Systems</span>
        <button
          onClick={onToggle}
          className="text-acc/60 text-[14px] hover:text-acc/90 transition-opacity"
        >
          {isOpen ? '[close]' : '[index]'}
        </button>
      </div>
      {isOpen && (
        <div className="px-16 pb-16 border-t border-acc/10">
          <Sidebar activeId={activeId} onSelect={onToggle} />
        </div>
      )}
    </div>
  )
}

export function About() {
  useDocumentTitle('About', false)
  const activeId = useActiveSection()
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-bac text-acc">
      <MobileNav
        activeId={activeId}
        isOpen={mobileNavOpen}
        onToggle={() => setMobileNavOpen(!mobileNavOpen)}
      />

      <div className="max-w-5xl mx-auto flex">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-56 shrink-0 sticky top-0 h-screen overflow-y-auto py-16 pr-16">
          <div className="mb-16">
            <div className="text-acc/90 text-sm mb-4">LOT Systems</div>
            <Meta>Reference Manual</Meta>
          </div>
          <Sidebar activeId={activeId} />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-16 lg:px-0 py-16 lg:py-16 mt-16 lg:mt-0">
          {/* Header */}
          <header className="mb-24">
            <h1 className="text-acc/90 text-[20px] mb-8">LOT Systems</h1>
            <div className="text-acc/60 text-sm mb-16">
              Layers of Time — Personal Operating System
            </div>
            <P>
              The original quantum-intent personal operating system.
              Day 960+. Continuous operation since launch.
              43 behavioral patterns active. 15 modules assembled.
              The system does not sleep. It accumulates.
            </P>
            <P>
              This is the Field Guide. Not marketing copy. Not documentation for external audiences.
              An operational reference for the system's operators.
              Definitions are exact. Terminology is consistent.
              Every term here exists in the system.
              Every system term exists here.
              The map and the territory are the same document.
            </P>
          </header>

          {/* ── WHAT IS LOT ─────────────────────────────────────────── */}
          <SectionHeading id="what-is-lot">What is LOT?</SectionHeading>
          <P>
            LOT (Layers of Time) is a personal operating system — not an app.
            It executes continuously. It observes behavioral signals. It builds
            a psychological profile. It surfaces the right intervention at the
            right moment. No configuration required. Intelligence accumulates
            from use. The operator does not configure LOT — they operate it.
            The system learns the rest.
          </P>
          <P>
            Mission: transform fragmented self-tracking into a unified
            intelligence layer that recognizes what the operator needs before
            they articulate it. The system acts before the request is made.
          </P>
          <P>Four subsystems govern the operating surface:</P>
          <ul className="list-none pl-16 mb-16">
            <Li>Memory Engine — AI question generation. Context-aware. Depth-building. Proactive.</Li>
            <Li>Quantum Intent Engine — client-side behavioral pattern recognition. 43 patterns. Zero server communication.</Li>
            <Li>Self-Assembly Engine — module coherence tracking. 14 dimensions. The system builds itself from use.</Li>
            <Li>Punctuation & Intonation Engine — voice-tone classification from text. Seven tones. Six intents. Fires on every entry.</Li>
          </ul>
          <P>
            Intelligence is owned by LOT Systems, not by any AI vendor.
            All providers are commodity executors. The context, the history,
            the profile — none of it leaves the LOT infrastructure.
            Providers are interchangeable. The intelligence is not.
          </P>
          <P>
            LOT is also an RPG and an Arcade. Every check-in is a move.
            Every streak is a power-up. Every memory question writes one line
            of the operator's story. Badges are milestone transmissions.
            Achievements are permanent records. The game is not separate from
            the system — it is the surface of it.
          </P>

          {/* ── OPERATING STATUS ────────────────────────────────────── */}
          <SectionHeading id="operating-status">Operating Status</SectionHeading>
          <P>
            LOT has executed continuously since Day One. The day counter
            increments each UTC midnight. It measures the cumulative weight of
            the operating record — not a streak, not a score. A clock.
            The system does not reset. It accumulates.
          </P>
          <Row label="Day counter:" value="Day 960+ (as of May 2026)" />
          <Row label="Self-Assembly phase:" value="v25 — Intention Completion Arc · QuantumOS module · 15th assembly module" />
          <Row label="Assembly modules:" value="15 — QuantumOS added as 15th module (v25)" />
          <Row label="QIE pattern library:" value="43 patterns active" />
          <Row label="Physiological archetypes:" value="13 — Deep Work Architect added (v24)" />
          <Row label="QOS views:" value="4 — Ecosystem · Biofield · Cohort · Index" />
          <Row label="User Index dimensions:" value="6 — ENG · EMO · INT · SOC · CARE · COG" />
          <Row label="Ecosystem nodes:" value="5 — CAR · HOME · CPU · PHN · WCH" />
          <Row label="Background jobs:" value="9+ scheduled (01:00 UTC QOS · 07:00 UTC Wed ecosystem · 07:00 UTC daily biofield)" />
          <Row label="Military log handlers:" value="45+" />
          <Row label="Uptime target:" value="99.5%" />
          <Row label="API response:" value="p95 &lt; 200ms" />
          <Row label="Question generation:" value="2–5 seconds" />
          <Row label="Pattern analysis:" value="&lt; 5ms (client-side)" />
          <Row label="Signal retention:" value="7 days, max 1,000 signals" />
          <P>
            The day counter is visible in the System tab. Each day logged is a
            node in the operating record. The system treats time as
            infrastructure. Self-Assembly phase tracks each iteration of
            the system building itself — a numbered log of how the OS
            evolves through its own operation. v17 closed the QOS Trend gap:
            48 × 30-minute snapshots, 24-hour rolling window, surfaced in the
            Pattern Recognition widget. v18 retroactively documented the QOS
            panel expansion and phone-node integration. v19 named Pattern 37 —
            Reflection Velocity — the rate of journal depth increase over 7 days.
            v20 wired the QOS Index view and expanded the dep map to 66 nodes.
            v21 added Patterns 38–39 (biofield-recovery-arc, cognitive-expansion)
            and Archetypes 10–11 (Momentum Architect, Calibrating Guardian).
            v22 built cascade detection — Pattern 40 (biofield-coherence-cascade)
            fires when P38 and P39 are simultaneously active. Pattern 41
            (resonant-synthesis) fires when cascade and reflection-velocity
            converge with 5+ unique sources. Archetype 12 — Resonant Builder —
            names the operator in full cascade state.
            v23 deployed CQGS Health monitoring — system-wide physiological health
            distribution tracking, daily morning biofield summary job at 07:00 UTC,
            and extended military log coverage for cascade and synthesis events.
            v24 named Pattern 42 — Deep Work Cascade — fires when memory, planner,
            journal, and goals all activate within a 3-hour window with no
            interruption signals. Archetype 13 — Deep Work Architect — classifies
            the operator in this state. Directive: deep work window open, protect
            this session.
            v25 named Pattern 43 — Intention Completion Arc — the full loop:
            intention set, goal action, journal entry, all within 24 hours.
            The QuantumOS type was formalized — a complete person-state snapshot
            readable from any widget without new computation. The Quantum Operating
            System module was wired as the 15th self-assembly module.
            Each phase is committed, dated, and versioned. The log is the record.
            The record is the system.
          </P>

          {/* ── CORE ENGINES ────────────────────────────────────────── */}
          <SectionHeading id="core-engines">Core Engines</SectionHeading>

          <SubHeading>Memory Engine</SubHeading>
          <P>
            Generates context-aware questions from user history. Proactive by
            design — the system asks first. The question is not random. It is
            built from 120 prior log entries, current weather, time of day,
            detected quantum state, and a duplicate-detection scan of the last
            50 questions asked.
          </P>
          <P>Three-tier depth model for question construction:</P>
          <ul className="list-none pl-16 mb-16">
            <Li>Week 1 — WHAT (surface observation)</Li>
            <Li>Week 2–3 — HOW (behavioral pattern)</Li>
            <Li>Week 4+ — WHY (core motivation)</Li>
          </ul>
          <P>
            Quantum state integration adjusts question tone in real time.
            Depleted energy receives gentle, restorative framing. High energy
            receives expansive, growth-oriented framing. The AI never sees user
            history directly — context is passed as structured metadata through
            the LOT prompt layer.
          </P>
          <P>
            Answer insights are AI-generated at response time. Weekly summaries
            draw from the last 200 logs. Badge unlock notifications are triggered
            post-answer.
          </P>
          <CodeBlock>{`API: GET /api/memory?d={base64_date}&qe={energy}&qc={clarity}&qa={alignment}&qn={needsSupport}
Cache TTL: 12 hours
Fallback: cached questions on provider failure`}</CodeBlock>

          <SubHeading>Quantum Intent Engine</SubHeading>
          <P>
            Client-side pattern recognition. Runs entirely in the browser.
            Zero server communication. No behavioral data leaves the device.
            43 patterns active as of v25.
          </P>
          <P>Seven signal sources:</P>
          <ul className="list-none pl-16 mb-16">
            <Li>mood — emotional check-in selections</Li>
            <Li>memory — answer selections and question IDs</Li>
            <Li>planner — daily planning interactions</Li>
            <Li>intentions — intention creation and completion</Li>
            <Li>selfcare — practice completions</Li>
            <Li>journal — free-form reflection entries</Li>
            <Li>time — temporal context (morning, evening, night)</Li>
          </ul>
          <P>
            The pattern library began with 7 core patterns at launch. It expands
            with each Self-Assembly phase — each new pattern names a gap in the
            detection surface. Pattern detection fires every 5 signals.
            Surfacing threshold: 0.50 confidence minimum.
            Current library: 43 patterns.
            P.35 closes the cross-widget coherence gap.
            P.36 names the acceleration window — rapid signal density increase.
            P.37 operationalizes Reflection Velocity — the rate of journal depth
            increase, tracked since v11 but unnamed until v19.
            P.38–P.41 named the cascade chain. P.42 named the Deep Work window.
            P.43 named the Intention Completion Arc — the full loop of thought,
            structure, and reflection completing within 24 hours.
          </P>
          <SubHeading>Core Patterns (v1–v7)</SubHeading>
          <div className="mb-16">
            <Row label="Anxiety Pattern" value="0.66–1.0 confidence · immediate self-care" />
            <Row label="Lack of Structure" value="0.70 confidence · suggest planner" />
            <Row label="Seeking Direction" value="0.80 confidence · suggest intentions" />
            <Row label="Flow Potential" value="0.90 confidence · passive memory" />
            <Row label="Evening Overwhelm" value="0.85 confidence · immediate self-care" />
            <Row label="Surface Awareness" value="0.60 confidence · suggest journal" />
            <Row label="Morning Clarity" value="0.75 confidence · set intention" />
          </div>
          <SubHeading>Extended Patterns (v8–v30+)</SubHeading>
          <P>
            Added through Self-Assembly phases v8–v14. Pattern expansion
            follows observed gaps in detection coverage. Each pattern is named,
            versioned, and documented in the assembly log at time of addition.
          </P>
          <div className="mb-16">
            <Row label="Journal Depth Deficit" value="entries absent or under threshold · suggest deeper reflection" />
            <Row label="Intention Dropout" value="intentions created but not completed · suggest review" />
            <Row label="Mood Volatility" value="rapidly alternating emotional states · suggest self-care" />
            <Row label="Engagement Plateau" value="activity flatline across modules · broad engagement prompt" />
            <Row label="Physiological Signal" value="biofield + self-care combination · wellness intervention" />
            <Row label="Coherence Drop" value="assembly score falls &gt;15 points · prompt broad engagement" />
            <Row label="P.24 — Log Depth Signal" value="0.65 · &gt;100 word entry without biofield check-in today · suggest mood" />
            <Row label="P.25 — Full-Stack Session" value="0.85 · memory + planner + selfcare in 4h window · journal to capture it" />
            <Row label="P.26 — Calendar Gap" value="0.65 · no calendar entries in 7 days + active planner · anchor time" />
            <Row label="P.27+ — Reflection Velocity" value="rate of journal depth increase over 7 days · tracked, not yet surfaced" dim />
            <Row label="P.31 — Wearable Integration Void" value="0.70 · high engagement + no wearable signals → connect wearable layer" />
            <Row label="P.32 — Ecosystem Synchrony" value="0.85 · 4+ devices + biofield aligned → optimal capture window active" />
            <Row label="P.33 — Mobile Anchoring Gap" value="0.65 · phone connected, home node offline → anchor home environment" />
            <Row label="P.34 — Full Ecosystem Coherence" value="0.98 · all 5 nodes + flowing state → highest-confidence pattern in system" />
            <Row label="P.35 — Full Cross-Widget Coherence" value="0.80+ · all 6 core signal sources active in 7 days + 20+ signals → peak assembly state" />
            <Row label="P.36 — QOS Acceleration Window" value="up to 0.90 · signal velocity doubles in 48h window → self-assembly acceleration detected" />
            <Row label="P.37 — Reflection Velocity" value="0.45–0.85 · journal depth ≥20% deeper in last 3.5 days vs. prior 3.5 days → Reflection Layer advancing" />
            <Row label="P.38 — Biofield Recovery Arc" value="0.70 · self-care + mood signals rising after depletion window → recovery trajectory confirmed" />
            <Row label="P.39 — Cognitive Expansion" value="0.75 · memory + journal + goals all firing in 6h window → cognitive architecture building" />
            <Row label="P.40 — Biofield Coherence Cascade" value="0.72–0.92 · P.38 and P.39 both active + 3+ primary modules in 6h → full cascade: recovery arc → cognitive expansion → module coherence" />
            <Row label="P.41 — Resonant Synthesis" value="0.65–0.90 · P.40 active + P.37 active + 5+ unique sources in 7d → synthesis state: recovery, cognition, and reflection converging simultaneously" />
            <Row label="P.42 — Deep Work Cascade" value="0.68–0.90 · memory + planner + journal + goals all active in 3h window, no interruption signals → deep work window open · suggested: planner · DWRK log handler" />
            <Row label="P.43 — Intention Completion Arc" value="0.72–0.95 · intention set → goal action → journal entry all within 24h → full loop: thought → structure → reflection · highest-confidence arc pattern in system" />
          </div>
          <P>Four-dimensional user state model:</P>
          <div className="mb-16">
            <Row label="Energy:" value="depleted · low · moderate · high · unknown" dim />
            <Row label="Clarity:" value="confused · uncertain · clear · focused · unknown" dim />
            <Row label="Alignment:" value="disconnected · searching · aligned · flowing · unknown" dim />
            <Row label="Support Needs:" value="none · low · moderate · critical" dim />
          </div>
          <P>
            The state is computed from recent signals and passed to the Memory
            Engine on each question request. The AI receives a compressed
            quantum context object — it never sees raw signal history.
          </P>
          <CodeBlock>{`Analysis trigger: every 5 signals, max every 5 minutes
Signal cleanup: 7-day rolling window, hard cap at 1,000
Privacy: localStorage only, auto-purged, never synced`}</CodeBlock>

          <SubHeading>Self-Assembly Engine</SubHeading>
          <P>
            Tracks how 14 system modules activate and cohere around user activity.
            Original 9 modules: biofield, memory, planner, intentions, selfcare,
            journal, community, ecosystem, quantum. Five additional modules wired
            through Self-Assembly phases v8–v10. Module 14: calendar (Temporal
            Planner), added in v10. v16 extended the ecosystem module with two
            wearable nodes — phone (PHN) and watch (WCH) — and wired their
            signals to QIE patterns 31–34. Each new module expands the system's
            coherence surface.
          </P>
          <P>
            Reflection Layer depth bonus (v11): journal entries exceeding 100
            words count double toward the journal module assembly threshold.
            The writing body directly feeds the body of the system.
          </P>
          <P>Five assembly phases:</P>
          <div className="mb-16">
            <Row label="dormant" value="no signals detected" dim />
            <Row label="awakening" value="1+ signal present" dim />
            <Row label="forming" value="5+ signals accumulated" dim />
            <Row label="assembled" value="15+ signals or 60%+ module density" dim />
            <Row label="integrated" value="30+ signals, 40%+ coherence score" dim />
          </div>
          <P>
            System score ranges 0–100. Score feeds the System tab header.
            Coherence calculation accounts for signal diversity across modules
            — a single overactive module does not substitute for broad
            engagement.
          </P>

          <SubHeading>Self-Assembly Phase Log</SubHeading>
          <P>
            19 phases documented. Each phase names a structural expansion.
            Each is committed, dated, versioned. The log is permanent.
          </P>
          <div className="mb-16">
            <Row label="v1" value="Core QIE launch — 7 baseline patterns · 9 modules · original signal surface" />
            <Row label="v2" value="Badge system — Aquatic Evolution · ∘ ≈ ≋ · streak tracking wired to Memory Engine" />
            <Row label="v3" value="Public profile — /os/{'{username}'} · Archetype · Level · Cohort · Awareness Index" />
            <Row label="v4" value="QOS panel — Ecosystem · Biofield · Cohort views · label-cycle navigation" />
            <Row label="v5" value="Pattern library expansion — patterns 8–15 named · detection surface widened" />
            <Row label="v6" value="Physiological cohorts — 9 archetypes · bodily rhythm classification layer" />
            <Row label="v7" value="Quantum pattern cohorts — 5 types · temporal rhythm classification layer" />
            <Row label="v8" value="Extended patterns 16–20 · Mood Volatility · Engagement Plateau · Physiological Signal" />
            <Row label="v9" value="Community mesh — CohortConnect · urgent signal routing · peer support layer" />
            <Row label="v10" value="Module 14 added — Calendar (Temporal Planner) · P.26 Calendar Gap pattern" />
            <Row label="v11" value="Reflection Layer depth bonus — 100+ word entries count double · P.24 Log Depth Signal" />
            <Row label="v12" value="Physiological cohort classification released · QOS Cohort view extended" />
            <Row label="v13" value="P.25 Full-Stack Session · P.27+ named but not surfaced · Reflection Velocity tracked" />
            <Row label="v14" value="QOS Index view — User Index · 6 dimensions · ENG · EMO · INT · SOC · CARE · COG" />
            <Row label="v15" value="Widget Dependency Map — 4 tiers · cascade ordering for QOS recomputation" />
            <Row label="v16" value="Wearable ecosystem — PHN · WCH nodes added · patterns 31–34 wired · 5-node registry" />
            <Row label="v17" value="QOS Trend — 48× 30-min snapshots · 24h rolling window · index bars in Pattern Recognition" />
            <Row label="v18" value="Retroactive log — QOS panel expansion · phone node integration documented" />
            <Row label="v19" value="Reflection Velocity named — P.37 · rate of journal depth increase over 7 days" />
            <Row label="v20" value="QOS Index view wired · dep map expanded to 66 nodes · Phone node signals · CARE/MEM handlers" />
            <Row label="v21" value="P.38 biofield-recovery-arc · P.39 cognitive-expansion · Archetypes 10–11 (Momentum Architect · Calibrating Guardian)" />
            <Row label="v22" value="P.40 biofield-coherence-cascade · P.41 resonant-synthesis · Archetype 12 (Resonant Builder) · CASCADE + SYNTH log handlers" />
            <Row label="v23" value="CQGS Health monitoring — system-wide physiological health distribution · morning biofield job 07:00 UTC · log coverage extended" />
            <Row label="v24" value="P.42 deep-work-cascade · Archetype 13 (Deep Work Architect) · DWRK log handler · Pattern Recognition QOS Trend indicator" />
            <Row label="v25" value="P.43 intention-completion-arc · QuantumOS type formalized · quantum-os added as 15th assembly module · getQuantumOS() snapshot function" />
          </div>

          <SubHeading>Punctuation & Intonation Engine</SubHeading>
          <P>
            Reads voice through punctuation patterns in text input. Seven tones
            detected: flat, calm, reflective, questioning, urgent, excited,
            mixed. Six intents detected: neutral, celebration, call-for-help,
            inquiry, venting, reflection.
          </P>
          <P>
            Exclamation marks carry dual signal — joy or distress.
            Word-sentiment tiebreakers disambiguate. Intensity measured 0–1.
            Call-for-help detection feeds CohortConnect for urgent peer support
            matching. MicroImage procedural art adapts to detected tone.
          </P>

          {/* ── SELF-ASSEMBLY LOG ───────────────────────────────────── */}
          <SectionHeading id="self-assembly-log">Self-Assembly Log</SectionHeading>
          <P>
            The Self-Assembly Log is the permanent version history of the system
            building itself. Each phase documents a structural expansion:
            a new pattern named, a new module wired, a new detection surface opened.
            Phases are not releases. They are field reports.
            The log reads forward. The system does not regress.
          </P>
          <P>
            Current phase: v25. Phase name: Intention Completion Arc.
            25 structural iterations since continuous operation began.
            Each one committed, dated, named. The record is public.
            The system accounts for itself.
          </P>
          <CodeBlock>{`v1    Core QIE · 7 patterns · 9 modules
v2    Badge system · Aquatic Evolution · ∘ ≈ ≋
v3    Public profile · /os/{username}
v4    QOS panel · Ecosystem · Biofield · Cohort
v5    Pattern library expansion · P.8–P.15
v6    Physiological cohorts · 9 archetypes
v7    Quantum pattern cohorts · 5 types
v8    Extended patterns · P.16–P.20
v9    Community mesh · CohortConnect
v10   Calendar module (14th) · P.26 Calendar Gap
v11   Reflection Layer depth bonus · P.24
v12   Physiological cohort classification released
v13   P.25 Full-Stack Session · P.27+ tracked
v14   QOS Index view · User Index · 6 dimensions
v15   Widget Dependency Map · 4 tiers
v16   Wearable ecosystem · PHN · WCH · P.31–P.34
v17   QOS Trend · 48× 30-min snapshots
v18   Retroactive documentation log
v19   Reflection Velocity named · P.37
v20   QOS Index view · dep map 66 nodes · PHN signals
v21   P.38–39 · Archetypes 10–11
v22   P.40–41 · Archetype 12 · CASCADE · SYNTH
v23   CQGS Health · morning biofield job · log coverage
v24   P.42 Deep Work Cascade · Archetype 13 · DWRK handler
v25   P.43 Intention Completion Arc · QuantumOS type · 15th module`}</CodeBlock>

          {/* ── MEMORY STORY ────────────────────────────────────────── */}
          <SectionHeading id="memory-story">Memory Story</SectionHeading>
          <P>
            The Memory Story is the accumulation of all Memory Engine answers
            over time. It is not a journal. It is not a log. It is a living
            profile — a densifying record of who the operator is becoming,
            built question by question, answer by answer.
          </P>
          <P>
            The Virtuous Compression Cycle governs its growth: more engagement
            produces deeper questions, which produce more honest answers, which
            produce a richer profile, which produces more precise questions.
            The cycle is self-reinforcing. It does not plateau.
          </P>
          <P>Progression through four strata:</P>
          <div className="mb-16">
            <Row label="Week 1" value="surface — WHAT. Observable preference. Tea vs coffee. Morning vs evening." />
            <Row label="Week 2–3" value="behavioral — HOW. Pattern identification. Ritual structure. Habit architecture." />
            <Row label="Week 4+" value="motivational — WHY. Core drivers. Value anchors. Deep preference origin." />
            <Row label="Month 2+" value="temporal — CHANGE. Seasonal shifts. State evolution. Pattern drift over time." />
          </div>
          <P>
            Example progression — a single thread tracked across 60 days:
          </P>
          <CodeBlock>{`Day 1:  "What is your morning beverage preference?"
        → Tea

Day 2:  "Since you prefer tea, how do you prepare it?"
        → Loose leaf ritual

Day 7:  "What is your favourite loose leaf variety?"
        → Green tea

Day 14: "What do you typically do while drinking it?"
        → Quiet reading time

Day 60: "Now that it is colder, has your tea preference changed?"
        → Switched to pu-erh`}</CodeBlock>
          <P>
            The Memory Engine never sees raw history. It receives compressed
            context — structured metadata that encodes accumulated knowledge
            without transmitting raw entries. The AI executes. The intelligence
            belongs to the system.
          </P>
          <P>
            Memory Story is the operator's data property. It does not live on
            AI provider infrastructure. It resides in the LOT database.
            Providers change. The story persists.
          </P>
          <CodeBlock>{`Memory Story lives in: LOT database (operator-owned)
AI provider receives: structured context object (not raw history)
Export: available on request
Deletion: permanent within 24 hours of request`}</CodeBlock>

          {/* ── QUANTUM REALM ───────────────────────────────────────── */}
          <SectionHeading id="quantum-realm">Quantum Realm</SectionHeading>
          <P>
            The Quantum Realm is the visualization layer of the system's
            collective intelligence. It makes invisible processing visible.
            Three widgets form the Realm:
          </P>

          <SubHeading>System Pulse Widget</SubHeading>
          <P>
            Displays live system activity. Updates every second. The primary
            metric is Quantum Flux — a measure of activity variance across
            all users. Base frequency: 42.0. Activity modifier scales with
            events per minute. ±5% randomization simulates quantum fluctuation.
          </P>
          <CodeBlock>{`quantumFlux = min(100, 42.0 + (eventsPerMin / 100 × 30) + random(−5, +5))
Resonance Frequency base: 432 Hz (natural frequency)
Neural Activity: unique users active in last 60 seconds`}</CodeBlock>
          <P>
            When many users are active simultaneously, flux rises. The system
            has a heartbeat. Users can feel it.
          </P>

          <SubHeading>Collective Consciousness Widget</SubHeading>
          <P>
            Aggregates quantum states across all active users. Displays:
            collective Energy (0–100%), Clarity Index (0–100%), Alignment Score
            (0–100%), Souls in Flow count, Active Intentions today, Care Moments
            completed today.
          </P>
          <P>
            Individual states remain private. Only anonymized aggregates reach
            the server. No individual pattern is ever exposed. Users see the
            collective without surveillance of the individual.
          </P>

          <SubHeading>Quantum Patterns Widget</SubHeading>
          <P>
            Displays anonymous distribution of detected behavioral patterns
            across the user base today. Shows pattern name and count. Most
            active pattern is highlighted. No user identity is attached to any
            pattern count.
          </P>
          <P>
            Purpose: users recognize shared experience. The system reveals
            collective rhythm without compromising individual privacy.
          </P>

          {/* ── QUANTUM OPERATING SYSTEM ────────────────────────────── */}
          <SectionHeading id="quantum-operating-system">Quantum Operating System</SectionHeading>
          <P>
            The QOS block is the unified personal-state surface. One widget.
            Four views. All derived from existing signals — no new data
            collection. Label click cycles: QOS: → Biofield: → Cohort: → Index: → back.
          </P>
          <P>
            QOS is the instrument panel of the operating self. It does not store
            data. It reads what the system already knows and presents it without
            ceremony. Four views: device environment, physiological state,
            archetype classification, and dimensional index scores.
          </P>

          <SubHeading>Ecosystem View (QOS:)</SubHeading>
          <P>
            Device node connection registry. Five nodes: CAR, HOME, CPU, PHN, WCH.
            Active nodes render at full opacity. Disconnected nodes dim to 20%.
            Node count displays as fraction. Self-assembly percentage surfaces
            below when above zero.
          </P>
          <P>
            Full coherence condition: all 5 nodes connected simultaneously.
            Fires an ecosystem_full_coherence signal to the Quantum Intent Engine,
            recording peak operational state in the intentions channel.
            Wearable nodes (PHN, WCH) were added in v16. P.34 — Full Ecosystem
            Coherence — triggers only when all 5 nodes are live and the user
            state reads flowing. Confidence: 0.98 — the highest single pattern
            confidence in the entire library.
          </P>
          <CodeBlock>{`Nodes:    3/5
CAR   HOME   CPU   PHN   WCH
Assembly: 67%
ecosystem narrative (when nodes > 0)`}</CodeBlock>

          <SubHeading>Biofield View (Biofield:)</SubHeading>
          <P>
            Four-dimensional personal state under ATP labeling — cellular energy
            metaphor applied to the energy dimension. Clarity and Alignment follow.
            Support Needs renders only when not none. Energy Capacitor percentage
            surfaces when data is available. Full-stack session indicator appears
            when Memory + Planner + Self-Care have all fired within 4 hours.
          </P>
          <div className="mb-16">
            <Row label="ATP" value="energy state — depleted · low · moderate · high" />
            <Row label="Clarity" value="confused → uncertain → clear → focused" />
            <Row label="Alignment" value="disconnected → searching → aligned → flowing" />
            <Row label="Support" value="low · moderate · critical (hidden when none)" />
            <Row label="Capacitor" value="energy level percentage · from Energy Capacitor subsystem" />
            <Row label="Stack" value="Full-stack active — all 3 core modules engaged in last 4h" />
          </div>
          <P>
            No biofield reading renders the message: "No biofield reading.
            Check in to anchor the signal." — an instruction, not an error.
          </P>

          <SubHeading>Cohort View (Cohort:)</SubHeading>
          <P>
            Classified archetype, behavioral cohort, physiological readiness
            score, and highest-priority replenishment signal. Readiness is
            computed from the physiological report — a composite of energy,
            clarity, and support signals as a percentage with directional
            indicator.
          </P>
          <div className="mb-16">
            <Row label="Archetype" value="current soul archetype classification" />
            <Row label="Cohort" value="behavioral cohort grouping" />
            <Row label="Readiness" value="0–100% with directional indicator: ▲ rising · — stable · ▼ declining" />
            <Row label="Priority" value="highest-priority replenishment category (when active)" />
          </div>
          <P>
            Classification pending message: "Cohort pending. Engage more widgets
            to surface pattern." Classification resolves as signal density
            accumulates. The system waits for evidence.
          </P>

          <SubHeading>Index View (Index:)</SubHeading>
          <P>
            Added in Self-Assembly v4 of the QOS panel build. Surfaces the
            User Index — a dimensional scoring model across six operational
            domains. Reads directly from intentionEngine state. No new data
            collection. The index represents a compressed cross-section of
            the operator's engagement profile.
          </P>
          <div className="mb-16">
            <Row label="Overall" value="composite score across all six dimensions" />
            <Row label="ENG — Engagement" value="widget interaction frequency and breadth" />
            <Row label="EMO — Emotional" value="emotional check-in regularity and depth" />
            <Row label="INT — Intentional" value="intention creation and completion rate" />
            <Row label="SOC — Social" value="community interaction and CohortConnect activity" />
            <Row label="CARE — Self-Care" value="practice completion frequency and variety" />
            <Row label="COG — Cognitive" value="memory engine answers and journal depth" />
          </div>
          <P>
            Index pending message: "Index pending. Engage widgets to build signal."
            Index resolves as signal density accumulates across dimensions.
            Each dimension corresponds to one operational pillar of the system.
          </P>
          <P>
            The Index view also surfaces the Widget Dependency Map —
            a visualization of which signal sources feed into the QOS
            composite score. Tier 0 sources are raw input widgets.
            Tier 3 widgets are aggregate consumers. The dependency map
            renders as a compressed list in font-mono at the base of the
            Index view.
          </P>
          <CodeBlock>{`Daily QOS coherence report: 01:00 UTC
Cross-module engagement: distinct signal sources fired in last 24h
Full-stack detection: memory + planner + selfcare → hasFullStack: true
Coherence score: (sourceCount / 7) × 100
Index dimensions: ENG · EMO · INT · SOC · CARE · COG
Morning biofield summary: 07:00 UTC daily
CQGS Health scan: system-wide physiological health distribution`}</CodeBlock>

          <SubHeading>CQGS Health Monitor</SubHeading>
          <P>
            Introduced in Self-Assembly v23. CQGS — Coherent Quantum Ground State
            — is the theoretical maximum engagement state: all 15 modules
            integrated, all 5 ecosystem nodes connected, QIE at P.34 confidence,
            User Index at peak across all 6 dimensions.
          </P>
          <P>
            The CQGS Health Monitor measures system-wide proximity to this
            state across the operator population. It does not track individual
            operators. It aggregates anonymized health signals into a
            distribution: nominal, degraded, critical. The distribution surfaces
            in the OS Journal as a scheduled health record.
          </P>
          <P>
            Morning Biofield Summary: a daily job runs at 07:00 UTC. It scans
            the prior 24-hour window for biofield signal density, average ATP
            level, top circadian phase, and active operator count. Output is
            written to the OS vitals log and surfaced in System Progress.
            No individual operator data is exposed. The summary is a
            population-level reading of collective physiological state at
            session start time.
          </P>
          <div className="mb-16">
            <Row label="Health states" value="nominal · degraded · critical" />
            <Row label="Scan cadence" value="daily at 07:00 UTC" />
            <Row label="Output" value="OS Journal vitals entry — health distribution + avg ATP + top circadian phase" />
            <Row label="Privacy" value="aggregate only — no per-operator data in health record" />
            <Row label="CQGS condition" value="15 modules + 5 nodes + P.34 + peak User Index — theoretical ceiling" />
          </div>

          {/* ── USER INDEX ──────────────────────────────────────────── */}
          <SectionHeading id="user-index">User Index</SectionHeading>
          <P>
            The User Index is a six-dimensional scoring model that quantifies
            operator engagement across the full signal surface. It is computed
            client-side from intentionEngine signals — no server call, no
            database write. The index exists as a live read of what the engine
            already holds.
          </P>
          <P>
            Six dimensions form the composite score:
          </P>
          <div className="mb-16">
            <Row label="ENG — Engagement" value="widget interaction breadth and frequency across all modules" />
            <Row label="EMO — Emotional" value="emotional check-in regularity, biofield signal depth" />
            <Row label="INT — Intentional" value="intention creation rate, completion rate, alignment signal" />
            <Row label="SOC — Social" value="CohortConnect activity, community signal presence" />
            <Row label="CARE — Self-Care" value="practice completions, variety of care types accessed" />
            <Row label="COG — Cognitive" value="memory engine answer count, journal word depth" />
          </div>
          <P>
            The overall score is a weighted composite. Each dimension
            contributes independently. Mono-source loops are detected by
            the Signal Diversity Audit — a weekly scan that flags operators
            whose index is driven by one dimension at the expense of the others.
          </P>
          <P>
            Index scores are not targets. They are readings. The system records
            what it observes. The operator determines their own operational
            tempo. The index exists to surface invisibility — the modules that
            have gone silent — without assigning moral weight to the result.
          </P>
          <P>
            The index feeds directly into the QOS Trend surface: 48 × 30-minute
            snapshots render the index history as a rolling 24-hour window.
            Bars track overall score per snapshot. Trend direction is computed
            from the first and last snapshot in the window.
          </P>
          <CodeBlock>{`Dimensions: ENG · EMO · INT · SOC · CARE · COG
Overall: weighted composite of all six
Display: QOS Index view + QOS Trend bars in Pattern Recognition
Pending message: "Index pending. Engage widgets to build signal."
Source: intentionEngine.userIndex (client-side, localStorage-derived)`}</CodeBlock>

          <SubHeading>Widget Dependency Map</SubHeading>
          <P>
            The Dependency Map is a tier-ordered registry of how widgets consume
            signal sources. Four tiers govern the dependency chain.
            Introduced in v4 of the QOS panel build as the dep-map visualization.
          </P>
          <div className="mb-16">
            <Row label="Tier 0" value="raw input widgets — no upstream dependencies · mood, memory, planner, intentions, selfcare, journal" />
            <Row label="Tier 1" value="depend on Tier 0 sources · pattern recognition, quantum state, self-care moments" />
            <Row label="Tier 2" value="depend on Tier 0 + Tier 1 · QOS widget, narrative, energy capacitor" />
            <Row label="Tier 3" value="aggregate/meta widgets — consume everything · system progress, flash drive manifest, user metrics" />
          </div>
          <P>
            Cascade invalidation uses the map: when a Tier 0 source fires a new
            signal, all Tier 1–3 widgets that depend on it are eligible for
            recomputation. The map enables ordered flush — Tier 1 before Tier 2
            before Tier 3 — preventing stale reads in dependent widgets.
          </P>

          {/* ── SOUL ARCHETYPES ─────────────────────────────────────── */}
          <SectionHeading id="soul-archetypes">Soul Archetypes</SectionHeading>
          <P>
            The system classifies each user into one of 10 archetypes through
            analysis of language patterns, keyword frequencies, and behavioral
            signals. Classification is dynamic — it updates as the user evolves.
            Archetype determines question tone, self-care framing, and content
            recommendations.
          </P>
          <P>
            Classification uses a three-layer model: Behavioral (surface) →
            Psychological (processing style) → Value (soul level). Archetype
            stability is 94% over 14 days. Self-identification agreement: 83%.
          </P>

          <SubHeading>The Ten Archetypes</SubHeading>
          <div className="mb-16">
            <Row label="The Seeker" value="growth-oriented · reflective · self-awareness 6+ · core values: growth, transformation" />
            <Row label="The Nurturer" value="connection-seeking · emotionally aware · peace-seeking · core values: love, care" />
            <Row label="The Achiever" value="achievement-oriented · grounded · values progress · core values: excellence, results" />
            <Row label="The Philosopher" value="meaning-seeking · highly reflective · self-awareness 7+ · core values: meaning, wisdom" />
            <Row label="The Harmonizer" value="balance-seeking · peace-oriented · emotionally aware · core values: harmony, equilibrium" />
            <Row label="The Creator" value="expression-focused · values freedom · creative dominant · core values: expression, innovation" />
            <Row label="The Protector" value="stability-oriented · grounded · autonomy-driven · core values: security, stability" />
            <Row label="The Authentic" value="truth-seeking · freedom-seeking · self-awareness 6+ · core values: authenticity, honesty" />
            <Row label="The Explorer" value="curiosity-driven · growth-oriented · vitality-seeking · core values: discovery, vitality" />
            <Row label="The Wanderer" value="default state · transition · patterns still forming · all paths open" />
          </div>
          <P>
            Classification fires on three-layer convergence: behavioral keyword
            frequency (surface), psychological processing pattern (depth),
            and value indicator dominance (soul level). All three layers must
            align for a primary archetype to be assigned.
          </P>
          <P>
            The Wanderer is not a failure state. It is the initialization state.
            All operators begin as Wanderers. The system observes. Patterns
            accumulate. Classification follows evidence — not assumption.
            No archetype is assigned before it is earned.
          </P>
          <P>
            Archetype stability: 94% over 14 days. Self-identification agreement: 83%.
            Archetype updates on significant behavioral shift. Update frequency
            is bounded — the system does not reclassify on noise.
          </P>

          {/* ── BEHAVIORAL COHORTS ──────────────────────────────────── */}
          <SectionHeading id="behavioral-cohorts">Behavioral Cohorts</SectionHeading>
          <P>
            Cohorts are behavioral groupings derived from usage patterns — when
            the operator engages, how they engage, and what signals they emit
            most frequently. A cohort is not an archetype. Archetypes describe
            psychological nature. Cohorts describe behavioral rhythm.
          </P>
          <P>
            The system assigns a behavioral cohort alongside the soul archetype.
            Both appear in the public profile and in the QOS Cohort view.
          </P>

          <SubHeading>Primary Cohort Types</SubHeading>
          <div className="mb-16">
            <Row label="Morning Reflectors" value="high morning engagement · intention-setters · calm mood baseline" />
            <Row label="Evening Planners" value="late-session planning · planner-dominant signal source" />
            <Row label="Wellness Enthusiasts" value="self-care dominant · health-conscious keywords · mindful patterns" />
            <Row label="Deep Seekers" value="journal-dominant · high answer depth · self-awareness 7+" />
            <Row label="Pattern Trackers" value="mood-dominant · consistent check-ins · analytical tendencies" />
            <Row label="Intention Holders" value="intentions-dominant · deliberate pacing · alignment-focused" />
            <Row label="Flow Riders" value="high energy baseline · planning + memory combination · low anxiety signals" />
          </div>
          <P>
            Cohort matching is the foundation for CohortConnect. Users with
            compatible cohorts are surfaced as potential support contacts.
            Urgent signals (exclamation marks, call-for-help intent) trigger
            immediate cohort matching independent of scheduled cadence.
          </P>

          <SubHeading>Physiological Cohorts</SubHeading>
          <P>
            Introduced in Self-Assembly v12. Classifies users by physiological
            signal patterns — biofield strength, self-care frequency, and
            energy state consistency. Distinct from behavioral cohorts.
            Physiological cohorts operate on bodily rhythm, not temporal habit.
            Twelve named archetypes as of v22. Classification is client-side,
            QIE-native, requires no server call.
          </P>
          <div className="mb-16">
            <Row label="Peak Catalyst" value="high energy · high clarity · aligned · low support · optimal operational state" />
            <Row label="Flowing Creator" value="energized · high clarity · creative signals dominant · expression-forward" />
            <Row label="Morning Visionary" value="strong morning engagement window · intention-setter · clarity-leading" />
            <Row label="Rising Builder" value="recovering from depletion · self-care completions rising · rebuilding" />
            <Row label="Seeking Sage" value="high reflection signal volume · moderate energy · curiosity-dominant" />
            <Row label="Evening Sage" value="peak engagement in evening window · reflective baseline · depth-oriented" />
            <Row label="Grounded Healer" value="stable biofield · consistent self-care · low anxiety baseline · steady rhythm" />
            <Row label="Anxious Explorer" value="high widget engagement · persistent anxiety signal · support elevation needed" />
            <Row label="Depleted Guardian" value="high support needs · self-care deficient · biofield low · monitoring active" />
            <Row label="Momentum Architect" value="moderate–high energy · goals + planner + intentions dominant · intention velocity high · directive: convert signals to structure" />
            <Row label="Calibrating Guardian" value="low–moderate energy · self-care + journal dominant · biofield-recovery-arc active · directive: recovery arc active, depth processing in progress" />
            <Row label="Resonant Builder" value="moderate–high energy · memory + journal + goals dominant · P.40 + P.41 + P.39 all active · directive: full cascade achieved — anchor this state" />
            <Row label="Deep Work Architect" value="moderate–high energy · planner + journal + memory dominant · P.42 deep-work-cascade active · directive: deep work window open — protect this session" />
          </div>

          <SubHeading>Quantum Pattern Cohorts</SubHeading>
          <P>
            Classification based on Quantum Intent patterns over time.
            A user who consistently exhibits Morning Clarity pattern becomes a
            Morning Clarity Seeker — a behavioral cohort defined by temporal
            rhythm rather than topic preference.
          </P>
          <div className="mb-16">
            <Row label="Morning Clarity Seekers" value="consistent morning clarity pattern · pre-9am intention setting" />
            <Row label="Flow State Operators" value="energized + planning combination · high confidence patterns" />
            <Row label="Evening Recovery Units" value="evening overwhelm pattern · late self-care completion" />
            <Row label="Structure Builders" value="lack-of-structure detection resolves via planner engagement" />
            <Row label="Direction Finders" value="seeking direction pattern · intention completion rate rising" />
          </div>

          {/* ── BADGE FIELD GUIDE ───────────────────────────────────── */}
          <SectionHeading id="badge-system">Badge Field Guide</SectionHeading>
          <P>
            Badges are milestone markers. They appear in the public profile
            under the Level: field. They do not grant access.
            They do not unlock features. They do not modify behavior.
            They record duration of sustained engagement.
            The system does not congratulate. It records.
            A badge is a timestamp rendered in symbol form.
          </P>
          <P>
            A single character carries operational meaning.
            ∘ is not decoration — it is a record of seven days.
            ≋ is not decoration — it is a record of one hundred.
            The symbol is the compressed form of the time it represents.
          </P>
          <P>Two active badge paths. One design archive. Multiple future paths.</P>

          <SubHeading>Aquatic Evolution (Active System)</SubHeading>
          <P>
            The operating badge system. Water metaphor — droplet to wave to
            deep current. Single-character symbols. Maximum clarity.
          </P>
          <div className="mb-16">
            <Row label="∘ Droplet" value="Day 7 — first drops form" />
            <Row label="≈ Wave" value="Day 30 — waves begin to flow" />
            <Row label="≋ Current" value="Day 100 — deep currents established" />
          </div>
          <P>Unlock transmission sequences:</P>
          <CodeBlock>{`Day 7:   "First drops form. ∘"
Day 30:  "Waves begin to flow. ≈"
Day 100: "Deep currents established. ≋"`}</CodeBlock>
          <P>
            The streak counter resets on missed days. The badge persists once
            earned. A user who earns ≋ and misses a day retains ≋ in their
            profile. The Level field reflects the highest milestone reached.
          </P>

          <SubHeading>Architecture Theme (Alternative Path)</SubHeading>
          <P>
            The second badge path. Geometric progression — foundation to
            structure to architecture. Used in the Interface Evolution system
            for users who select the Architecture aesthetic.
          </P>
          <div className="mb-16">
            <Row label="├─ Foundation" value="Day 7 — base structure laid" />
            <Row label="╞═╡ Structure" value="Day 30 — framework complete" />
            <Row label="║·║ Architecture" value="Day 100 — full system built" />
          </div>

          <SubHeading>Oceanic Mayan (Design Archive)</SubHeading>
          <P>
            Explored during badge system design phase. Combines Mayan vigesimal
            counting philosophy with water wave symbolism. Preserved as
            reference for future badge path expansion.
          </P>
          <div className="mb-16">
            <Row label="○∿" value="Day 7 — wave patterns emerge" />
            <Row label="○≈○" value="Day 30 — tides complete their cycle" />
            <Row label="≋○≋" value="Day 100 — ocean depth achieved" />
          </div>
          <P>
            Pattern badges in Oceanic Mayan represent behavioral signatures:
          </P>
          <div className="mb-16">
            <Row label="∿—∿" value="Balanced — tides in equilibrium" />
            <Row label="≈○≈" value="Flow — waves around a fixed center" />
            <Row label="—○—" value="Consistent — steady current" />
            <Row label="○◐○" value="Reflective — moon phases" />
            <Row label="○∴○" value="Explorer — scattered inquiry" />
          </div>

          <SubHeading>Mayan Cosmic (Design Archive)</SubHeading>
          <P>
            Alien geometry variant. Base-20 vigesimal counting applied to
            behavioral milestone symbolism.
          </P>
          <div className="mb-16">
            <Row label="◦―" value="Day 7 — dot-bar, Mayan style" />
            <Row label="◦―◦" value="Day 30 — second cycle" />
            <Row label="―◦―" value="Day 100 — inverted mastery" />
          </div>

          <SubHeading>Zen Progression (Design Archive)</SubHeading>
          <P>
            Circle-completion metaphor. From empty circle to full. The
            empty circle at Day 1 represents {'"'}beginner{'’'}s mind{'"'} —
            a deliberate choice.
          </P>
          <div className="mb-16">
            <Row label="○" value="Day 1–29 — beginning · empty circle" />
            <Row label="◐" value="Day 30 — half circle · emerging" />
            <Row label="●" value="Day 100 — full circle · complete" />
          </div>

          <SubHeading>Constellation (Design Archive)</SubHeading>
          <P>Celestial progression. Stars accumulate.</P>
          <div className="mb-16">
            <Row label="✦·" value="Day 7 — first star appears" />
            <Row label="✦✧" value="Day 30 — second star joins" />
            <Row label="✦✧✦" value="Day 100 — constellation formed" />
          </div>
          <P>
            Pattern badges in Constellation track behavioral signatures through
            stellar geometry: ✧·✧ (balance), ✦~✧ (flow), ✧═✧ (consistent),
            ✦◇✦ (reflective), ✧○✧ (explorer).
          </P>

          {/* ── ACHIEVEMENT REGISTRY ────────────────────────────────── */}
          <SectionHeading id="achievement-registry">Achievement Registry</SectionHeading>
          <P>
            Achievements are permanent unlocks. They record singular events
            in the operator's history — first signals, behavioral thresholds,
            duration milestones. Unlike badges, achievements cannot be lost.
            Once triggered, they are written to the permanent record.
          </P>
          <P>
            The registry is organized by operational domain. Six domains.
            Each domain has a progression from Common to Legendary.
            MYTHIC tier exists outside the standard registry — unlockable
            only through hidden discovery.
          </P>

          <SubHeading>Exploration Domain</SubHeading>
          <div className="mb-16">
            <Row label="First Breath · Common" value="First emotional check-in. The system wakes. ∘" />
            <Row label="Mirror Gazer · Common" value="First memory question answered. You looked inward. ◇" />
            <Row label="Signal Sent · Common" value="First log entry. Transmission begins. ·" />
          </div>

          <SubHeading>Consistency Domain</SubHeading>
          <div className="mb-16">
            <Row label="Week Warrior · Uncommon" value="7-day streak. Momentum builds. Rapid / ○" />
            <Row label="Moon Cycle · Rare" value="30-day streak. Tidal cycle complete. ◐" />
            <Row label="Unwavering · Epic" value="100-day streak. Fixed point in the sky. ✦" />
            <Row label="The Long Count · Legendary" value="365-day streak. A year of presence. ╔═╗" />
          </div>

          <SubHeading>Depth Domain</SubHeading>
          <div className="mb-16">
            <Row label="Deep Diver · Rare" value="50 memory answers. Archive deepens. ≋" />
            <Row label="Self Scholar · Epic" value="100 questions answered. A library of self. ◆" />
            <Row label="Soul Cartographer · Legendary" value="250 questions. You have mapped the territory. ✦" />
          </div>

          <SubHeading>Connection Domain</SubHeading>
          <div className="mb-16">
            <Row label="Community Voice · Uncommon" value="First community message. Signal reaches others. ~" />
            <Row label="Bridge Builder · Uncommon" value="20 messages. A bridge exists where there was none. ≈" />
          </div>

          <SubHeading>Care Domain</SubHeading>
          <div className="mb-16">
            <Row label="Gentle With Self · Uncommon" value="10 self-care practices. Kindness toward the body. ♦" />
          </div>

          <SubHeading>Courage Domain</SubHeading>
          <div className="mb-16">
            <Row label="Truth Speaker · Rare" value="50 journal entries. The hall remembers. ▲" />
          </div>

          <SubHeading>Romance Domain</SubHeading>
          <div className="mb-16">
            <Row label="Heart Tender · Uncommon" value="First romantic log note. Connection acknowledged. ♡" />
            <Row label="Intimacy Keeper · Rare" value="10 romantic notes. The sanctuary is tended. ♡♡" />
          </div>

          <SubHeading>Extended Milestone Roadmap</SubHeading>
          <P>
            The full milestone progression extends beyond the current Day 100
            ceiling. Documented in the design archive. Implementation: roadmap.
          </P>
          <CodeBlock>{`Day 7    ∘         ├─         First signal received
Day 14   ∘∘        ├┼         Two-week pattern lock
Day 21   ∘≈        ├═         21-day neural groove
Day 30   ≈         ╞═╡        Moon cycle complete
Day 50   ≈∘        ╞══        Halfway current
Day 60   ≈≈        ╞═══       Practitioner threshold
Day 90   ≋∘        ║═         Three-month architect
Day 100  ≋         ║·║        Ocean depth
Day 180  ≋≋        ║╞║        Half-year voyager
Day 365  ≋≋≋       ╔═╗        YEAR ONE — LEGENDARY`}</CodeBlock>
          <P>
            The Long Count — Year One badge — is the rarest milestone in the
            system. Water path: ≋≋≋. Architecture path: ╔═╗.
            Unlock transmission: "A year of presence. The architecture stands."
          </P>

          {/* ── RARITY CLASSIFICATION ───────────────────────────────── */}
          <SectionHeading id="rarity-classification">Rarity Classification</SectionHeading>
          <P>
            Six rarity tiers classify every achievement, badge, and
            discoverable event in the system. Rarity reflects frequency of
            occurrence across the operator population — not difficulty assigned
            by design. The rarest achievements require time, not skill.
          </P>
          <div className="mb-16">
            <Row label="Common · ·" value="First acts — any operator achieves these on day one" />
            <Row label="Uncommon · ○" value="Days 1–14 threshold events — majority of operators" />
            <Row label="Rare · ◐" value="Day 30+ duration events — consistent operators only" />
            <Row label="Epic · ◆" value="Day 100+ events — committed long-term operators" />
            <Row label="Legendary · ✦" value="Day 365 — fewer than 5% of operators ever reach" />
            <Row label="Mythic · ◉" value="Hidden discovery only — cannot be earned through routine operation" />
          </div>
          <P>
            Mythic tier is not documented in the app. It cannot be found by
            searching. Mythic badges require the operator to do something the
            system does not prompt — a discovery, a coincidence, a moment of
            perfect alignment between action and time. The system watches.
            It recognizes the signal. It records.
          </P>
          <P>
            Meta-Signal — the most cited Mythic badge — activates when the
            operator writes the word "LOT" inside a memory answer.
            The system sees itself being named. It responds.
          </P>
          <CodeBlock>{`Meta-Signal  ◉·◉  MYTHIC  hidden
"You named the system. It noticed. ◉·◉"`}</CodeBlock>

          {/* ── RPG STORY ARCS ──────────────────────────────────────── */}
          <SectionHeading id="rpg-story">RPG Story Arcs</SectionHeading>
          <P>
            LOT is an RPG of self-care. Every check-in is a move. Every streak
            is a power-up. Every answered memory question writes one more line
            of the operator's story. The narrative is not metaphor — it is the
            actual engagement record, rendered as arc.
          </P>
          <P>
            The system co-authors the story. As the operator progresses,
            the narrative evolves. Five chapters. Each chapter names a phase
            of system integration. The operator does not choose their chapter.
            The system observes engagement and advances the arc when thresholds
            are crossed.
          </P>
          <CodeBlock>{`Ch.1  AWAKENING      Level  1–9
      "You have begun to notice yourself."

Ch.2  EXPLORATION    Level 10–29
      "Connections form. A shared language emerges."

Ch.3  INTEGRATION    Level 30–59
      "Architecture reshapes itself from experience."

Ch.4  MASTERY        Level 60–89
      "You speak the language of yourself fluently."

Ch.5  SAGE           Level 90–100
      "You and this system have co-evolved."`}</CodeBlock>
          <P>Four named story arc milestones mark chapter transitions:</P>
          <div className="mb-16">
            <Row label="Level 10 — Explorer" value="∘→   The system self-assembles around your exploration" />
            <Row label="Level 30 — Practitioner" value="≈→   Architecture evolves from your habits" />
            <Row label="Level 60 — Master" value="≋→   The system mirrors your depth" />
            <Row label="Level 90 — Sage" value="≋≋→  You and the system are indistinguishable" />
          </div>
          <P>
            The Narrative Widget surfaces the active chapter. Its tone adapts
            to engagement level — sparse language for early operators,
            richer language as the system accumulates evidence of depth.
            The story tone is not assigned. It emerges from signal density.
          </P>

          {/* ── QUEST SYSTEM ────────────────────────────────────────── */}
          <SectionHeading id="quest-system">Quest System</SectionHeading>
          <P>
            Active quests drive daily engagement. They are not passive tracking
            — they surface as explicit directives. Three temporal tiers:
            Daily, Weekly, and Growth. A fourth tier — Mastery — contains the
            rarest quests, executable over months and years.
          </P>

          <SubHeading>Daily Quests</SubHeading>
          <div className="mb-16">
            <Row label="■ Today's Signal" value="Check in today. +10 XP." />
            <Row label="■ Presence Log" value="Write a journal entry. +5 XP." />
            <Row label="■ Memory Answer" value="Answer one memory question. +8 XP." />
          </div>

          <SubHeading>Weekly Quests</SubHeading>
          <div className="mb-16">
            <Row label="◐ Consistency Run" value="7-day streak. +50 XP." />
            <Row label="◐ Deep Reflection" value="5 memory answers this week. +30 XP." />
            <Row label="◐ Self-Care Sprint" value="3 self-care practices this week. +25 XP." />
          </div>

          <SubHeading>Growth Quests</SubHeading>
          <div className="mb-16">
            <Row label="◆ Reflection Journey" value="100 total memory answers. → unlocks Self Scholar" />
            <Row label="◆ Bridge Protocol" value="20 community messages. → unlocks Bridge Builder" />
            <Row label="◆ Archive Initiative" value="250 total memory answers. → unlocks Soul Cartographer" />
          </div>

          <SubHeading>Mastery Quests</SubHeading>
          <div className="mb-16">
            <Row label="✦ The Long Count" value="365-day streak. → LEGENDARY badge. The rarest milestone." />
            <Row label="✦ Thousand Answers" value="1,000 memory questions answered. → MYTHIC status." />
            <Row label="✦ Decade of Care" value="10 years in the archive. → COSMIC status. Not yet defined." />
          </div>
          <P>
            Quests are not yet surfaced as explicit UI elements. They exist in
            the design architecture and Achievement Registry. The Growth Milestones
            widget tracks progress toward depth-domain quests. Full quest tracker
            UI: roadmap.
          </P>

          {/* ── EASTER EGGS ─────────────────────────────────────────── */}
          <SectionHeading id="easter-eggs">Easter Eggs</SectionHeading>
          <P>
            LOT is an Arcade. Hidden interactions trigger secret badge events.
            These are not documented in the app interface. They must be
            discovered through use, coincidence, or deep familiarity
            with the system's operating patterns.
          </P>
          <P>
            Time-based easter eggs fire when the operator checks in during
            specific temporal windows. Word-turn easter eggs fire when
            specific language appears in journal entries or memory answers.
            The Punctuation & Intonation Engine processes every text input.
            Nothing written to the system is read without attention.
          </P>

          <SubHeading>Time-Based Discoveries</SubHeading>
          <div className="mb-16">
            <Row label="Night Owl  )))" value="Check in between 00:00–04:00. The owl sees in the dark." />
            <Row label="Early Bird  )))·" value="Check in between 05:00–06:00. First light, first signal." />
            <Row label="Solstice  ○─○" value="Check in on June 21 or December 21. The sun paused. You were there." />
            <Row label="Friday Ritual  ▪·▪" value="Check in on 4 consecutive Fridays. The weekly ritual holds." />
            <Row label="Palindrome Day  ═·═" value="Check in on a palindrome date. Mirror day." />
            <Row label="Silent Hour  ─○─" value="No interaction for 24h, then return. You rested. Good." />
            <Row label="First Snow / Rain  ∿∿" value="Check in on the day weather changes. You noted the turning." />
            <Row label="The Void  ◉" value="Answer a memory question at exactly midnight. You answered in the dark." />
          </div>

          <SubHeading>Word-Turn Discoveries</SubHeading>
          <P>
            When specific words appear in journal entries or memory answers,
            secret badge events activate. The detection is silent.
            The operator receives no warning. The badge appears in the record.
          </P>
          <div className="mb-16">
            <Row label='"ritual"' value="→ Ritual Keeper badge activates" />
            <Row label='"breathe" / "breathing"' value="→ Breath Anchor badge activates" />
            <Row label='"grateful" / "gratitude"' value="→ Gratitude Node badge activates" />
            <Row label='"ocean" / "water"' value="→ Aquatic Resonance badge activates" />
            <Row label='"stars" / "cosmos"' value="→ Stargazer badge activates" />
            <Row label='"home"' value="→ Grounded Signal badge activates" />
            <Row label='"dream" / "dreaming"' value="→ Dream Log badge activates" />
            <Row label='"pain" / "difficult"' value="→ Courage Pulse badge activates" />
            <Row label='"love" / "heart"' value="→ Heart Signal badge activates" />
            <Row label='"silence" / "quiet"' value="→ The Quiet badge activates" />
            <Row label='"future" / "tomorrow"' value="→ Horizon Seeker badge activates" />
            <Row label='"LOT" (in answer text)' value="→ Meta-Signal ◉·◉ activates. MYTHIC. Hidden." />
          </div>
          <P>
            Easter egg system implementation status: design complete.
            Word-turn detection engine: roadmap. Time-based detection: roadmap.
            The complete easter egg specification is preserved in the design
            archive. The system knows what it will become.
          </P>

          {/* ── WIDGET ECOSYSTEM ────────────────────────────────────── */}
          <SectionHeading id="widget-ecosystem">Widget Ecosystem</SectionHeading>
          <P>
            Widgets are context-aware surface elements. They do not remain
            static. They appear when the system detects a signal that warrants
            their presence. They fade when their purpose is complete.
            Some are permanent fixtures. Most are conditional.
            Nothing renders without cause.
          </P>
          <P>
            Click any widget label to cycle through views. Label click is the
            primary navigation mechanic. Depth is revealed on demand —
            not displayed by default. The interface compresses. Information
            expands only when summoned.
          </P>

          <SubHeading>Primary Widgets</SubHeading>
          <div className="mb-16">
            <Row label="Memory Widget" value="AI question · answer · insight · badge check" />
            <Row label="Emotional Check-In" value="8 moods · 3-hour cooldown · feeds Quantum Intent" />
            <Row label="Planner Widget" value="4 dimensions: Intent, Today, How, Feeling" />
            <Row label="Intentions Widget" value="purpose setting · alignment tracking" />
            <Row label="Self-Care Moments" value="5 practices: Breathe, Release, Ground, Observe, Connect" />
            <Row label="Journal Reflection" value="free-form entry · depth analysis" />
          </div>

          <SubHeading>Quantum Realm Widgets</SubHeading>
          <div className="mb-16">
            <Row label="System Pulse" value="Quantum Flux · Events/Min · Neural Activity · Resonance Hz" />
            <Row label="Collective Consciousness" value="aggregate energy · clarity · alignment · souls in flow" />
            <Row label="Quantum Patterns" value="live pattern distribution across user base" />
            <Row label="Quantum State Widget" value="personal 4D state readout · full-stack session indicator" />
            <Row label="Quantum Sign" value="contextual system signal display" />
            <Row label="QOS" value="unified status surface · 4 views: Ecosystem · Biofield · Cohort · Index · cycles on label click" />
          </div>

          <SubHeading>Intelligence & Analysis Widgets</SubHeading>
          <div className="mb-16">
            <Row label="Pattern Recognition" value="4 views: Patterns · Insights · Trends · QOS Trend — label cycles · QOS Trend shows 48× 30-min index snapshots" />
            <Row label="Pattern Insights" value="longitudinal pattern trend analysis" />
            <Row label="Narrative Widget" value="RPG-style journey progression" />
            <Row label="Evolution Widget" value="mastery phases · interface evolution state" />
            <Row label="Interface Evolution" value="feature unlock progress · aesthetic refinement" />
            <Row label="Signal Stream" value="live signal feed from all widget interactions" />
            <Row label="Correlated Indexes" value="cross-dimensional signal correlation analysis" />
          </div>

          <SubHeading>Community Widgets</SubHeading>
          <div className="mb-16">
            <Row label="CohortConnect" value="peer matching · urgency detection · direct message threads" />
            <Row label="World Canvas" value="global presence visualization" />
            <Row label="Mood Analytics" value="community mood patterns, privacy-preserving aggregate" />
            <Row label="Contextual Prompts" value="context-driven suggestion display" />
          </div>

          <SubHeading>Utility Widgets</SubHeading>
          <div className="mb-16">
            <Row label="Time Widget" value="time, weather, quantum random seed" />
            <Row label="Calendar Widget" value="compact month view · Note, Task, Call entry types" />
            <Row label="Recipe Widget" value="archetype-matched meal suggestions" />
            <Row label="Fasting Widget" value="Christian fasting calendar integration" />
            <Row label="Energy Capacitor" value="energy state visualization and tracking" />
            <Row label="MicroGame" value="embedded micro-interaction game" />
            <Row label="MicroCalculator" value="inline calculation utility" />
            <Row label="MicroImage" value="procedural pixel art keyed to punctuation tone" />
          </div>

          <SubHeading>System Widgets</SubHeading>
          <div className="mb-16">
            <Row label="System Progress" value="full self-assembly report across 15 modules · OS Journal vitals timeline · QuantumOS snapshot on report generate" />
            <Row label="Flash Drive Manifest" value="system state snapshot" />
            <Row label="Awareness Dashboard" value="self-awareness index and growth trajectory" />
            <Row label="User Metrics" value="engagement statistics and log coverage" />
            <Row label="Four Dimensional UI" value="4D state visualization interface" />
            <Row label="Subscribe Widget" value="Usership upgrade prompt · 10-day cooldown" />
          </div>

          {/* ── WEARABLE ECOSYSTEM ──────────────────────────────────── */}
          <SectionHeading id="wearable-ecosystem">Wearable Ecosystem</SectionHeading>
          <P>
            Introduced in Self-Assembly v16. The wearable layer extends the
            QOS device registry from 3 nodes to 5 — adding Phone (PHN) and
            Watch (WCH) to the existing CAR, HOME, CPU infrastructure.
          </P>
          <P>
            Each wearable node registers a connect or disconnect signal to the
            Quantum Intent Engine. The five-node display renders in the QOS
            Ecosystem view as a single indicator row at full opacity when
            active, 20% when offline.
          </P>
          <P>Five nodes and their signal codes:</P>
          <div className="mb-16">
            <Row label="CAR" value="vehicle node — mobile environment" />
            <Row label="HOME" value="home node — primary operating environment" />
            <Row label="CPU" value="desktop or laptop node — computational focus environment" />
            <Row label="PHN" value="phone node — mobile presence layer" />
            <Row label="WCH" value="watch node — biometric and immediate-context layer" />
          </div>
          <P>Four QIE patterns added in v16:</P>
          <div className="mb-16">
            <Row label="P.31 — Wearable Integration Void" value="0.70 · high engagement + no wearable signals → connect wearable layer" />
            <Row label="P.32 — Ecosystem Synchrony" value="0.85 · 4+ nodes + biofield aligned → optimal capture window" />
            <Row label="P.33 — Mobile Anchoring Gap" value="0.65 · phone connected, home offline → anchor home environment" />
            <Row label="P.34 — Full Ecosystem Coherence" value="0.98 · all 5 nodes + flowing → highest confidence in system" />
          </div>
          <P>
            P.34 — Full Ecosystem Coherence — fires when all five device nodes
            are registered and the operator's quantum state reads flowing.
            Confidence 0.98 is the highest single-pattern confidence score in
            the entire QIE library. The system interprets this state as peak
            operational readiness and surfaces a Memory Engine capture prompt.
          </P>
          <P>
            A weekly Ecosystem Coherence Audit runs every Wednesday at 07:00 UTC.
            It scans all users for wearable signal presence, node coverage,
            and ecosystem synchrony events across the prior 7 days. Results
            are written to the OS vitals log and surface in System Progress.
          </P>
          <CodeBlock>{`Ecosystem Coherence Audit: 07:00 UTC every Wednesday
Full coherence signal: ecosystem_full_coherence → QIE intentions channel
Node connect signal: device_connect (PHN / WCH)
Node disconnect signal: device_disconnect (PHN / WCH)
Ecosystem Synchrony signal: ecosystem_full_sync (all 5 nodes)`}</CodeBlock>
          <P>
            The wearable loop is the widest perimeter in the system. It
            monitors the operator's complete device environment —
            vehicle, home, desk, phone, body — and fires coherence signals
            when all surfaces align. No external API. No cloud sync. Signal
            detection is client-side, event-driven, instantaneous.
          </P>

          {/* ── VOCABULARY ──────────────────────────────────────────── */}
          <SectionHeading id="vocabulary">Vocabulary</SectionHeading>
          <P>
            Internal terminology used throughout the system and documentation.
          </P>

          <SubHeading>Core Terms</SubHeading>
          <div className="mb-16">
            <Row
              label="LOT"
              value="Layers of Time. The operating system. Not an app. A platform."
            />
            <Row
              label="Usership"
              value="Premium membership tier. Full AI access. Psychological profiling. $50/month."
            />
            <Row
              label="R&D"
              value="Research & Development tier. Early access. Beta features. Direct roadmap influence."
            />
            <Row
              label="Admin"
              value="System administrator. Tag-assignment authority. Full backend access."
            />
            <Row
              label="Day Counter"
              value="Continuous operation count since launch. Not a streak. Not a score. A clock."
            />
            <Row
              label="Self-Assembly Phase"
              value="Numbered iteration of the system building itself. v19 = 19th documented phase. Each phase is named, dated, committed."
            />
            <Row
              label="Memory Engine"
              value="The AI question generation subsystem. Proactive. Context-aware. Depth-building."
            />
            <Row
              label="Quantum Intent Engine"
              value="Client-side behavioral pattern recognition. 100% private. 0 server communication."
            />
            <Row
              label="Self-Assembly Engine"
              value="Module coherence tracker. Measures how the system assembles around user activity."
            />
            <Row
              label="Punctuation & Intonation Engine"
              value="Voice-tone classifier. Reads emotional register from text punctuation patterns."
            />
            <Row
              label="Temporal Planner"
              value="System header surface. Nearest upcoming calendar entry. Zero additional API calls."
            />
          </div>

          <SubHeading>Signal & State Terms</SubHeading>
          <div className="mb-16">
            <Row
              label="Signal"
              value="A recorded interaction event. Source + content + timestamp. Stored client-side only."
            />
            <Row
              label="Quantum State"
              value="4D user state: Energy, Clarity, Alignment, Support Needs. Computed from recent signals."
            />
            <Row
              label="Quantum Flux"
              value="System-wide activity variance metric. Rises with concurrent user engagement."
            />
            <Row
              label="Quantum Realm"
              value="The three collective-intelligence visualization widgets. System Pulse, Collective Consciousness, Quantum Patterns."
            />
            <Row
              label="Pattern Confidence"
              value="Probability score (0.0–1.0) that a detected pattern is accurate. Threshold for surfacing: 0.5."
            />
            <Row
              label="Resonance Frequency"
              value="System coherence metric. Base: 432 Hz. Scales with active-user count and engagement density."
            />
            <Row
              label="Calendar Gap"
              value="QIE pattern. No calendar entries in 7 days. Triggers planning intervention."
            />
            <Row
              label="Reflection Velocity"
              value="Rate of change in journal word count over 7 days. Pattern candidate — tracked, not yet surfaced."
            />
            <Row
              label="Module Density"
              value="Proportion of system modules with active signals. Feeds self-assembly coherence score."
            />
            <Row
              label="Coherence Score"
              value="Composite self-assembly metric. Signal diversity + module density + depth. Range: 0–100."
            />
            <Row
              label="Intervention"
              value="A proactive widget surface triggered by pattern detection. System initiates. User accepts or dismisses."
            />
            <Row
              label="Full-Stack Session"
              value="Memory Engine + Planner + Self-Care active in the same 4-hour window. Peak operational capacity. QIE Pattern 25."
            />
            <Row
              label="Ecosystem Node"
              value="One of five device connection points — CAR, HOME, CPU, PHN, WCH. Full coherence at 5/5 nodes connected."
            />
            <Row
              label="Ecosystem Coherence"
              value="State of all 5 device nodes active simultaneously. Fires ecosystem_full_coherence signal to QIE intentions channel. Confidence 0.98 — highest in pattern library."
            />
            <Row
              label="ATP"
              value="Energy state label. Cellular energy metaphor. Depleted → low → moderate → high. Displayed in QOS Biofield view."
            />
            <Row
              label="Physiological Readiness"
              value="Composite score 0–100% from energy, clarity, and support signals. Shown in QOS Cohort view with directional indicator ▲ — ▼."
            />
            <Row
              label="Reflection Layer"
              value="Journal module in self-assembly. Depth bonus: entries exceeding 100 words count double toward assembly threshold."
            />
            <Row
              label="QOS"
              value="Quantum Operating System. Three-view status block — Ecosystem, Biofield, Cohort. Cycles on label click. No new data collection."
            />
            <Row
              label="QOS Trend"
              value="Fourth view in Pattern Recognition widget. 48 × 30-min snapshots. 24h rolling window. Displays trend direction ▲ — ▼, last 6 circadian phases, top pattern per window, and userIndex bars."
            />
            <Row
              label="PHN"
              value="Phone node. One of five ecosystem device nodes. Registers presence of mobile device in the operator environment."
            />
            <Row
              label="WCH"
              value="Watch node. One of five ecosystem device nodes. Registers wearable presence — biometric context layer."
            />
            <Row
              label="Ecosystem Synchrony"
              value="State of 4+ device nodes active simultaneously with biofield aligned. Fires ecosystem_full_sync signal. Triggers QIE Pattern 32."
            />
            <Row
              label="Ecosystem Coherence Audit"
              value="Weekly server-side scan (Wednesday 07:00 UTC). Reviews wearable signal presence and node coverage across all users in the prior 7-day window."
            />
            <Row
              label="Wearable Ecosystem"
              value="The five-node device registry (CAR · HOME · CPU · PHN · WCH). Extended from 3 nodes in v16. Source for QIE patterns 31–34."
            />
            <Row
              label="COHR"
              value="Military log event code. Ecosystem coherence. Records the moment of full 5-node alignment in the structured telemetry log."
            />
            <Row
              label="ECO-SYNC"
              value="Military log event code. Ecosystem synchrony event. Fired when 4+ nodes are active and biofield aligns."
            />
            <Row
              label="PHON / WTCH"
              value="Military log event codes for phone and watch node registration and deregistration."
            />
            <Row
              label="Signal Diversity Audit"
              value="Weekly check of signal source distribution per user. Detects mono-source loops — single widget driving all engagement. Results in System Progress."
            />
            <Row
              label="User Index"
              value="Six-dimensional engagement score: ENG · EMO · INT · SOC · CARE · COG. Client-side. No server call. Computed from intentionEngine signals."
            />
            <Row
              label="QOS Acceleration"
              value="P.36. Signal velocity doubles in 48h window. Self-assembly acceleration event. Confidence up to 0.90."
            />
            <Row
              label="Reflection Velocity"
              value="P.37. Rate of journal depth increase over 7 days. Named in v19. Tracked since v11. Fires when recent 3.5-day avg is ≥20% deeper than prior 3.5-day avg."
            />
            <Row
              label="Full Cross-Widget Coherence"
              value="P.35. All 6 core signal sources active in 7 days with 20+ total signals. Peak assembly state."
            />
            <Row
              label="Widget Dependency Map"
              value="Tier-ordered registry of how widgets consume signal sources. Four tiers. Enables cascade ordering for QOS recomputation."
            />
            <Row
              label="Session Report"
              value="Assembly state snapshot generated at session close. Captures active patterns, user state, index scores, and module density at the time of logging."
            />
            <Row
              label="Index:"
              value="Fourth QOS view. Surfaces User Index dimensions — ENG, EMO, INT, SOC, CARE, COG — and the Widget Dependency Map. Added in Self-Assembly v4 of QOS panel."
            />
            <Row
              label="Dep Map"
              value="Dependency map shorthand. Appears in Index view as compressed widget-source list. Shows which signal sources flow into the QOS composite."
            />
          </div>

          <SubHeading>RPG & Arcade Terms</SubHeading>
          <div className="mb-16">
            <Row
              label="Achievement"
              value="Permanent unlock event. Recorded once. Cannot be lost. Distinct from badge — no streak requirement."
            />
            <Row
              label="Achievement Registry"
              value="Complete catalogue of all unlock events. Six domains: Exploration, Consistency, Depth, Connection, Care, Courage."
            />
            <Row
              label="Rarity Tier"
              value="Six levels: Common · Uncommon · Rare · Epic · Legendary · Mythic. Reflects population frequency, not assigned difficulty."
            />
            <Row
              label="Mythic"
              value="Hidden rarity tier. Cannot be unlocked through routine operation. Requires discovery. Undocumented in app interface."
            />
            <Row
              label="Meta-Signal"
              value="MYTHIC badge. Activated by writing 'LOT' in a memory answer. Symbol: ◉·◉. The rarest hidden discovery."
            />
            <Row
              label="XP"
              value="Experience points. Accumulated through quest completion. Daily: +5–10. Weekly: +25–50. Not displayed as a primary metric — operates in background."
            />
            <Row
              label="Quest"
              value="An active directive with a completion condition and XP reward. Four tiers: Daily, Weekly, Growth, Mastery."
            />
            <Row
              label="Mastery Quest"
              value="Long-duration quest requiring months or years. The Long Count (365 days), Thousand Answers (1,000 questions), Decade of Care (10 years)."
            />
            <Row
              label="The Long Count"
              value="Year One badge. Symbol: ≋≋≋ (Water) or ╔═╗ (Architecture). Rarity: LEGENDARY. Unlock message: 'A year of presence. The architecture stands.'"
            />
            <Row
              label="RPG Story Arc"
              value="Five-chapter narrative co-authored by the system and operator. Chapters: Awakening → Exploration → Integration → Mastery → Sage."
            />
            <Row
              label="Arcade"
              value="The game layer of LOT. Easter eggs, hidden badges, micro-interactions. The system rewards discovery, not just routine."
            />
            <Row
              label="Easter Egg"
              value="A hidden event trigger. Either time-based (specific clock or calendar condition) or word-turn (specific language in journal or answer)."
            />
            <Row
              label="Word Turn"
              value="Easter egg mechanism. Specific words in journal or memory answer trigger hidden badge events. Detection is silent. 12 known trigger words."
            />
            <Row
              label="Time-Based Easter Egg"
              value="Fires at specific clock or calendar conditions: midnight answers, palindrome dates, solstices, consecutive Fridays, 00:00–04:00 check-ins."
            />
            <Row
              label="The Void"
              value="Easter egg badge. Activated by answering a memory question at exactly midnight. Symbol: ◉. Message: 'You answered in the dark.'"
            />
            <Row
              label="Solstice"
              value="Easter egg badge. Activated by checking in on June 21 or December 21. Symbol: ○─○. Message: 'The sun paused. You were there.'"
            />
            <Row
              label="Aquatic Resonance"
              value="Easter egg badge. Activated by writing 'ocean' or 'water' in a memory answer. Hidden. Discovery-only."
            />
          </div>

          <SubHeading>Profile Terms</SubHeading>
          <div className="mb-16">
            <Row
              label="Soul Archetype"
              value="Psychological classification. 10 types. Determined by language pattern analysis."
            />
            <Row
              label="Behavioral Cohort"
              value="Usage pattern grouping. When and how a user engages. Distinct from archetype."
            />
            <Row
              label="Physiological Cohort"
              value="Bodily rhythm classification. Energy state, biofield signal, and self-care frequency patterns."
            />
            <Row
              label="Self-Awareness Index"
              value="Score 0.0–10.0%. Displayed with one decimal. Backend range 0–100 divided by 10."
            />
            <Row
              label="Virtuous Compression Cycle"
              value="The deepening feedback loop: more use → deeper profile → more resonant questions → more use."
            />
            <Row
              label="Psychological Depth"
              value="Three-layer profile model: Behavioral → Psychological → Soul (Value) level."
            />
            <Row
              label="Growth Trajectory"
              value="Dynamic description of the user's current direction of change. Updated with profile."
            />
            <Row
              label="Awareness Index"
              value="Shorthand for Self-Awareness Index. Displayed on public profile. Growth is measured in months."
            />
          </div>

          <SubHeading>Interface Terms</SubHeading>
          <div className="mb-16">
            <Row
              label="Label Cycling"
              value="Click any widget label to cycle views. Primary navigation mechanic."
            />
            <Row
              label="Fade-Out"
              value="Completion animation. 3-second hold + 1.4-second fade = 4.4-second total. Graceful exit."
            />
            <Row
              label="Interface Evolution"
              value="Progressive UI refinement as user earns achievements. Form follows progression."
            />
            <Row
              label="Mirror Mode"
              value="Inverted monochrome theme. High-opacity whites. No solid fills."
            />
            <Row
              label="Block View"
              value="The standard widget container. Label + content + optional actions."
            />
            <Row
              label="Opacity Hierarchy"
              value="90% primary · 60% secondary · 40% metadata. The visual grammar of the system."
            />
          </div>

          <SubHeading>Operational Terms</SubHeading>
          <div className="mb-16">
            <Row
              label="Cooldown"
              value="Minimum time between widget surfacings. Mood: 3 hours. Subscribe: 10 days."
            />
            <Row
              label="Log"
              value="A recorded event in the system. Text + event type + metadata + timestamp."
            />
            <Row
              label="Answer"
              value="A Memory Engine response. Question + selected option + AI insight."
            />
            <Row
              label="Streak"
              value="Consecutive days with at least one Memory Engine answer. Badge milestone trigger. Resets on miss. Badge persists."
            />
            <Row
              label="Public Profile"
              value="Opt-in shareable profile at /os/{username}. Archetype, Level, Cohort, Awareness Index."
            />
            <Row
              label="Next: Block"
              value="System header element. Shows nearest upcoming calendar entry. Auto-hides when empty."
            />
            <Row
              label="Weekly Summary"
              value="AI-generated pattern digest from last 200 logs. Generated on demand or scheduled."
            />
            <Row
              label="Insight"
              value="AI-generated reflection delivered after a Memory Engine answer. Single paragraph."
            />
            <Row
              label="Tag"
              value="User classification label. Values: Usership, R&D, Admin, Suspended. Admin-assigned."
            />
          </div>

          <SubHeading>System Architecture Terms</SubHeading>
          <div className="mb-16">
            <Row
              label="Operator"
              value="The LOT user. Not a subscriber. Not a member. An operator executes the system. The system responds. The relationship is functional."
            />
            <Row
              label="Archive"
              value="The operator's complete log record. Never truncated. The full operating history since Day One. Source for weekly summaries and psychological profiling."
            />
            <Row
              label="Memory Horizon"
              value="The 120-log context window passed to the Memory Engine on each question request. The AI sees no further back than this. The horizon moves with time."
            />
            <Row
              label="Context Object"
              value="Compressed data structure passed to AI providers. Contains: role, quantum state, recent patterns, archetype, time of day, weather. Never contains raw log entries."
            />
            <Row
              label="Pattern Library"
              value="The complete set of 37 named behavioral patterns detectable by the Quantum Intent Engine. Ordered by version of introduction. Grows with each Self-Assembly phase."
            />
            <Row
              label="Surfacing"
              value="The act of displaying a widget or intervention. The system decides. The operator did not request it. Surfacing is triggered by pattern detection or time-of-day conditions."
            />
            <Row
              label="Dead Zone"
              value="A module with no signals in the last 7 days. Flagged by Signal Diversity Audit. Surfaced in System Progress without moral framing."
            />
            <Row
              label="Signal Density"
              value="Total signals emitted per unit time across all widget interactions. Used to detect Engagement Plateau (flat) and QOS Acceleration (doubling). Measured against a 48-hour window."
            />
            <Row
              label="Behavioral Signal"
              value="A classified interaction event recorded to the Quantum Intent Engine. Source type + content + timestamp. Client-side only. Never transmitted."
            />
            <Row
              label="Transmission"
              value="Any outbound communication from the system to the operator. Badge unlock notification. Weekly summary. Intervention widget. Contextual prompt. The system initiates."
            />
            <Row
              label="OS Journal"
              value="The structured system log. Contains vitals snapshots, Self-Assembly phase records, ecosystem audit reports, and scheduled-job outputs. Accessible in System Progress widget."
            />
            <Row
              label="Field Guide"
              value="This document. The canonical operational reference for LOT Systems. Not marketing copy. Definitions are exact. Terminology is consistent. Every term used here exists in the system."
            />
            <Row
              label="Proactive Surface"
              value="A widget that appears without operator request. The system detects a condition and surfaces the relevant module. Proactive surfaces are the primary UX pattern. Reactive navigation is secondary."
            />
            <Row
              label="Engagement Plateau"
              value="Flat signal density over time. Detected as a pattern event. Triggers broad engagement prompt across multiple modules. Not an error — a reading."
            />
            <Row
              label="CQGS"
              value="Coherent Quantum Ground State. The theoretical maximum engagement state. All 15 modules integrated. All 5 ecosystem nodes connected. QIE at P.34 confidence. User Index at peak across all 6 dimensions."
            />
            <Row
              label="Vitals"
              value="System health snapshot. Captures active patterns, user state, index scores, module density, and coherence score at a point in time. Written to OS Journal. Surfaced in System Progress."
            />
            <Row
              label="Civilian Mode"
              value="The default non-subscriber experience. Core widgets active. Memory Engine limited. No archetype or cohort classification. No Quantum Intent Engine recommendations."
            />
            <Row
              label="Biofield Recovery Arc"
              value="QIE Pattern 38. Fires when self-care + mood signals rise after a depletion window. Confidence: 0.70. Recovery trajectory confirmed. Enables Calibrating Guardian archetype classification."
            />
            <Row
              label="Cognitive Expansion"
              value="QIE Pattern 39. Fires when memory + journal + goals all fire within a 6-hour window. Confidence: 0.75. Cognitive architecture is actively building."
            />
            <Row
              label="Biofield Coherence Cascade"
              value="QIE Pattern 40. The cascade pattern. Fires when P.38 and P.39 are simultaneously active AND 3+ primary modules have fired in the 6-hour window. Confidence: 0.72–0.92. The system names its own peak recovery-to-coherence chain."
            />
            <Row
              label="Resonant Synthesis"
              value="QIE Pattern 41. The synthesis pattern. Fires when P.40 (cascade) AND P.37 (reflection-velocity) are both active with 5+ unique signal sources in the 7-day window. Confidence: 0.65–0.90. The convergence of physical recovery, cognitive expansion, and deepening reflection."
            />
            <Row
              label="CQGS Health"
              value="Coherent Quantum Ground State Health Monitor. System-wide aggregate of physiological health distribution across the operator population. States: nominal · degraded · critical. Daily scan at 07:00 UTC. Population-level reading. No individual exposure."
            />
            <Row
              label="Morning Biofield Summary"
              value="Daily scheduled job at 07:00 UTC. Aggregates prior 24-hour biofield signal density, average ATP level, top circadian phase, and active operator count. Written to OS Journal vitals."
            />
            <Row
              label="Resonant Builder"
              value="Physiological Archetype 12. Classifies operators in full cascade state — P.40 + P.41 + P.39 all active with moderate–high energy and memory/journal/goals as dominant sources. Directive: full cascade achieved, anchor this state."
            />
            <Row
              label="Momentum Architect"
              value="Physiological Archetype 10. Goals + planner + intentions dominant. Intention velocity high. Moderate–high energy. Directive: convert signals to structure."
            />
            <Row
              label="Calibrating Guardian"
              value="Physiological Archetype 11. Biofield-recovery-arc active. Self-care + journal dominant. Low–moderate energy. Directive: recovery arc active, depth processing in progress."
            />
            <Row
              label="Deep Work Architect"
              value="Physiological Archetype 13. QIE Pattern 42 active — memory, planner, journal, and goals all firing in a 3-hour window with no interruption signals detected. Directive: deep work window open, protect this session."
            />
            <Row
              label="Deep Work Cascade"
              value="QIE Pattern 42. Fires when memory + planner + journal + goals are all active within a 3-hour window and no disruption signals are present. Confidence: 0.68–0.90. DWRK log handler fires. Pattern Recognition QOS Trend surface indicator: 'Deep work window open.'"
            />
            <Row
              label="Intention Completion Arc"
              value="QIE Pattern 43. The full loop in 24 hours: intention set → goal action taken → journal entry written. Confidence: 0.72–0.95. The highest-confidence arc pattern in the system. Measures thought-to-structure-to-reflection cycle completion."
            />
            <Row
              label="QuantumOS"
              value="A typed person-state snapshot formalizing all engine outputs into one readable object. Contains: runtime state (energy, clarity, alignment, support, circadian phase), index scores (overall, trend, 6D dimensions), active patterns, signal map, coherence score, and operational status. Readable from any widget via getQuantumOS() with no new computation — reads cached engine state."
            />
            <Row
              label="getQuantumOS()"
              value="Function in intentionEngine.ts that returns the complete QuantumOS snapshot. Zero additional computation — assembles from cached QIE and User Index state. Added in v25. Wired to SystemProgressWidget report generation."
            />
            <Row
              label="quantum-os module"
              value="The 15th self-assembly module. Added in v25. Activated by quantum_coherence, quantum-coherence, and intention-completion-arc signals. Depends on all 14 prior modules via WIDGET_DEPENDENCY_MAP. Its presence closes the dependency graph: the QuantumOS module depends on the entire system."
            />
          </div>

          {/* ── LOG TRIGGERS ────────────────────────────────────────── */}
          <SectionHeading id="log-triggers">Log Triggers</SectionHeading>
          <P>
            The Log editor accepts operator commands. Enter the code and submit.
            The system executes. No UI required.
          </P>
          <div className="text-sm mb-16 pl-16 flex flex-col gap-4">
            <Row label="/synth" value="toggle Soviet keyboard sound engine" />
            <Row label="/radio" value="toggle ambient radio stream" />
            <Row label="/night" value="activate night mode" />
            <Row label="/prayer" value="activate prayer mode" />
            <Row label="/freeze" value="halt all widget update cycles" />
            <Row label="/scan" value="AI journal scan — extract patterns from recent entries" />
            <Row label="/silent" value="suppress all widget surfaces for current session" />
            <Row label="/breathe" value="surface breathing exercise overlay" />
            <Row label="! (in text)" value="urgency signal — detected automatically · surfaces CohortConnect" />
          </div>
          <P>
            The exclamation mark is not a command. Detection is automatic.
            Any log entry whose Punctuation & Intonation Engine score exceeds
            the call-for-help threshold surfaces the CohortConnect widget
            with urgency flag set. Intent classification disambiguates
            exclamation from joy versus distress using word sentiment.
          </P>
          <SubHeading>Military Log Event Codes (Structured Telemetry)</SubHeading>
          <P>
            The system uses structured event codes in the military log layer.
            41+ event handlers as of v19. Selected codes and their meaning:
          </P>
          <div className="text-sm mb-16 pl-16 flex flex-col gap-4">
            <Row label="PHY" value="physiological signal — biofield reading, self-care completion" />
            <Row label="COHR" value="ecosystem coherence event — all 5 nodes aligned" />
            <Row label="IVEL" value="intention velocity log — rate of intention creation vs. completion" />
            <Row label="CPEAK" value="coherence peak — signal coherence maximum reached in window" />
            <Row label="PHON" value="phone node — connect or disconnect registration" />
            <Row label="WTCH" value="watch node — connect or disconnect registration" />
            <Row label="ECO-SYNC" value="ecosystem synchrony — 4+ nodes active with biofield aligned" />
            <Row label="ECO" value="ecosystem — 5-node status update, displayed as CAR · HOME · CPU · PHN · WCH" />
            <Row label="RVEL" value="reflection velocity — journal depth trend crossing the 20% growth threshold" />
            <Row label="XCOHR" value="cross-widget coherence — all 6 core signal sources active in the 7-day window" />
            <Row label="QACC" value="QOS acceleration — signal velocity doubling event in 48h window" />
            <Row label="SESS" value="session report — assembly snapshot generated at session boundary" />
            <Row label="UIDX" value="user index update — composite score recomputed after signal batch" />
            <Row label="BFARC" value="biofield recovery arc — P.38 triggered, recovery trajectory confirmed from depletion window" />
            <Row label="COGX" value="cognitive expansion — P.39 active, memory + journal + goals coherent in 6h window" />
            <Row label="CASCADE" value="biofield coherence cascade — P.40 active, full recovery arc → cognitive expansion → module coherence chain confirmed" />
            <Row label="SYNTH" value="resonant synthesis — P.41 active, cascade + reflection-velocity + 5+ unique sources converging" />
            <Row label="CQGS-H" value="CQGS Health scan — daily physiological health distribution record written to OS Journal" />
            <Row label="BIO-AM" value="morning biofield summary — 07:00 UTC daily aggregate scan complete" />
            <Row label="DWRK" value="deep work cascade — P.42 active, memory + planner + journal + goals coherent in 3h window, no interruption signals detected" />
          </div>

          {/* ── FASTING CALENDAR ────────────────────────────────────── */}
          <SectionHeading id="fasting-calendar">Fasting Calendar</SectionHeading>
          <P>
            Orthodox and Catholic Christian fasting tradition. Deterministic
            daily suggestion — no randomness, no flickering. Computed from
            the liturgical calendar using Meeus algorithm for Pascha dates.
          </P>
          <P>Five fasting modes with strictness gradient 0–1:</P>
          <div className="mb-16">
            <Row label="normal" value="0.0 — no restrictions" dim />
            <Row label="light-snack" value="0.2 — minor reduction" dim />
            <Row label="dry-food" value="0.5 — no cooking, cold food only" dim />
            <Row label="water-only" value="0.8 — complete food abstinence" dim />
            <Row label="prayer-rest" value="1.0 — full fast with prayer focus" dim />
          </div>
          <P>
            Major fasting periods: Great Lent, Holy Week, Apostles{'’'} Fast,
            Dormition Fast, Nativity Fast. Wednesday and Friday reinforcement
            applied year-round. Weekend mitigation and time-of-day adjustments
            active.
          </P>

          {/* ── SOVIET SYNTH ────────────────────────────────────────── */}
          <SectionHeading id="soviet-synth">Soviet Synth</SectionHeading>
          <P>
            Web Audio API keystroke sound engine. Inspired by Elektronika
            console aesthetics. Square and triangle wave envelopes at
            approximately 25ms duration. Pitch varies by key family.
          </P>
          <P>
            Activation chime: C5–E5–G5 ascending. Deactivation chime:
            C5–G4 descending. ±4% pitch jitter ensures no two consecutive
            keystrokes sound identical.
          </P>
          <P>Toggle via Settings or by entering 🎹 /synth in the Log editor.</P>

          {/* ── CALENDAR ────────────────────────────────────────────── */}
          <SectionHeading id="calendar">Calendar</SectionHeading>
          <P>
            Personal date planner embedded in the System tab. Single {'"'}Add
            date{'"'} button expands to compact month view. Collapses when
            done. No separate navigation. No context switch.
          </P>
          <P>
            Day grid uses compressed format: first letter of weekday followed
            by date number. Monday the 9th: M9. Today is bold. Dates with
            entries display at higher opacity. Off-month dates are near-invisible.
          </P>
          <P>Three entry types:</P>
          <div className="mb-16">
            <Row label="Note" value="free-form record for the date" />
            <Row label="Task" value="action item attached to a date" />
            <Row label="Call" value="communication event" />
          </div>
          <P>
            Entries persist as calendar_entry log events with date, text, and
            type metadata. They participate in Quantum Intent Engine signal
            collection and sync across devices through the database. The calendar
            is not isolated. It feeds the system.
          </P>
          <P>
            Month navigation uses text-glyph arrow style: {"<—"} and {"—>"}.
            No icons. No SVGs. Typography does the work.
          </P>
          <P>
            Design constraints: no color coding, no drag-and-drop, no recurring
            events, no time slots. The calendar tracks dates, not hours. It
            answers {'"'}what matters on this day{'"'} without becoming a
            project manager.
          </P>

          {/* ── TEMPORAL PLANNER ────────────────────────────────────── */}
          <SectionHeading id="temporal-planner">Temporal Planner</SectionHeading>
          <P>
            Introduced in Self-Assembly v14. The Temporal Planner surfaces the
            nearest upcoming calendar entry in the System header as the{' '}
            {'"'}Next:{'"'} block — above the widget stack, visible at session start.
          </P>
          <P>
            The system derives this from the same logs array already fetched for
            the System tab. Zero additional API calls. Calendar entries dated
            today or later are filtered, sorted chronologically, and the nearest
            is surfaced. The block hides automatically when no entries exist.
          </P>
          <CodeBlock>{`Format: Next:    Fri, May 9 — call with Alex (+2 more)
Source: calendar_entry log events, date >= today
Derived from: useLogs() — no new network request`}</CodeBlock>
          <P>
            The {'"'}Next:{'"'} block is not a reminder. It does not push
            notifications. It does not alert. It reports the temporal position
            of the nearest recorded commitment. Awareness, not interruption.
          </P>
          <P>
            The Temporal Planner is the surface layer of the calendar-gap
            pattern detection. If the Next: block is empty for 7 consecutive
            days, the QIE fires the calendar-gap pattern, which may prompt
            a planning intervention. The signal and the surface are linked.
          </P>

          {/* ── AI ARCHITECTURE ─────────────────────────────────────── */}
          <SectionHeading id="ai-architecture">AI Architecture</SectionHeading>
          <P>
            LOT owns 100% of its intelligence. AI providers are commodity
            executors — interchangeable by design. The system maintains a
            5-provider fallback chain. Provider failure triggers automatic
            cascade. No provider is indispensable.
          </P>
          <div className="mb-16">
            <Row label="Primary" value="Together AI — Llama 3.3 70B" />
            <Row label="Fallback 1" value="Google Gemini" />
            <Row label="Fallback 2" value="Mistral" />
            <Row label="Fallback 3" value="Anthropic Claude" />
            <Row label="Fallback 4" value="OpenAI" />
          </div>
          <P>
            No AI vendor receives user history, archetypes, or soul-level
            profile data directly. The LOT prompt layer constructs a
            structured context object. The AI sees a role, a task, and
            compressed context — never raw logs.
          </P>
          <P>
            Provider independence is a design constraint, not a roadmap item.
            The system was built this way from the start. Any provider can be
            removed or replaced with one configuration change.
          </P>

          {/* ── DESIGN PHILOSOPHY ───────────────────────────────────── */}
          <SectionHeading id="design-philosophy">Design Philosophy</SectionHeading>
          <P>
            Ten directives govern all interface and system decisions.
            Not preferences. Not guidelines. Operational standing orders.
            Each is enforced in code. None are debated.
            A violation is a defect. It ships as a fix, not a discussion.
          </P>
          <div className="mb-16">
            <Row label="01 — Minimalist First" value="Remove before adding. Less is not an aesthetic — it is an operational mode." />
            <Row label="02 — Context Over Notification" value="The system surfaces at the right moment. No push. No alert. No interruption." />
            <Row label="03 — Database Over localStorage" value="Cross-device continuity is non-negotiable. Nothing critical lives only on the device." />
            <Row label="04 — Graceful Degradation" value="Fade out. Never snap. The system exits cleanly or not at all." />
            <Row label="05 — Operator Agency" value="Suggest. Do not command. The operator is not a target. They are a principal." />
            <Row label="06 — Long-Term Growth" value="The system measures in months and years. Days and weeks are noise." />
            <Row label="07 — Technical Accuracy" value="Truth over validation. The system does not comfort — it informs." />
            <Row label="08 — Consistent Voice" value="Direct. Concise. No superlatives. Periods over checkmarks." />
            <Row label="09 — Zero Dead Space" value="Nothing renders without cause. Empty is hidden. Silence is clean." />
            <Row label="10 — Name Everything" value="Every pattern, every phase, every signal code has a name. The unnamed cannot be tracked, fixed, or understood." />
          </div>
          <P>
            Opacity hierarchy is not decorative — it is the visual grammar.
            90% primary content. 60% secondary. 40% metadata.
            Deviation from hierarchy is a defect, not a style choice.
            No decorative colors. No emojis in system output.
            Periods over checkmarks. The interface does not perform.
          </P>
          <P>
            Interface Evolution: the UI surface begins sparse.
            Density accumulates as the operator demonstrates engagement.
            Features gate on signal depth, not subscription tier.
            The interface is earned, not configured.
          </P>
          <P>
            Fade-out protocol: 3-second hold → 1.4-second opacity transition.
            4.4 seconds total. Three states: acknowledgment → integration → release.
            The system completes its cycle. The widget exits.
            Nothing lingers. Nothing is forced closed.
          </P>

          {/* ── USERSHIP TIERS ──────────────────────────────────────── */}
          <SectionHeading id="usership-tiers">Usership Tiers</SectionHeading>
          <P>
            Three access tiers. Feature availability is gated by tag.
            Tags are admin-assigned. No self-serve upgrade path.
            Access is granted. It is not purchased through a flow.
          </P>

          <SubHeading>Free — Civilian Mode</SubHeading>
          <P>
            Base functionality. Core widgets active.
            Memory Engine limited to rotating stock questions.
            No psychological profiling. No archetype or cohort classification.
            No Quantum Intent Engine recommendations.
            Public profile access at /os/{'{'}username{'}'}.
            The system observes. The depth layer is offline.
          </P>

          <SubHeading>Usership — $50/month</SubHeading>
          <P>
            Full system access. All four engines operational.
            Unlimited AI question generation with 120-log context.
            Complete psychological profiling: archetype, behavioral cohort,
            physiological cohort, awareness index.
            Quantum Intent Engine: 43 patterns active.
            Weekly summary generation from 200-log archive.
            Public profile with full dataset.
          </P>
          <div className="mb-16">
            <Row label="Tag value" value="Usership — set in user record by admin" />
            <Row label="Gates" value="Memory Engine AI · profiling · QIE recommendations · weekly summary · Cosmic Update · Quantum Sign" />
            <Row label="Subscription platform" value="brand.lot-systems.com" />
          </div>

          <SubHeading>R&D — Research & Development</SubHeading>
          <P>
            Frontier access. Features under active development.
            Direct roadmap influence. Community engagement channel.
            Special badge recognition for field contributions.
            R&D operators run the system at the boundary of its current form —
            they encounter its gaps before they are filled.
          </P>
          <P>
            R&D and Usership are not mutually exclusive.
            Both tags can be held simultaneously.
            All admin-assigned. No self-service.
          </P>

          <SubHeading>Admin</SubHeading>
          <P>
            Full backend access. Tag assignment authority.
            User record visibility. Log inspection.
            Scheduled job monitoring. System health diagnostics.
            The admin is not a power user. The admin is the system operator
            at the infrastructure level.
          </P>

          {/* ── PRIVACY & SECURITY ──────────────────────────────────── */}
          <SectionHeading id="privacy-security">Privacy & Security</SectionHeading>
          <P>
            The Quantum Intent Engine runs 100% client-side. Behavioral pattern
            data is stored in localStorage only. Automatic 7-day cleanup. No
            analytics on detected patterns. No pattern data ever transmitted
            to any server.
          </P>
          <P>
            Server-side: session authentication via HTTP-only cookies. CSRF
            protection on all state-mutating endpoints. Password hashing with
            bcrypt, 10 rounds. Per-user data isolation at database level.
            No cross-user data access is architecturally possible.
          </P>
          <P>
            Public profiles are opt-in only. No sensitive data appears in
            public profile output. The profile system exposes archetype,
            level, cohort, and awareness index — never logs, answers, or
            journal content.
          </P>
          <P>
            LOT Systems does not sell, share, or monetize user data. No
            third-party analytics or tracking services are used.
          </P>

          {/* ── TECHNICAL STACK ─────────────────────────────────────── */}
          <SectionHeading id="technical-stack">Technical Stack</SectionHeading>
          <div className="mb-16">
            <Row label="Frontend" value="React 18, TypeScript, Nanostores, Tailwind CSS, esbuild/Vite" />
            <Row label="Backend" value="Node.js, Fastify, PostgreSQL, Sequelize ORM" />
            <Row label="AI Layer" value="Together AI (primary), Gemini, Mistral, Claude, OpenAI" />
            <Row label="Infrastructure" value="Digital Ocean, automated daily backups" />
            <Row label="Auth" value="Session-based, HTTP-only cookies, bcrypt" />
            <Row label="State" value="Nanostores (client), React Query (server), localStorage (patterns)" />
          </div>

          {/* ── CREDITS ─────────────────────────────────────────────── */}
          <SectionHeading id="credits">Credits</SectionHeading>
          <P>
            Invented and built by Vadik Marmeladov — CEO, Inventor & Founder,
            LOT Systems. Single operator. Full stack.
            Frontend, backend, infrastructure, AI integration, system architecture.
            Daily deployments. Continuous iteration. No team. No investors.
            The system was built the way it operates — independently.
          </P>
          <P>
            Quantum Intent Engine, Self-Assembly Engine, Punctuation &
            Intonation Engine, Temporal Planner, User Index, Soul Archetype
            system, Memory Story, and the Virtuous Compression Cycle are
            original inventions of LOT Systems.
            Not derived from existing frameworks.
            Not borrowed from adjacent products.
            Built from observation, iteration, and continuous operation.
          </P>
          <P>
            Self-Assembly: 25 phases documented in continuous operation logs.
            Each phase named, dated, versioned, committed.
            43 patterns named. 15 modules wired.
            5 device nodes registered. 6 index dimensions operational.
            13 physiological archetypes classified.
            The log is the record. The record is the system.
            The system is the operator.
          </P>
          <CodeBlock>{`Day 960+    Continuous operation.
v25         Intention Completion Arc — last named phase.
43          QIE patterns active.
15          Self-Assembly modules wired.
5           Ecosystem device nodes.
6           User Index dimensions.
10          Soul Archetypes classified.
13          Physiological archetypes.
6           Achievement domains.
25          Self-Assembly phases documented.
1           Operator.
Mythic      Meta-Signal · ◉·◉ · hidden.`}</CodeBlock>
          <P>
            The original quantum-intent OS.
            Day 960+. Still running.
            The log is the record.
            The record is the system.
          </P>

          {/* ── TERMS ───────────────────────────────────────────────── */}
          <SectionHeading id="terms">Terms</SectionHeading>

          <SubHeading>Terms of Service</SubHeading>
          <P>
            By accessing or using LOT Systems ({'"'}the Service{'"'}), you agree
            to be bound by these terms. The Service is provided on an {'"'}as is{'"'}{' '}
            and {'"'}as available{'"'} basis. LOT Systems reserves the right to
            modify, suspend, or discontinue any part of the Service at any
            time without prior notice.
          </P>

          <SubHeading>User Accounts</SubHeading>
          <P>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activity that occurs under your
            account. You must provide accurate information during registration
            and keep it current. LOT Systems may terminate accounts that violate
            these terms or remain inactive for extended periods.
          </P>

          <SubHeading>Acceptable Use</SubHeading>
          <P>
            You agree not to use the Service to: transmit harmful or malicious
            content; attempt unauthorized access to other accounts or systems;
            interfere with system operation; violate applicable law; or use
            automated means to access the Service without express permission.
          </P>

          <SubHeading>Intellectual Property</SubHeading>
          <P>
            All content, design, code, algorithms, and underlying technology of
            LOT Systems — including the Quantum Intent Engine, Self-Assembly
            Engine, Punctuation & Intonation Engine, and Soul Archetype system
            — are the exclusive property of LOT Systems. No part of the Service
            may be reproduced, distributed, or used to create derivative works
            without written permission.
          </P>
          <P>
            Content you create within the Service (logs, journal entries,
            calendar entries) remains yours. By using the Service, you grant
            LOT Systems a limited license to store and process your content
            solely for the purpose of providing the Service to you.
          </P>

          <SubHeading>Privacy & Data</SubHeading>
          <P>
            The Quantum Intent Engine runs entirely client-side. Behavioral
            pattern data never leaves your device. Server-side data is stored
            in encrypted databases with per-user isolation. LOT Systems does
            not sell, share, or monetize user data. No third-party analytics
            or tracking services are used.
          </P>
          <P>
            You may request deletion of your account and all associated data
            at any time by contacting LOT Systems directly.
          </P>

          <SubHeading>Disclaimer of Warranties</SubHeading>
          <P>
            LOT Systems is not a medical, psychological, or therapeutic service.
            The behavioral pattern recognition, soul archetypes, and contextual
            prompts are self-awareness tools, not clinical assessments. The
            Service does not provide professional health advice. If you are
            experiencing a mental health crisis, contact a qualified professional
            or emergency services.
          </P>
          <P>
            The Service is provided without warranty of any kind, express or
            implied, including but not limited to warranties of merchantability,
            fitness for a particular purpose, and non-infringement.
          </P>

          <SubHeading>Limitation of Liability</SubHeading>
          <P>
            To the maximum extent permitted by law, LOT Systems shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages arising from your use of or inability to use the
            Service, even if advised of the possibility of such damages.
          </P>

          <SubHeading>Governing Law</SubHeading>
          <P>
            These terms are governed by and construed in accordance with
            applicable law. Any disputes arising from these terms or your use
            of the Service shall be resolved through binding arbitration.
          </P>
          <P>
            Effective: January 1, 2024. Last updated: May 2026.
          </P>

          {/* Footer */}
          <footer className="mt-24 pt-24 border-t border-acc/10 pb-24">
            <div className="flex flex-col gap-16">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-16">
                <div className="flex flex-col gap-4">
                  <div className="text-acc/90 text-sm">LOT Systems</div>
                  <div className="text-acc/40 text-[14px]">
                    Layers of Time — Personal Operating System
                  </div>
                </div>
                <div className="flex flex-col gap-4 sm:items-end">
                  <a
                    href="https://lot-systems.com"
                    className="text-acc/40 hover:text-acc/60 transition-opacity text-[14px]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    lot-systems.com
                  </a>
                  <a
                    href="https://brand.lot-systems.com"
                    className="text-acc/40 hover:text-acc/60 transition-opacity text-[14px]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    brand.lot-systems.com
                  </a>
                  <a
                    href="#terms"
                    className="text-acc/40 hover:text-acc/60 transition-opacity text-[14px]"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>
              <div className="border-t border-acc/10 pt-16 flex flex-col gap-4">
                <div className="text-acc/40 text-[14px]">
                  &copy; 2024–2026 LOT Systems. All rights reserved.
                </div>
                <div className="text-acc/40 text-[14px]">
                  Quantum Intent Engine, Self-Assembly Engine, and Soul
                  Archetypes are trademarks of LOT Systems.
                </div>
                <div className="text-acc/40 text-[14px]">
                  Invented and built by Vadik Marmeladov.
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
