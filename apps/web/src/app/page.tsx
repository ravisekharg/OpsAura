"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

/* ─── Scroll-animation helper ─────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function AnimSection({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  const { ref, visible } = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity .65s ease, transform .65s ease",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ─── Data ────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Incident Lifecycle", href: "#workflow" },
  { label: "On-Call", href: "#oncall" },
  { label: "War Rooms", href: "#warrooms" },
  { label: "Integrations", href: "#integrations" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#" },
]

const LOGOS = ["Stripe", "Airbnb", "Notion", "Figma", "Vercel", "Linear", "Datadog", "Elastic"]

const STATS = [
  { value: "< 2 min", label: "Mean Time to Acknowledge", sub: "Industry avg: 18 min" },
  { value: "99.9%", label: "Platform Uptime SLA", sub: "Guaranteed in every plan" },
  { value: "40%", label: "Faster Resolution", sub: "vs legacy tools" },
  { value: "10k+", label: "Incidents Managed", sub: "In the last 30 days" },
  { value: "200+", label: "Native Integrations", sub: "Monitoring, ITSM & more" },
  { value: "< 30s", label: "Alert-to-Page Latency", sub: "End-to-end, globally" },
]

const PAIN_POINTS = [
  {
    icon: "🔔",
    stat: "82%",
    title: "Alert Fatigue is killing productivity",
    desc: "Engineers are drowning in duplicate, low-signal alerts. With no intelligent deduplication or correlation, the noise drowns out the signal — leading to missed critical incidents and burned-out teams.",
  },
  {
    icon: "📞",
    stat: "23 min",
    title: "Manual escalation wastes critical minutes",
    desc: "When the primary on-call doesn't respond, someone has to manually hunt down the next person, figure out who owns the service, and manually trigger a war room. Every minute counts during a P0.",
  },
  {
    icon: "🔧",
    stat: "6+ tools",
    title: "Siloed tools break your incident flow",
    desc: "Teams jump between Slack, Jira, PagerDuty, Grafana, and Confluence during an incident. No single source of truth, no shared timeline — just chaos and finger-pointing when things go wrong.",
  },
]

const FEATURE_COLUMNS = [
  {
    title: "Alert Management",
    color: "#6366f1",
    icon: "⚡",
    items: [
      "Intelligent deduplication engine",
      "Correlation rules & grouping",
      "Suppression windows & overrides",
      "Severity normalization across sources",
      "Payload enrichment with CMDB data",
      "Multi-source webhook ingestion",
      "Alert dependency mapping",
      "Custom routing condition builder",
      "Historical noise analysis",
    ],
  },
  {
    title: "On-Call & Scheduling",
    color: "#8b5cf6",
    icon: "📅",
    items: [
      "Visual rotation schedule builder",
      "Override management & approvals",
      "Coverage gap detection & alerts",
      "Google/Outlook calendar sync",
      "Mobile push notifications (iOS/Android)",
      "Escalation chain builder (multi-tier)",
      "Handoff summaries & briefings",
      "Timezone-aware scheduling",
      "Team availability heatmaps",
    ],
  },
  {
    title: "Incident Response",
    color: "#ec4899",
    icon: "🏠",
    items: [
      "War room auto-creation from templates",
      "Role assignment (IC, comms, scribe)",
      "Real-time incident timeline tracking",
      "Stakeholder status update broadcasts",
      "RCA template library",
      "Postmortem builder & export",
      "Action item tracking with owners",
      "SLA breach alerting & reporting",
      "Executive summary auto-generation",
    ],
  },
]

const DEEP_DIVE = [
  {
    title: "Smart Alert Routing",
    icon: "🎯",
    label: "Alert Intelligence",
    color: "#6366f1",
    desc: "OpsAura's routing engine evaluates every incoming alert against your defined routing rules — matching on service, severity, environment, payload fields, and time-of-day — to ensure the right engineer is paged instantly.",
    bullets: [
      "Condition-based routing with 30+ alert field matchers",
      "Fallback routing when primary team is unavailable",
      "Automatic priority escalation for correlated incidents",
      "Live routing preview before you publish rule changes",
    ],
    mockup: (
      <div style={{ background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.25)", borderRadius: 12, padding: "20px 24px", fontFamily: "monospace", fontSize: 13, lineHeight: 1.8 }}>
        <div style={{ color: "#6366f1", marginBottom: 12, fontSize: 12, letterSpacing: 1 }}>ROUTING RULE · ACTIVE</div>
        {[
          { k: "IF", v: "service = payments-api" },
          { k: "AND", v: "severity ≥ critical" },
          { k: "AND", v: "env = production" },
          { k: "THEN", v: "→ Payments On-Call" },
          { k: "ESCALATE", v: "after 3 min → Payments Lead" },
          { k: "CC", v: "VP Engineering, Slack #p0-alerts" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 16 }}>
            <span style={{ color: "#8b5cf6", width: 72, flexShrink: 0 }}>{r.k}</span>
            <span style={{ color: "#e2e8f0" }}>{r.v}</span>
          </div>
        ))}
        <div style={{ marginTop: 16, padding: "8px 12px", background: "rgba(16,185,129,.1)", borderRadius: 8, color: "#10b981", fontSize: 12 }}>
          ✓ Rule matched 1,284 alerts this week · 0 missed
        </div>
      </div>
    ),
  },
  {
    title: "War Rooms & Collaboration",
    icon: "🏠",
    label: "Incident Collaboration",
    color: "#ec4899",
    desc: "The moment an incident is created, OpsAura spins up a structured war room with pre-assigned roles, a running timeline, and a shared action item board — so your team can focus on resolution, not coordination overhead.",
    bullets: [
      "Auto-created Slack/Teams channel linked to every incident",
      "Role-based access: Incident Commander, Comms Lead, Scribe",
      "Live timeline with automated system events + manual entries",
      "One-click stakeholder broadcasts with live status embeds",
    ],
    mockup: (
      <div style={{ background: "rgba(236,72,153,.06)", border: "1px solid rgba(236,72,153,.2)", borderRadius: 12, padding: "20px 24px", fontSize: 13, lineHeight: 1.9 }}>
        <div style={{ color: "#ec4899", marginBottom: 12, fontSize: 12, letterSpacing: 1 }}>WAR ROOM · INC-2847 · P0 · ACTIVE</div>
        {[
          { time: "14:03:11", icon: "🔴", msg: "Incident created · payments-api latency > 5s" },
          { time: "14:03:14", icon: "📣", msg: "Paging: Sarah K (IC) · Alex M (Comms)" },
          { time: "14:03:41", icon: "✅", msg: "Sarah K acknowledged" },
          { time: "14:05:12", icon: "💬", msg: "#war-room-inc-2847 created in Slack" },
          { time: "14:07:04", icon: "🔍", msg: "RDS read replica lag identified (8.3s)" },
          { time: "14:09:55", icon: "🔧", msg: "Action: Failover replica · Owner: Alex M" },
        ].map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 10, borderBottom: "1px solid rgba(255,255,255,.05)", paddingBottom: 4 }}>
            <span style={{ color: "#64748b", fontSize: 11, flexShrink: 0, paddingTop: 2 }}>{e.time}</span>
            <span style={{ fontSize: 14 }}>{e.icon}</span>
            <span style={{ color: "#cbd5e1" }}>{e.msg}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "On-Call Intelligence",
    icon: "📅",
    label: "Scheduling Engine",
    color: "#8b5cf6",
    desc: "Building on-call schedules that scale with your team is hard. OpsAura makes it visual, flexible, and smart — detecting coverage gaps, suggesting overrides, and ensuring your team never gets paged without the context they need.",
    bullets: [
      "Drag-and-drop rotation builder with split-week support",
      "Automatic gap detection with team-wide alerts",
      "Handoff briefings auto-generated from last shift's incidents",
      "On-call load balancing and fairness analytics",
    ],
    mockup: (
      <div style={{ background: "rgba(139,92,246,.07)", border: "1px solid rgba(139,92,246,.22)", borderRadius: 12, padding: "20px 24px", fontSize: 13 }}>
        <div style={{ color: "#8b5cf6", marginBottom: 14, fontSize: 12, letterSpacing: 1 }}>PAYMENTS TEAM · WEEK 41</div>
        {[
          { name: "Sarah K", days: "Mon–Wed", role: "Primary", status: "active" },
          { name: "Alex M", days: "Mon–Wed", role: "Backup", status: "active" },
          { name: "Jordan L", days: "Thu–Sun", role: "Primary", status: "upcoming" },
          { name: "Sam P", days: "Thu–Sun", role: "Backup", status: "upcoming" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, padding: "8px 12px", background: "rgba(255,255,255,.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,.06)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `hsl(${i * 60 + 200},60%,55%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
              {r.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#e2e8f0", fontWeight: 600 }}>{r.name}</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>{r.days} · {r.role}</div>
            </div>
            <div style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: r.status === "active" ? "rgba(16,185,129,.15)" : "rgba(100,116,139,.15)", color: r.status === "active" ? "#10b981" : "#94a3b8" }}>
              {r.status}
            </div>
          </div>
        ))}
        <div style={{ marginTop: 8, padding: "8px 12px", background: "rgba(245,158,11,.08)", borderRadius: 8, color: "#f59e0b", fontSize: 12 }}>
          ⚠ Coverage gap detected: Sunday 00:00–06:00 UTC
        </div>
      </div>
    ),
  },
]

const WORKFLOW_STEPS = [
  { n: "01", icon: "📡", title: "Ingest", desc: "Alerts arrive via webhook from any monitoring source. Payload is normalised and timestamped." },
  { n: "02", icon: "🔍", title: "Deduplicate", desc: "The correlation engine groups related alerts, suppressing noise and surfacing signal." },
  { n: "03", icon: "🎯", title: "Route", desc: "Routing rules match alert conditions to the right team, service owner, and on-call schedule." },
  { n: "04", icon: "📣", title: "Notify", desc: "Multi-channel notifications fire instantly. Escalation triggers automatically on SLA breach." },
  { n: "05", icon: "🏠", title: "Collaborate", desc: "War room spins up. Timeline, roles, and action items tracked in real-time." },
  { n: "06", icon: "✅", title: "Resolve", desc: "Incident is closed, postmortem generated, and metrics updated for retrospective analysis." },
]

const CHANNELS = [
  { icon: "💬", name: "Slack", desc: "Channel-per-incident with live status" },
  { icon: "🟦", name: "MS Teams", desc: "Adaptive cards with rich actions" },
  { icon: "📧", name: "Email", desc: "Configurable HTML digest templates" },
  { icon: "📞", name: "Voice Call", desc: "Automated IVR with acknowledgment" },
  { icon: "📱", name: "SMS", desc: "Global delivery via Twilio network" },
  { icon: "🔔", name: "PagerDuty", desc: "Bi-directional sync & dedup" },
  { icon: "🔗", name: "Webhook", desc: "Any HTTP endpoint, custom payload" },
  { icon: "📲", name: "Mobile Push", desc: "iOS & Android apps with offline queueing" },
]

const INTEGRATIONS = {
  Monitoring: ["Datadog", "Prometheus", "Grafana", "New Relic", "Dynatrace", "CloudWatch"],
  ITSM: ["ServiceNow", "Jira Service Mgmt", "Freshservice", "Zendesk", "BMC Helix", "Remedy"],
  Communication: ["Slack", "MS Teams", "Google Chat", "Mattermost", "Discord", "Webex"],
  Cloud: ["AWS", "Google Cloud", "Azure", "DigitalOcean", "Cloudflare", "Fastly"],
  "CI/CD": ["GitHub Actions", "GitLab CI", "Jenkins", "CircleCI", "ArgoCD", "Spinnaker"],
}

const SECURITY_FEATURES = [
  "SOC 2 Type II certified",
  "GDPR & CCPA compliant",
  "ISO 27001 certified",
  "HIPAA-ready architecture",
  "End-to-end TLS 1.3 encryption",
  "Data residency controls (US/EU/APAC)",
  "SSO/SAML 2.0 & SCIM provisioning",
  "Role-based access control (RBAC)",
  "Audit log with 7-year retention",
  "Penetration tested quarterly",
]

const TESTIMONIALS = [
  {
    quote: "OpsAura cut our MTTA from 18 minutes to under 90 seconds. The intelligent routing and automatic war rooms mean our engineers spend time fixing, not coordinating.",
    name: "Priya Nair",
    role: "VP Engineering",
    company: "FinTech Scale",
  },
  {
    quote: "We evaluated five incident platforms. OpsAura was the only one that handled our multi-region on-call complexity without requiring a full-time admin to maintain it.",
    name: "Marcus Chen",
    role: "SRE Lead",
    company: "CloudOps Ltd",
  },
  {
    quote: "The postmortem builder alone saved us 6 hours per major incident. Templates, pre-filled timelines, and direct Confluence export — it's the detail work that matters.",
    name: "Sophia Reyes",
    role: "Director of Reliability",
    company: "StreamMedia",
  },
  {
    quote: "After our PagerDuty bill crossed $80k/year for 40 engineers, we switched to OpsAura. Onboarded in 3 days, and our team actually prefers it now.",
    name: "James O'Brien",
    role: "CTO",
    company: "RetailTech",
  },
]

const PRICING = [
  {
    name: "Starter",
    price: "$29",
    unit: "/engineer/month",
    desc: "For small teams getting serious about incident management.",
    color: "#6366f1",
    features: [
      "Up to 20 engineers",
      "Unlimited incidents",
      "5 routing rules",
      "3 escalation policies",
      "Slack & Email notifications",
      "Basic on-call scheduling",
      "7-day alert history",
      "Community support",
      "1 integration pack",
      "Standard uptime SLA",
    ],
    cta: "Start free trial",
  },
  {
    name: "Growth",
    price: "$79",
    unit: "/engineer/month",
    desc: "For scaling teams that need advanced automation and analytics.",
    color: "#8b5cf6",
    popular: true,
    features: [
      "Up to 200 engineers",
      "Unlimited incidents & alerts",
      "Unlimited routing rules",
      "Unlimited escalation policies",
      "All notification channels",
      "Advanced on-call + overrides",
      "90-day alert history",
      "Priority email support",
      "All 200+ integrations",
      "War room templates",
      "Postmortem builder",
      "SAML SSO",
      "Advanced analytics & reporting",
    ],
    cta: "Start free trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "pricing",
    desc: "For large organizations with advanced security and compliance needs.",
    color: "#ec4899",
    features: [
      "Unlimited engineers",
      "Dedicated infrastructure option",
      "Custom SLA (up to 99.99%)",
      "Data residency controls",
      "SOC 2 / ISO 27001 reports",
      "SCIM provisioning",
      "RBAC with custom roles",
      "Priority 24/7 phone support",
      "Dedicated CSM",
      "Custom integration development",
      "On-premises deployment option",
      "Audit log & compliance exports",
      "Executive business reviews",
    ],
    cta: "Talk to sales",
  },
]

const FAQS = [
  {
    q: "How does OpsAura differ from PagerDuty or OpsGenie?",
    a: "OpsAura was built ground-up for the modern cloud-native stack. Unlike legacy tools, it includes native war rooms, AI-powered alert correlation, a postmortem builder, and full bi-directional ServiceNow/Jira sync — all in one platform at a fraction of the cost. Most teams see a 50–70% reduction in their incident tooling bill.",
  },
  {
    q: "How long does onboarding take?",
    a: "Most teams are fully operational within 24–72 hours. We provide a guided setup wizard, pre-built integration templates for the most common monitoring stacks (Datadog, Prometheus, CloudWatch), and a dedicated onboarding engineer on Growth and Enterprise plans.",
  },
  {
    q: "Does OpsAura work with our existing Slack workspace?",
    a: "Yes. OpsAura's Slack integration creates a dedicated channel per incident, posts live status updates, and allows engineers to acknowledge, escalate, and close incidents directly from Slack. You can also configure which channels receive incident broadcasts by severity and team.",
  },
  {
    q: "What happens to our data if we cancel?",
    a: "You retain full ownership of your data. Upon cancellation, you can export all incidents, timelines, postmortems, and on-call history in JSON and CSV format. Data is retained for 90 days post-cancellation before secure deletion.",
  },
  {
    q: "Is there a free trial available?",
    a: "Yes — all plans include a 14-day free trial with no credit card required. Enterprise customers can request a 30-day proof-of-concept with full platform access and a dedicated solutions engineer.",
  },
  {
    q: "Can we self-host OpsAura?",
    a: "On-premises and private cloud deployment is available on the Enterprise plan. We support Kubernetes-based deployment with Helm charts, and our solutions team will work with you to architect a deployment that meets your network isolation and compliance requirements.",
  },
]

/* ─── Styles ──────────────────────────────────────────────────────────── */
const S = {
  bg: "#08090f",
  card: {
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.07)",
    borderRadius: 14,
  } as React.CSSProperties,
  grad: "linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)",
}

