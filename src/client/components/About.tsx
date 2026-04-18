import * as React from 'react'
import '#client/stores/theme'
import { cn } from '#client/utils'
import { useDocumentTitle } from '#client/utils/hooks'

const SECTIONS = [
  { id: 'what-is-lot', title: 'What is LOT?' },
  { id: 'core-engines', title: 'Core Engines' },
  { id: 'ai-architecture', title: 'AI Architecture' },
  { id: 'soul-archetypes', title: 'Soul Archetypes' },
  { id: 'widget-ecosystem', title: 'Widget Ecosystem' },
  { id: 'fasting-calendar', title: 'Christian Fasting Calendar' },
  { id: 'log-triggers', title: 'Log Triggers & Secret Codes' },
  { id: 'soviet-synth', title: 'Soviet Keyboard Synth' },
  { id: 'badge-system', title: 'Badge System' },
  { id: 'design-philosophy', title: 'Design Philosophy' },
  { id: 'privacy-security', title: 'Privacy & Security' },
  { id: 'technical-stack', title: 'Technical Stack' },
  { id: 'credits', title: 'Credits' },
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
      className="text-acc text-lg font-mono pt-12 pb-4 border-t border-acc/10 scroll-mt-20"
    >
      {children}
    </h2>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-acc/90 font-mono mt-8 mb-3">{children}</h3>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-acc/80 font-mono text-sm leading-relaxed mb-4">{children}</p>
}

function Li({ children }: { children: React.ReactNode }) {
  return <li className="text-acc/80 font-mono text-sm leading-relaxed mb-1">{children}</li>
}

function Meta({ children }: { children: React.ReactNode }) {
  return <span className="text-acc/40 font-mono text-xs">{children}</span>
}

