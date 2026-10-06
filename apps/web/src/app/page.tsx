"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Integrations", href: "#integrations" },
  { label: "Pricing", href: "#pricing" },
]

const STATS = [
  { value: "< 2 min", label: "Mean Time to Acknowledge" },
  { value: "99.9%", label: "Platform Uptime" },
  { value: "40%", label: "Faster Incident Resolution" },
  { value: "10k+", label: "Incidents Managed" },
]

const FEATURES = [
  {
    icon: "⚡",
    title: "Smart Alert Routing",
    desc: "Rules-based routing with priority queues, escalation policies, and auto-assignment to the right on-call engineer — every time.",
    color: "#6366f1",
  },
  {
    icon: "🔔",
    title: "Multi-Channel Notifications",
    desc: "Reach your team via Slack, MS Teams, Email, Voice, and SMS. Configurable per-severity with delivery tracking.",
    color: "#8b5cf6",
  },
  {
    icon: "🏠",
    title: "War Rooms",
    desc: "Auto-create collaborative war rooms from templates. Track participants, actions, timeline, and resolution in one place.",
    color: "#ec4899",
  },
  {
    icon: "📅",
    title: "On-Call Scheduling",
    desc: "Visual rotation builder with overrides, coverage gaps detection, and calendar sync. No more spreadsheet schedules.",
    color: "#06b6d4",
  },
  {
    icon: "📊",
    title: "Escalation Policies",
    desc: "Multi-tier escalation with time-based rules. Automatically page the next tier when acknowledgment SLAs are breached.",
    color: "#10b981",
  },
  {
    icon: "🔗",
    title: "ServiceNow Integration",
    desc: "Bi-directional sync with ServiceNow. Auto-create incidents, update assignment groups, and track sync logs.",
    color: "#f59e0b",
  },
]

const WORKFLOW_STEPS = [
  {
    n: "01",
    title: "Alert Ingestion",
    desc: "Alerts flow in from any monitoring tool via webhook. OpsAura normalises, deduplicates, and correlates them in real-time.",
    icon: "📡",
  },
  {
    n: "02",
    title: "Intelligent Routing",
    desc: "Routing rules evaluate alert payload conditions and assign the incident to the right team and on-call engineer automatically.",
    icon: "🎯",
  },
  {
    n: "03",
    title: "Notification Dispatch",
    desc: "Simultaneous notifications fire across Slack, Teams, Email, and Voice. Escalation kicks in if no one acknowledges within SLA.",
    icon: "📣",
  },
  {
    n: "04",
    title: "War Room & Collaboration",
    desc: "A war room spins up automatically. Timeline, actions, and participants tracked. Stakeholders get live status updates.",
    icon: "🛡️",
  },
  {
    n: "05",
    title: "Resolution & Retrospective",
    desc: "Resolve the incident, capture RCA, and auto-generate a postmortem. All history searchable for future learning.",
    icon: "✅",
  },
]

const INTEGRATIONS = [
  { name: "Slack", logo: "💬" },
  { name: "MS Teams", logo: "🟦" },
  { name: "PagerDuty", logo: "🟢" },
  { name: "ServiceNow", logo: "🔧" },
  { name: "Datadog", logo: "🐕" },
  { name: "Prometheus", logo: "🔥" },
  { name: "Grafana", logo: "📈" },
  { name: "OpsGenie", logo: "🔵" },
  { name: "Jira", logo: "📋" },
  { name: "Twilio", logo: "📞" },
  { name: "GitHub", logo: "🐙" },
  { name: "AWS", logo: "☁️" },
]

const TESTIMONIALS = [
  {
    quote: "OpsAura cut our MTTA from 15 minutes to under 90 seconds. The routing rules alone saved us countless hours of manual triage.",
    name: "Sarah Chen",
    role: "VP Engineering, FinTech Corp",
    avatar: "SC",
  },
  {
    quote: "War rooms used to be a chaos of DMs and calls. Now everything is in one place with a clear audit trail. Game changer.",
    name: "Marcus Williams",
    role: "SRE Lead, CloudScale",
    avatar: "MW",
  },
  {
    quote: "The ServiceNow integration alone justified the switch. Incidents sync automatically — no more dual-entry nightmares.",
    name: "Priya Nair",
    role: "Head of Operations, Enterprise SaaS",
    avatar: "PN",
  },
]