/* ─── Component ───────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("Monitoring")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div style={{ background: S.bg, color: "#e2e8f0", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .grad-text {
          background: linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hover-card { transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; cursor: default; }
        .hover-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(99,102,241,.13); border-color: rgba(99,102,241,.3) !important; }
        .nav-link { color: #94a3b8; text-decoration: none; font-size: 14px; font-weight: 500; transition: color .2s; }
        .nav-link:hover { color: #e2e8f0; }
        .btn-primary {
          background: linear-gradient(135deg,#6366f1,#8b5cf6);
          color: #fff; border: none; border-radius: 10px;
          padding: 12px 28px; font-size: 15px; font-weight: 600;
          cursor: pointer; transition: opacity .2s, transform .2s;
          text-decoration: none; display: inline-block;
        }
        .btn-primary:hover { opacity: .9; transform: translateY(-1px); }
        .btn-secondary {
          background: rgba(255,255,255,.06); color: #e2e8f0;
          border: 1px solid rgba(255,255,255,.12); border-radius: 10px;
          padding: 12px 28px; font-size: 15px; font-weight: 600;
          cursor: pointer; transition: background .2s, transform .2s;
          text-decoration: none; display: inline-block;
        }
        .btn-secondary:hover { background: rgba(255,255,255,.1); transform: translateY(-1px); }
        .section-label {
          font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          background: linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          margin-bottom: 14px; display: block;
        }
        .section-title {
          font-size: clamp(28px,4vw,52px); font-weight: 800;
          letter-spacing: -2px; line-height: 1.1; margin-bottom: 16px;
        }
        .section-sub {
          font-size: clamp(15px,1.5vw,18px); color: #94a3b8; line-height: 1.7; max-width: 640px;
        }
        .chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 20px;
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
          font-size: 13px; font-weight: 500; color: #cbd5e1;
          transition: background .2s, border-color .2s;
        }
        .chip:hover { background: rgba(99,102,241,.12); border-color: rgba(99,102,241,.3); }
        .tab-btn {
          padding: 8px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;
          border: 1px solid rgba(255,255,255,.08); cursor: pointer; transition: all .2s;
        }
        .check-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; font-size: 14px; color: #cbd5e1; line-height: 1.5; }
        .check-icon { color: #10b981; flex-shrink: 0; margin-top: 2px; font-size: 15px; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0d0f1a; }
        ::-webkit-scrollbar-thumb { background: #2a2d4a; border-radius: 3px; }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 5vw",
        background: scrolled ? "rgba(8,9,15,.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,.06)" : "none",
        transition: "all .3s ease",
        display: "flex", alignItems: "center", height: 64, gap: 32,
      }}>
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
          <span style={{ fontSize: 22 }}>⚡</span>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: -0.5 }}>OpsAura</span>
        </a>
        <div style={{ display: "flex", gap: 28, flex: 1, justifyContent: "center", flexWrap: "wrap" }}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
          <Link href="/login" className="nav-link" style={{ display: "flex", alignItems: "center", padding: "8px 16px" }}>Sign In</Link>
          <Link href="/login" className="btn-primary" style={{ padding: "9px 22px", fontSize: 14 }}>Get Started</Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "140px 5vw 80px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {/* Background glow */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 900, height: 500, background: "radial-gradient(ellipse,rgba(99,102,241,.12) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 600, height: 600, background: "radial-gradient(ellipse,rgba(236,72,153,.06) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 760, position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.25)", borderRadius: 20, marginBottom: 28, fontSize: 13, color: "#a5b4fc" }}>
            <span>✨</span> Now with AI-powered incident correlation
          </div>
          <h1 style={{ fontSize: "clamp(38px,6vw,80px)", fontWeight: 900, letterSpacing: "-3px", lineHeight: 1.05, marginBottom: 24 }}>
            Enterprise Incident Response,{" "}
            <span className="grad-text">Reimagined</span>
          </h1>
          <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "#94a3b8", lineHeight: 1.7, marginBottom: 36, maxWidth: 640 }}>
            From alert to resolution — OpsAura orchestrates your entire incident lifecycle with intelligent routing, real-time war rooms, and automated escalations built for enterprise scale.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 52 }}>
            <Link href="/login" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>Start free trial →</Link>
            <a href="#workflow" className="btn-secondary" style={{ fontSize: 16, padding: "14px 32px" }}>See how it works</a>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: 13, color: "#64748b" }}>
            {["SOC 2 Type II", "GDPR", "ISO 27001", "99.9% SLA"].map(b => (
              <span key={b} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#10b981" }}>✓</span> {b}
              </span>
            ))}
          </div>
        </div>

        {/* Floating Dashboard Mockup */}
        <div style={{ position: "absolute", right: "5vw", top: "50%", transform: "translateY(-50%)", width: "min(44%, 540px)", display: "flex", flexDirection: "column", gap: 12 }}>
          <AnimSection style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: 20, backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12, fontWeight: 600, letterSpacing: 1 }}>ACTIVE INCIDENTS</div>
            {[
              { id: "INC-2847", sev: "P0", svc: "payments-api", age: "4m", status: "Active" },
              { id: "INC-2846", sev: "P1", svc: "auth-service", age: "12m", status: "Ack" },
              { id: "INC-2845", sev: "P2", svc: "search-index", age: "31m", status: "Ack" },
              { id: "INC-2844", sev: "P3", svc: "email-worker", age: "1h", status: "Resolving" },
            ].map((inc, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,.04)" : undefined }}>
                <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 6, background: i === 0 ? "rgba(239,68,68,.2)" : i === 1 ? "rgba(245,158,11,.2)" : "rgba(100,116,139,.2)", color: i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : "#94a3b8" }}>{inc.sev}</span>
                <span style={{ flex: 1, fontSize: 13, color: "#e2e8f0" }}>{inc.id} · {inc.svc}</span>
                <span style={{ fontSize: 11, color: "#64748b" }}>{inc.age}</span>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: inc.status === "Active" ? "rgba(239,68,68,.1)" : "rgba(16,185,129,.1)", color: inc.status === "Active" ? "#ef4444" : "#10b981" }}>{inc.status}</span>
              </div>
            ))}
          </AnimSection>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "MTTA", value: "1m 42s", delta: "↓ 68%", positive: true },
              { label: "Open P0/P1", value: "2", delta: "↑ 1", positive: false },
            ].map((m, i) => (
              <AnimSection key={i} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6, fontWeight: 600, letterSpacing: 1 }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>{m.value}</div>
                <div style={{ fontSize: 12, color: m.positive ? "#10b981" : "#ef4444", marginTop: 4 }}>{m.delta} vs last week</div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOGO BAR ────────────────────────────────────────────────────── */}
      <section style={{ padding: "40px 5vw 56px", borderTop: "1px solid rgba(255,255,255,.05)", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        <AnimSection>
          <p style={{ textAlign: "center", fontSize: 13, color: "#475569", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 32 }}>
            Trusted by engineering teams at
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "12px 40px" }}>
            {LOGOS.map(l => (
              <span key={l} style={{ fontSize: 20, fontWeight: 800, color: "#334155", letterSpacing: -0.5, fontFamily: "Georgia, serif" }}>{l}</span>
            ))}
          </div>
        </AnimSection>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 5vw" }}>
        <AnimSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
            {STATS.map((s, i) => (
              <div key={i} className="hover-card" style={{ ...S.card, padding: "28px 24px", textAlign: "center" }}>
                <div className="grad-text" style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#e2e8f0", marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: "#475569" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </AnimSection>
      </section>

      {/* ── PROBLEM STATEMENT ───────────────────────────────────────────── */}
      <section style={{ padding: "80px 5vw", background: "rgba(255,255,255,.01)" }}>
        <AnimSection style={{ marginBottom: 48 }}>
          <span className="section-label">Why OpsAura</span>
          <h2 className="section-title">The cost of broken<br />incident response</h2>
          <p className="section-sub">Alert fatigue, manual handoffs, and disconnected tools turn every incident into a fire drill. The impact compounds: MTTR spikes, SLAs breach, and engineers burn out.</p>
        </AnimSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {PAIN_POINTS.map((p, i) => (
            <AnimSection key={i}>
              <div className="hover-card" style={{ ...S.card, padding: "32px 28px", height: "100%" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{p.icon}</div>
                <div className="grad-text" style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2, marginBottom: 12 }}>{p.stat}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 14, letterSpacing: -0.5 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* ── FULL FEATURE BREAKDOWN ──────────────────────────────────────── */}
      <section id="features" style={{ padding: "80px 5vw" }}>
        <AnimSection style={{ marginBottom: 56 }}>
          <span className="section-label">Platform Capabilities</span>
          <h2 className="section-title">Every tool your team needs</h2>
          <p className="section-sub">OpsAura replaces the patchwork of PagerDuty, OpsGenie, and status page tools with a single, deeply integrated platform built for how modern engineering teams actually work.</p>
        </AnimSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {FEATURE_COLUMNS.map((col, i) => (
            <AnimSection key={i}>
              <div className="hover-card" style={{ ...S.card, padding: "32px 28px", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${col.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: `1px solid ${col.color}44` }}>
                    {col.icon}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", letterSpacing: -0.5 }}>{col.title}</h3>
                </div>
                {col.items.map((item, j) => (
                  <div key={j} className="check-item">
                    <span className="check-icon">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* ── DEEP DIVE FEATURE CARDS ─────────────────────────────────────── */}
      <section style={{ padding: "80px 5vw", background: "rgba(255,255,255,.01)" }}>
        <AnimSection style={{ marginBottom: 64 }}>
          <span className="section-label">Deep Dive</span>
          <h2 className="section-title">Built for the moments<br />that matter most</h2>
        </AnimSection>
        {DEEP_DIVE.map((d, i) => (
          <AnimSection key={i} style={{ marginBottom: 56 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
            }}>
              <div style={{ order: i % 2 === 1 ? 2 : 1 }}>
                <span className="section-label">{d.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <span style={{ fontSize: 28 }}>{d.icon}</span>
                  <h3 style={{ fontSize: "clamp(22px,2.5vw,34px)", fontWeight: 800, letterSpacing: -1.5, color: "#f1f5f9" }}>{d.title}</h3>
                </div>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.75, marginBottom: 24 }}>{d.desc}</p>
                {d.bullets.map((b, j) => (
                  <div key={j} className="check-item">
                    <span style={{ color: d.color, flexShrink: 0, fontSize: 15, marginTop: 2 }}>→</span>
                    <span style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>{b}</span>
                  </div>
                ))}
              </div>
              <div style={{ order: i % 2 === 1 ? 1 : 2 }}>
                {d.mockup}
              </div>
            </div>
          </AnimSection>
        ))}
      </section>

      {/* ── WORKFLOW ────────────────────────────────────────────────────── */}
      <section id="workflow" style={{ padding: "80px 5vw" }}>
        <AnimSection style={{ marginBottom: 56, textAlign: "center" }}>
          <span className="section-label" style={{ display: "block" }}>Incident Lifecycle</span>
          <h2 className="section-title" style={{ textAlign: "center" }}>From alert ingested<br />to incident resolved</h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>Six automated stages. Zero manual handoffs. OpsAura orchestrates the entire flow so your engineers can focus on what matters — solving the problem.</p>
        </AnimSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, position: "relative" }}>
          {WORKFLOW_STEPS.map((s, i) => (
            <AnimSection key={i}>
              <div className="hover-card" style={{ ...S.card, padding: "28px 24px", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 28 }}>{s.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#475569", letterSpacing: 1 }}>{s.n}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 10, letterSpacing: -0.5 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65 }}>{s.desc}</p>
                {i < WORKFLOW_STEPS.length - 1 && (
                  <div style={{ position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)", fontSize: 20, color: "#334155", zIndex: 2 }}>→</div>
                )}
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* ── NOTIFICATION CHANNELS ───────────────────────────────────────── */}
      <section style={{ padding: "80px 5vw", background: "rgba(255,255,255,.01)" }}>
        <AnimSection style={{ marginBottom: 48, textAlign: "center" }}>
          <span className="section-label" style={{ display: "block" }}>Multi-Channel Delivery</span>
          <h2 className="section-title" style={{ textAlign: "center" }}>Reach your team everywhere</h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>OpsAura delivers incident notifications across every channel your team uses — with per-severity configuration, delivery receipts, and fallback routing.</p>
        </AnimSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
          {CHANNELS.map((c, i) => (
            <AnimSection key={i}>
              <div className="hover-card" style={{ ...S.card, padding: "24px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{c.desc}</div>
                </div>
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* ── INTEGRATIONS ────────────────────────────────────────────────── */}
      <section id="integrations" style={{ padding: "80px 5vw" }}>
        <AnimSection style={{ marginBottom: 40, textAlign: "center" }}>
          <span className="section-label" style={{ display: "block" }}>Integrations</span>
          <h2 className="section-title" style={{ textAlign: "center" }}>200+ integrations out of the box</h2>
          <p className="section-sub" style={{ margin: "0 auto 32px" }}>Connect to your entire monitoring, observability, and ITSM stack in minutes. Every integration is maintained and tested by the OpsAura team.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {Object.keys(INTEGRATIONS).map(tab => (
              <button
                key={tab}
                className="tab-btn"
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? "rgba(99,102,241,.2)" : "rgba(255,255,255,.04)",
                  color: activeTab === tab ? "#a5b4fc" : "#64748b",
                  borderColor: activeTab === tab ? "rgba(99,102,241,.4)" : "rgba(255,255,255,.08)",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </AnimSection>
        <AnimSection>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {(INTEGRATIONS as Record<string, string[]>)[activeTab].map(tool => (
              <span key={tool} className="chip">{tool}</span>
            ))}
          </div>
        </AnimSection>
      </section>

      {/* ── SECURITY & COMPLIANCE ───────────────────────────────────────── */}
      <section style={{ padding: "80px 5vw", background: "rgba(255,255,255,.01)" }}>
        <AnimSection style={{ marginBottom: 48 }}>
          <span className="section-label">Security & Compliance</span>
          <h2 className="section-title">Enterprise-grade security,<br />out of the box</h2>
          <p className="section-sub">OpsAura is built for enterprise security requirements. Every feature is designed with data protection, auditability, and compliance in mind — from day one.</p>
        </AnimSection>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
          <AnimSection>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              {["SOC 2 Type II", "GDPR Compliant", "ISO 27001", "HIPAA Ready"].map(badge => (
                <div key={badge} className="hover-card" style={{ ...S.card, padding: "20px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🛡️</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc" }}>{badge}</div>
                </div>
              ))}
            </div>
          </AnimSection>
          <AnimSection>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {SECURITY_FEATURES.map((f, i) => (
                <div key={i} className="check-item">
                  <span className="check-icon">🔒</span>
                  <span style={{ fontSize: 13 }}>{f}</span>
                </div>
              ))}
            </div>
          </AnimSection>
        </div>
      </section>

      {/* ── METRICS DASHBOARD ───────────────────────────────────────────── */}
      <section style={{ padding: "80px 5vw" }}>
        <AnimSection style={{ marginBottom: 48, textAlign: "center" }}>
          <span className="section-label" style={{ display: "block" }}>Observability</span>
          <h2 className="section-title" style={{ textAlign: "center" }}>Real-time visibility<br />into your operations</h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>Track MTTA, MTTR, alert volume, team performance, and on-call load — all in a single configurable dashboard your entire leadership team can access.</p>
        </AnimSection>
        <AnimSection>
          <div style={{ ...S.card, padding: "28px 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
              {[
                { label: "MTTA (7d avg)", value: "1m 42s", delta: "↓ 18s", pos: true },
                { label: "MTTR (7d avg)", value: "23m 11s", delta: "↓ 4m", pos: true },
                { label: "Open Incidents", value: "2", delta: "↑ 1", pos: false },
                { label: "Alerts This Week", value: "1,284", delta: "↓ 12%", pos: true },
              ].map((m, i) => (
                <div key={i} style={{ padding: "16px", background: "rgba(255,255,255,.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,.06)" }}>
                  <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: -1, marginBottom: 4 }}>{m.value}</div>
                  <div style={{ fontSize: 12, color: m.pos ? "#10b981" : "#ef4444" }}>{m.delta} vs last week</div>
                </div>
              ))}
            </div>
            {/* Fake bar chart */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#475569", fontWeight: 600, letterSpacing: 1, marginBottom: 12 }}>INCIDENT VOLUME · LAST 14 DAYS</div>
              <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 80 }}>
                {[40, 28, 55, 38, 62, 44, 30, 72, 48, 36, 58, 42, 66, 35].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, background: "linear-gradient(180deg,#6366f1,#8b5cf6)", borderRadius: "3px 3px 0 0", opacity: 0.7 + (i / 28) }} />
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { name: "Sarah K.", pages: 14, ack: "45s" },
                { name: "Alex M.", pages: 11, ack: "1m 12s" },
                { name: "Jordan L.", pages: 9, ack: "2m 04s" },
              ].map((eng, i) => (
                <div key={i} style={{ padding: "12px 14px", background: "rgba(255,255,255,.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,.05)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>{eng.name}</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>{eng.pages} pages · avg ack {eng.ack}</div>
                </div>
              ))}
            </div>
          </div>
        </AnimSection>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 5vw", background: "rgba(255,255,255,.01)" }}>
        <AnimSection style={{ marginBottom: 48, textAlign: "center" }}>
          <span className="section-label" style={{ display: "block" }}>Customer Stories</span>
          <h2 className="section-title" style={{ textAlign: "center" }}>Loved by engineering<br />teams worldwide</h2>
        </AnimSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <AnimSection key={i}>
              <div className="hover-card" style={{ ...S.card, padding: "28px 24px", height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 32, color: "#6366f1", marginBottom: 16, lineHeight: 1 }}>"</div>
                <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.75, flex: 1, marginBottom: 20, fontStyle: "italic" }}>{t.quote}</p>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `hsl(${i * 80 + 220},60%,55%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{t.role} · {t.company}</div>
                  </div>
                </div>
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: "80px 5vw" }}>
        <AnimSection style={{ marginBottom: 56, textAlign: "center" }}>
          <span className="section-label" style={{ display: "block" }}>Pricing</span>
          <h2 className="section-title" style={{ textAlign: "center" }}>Simple, transparent pricing</h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>All plans include a 14-day free trial. No credit card required. Cancel anytime.</p>
        </AnimSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24, alignItems: "start" }}>
          {PRICING.map((p, i) => (
            <AnimSection key={i}>
              <div className="hover-card" style={{
                ...S.card,
                padding: "36px 28px",
                position: "relative",
                border: p.popular ? `1px solid rgba(139,92,246,.4)` : "1px solid rgba(255,255,255,.07)",
              }}>
                {p.popular && (
                  <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 16px", borderRadius: 20, letterSpacing: 1, whiteSpace: "nowrap" }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>{p.name}</h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
                    <span style={{ fontSize: 38, fontWeight: 900, color: "#fff", letterSpacing: -2 }}>{p.price}</span>
                    <span style={{ fontSize: 14, color: "#64748b" }}>{p.unit}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{p.desc}</p>
                </div>
                <Link href="/login" className="btn-primary" style={{ display: "block", textAlign: "center", marginBottom: 28, background: p.popular ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,.08)", border: p.popular ? "none" : "1px solid rgba(255,255,255,.12)" }}>
                  {p.cta}
                </Link>
                <div>
                  {p.features.map((f, j) => (
                    <div key={j} className="check-item">
                      <span className="check-icon">✓</span>
                      <span style={{ fontSize: 13 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 5vw", background: "rgba(255,255,255,.01)" }}>
        <AnimSection style={{ marginBottom: 48, textAlign: "center" }}>
          <span className="section-label" style={{ display: "block" }}>FAQ</span>
          <h2 className="section-title" style={{ textAlign: "center" }}>Common questions</h2>
        </AnimSection>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((faq, i) => (
            <AnimSection key={i}>
              <div
                className="hover-card"
                style={{ ...S.card, overflow: "hidden", cursor: "pointer" }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#e2e8f0" }}>{faq.q}</span>
                  <span style={{ color: "#6366f1", fontSize: 18, transition: "transform .2s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
                </div>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 20px", fontSize: 14, color: "#64748b", lineHeight: 1.75 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 5vw", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center,rgba(99,102,241,.1) 0%,transparent 70%)", pointerEvents: "none" }} />
        <AnimSection style={{ position: "relative" }}>
          <span className="section-label" style={{ display: "block" }}>Get Started Today</span>
          <h2 className="section-title" style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 16px" }}>
            Start resolving incidents<br /><span className="grad-text">faster today</span>
          </h2>
          <p className="section-sub" style={{ textAlign: "center", margin: "0 auto 40px" }}>
            Join thousands of engineers who've transformed their incident response. 14-day free trial, no credit card required.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/login" className="btn-primary" style={{ fontSize: 17, padding: "16px 40px" }}>Start free trial →</Link>
            <a href="#" className="btn-secondary" style={{ fontSize: 17, padding: "16px 40px" }}>Book a demo</a>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "#334155" }}>No credit card · 14-day trial · Cancel anytime</p>
        </AnimSection>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ padding: "64px 5vw 40px", borderTop: "1px solid rgba(255,255,255,.06)", background: "rgba(255,255,255,.01)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <span style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>OpsAura</span>
            </div>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, maxWidth: 280, marginBottom: 20 }}>
              Enterprise incident response platform for modern engineering teams. Faster resolution, smarter on-call, better postmortems.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {["𝕏", "in", "gh", "yt"].map(s => (
                <a key={s} href="#" style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#64748b", textDecoration: "none", transition: "background .2s" }}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          {[
            { title: "Product", links: ["Features", "Integrations", "Pricing", "Changelog", "Roadmap", "Status Page"] },
            { title: "Company", links: ["About Us", "Blog", "Careers", "Press", "Partners", "Contact"] },
            { title: "Resources", links: ["Documentation", "API Reference", "Guides", "Community", "Webinars", "Support"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Security", "Cookie Policy", "DPA", "SLA"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#334155", marginBottom: 16 }}>{col.title}</div>
              {col.links.map(l => (
                <a key={l} href="#" style={{ display: "block", fontSize: 13, color: "#475569", textDecoration: "none", marginBottom: 10, transition: "color .2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#475569")}
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.05)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#334155" }}>© 2026 OpsAura, Inc. All rights reserved.</span>
          <span style={{ fontSize: 13, color: "#334155" }}>Made with ♥ for on-call engineers everywhere</span>
        </div>
      </footer>
    </div>
  )
}
