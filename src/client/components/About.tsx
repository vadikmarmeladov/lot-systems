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
  { id: 'calendar', title: 'Calendar' },
  { id: 'badge-system', title: 'Badge System' },
  { id: 'design-philosophy', title: 'Design Philosophy' },
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
  return (
    <h3 className="text-acc/60 mt-16 mb-12">{children}</h3>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-acc/90 text-sm leading-relaxed mb-16">{children}</p>
}

function Li({ children }: { children: React.ReactNode }) {
  return <li className="text-acc/90 text-sm leading-relaxed mb-4">{children}</li>
}

function Meta({ children }: { children: React.ReactNode }) {
  return <span className="text-acc/40 text-[14px]">{children}</span>
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
            activeId === id ? 'text-acc/90' : 'text-acc/40 hover:text-acc/60'
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
          <ul className="list-none pl-16 mb-16">
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
          <ul className="list-none pl-16 mb-16">
            <Li>mood, memory, planner, intentions, selfcare, journal, time</Li>
          </ul>
          <P>7 behavioral patterns detected:</P>
          <ul className="list-none pl-16 mb-16">
            <Li>Anxiety — confidence 0.66-1.0</Li>
            <Li>Lack of Structure — confidence 0.7</Li>
            <Li>Seeking Direction — confidence 0.8</Li>
            <Li>Flow Potential — confidence 0.9</Li>
            <Li>Evening Overwhelm — confidence 0.85</Li>
            <Li>Surface Awareness — confidence 0.6</Li>
            <Li>Morning Clarity — confidence 0.75</Li>
          </ul>
          <P>4-dimensional user state model:</P>
          <ul className="list-none pl-16 mb-16">
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
          <ul className="list-none pl-16 mb-16">
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
          <ul className="list-none pl-16 mb-16">
            <Li>flat, calm, reflective, questioning, urgent, excited, mixed</Li>
          </ul>
          <P>6 detected intents:</P>
          <ul className="list-none pl-16 mb-16">
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
          <ul className="list-none pl-16 mb-16">
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
          <ul className="list-none pl-16 mb-16">
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
          <ul className="list-none pl-16 mb-16">
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
            <Li>Calendar — compact month view with date entries for notes, tasks, and calls</Li>
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
          <ul className="list-none pl-16 mb-16">
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
          <div className="text-sm mb-16 pl-16 flex flex-col gap-4">
            <div className="text-acc/90">
              <span className="text-acc/40 inline-block w-[150px]">🎹 /synth</span>
              toggle Soviet keyboard sound
            </div>
            <div className="text-acc/90">
              <span className="text-acc/40 inline-block w-[150px]">🎧 /radio</span>
              toggle radio
            </div>
            <div className="text-acc/90">
              <span className="text-acc/40 inline-block w-[150px]">🌙 /night</span>
              night mode
            </div>
            <div className="text-acc/90">
              <span className="text-acc/40 inline-block w-[150px]">🕯️ /prayer</span>
              prayer mode
            </div>
            <div className="text-acc/90">
              <span className="text-acc/40 inline-block w-[150px]">🧊 /freeze</span>
              freeze widgets
            </div>
            <div className="text-acc/90">
              <span className="text-acc/40 inline-block w-[150px]">❗</span>
              urgent cohort support
            </div>
            <div className="text-acc/90">
              <span className="text-acc/40 inline-block w-[150px]">/scan</span>
              AI journal scan
            </div>
            <div className="text-acc/90">
              <span className="text-acc/40 inline-block w-[150px]">/silent</span>
              suppress widgets
            </div>
            <div className="text-acc/90">
              <span className="text-acc/40 inline-block w-[150px]">/breathe</span>
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

          {/* Calendar */}
          <SectionHeading id="calendar">Calendar</SectionHeading>
          <P>
            The Calendar widget is a personal date planner built into the System
            tab. It follows the LOT principle of invisible complexity — a single
            "Add date" button expands into a compact month view, and collapses
            back when the user is done. No separate app, no navigation, no
            context switch.
          </P>

          <SubHeading>Compact Day Grid</SubHeading>
          <P>
            Days render in a compressed format: the first letter of the weekday
            followed by the date number. Monday the 9th becomes M9, Tuesday the
            10th becomes T10, and so on. Each row is one week. Today is bold.
            Dates with entries show at higher opacity. Months outside the current
            view are dimmed to near-invisible.
          </P>
          <P>
            This format was chosen to match the LOT information density
            philosophy — maximum data in minimum space, with visual hierarchy
            doing the work that labels and chrome do in conventional calendars.
          </P>

          <SubHeading>Month Navigation</SubHeading>
          <P>
            Arrow controls use the LOT text-glyph style: {"<—"} and {"—>"}
            flanking the month and year. No icons, no SVGs. The interface
            communicates through typography alone.
          </P>

          <SubHeading>Entry Types</SubHeading>
          <P>
            Three entry types — Note, Task, Call — cover the essential
            categories without overcomplicating. Clicking a date reveals the type
            selector on the right side of the grid, maintaining the two-column
            date-and-content layout visible in the mockup.
          </P>
          <P>
            Entries are persisted through the LOT log system as calendar_entry
            events with metadata containing date, text, and entry type. This
            means calendar data participates in the same infrastructure as every
            other widget — it feeds into the Quantum Intent Engine, appears in
            log context, and syncs across devices through the database.
          </P>

          <SubHeading>Upcoming Dates</SubHeading>
          <P>
            Below the calendar grid, upcoming entries are listed as a simple
            two-column layout: full date on the left (Sunday, April 26, 2026),
            entry text on the right (Call mom). This view is always visible,
            even when the month picker is collapsed, so the user sees what is
            ahead without opening anything.
          </P>

          <SubHeading>Design Decisions</SubHeading>
          <ul className="list-none pl-16 mb-16">
            <Li>No color coding — entries are distinguished by type text, not hue</Li>
            <Li>No drag-and-drop — dates are set, not shuffled</Li>
            <Li>No recurring events — each entry is intentional, not automatic</Li>
            <Li>No time slots — the calendar tracks dates, not hours</Li>
            <Li>Keyboard entry — press Enter to add, matching the Log editor flow</Li>
          </ul>
          <P>
            The Calendar is deliberately not a full scheduling tool. It exists
            to anchor intentions to dates — a bridge between the Planner
            widget's daily dimensions and the longer arc of weeks and months.
            It answers the question "what matters on this day" without becoming
            a project manager.
          </P>

          {/* Badge System */}
          <SectionHeading id="badge-system">
            Badge System (Aquatic Evolution)
          </SectionHeading>
          <P>
            Water metaphor for growth. Badges are earned through sustained
            engagement:
          </P>
          <ul className="list-none pl-16 mb-16">
            <Li>&#8728; Droplet — 7-day streak</Li>
            <Li>&#8776; Wave — 30-day streak</Li>
            <Li>&#8779; Current — 100-day streak</Li>
          </ul>
          <P>Unlock messages:</P>
          <ul className="list-none pl-16 mb-16">
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
          <ul className="list-none pl-16 mb-16">
            <Li>React 18, TypeScript, Nanostores, Tailwind CSS, esbuild</Li>
          </ul>
          <P>Backend:</P>
          <ul className="list-none pl-16 mb-16">
            <Li>Node.js, Fastify, PostgreSQL, Sequelize</Li>
          </ul>
          <P>AI:</P>
          <ul className="list-none pl-16 mb-16">
            <Li>Together AI, Gemini, Mistral, Claude, OpenAI</Li>
          </ul>
          <P>Infrastructure:</P>
          <ul className="list-none pl-16 mb-16">
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

          {/* Terms */}
          <SectionHeading id="terms">Terms</SectionHeading>

          <SubHeading>Terms of Service</SubHeading>
          <P>
            By accessing or using LOT Systems ("the Service"), you agree to be
            bound by these terms. The Service is provided on an "as is" and "as
            available" basis. LOT Systems reserves the right to modify, suspend,
            or discontinue any part of the Service at any time without prior
            notice.
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
            content; attempt to gain unauthorized access to other accounts or
            systems; interfere with the operation of the Service; violate any
            applicable law or regulation; or use automated means to access the
            Service without express permission.
          </P>

          <SubHeading>Intellectual Property</SubHeading>
          <P>
            All content, design, code, algorithms, and underlying technology of
            LOT Systems — including the Quantum Intent Engine, Self-Assembly
            Engine, Punctuation & Intonation Engine, and Soul Archetype system —
            are the exclusive property of LOT Systems. No part of the Service
            may be reproduced, distributed, or used to create derivative works
            without written permission.
          </P>
          <P>
            Content you create within the Service (logs, journal entries,
            calendar entries) remains yours. By using the Service, you grant LOT
            Systems a limited license to store and process your content solely
            for the purpose of providing the Service to you.
          </P>

          <SubHeading>Privacy & Data</SubHeading>
          <P>
            The Quantum Intent Engine runs entirely client-side. Behavioral
            pattern data never leaves your device. Server-side data (logs,
            settings, profile) is stored in encrypted databases with per-user
            isolation. LOT Systems does not sell, share, or monetize user data.
            We do not use third-party analytics or tracking services.
          </P>
          <P>
            You may request deletion of your account and all associated data at
            any time by contacting LOT Systems directly.
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
            applicable law. Any disputes arising from these terms or your use of
            the Service shall be resolved through binding arbitration.
          </P>
          <P>
            These terms are effective as of January 1, 2024 and were last
            updated April 2026.
          </P>

          {/* Footer */}
          <footer className="mt-24 pt-24 border-t border-acc/10 pb-24">
            <div className="flex flex-col gap-16">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-16">
                <div className="flex flex-col gap-4">
                  <div className="text-acc/90 text-sm">LOT Systems</div>
                  <div className="text-acc/40 text-[14px]">Layers of Time — Personal Operating System</div>
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
                  Quantum Intent Engine, Self-Assembly Engine, and Soul Archetypes
                  are trademarks of LOT Systems.
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