const PLANS = [
  {
    name: "Starter",
    price: "$29",
    period: "/mo per user",
    features: ["Up to 5 users", "Basic alert routing", "Email & Slack notifications", "7-day history", "Community support"],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$79",
    period: "/mo per user",
    features: ["Unlimited users", "Advanced routing rules", "All notification channels", "War rooms & templates", "ServiceNow integration", "90-day history", "Priority support"],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Everything in Growth", "Dedicated infrastructure", "SSO / SAML", "Custom SLAs", "Audit logs & compliance", "Dedicated CSM", "White-glove onboarding"],
    cta: "Contact Sales",
    highlight: false,
  },
]

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function AnimSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <div style={{ background: "#08090f", color: "#e2e8f0", fontFamily: "'Inter', system-ui, sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        ::-webkit-scrollbar{width:6px;} ::-webkit-scrollbar-track{background:#111;} ::-webkit-scrollbar-thumb{background:#333;border-radius:3px;}
        .grad-text{background:linear-gradient(135deg,#6366f1 0%,#a855f7 50%,#ec4899 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .card-hover{transition:transform .3s ease,box-shadow .3s ease;} .card-hover:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(99,102,241,.18);}
        .btn-primary{background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;color:#fff;cursor:pointer;font-weight:600;transition:opacity .2s,transform .2s;} .btn-primary:hover{opacity:.9;transform:translateY(-1px);}
        .btn-outline{background:transparent;border:1.5px solid rgba(99,102,241,.5);color:#a5b4fc;cursor:pointer;font-weight:500;transition:all .2s;} .btn-outline:hover{border-color:#6366f1;background:rgba(99,102,241,.1);color:#fff;}
        @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.6;}100%{transform:scale(1.6);opacity:0;}}
        @keyframes marquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(99,102,241,.3);}50%{box-shadow:0 0 40px rgba(168,85,247,.5);}}
        @keyframes dash{to{stroke-dashoffset:0;}}
        .marquee-track{display:flex;animation:marquee 30s linear infinite;width:max-content;}
        .marquee-track:hover{animation-play-state:paused;}
        @media(max-width:768px){.hide-mobile{display:none!important;} .mobile-col{flex-direction:column!important;}}
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 5vw",
        background: scrolled ? "rgba(8,9,15,.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,.06)" : "none",
        transition: "all .3s",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-.5px" }}>OpsAura</span>
        </div>
        <div className="hide-mobile" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>{l.label}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <button className="btn-outline" style={{ padding: "8px 18px", borderRadius: 8, fontSize: 14 }}>Sign In</button>
          </Link>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ padding: "8px 18px", borderRadius: 8, fontSize: 14 }}>Get Started</button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 5vw 80px", position: "relative", overflow: "hidden" }}>
        {/* bg blobs */}
        <div style={{ position: "absolute", top: "15%", left: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,.15) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "25%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,85,247,.12) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "30%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,.1) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 900, textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.3)", borderRadius: 100, padding: "6px 16px", fontSize: 13, color: "#a5b4fc", marginBottom: 28, fontWeight: 500 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", display: "inline-block", animation: "pulse-ring 1.5s ease infinite" }} />
            Built for enterprise incident response teams
          </div>

          <h1 style={{ fontSize: "clamp(42px,7vw,88px)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-3px", marginBottom: 24 }}>
            Resolve Incidents<br />
            <span className="grad-text">10× Faster</span>
          </h1>

          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "#94a3b8", lineHeight: 1.7, maxWidth: 640, margin: "0 auto 40px", fontWeight: 400 }}>
            OpsAura is the enterprise incident response platform that alerts, routes, escalates, and coordinates resolution — so your team spends time fixing, not fighting the process.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ padding: "14px 32px", borderRadius: 10, fontSize: 16, animation: "glow 3s ease infinite" }}>
                Start Free Trial →
              </button>
            </Link>
            <a href="#how-it-works" style={{ textDecoration: "none" }}>
              <button className="btn-outline" style={{ padding: "14px 32px", borderRadius: 10, fontSize: 16 }}>
                See How It Works
              </button>
            </a>
          </div>

          <p style={{ color: "#475569", fontSize: 13, marginTop: 20 }}>No credit card required · Free 14-day trial · SOC 2 Type II</p>

          {/* hero dashboard mockup */}
          <div style={{ marginTop: 64, position: "relative" }}>
            <div style={{
              background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 16, padding: "20px", backdropFilter: "blur(8px)",
              animation: "float 6s ease infinite",
              boxShadow: "0 40px 120px rgba(99,102,241,.15)",
            }}>
              {/* fake dashboard header */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
                <div style={{ flex: 1, height: 24, background: "rgba(255,255,255,.04)", borderRadius: 6, marginLeft: 8 }} />
              </div>
              {/* fake incident rows */}
              {[
                { sev: "P1", title: "DB replication lag > 5s", team: "Platform", status: "Active", color: "#ef4444" },
                { sev: "P2", title: "Payment gateway 502s", team: "Payments", status: "Acknowledged", color: "#f59e0b" },
                { sev: "P3", title: "CDN cache miss spike", team: "Infra", status: "Resolved", color: "#10b981" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "rgba(255,255,255,.03)", borderRadius: 8, marginBottom: 8, borderLeft: `3px solid ${r.color}` }}>
                  <span style={{ background: r.color + "22", color: r.color, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{r.sev}</span>
                  <span style={{ flex: 1, textAlign: "left", fontSize: 13, color: "#e2e8f0" }}>{r.title}</span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{r.team}</span>
                  <span style={{ fontSize: 11, color: r.color, background: r.color + "15", padding: "2px 10px", borderRadius: 100 }}>{r.status}</span>
                </div>
              ))}
              {/* stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 16 }}>
                {[{ v: "3", l: "Active P1s" }, { v: "98.7%", l: "Uptime" }, { v: "1m 42s", l: "Avg MTTA" }, { v: "12", l: "On-Call Now" }].map((s, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,.04)", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#a5b4fc" }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section style={{ padding: "0 5vw 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, background: "rgba(255,255,255,.06)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,.06)" }}>
          {STATS.map((s, i) => (
            <AnimSection key={i} delay={i * 80}>
              <div style={{ padding: "36px 28px", background: "#0d0e18", textAlign: "center" }}>
                <div className="grad-text" style={{ fontSize: 42, fontWeight: 900, letterSpacing: "-2px" }}>{s.value}</div>
                <div style={{ color: "#64748b", fontSize: 13, marginTop: 6, fontWeight: 500 }}>{s.label}</div>
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "80px 5vw" }}>
        <AnimSection>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: "#6366f1", fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Platform Features</div>
            <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.1 }}>Everything your team needs<br /><span className="grad-text">to own incident response</span></h2>
          </div>
        </AnimSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {FEATURES.map((f, i) => (
            <AnimSection key={i} delay={i * 70}>
              <div className="card-hover" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "28px 24px", height: "100%" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: f.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 18 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: "#f1f5f9" }}>{f.title}</h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: "80px 5vw", background: "rgba(255,255,255,.015)" }}>
        <AnimSection>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ color: "#8b5cf6", fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Workflow</div>
            <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-2px" }}>From alert to resolution<br /><span className="grad-text">in minutes, not hours</span></h2>
          </div>
        </AnimSection>
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          {/* connector line */}
          <div className="hide-mobile" style={{ position: "absolute", left: 35, top: 40, bottom: 40, width: 2, background: "linear-gradient(to bottom,#6366f1,#a855f7,#ec4899)", borderRadius: 2, opacity: .4 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {WORKFLOW_STEPS.map((s, i) => (
              <AnimSection key={i} delay={i * 100}>
                <div className="card-hover" style={{ display: "flex", gap: 24, alignItems: "flex-start", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "24px 28px" }}>
                  <div style={{ minWidth: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
                    <span style={{ fontSize: 11, color: "#475569", fontWeight: 700 }}>{s.n}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#f1f5f9" }}>{s.title}</h3>
                    <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section id="integrations" style={{ padding: "80px 0" }}>
        <AnimSection className="">
          <div style={{ textAlign: "center", marginBottom: 48, padding: "0 5vw" }}>
            <div style={{ color: "#ec4899", fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Integrations</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-2px" }}>Connects with your<br /><span className="grad-text">entire stack</span></h2>
          </div>
        </AnimSection>
        <div style={{ overflow: "hidden", maskImage: "linear-gradient(to right,transparent,black 10%,black 90%,transparent)" }}>
          <div className="marquee-track">
            {[...INTEGRATIONS, ...INTEGRATIONS].map((intg, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, padding: "14px 24px", margin: "0 8px", whiteSpace: "nowrap", minWidth: 140 }}>
                <span style={{ fontSize: 22 }}>{intg.logo}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>{intg.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 5vw", background: "rgba(255,255,255,.015)" }}>
        <AnimSection>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ color: "#10b981", fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Testimonials</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-2px" }}>Trusted by engineering<br /><span className="grad-text">teams worldwide</span></h2>
          </div>
        </AnimSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <AnimSection key={i} delay={i * 100}>
              <div className="card-hover" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "28px 24px" }}>
                <div style={{ color: "#6366f1", fontSize: 32, lineHeight: 1, marginBottom: 14 }}>"</div>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>{t.quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "80px 5vw" }}>
        <AnimSection>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ color: "#f59e0b", fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Pricing</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-2px" }}>Simple, transparent<br /><span className="grad-text">pricing</span></h2>
          </div>
        </AnimSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, maxWidth: 1000, margin: "0 auto" }}>
          {PLANS.map((p, i) => (
            <AnimSection key={i} delay={i * 80}>
              <div className="card-hover" style={{
                background: p.highlight ? "linear-gradient(135deg,rgba(99,102,241,.18),rgba(139,92,246,.12))" : "rgba(255,255,255,.03)",
                border: p.highlight ? "1.5px solid rgba(99,102,241,.5)" : "1px solid rgba(255,255,255,.07)",
                borderRadius: 16, padding: "32px 28px", height: "100%", position: "relative"
              }}>
                {p.highlight && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 16px", borderRadius: 100, whiteSpace: "nowrap" }}>MOST POPULAR</div>}
                <div style={{ fontSize: 15, fontWeight: 700, color: "#94a3b8", marginBottom: 16 }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                  <span className="grad-text" style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-2px" }}>{p.price}</span>
                  <span style={{ color: "#475569", fontSize: 13 }}>{p.period}</span>
                </div>
                <div style={{ height: 1, background: "rgba(255,255,255,.07)", margin: "20px 0" }} />
                <ul style={{ listStyle: "none", marginBottom: 28 }}>
                  {p.features.map((f, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#94a3b8", marginBottom: 10 }}>
                      <span style={{ color: "#6366f1", flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" style={{ textDecoration: "none", display: "block" }}>
                  <button className={p.highlight ? "btn-primary" : "btn-outline"} style={{ width: "100%", padding: "12px 0", borderRadius: 10, fontSize: 14 }}>{p.cta}</button>
                </Link>
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: "80px 5vw" }}>
        <AnimSection>
          <div style={{ background: "linear-gradient(135deg,rgba(99,102,241,.15),rgba(168,85,247,.12),rgba(236,72,153,.1))", border: "1px solid rgba(99,102,241,.25)", borderRadius: 20, padding: "64px 5vw", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(circle at 50% 50%,rgba(99,102,241,.12) 0%,transparent 70%)", pointerEvents: "none" }} />
            <h2 style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: 16, position: "relative" }}>
              Ready to transform<br /><span className="grad-text">your incident response?</span>
            </h2>
            <p style={{ color: "#64748b", fontSize: 16, marginBottom: 36, position: "relative" }}>Join hundreds of engineering teams resolving incidents faster with OpsAura.</p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <Link href="/login" style={{ textDecoration: "none" }}>
                <button className="btn-primary" style={{ padding: "14px 36px", borderRadius: 10, fontSize: 16, animation: "glow 3s ease infinite" }}>Start Free Trial →</button>
              </Link>
              <a href="mailto:hello@opsaura.io" style={{ textDecoration: "none" }}>
                <button className="btn-outline" style={{ padding: "14px 36px", borderRadius: 10, fontSize: 16 }}>Contact Sales</button>
              </a>
            </div>
          </div>
        </AnimSection>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "48px 5vw 32px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr repeat(3, 1fr)", gap: 40, marginBottom: 40 }} className="mobile-col">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
              <span style={{ fontWeight: 800, fontSize: 16 }}>OpsAura</span>
            </div>
            <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.7, maxWidth: 240 }}>The enterprise incident response platform that keeps your systems — and teams — resilient.</p>
          </div>
          {[
            { title: "Product", links: ["Features", "How It Works", "Integrations", "Pricing"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security", "Status"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(l => (
                  <a key={l} href="#" style={{ color: "#475569", fontSize: 14, textDecoration: "none", transition: "color .2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#a5b4fc")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "#334155", fontSize: 13 }}>© 2026 OpsAura. All rights reserved.</p>
          <p style={{ color: "#334155", fontSize: 13 }}>Built for engineers who care about reliability.</p>
        </div>
      </footer>
    </div>
  )
}