function Sidebar({
  activeId,
  onSelect,
}: {
  activeId: string
  onSelect?: () => void
}) {
  return (
    <nav className="space-y-1">
      {SECTIONS.map(({ id, title }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={onSelect}
          className={cn(
            'block font-mono text-xs py-1 transition-opacity duration-200',
            activeId === id ? 'text-acc opacity-100' : 'text-acc/40 hover:text-acc/70'
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
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-mono text-acc text-sm">LOT Systems</span>
        <button
          onClick={onToggle}
          className="font-mono text-acc/60 text-xs hover:text-acc transition-opacity"
        >
          {isOpen ? '[close]' : '[index]'}
        </button>
      </div>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-acc/10">
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
    <div className="min-h-screen bg-bac text-acc font-mono">
      <MobileNav
        activeId={activeId}
        isOpen={mobileNavOpen}
        onToggle={() => setMobileNavOpen(!mobileNavOpen)}
      />

      <div className="max-w-5xl mx-auto flex">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-56 shrink-0 sticky top-0 h-screen overflow-y-auto py-16 pr-8">
          <div className="mb-8">
            <div className="text-acc font-mono text-sm mb-1">LOT Systems</div>
            <Meta>Reference Manual</Meta>
          </div>
          <Sidebar activeId={activeId} />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 lg:px-0 py-16 lg:py-16 mt-12 lg:mt-0">
          {/* Header */}
          <header className="mb-16">
            <h1 className="text-acc text-2xl font-mono mb-2">LOT Systems</h1>
            <div className="text-acc/60 font-mono text-sm mb-4">
              Layers of Time — Personal Operating System
            </div>
            <P>
              Self-care through proactive context-aware AI. Built different since
              Day One.
            </P>
          </header>

          {/* What is LOT? */}
          <SectionHeading id="what-is-lot">What is LOT?</SectionHeading>
          <P>
            LOT (Layers of Time) Systems is an advanced personal operating system
            that combines psychological profiling, behavioral pattern recognition,
            and AI-driven self-awareness tools. The platform operates as a 24/7
            intelligent system that learns, adapts, and provides contextual
            support.
          </P>
          <P>
            Core value: Transform fragmented self-tracking into a unified,
            intelligent system that recognizes what users need before they
            articulate it.
          </P>

          {/* Core Engines */}
          <SectionHeading id="core-engines">Core Engines</SectionHeading>

          <SubHeading>Memory Engine</SubHeading>
          <P>
            AI-generated, context-aware questions that build psychological depth
            over time. Proactive — the system asks first, like a loving partner
            would.
          </P>
          <P>
            Context triggers include weather, time, location, day of week, and
            relationship maturity. The engine performs three-tier psychological
            analysis: Behavioral (surface) to Psychological (deep) to Soul-level
            (values).
          </P>
          <P>
            Journal integration reads inner world. Progressive depth follows a
            natural arc:
          </P>
          <ul className="list-none pl-4 mb-4">
            <Li>Week 1 — WHAT (surface observations)</Li>
            <Li>Week 2-3 — HOW (behavioral patterns)</Li>
            <Li>Week 4+ — WHY (core motivations)</Li>
          </ul>

          <SubHeading>Quantum Intent Engine</SubHeading>
          <P>
            Client-side pattern recognition — 100% privacy-preserving, runs
            entirely in the browser. No data leaves the device.
          </P>
          <P>7 signal sources feed the engine:</P>
          <ul className="list-none pl-4 mb-4">
            <Li>mood, memory, planner, intentions, selfcare, journal, time</Li>
          </ul>
          <P>7 behavioral patterns detected:</P>
          <ul className="list-none pl-4 mb-4">
            <Li>Anxiety — confidence 0.66-1.0</Li>
            <Li>Lack of Structure — confidence 0.7</Li>
            <Li>Seeking Direction — confidence 0.8</Li>
            <Li>Flow Potential — confidence 0.9</Li>
            <Li>Evening Overwhelm — confidence 0.85</Li>
            <Li>Surface Awareness — confidence 0.6</Li>
            <Li>Morning Clarity — confidence 0.75</Li>
          </ul>
          <P>4-dimensional user state model:</P>
          <ul className="list-none pl-4 mb-4">
            <Li>Energy — depleted to high</Li>
            <Li>Clarity — confused to focused</Li>
            <Li>Alignment — disconnected to flowing</Li>
            <Li>Support Needs — none to critical</Li>
          </ul>
          <P>
            Signal retention: 7 days, maximum 1000 signals, analysis triggered
            every 5 signals.
          </P>

          <SubHeading>Self-Assembly Engine</SubHeading>
          <P>
            Tracks how 9 modules self-assemble around user activity: biofield,
            memory, planner, intentions, selfcare, journal, community, ecosystem,
            quantum.
          </P>
          <P>5 assembly phases:</P>
          <ul className="list-none pl-4 mb-4">
            <Li>dormant — no activity</Li>
            <Li>awakening — 1+ signal</Li>
            <Li>forming — 5+ signals</Li>
            <Li>assembled — 15+ signals or density at 60%+</Li>
            <Li>integrated — 30+ signals, coherence at 40%+</Li>
          </ul>
          <P>Overall system score ranges from 0 to 100.</P>

          <SubHeading>Punctuation & Intonation Engine</SubHeading>
          <P>
            Reads user voice through punctuation patterns in text input.
          </P>
          <P>7 detected tones:</P>
          <ul className="list-none pl-4 mb-4">
            <Li>flat, calm, reflective, questioning, urgent, excited, mixed</Li>
          </ul>
          <P>6 detected intents:</P>
          <ul className="list-none pl-4 mb-4">
            <Li>neutral, celebration, call-for-help, inquiry, venting, reflection</Li>
          </ul>
          <P>
            Exclamation marks can indicate joy or a call for help — the engine
            disambiguates using word-sentiment tiebreakers. Intensity measured on
            a 0 to 1 scale. Call-for-help detection feeds into CohortConnect for
            urgent support matching.
          </P>

          {/* AI Architecture */}
          <SectionHeading id="ai-architecture">AI Architecture</SectionHeading>
          <P>
            Vendor-independent: LOT owns 100% of intelligence. AI providers are
            commodity executors. The system maintains an automatic fallback chain
            across 5 engines:
          </P>
          <ul className="list-none pl-4 mb-4">
            <Li>Together AI — Llama 3.3 70B (primary)</Li>
            <Li>Google Gemini</Li>
            <Li>Mistral</Li>
            <Li>Anthropic Claude</Li>
            <Li>OpenAI</Li>
          </ul>
          <P>
            If any vendor raises prices, changes API, or goes down — seamless
            switch. The AI vendor never sees user history, archetypes, or
            soul-level logic.
          </P>

          {/* Soul Archetypes */}
          <SectionHeading id="soul-archetypes">Soul Archetypes</SectionHeading>
          <P>
            10 archetypes define interaction personality. Each has a distinct
            question style and behavioral signature:
          </P>
          <ul className="list-none pl-4 mb-4">
            <Li>The Seeker</Li>
            <Li>The Nurturer</Li>
            <Li>The Philosopher</Li>
            <Li>The Achiever</Li>
            <Li>The Harmonizer</Li>
            <Li>The Creator</Li>
            <Li>The Protector</Li>
            <Li>The Authentic</Li>
            <Li>The Explorer</Li>
            <Li>The Wanderer</Li>
          </ul>

          {/* Widget Ecosystem */}
          <SectionHeading id="widget-ecosystem">Widget Ecosystem</SectionHeading>
          <P>
            Major widgets in the System tab, listed from top to bottom:
          </P>
          <ul className="list-none pl-4 mb-4">
            <Li>Recipe/Fasting Widget — mealtime suggestions with Christian fasting awareness</Li>
            <Li>Community Convergence Pulse</Li>
            <Li>Time & Weather — with quantum randomness</Li>
            <Li>Astrology/Psychology/Journey/Quantum — cycling block</Li>
            <Li>Contextual Prompts</Li>
            <Li>Planner — 4 dimensions: Intent, Today, How, Feeling</Li>
            <Li>Memory Widget</Li>
            <Li>Self-Care Moments — 5 practices: Breathe, Release, Ground, Observe, Connect</Li>
            <Li>Intentions</Li>
            <Li>Emotional Check-In — 8 moods, time-of-day aware</Li>
            <Li>Interventions</Li>
            <Li>Energy Capacitor</Li>
            <Li>Narrative — RPG-style journey</Li>
            <Li>Evolution — mastery phases</Li>
            <Li>Cohort Connect — community matching</Li>
            <Li>MicroGame</Li>
            <Li>MicroCalculator</Li>
            <Li>MicroImage — procedural pixel art tied to punctuation tone</Li>
          </ul>

          {/* Christian Fasting Calendar */}
          <SectionHeading id="fasting-calendar">
            Christian Fasting Calendar
          </SectionHeading>
          <P>
            Orthodox and Catholic traditions. Gradual strictness gradient from 0
            to 1.
          </P>
          <P>5 fasting modes:</P>
          <ul className="list-none pl-4 mb-4">
            <Li>normal — no restrictions</Li>
            <Li>light-snack — minor reduction</Li>
            <Li>dry-food — no cooking, cold food only</Li>
            <Li>water-only — complete food abstinence</Li>
            <Li>prayer-rest — full fast with prayer focus</Li>
          </ul>
          <P>
            Computed from liturgical calendar using Pascha dates via Meeus
            algorithm. Fasting periods: Great Lent, Holy Week, Apostles' Fast,
            Dormition Fast, Nativity Fast.
          </P>
          <P>
            Weekend mitigation, time-of-day adjustments, Wednesday/Friday
            reinforcement. Deterministic daily suggestions — no flickering.
          </P>

          {/* Log Triggers & Secret Codes */}
          <SectionHeading id="log-triggers">
            Log Triggers & Secret Codes
          </SectionHeading>
          <P>
            The Log editor supports secret emojis and slash commands that
            activate system modes:
          </P>
          <div className="font-mono text-sm mb-4 pl-4 space-y-1">
            <div className="text-acc/80">
              <span className="text-acc/40 inline-block w-28">🎹 /synth</span>
              toggle Soviet keyboard sound
            </div>
            <div className="text-acc/80">
              <span className="text-acc/40 inline-block w-28">🎧 /radio</span>
              toggle radio
            </div>
            <div className="text-acc/80">
              <span className="text-acc/40 inline-block w-28">🌙 /night</span>
              night mode
            </div>
            <div className="text-acc/80">
              <span className="text-acc/40 inline-block w-28">🕯️ /prayer</span>
              prayer mode
            </div>
            <div className="text-acc/80">
              <span className="text-acc/40 inline-block w-28">🧊 /freeze</span>
              freeze widgets
            </div>
            <div className="text-acc/80">
              <span className="text-acc/40 inline-block w-28">❗</span>
              urgent cohort support
            </div>
            <div className="text-acc/80">
              <span className="text-acc/40 inline-block w-28">/scan</span>
              AI journal scan
            </div>
            <div className="text-acc/80">
              <span className="text-acc/40 inline-block w-28">/silent</span>
              suppress widgets
            </div>
            <div className="text-acc/80">
              <span className="text-acc/40 inline-block w-28">/breathe</span>
              breathing exercise
            </div>
          </div>

          {/* Soviet Keyboard Synth */}
          <SectionHeading id="soviet-synth">
            Soviet Keyboard Synth
          </SectionHeading>
          <P>
            Web Audio API keystroke click synth inspired by Elektronika consoles.
            Square and triangle wave envelopes at approximately 25ms duration,
            with pitch varying by key family.
          </P>
          <P>
            Activation chime: C5-E5-G5 ascent. Deactivation chime: C5-G4
            descent. Plus/minus 4% pitch jitter ensures consecutive presses never
            sound identical.
          </P>
          <P>Toggle via Settings or the synth emoji in the Log editor.</P>

          {/* Badge System */}
          <SectionHeading id="badge-system">
            Badge System (Aquatic Evolution)
          </SectionHeading>
          <P>
            Water metaphor for growth. Badges are earned through sustained
            engagement:
          </P>
          <ul className="list-none pl-4 mb-4">
            <Li>&#8728; Droplet — 7-day streak</Li>
            <Li>&#8776; Wave — 30-day streak</Li>
            <Li>&#8779; Current — 100-day streak</Li>
          </ul>
          <P>Unlock messages:</P>
          <ul className="list-none pl-4 mb-4">
            <Li>"First drops form. &#8728;"</Li>
            <Li>"Waves begin to flow. &#8776;"</Li>
            <Li>"Deep currents established. &#8779;"</Li>
          </ul>

          {/* Design Philosophy */}
          <SectionHeading id="design-philosophy">
            Design Philosophy
          </SectionHeading>
          <P>
            No decorative colors, no emojis, no visual noise. The interface
            communicates through opacity hierarchy: 90% for primary content, 60%
            for secondary, 40% for metadata.
          </P>
          <P>
            Clickable label cycling reveals depth without cluttering the surface.
            Fade-out animations use a 3-second visible window followed by a
            1.4-second fade. Database-first state ensures consistency.
            Zero-configuration intelligence means the system works without setup.
          </P>
          <P>
            Density-based UI evolution: the interface starts breathable and
            compresses as the user masters the system.
          </P>

          {/* Privacy & Security */}
          <SectionHeading id="privacy-security">
            Privacy & Security
          </SectionHeading>
          <P>
            Quantum Intent Engine runs 100% client-side using localStorage only,
            with automatic 7-day cleanup. No analytics on detected behavioral
            patterns.
          </P>
          <P>
            Session-based authentication with HTTP-only cookies. CSRF protection
            on all state-mutating endpoints. User data isolation at the database
            level. Public profile system is opt-in only.
          </P>

          {/* Technical Stack */}
          <SectionHeading id="technical-stack">Technical Stack</SectionHeading>
          <P>Frontend:</P>
          <ul className="list-none pl-4 mb-4">
            <Li>React 18, TypeScript, Nanostores, Tailwind CSS, esbuild</Li>
          </ul>
          <P>Backend:</P>
          <ul className="list-none pl-4 mb-4">
            <Li>Node.js, Fastify, PostgreSQL, Sequelize</Li>
          </ul>
          <P>AI:</P>
          <ul className="list-none pl-4 mb-4">
            <Li>Together AI, Gemini, Mistral, Claude, OpenAI</Li>
          </ul>
          <P>Infrastructure:</P>
          <ul className="list-none pl-4 mb-4">
            <Li>Digital Ocean, automated backups</Li>
          </ul>

          {/* Credits */}
          <SectionHeading id="credits">Credits</SectionHeading>
          <P>
            Invented and built by Vadik Marmeladov, CEO & Founder, LOT Systems.
          </P>
          <P>
            The original quantum-intent operating system. Built different since
            Day One.
          </P>

          {/* Footer */}
          <footer className="mt-24 pt-8 border-t border-acc/10 pb-16">
            <div className="text-acc/40 font-mono text-xs space-y-2">
              <div>LOT Systems &copy; 2024-2026. Quantum Intent Engine is a trademark of LOT Systems.</div>
              <div>
                <a
                  href="https://lot-systems.com"
                  className="text-acc/40 hover:text-acc/70 transition-opacity underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  lot-systems.com
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
