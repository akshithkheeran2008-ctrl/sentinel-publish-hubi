import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Anchor,
  ArrowRight,
  Bot,
  Camera,
  CheckCircle2,
  ChevronRight,
  Compass,
  Download,
  Fish,
  Leaf,
  LifeBuoy,
  MapPin,
  Radio,
  Sailboat,
  Satellite,
  Send,
  ShieldAlert,
  Sparkles,
  Thermometer,
  Users,
  Waves,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ORCA — Ocean Intelligence Mesh for India's Coastline" },
      {
        name: "description",
        content:
          "ORCA connects satellite observations, marine ecosystems, local knowledge, and action — so India's coastline can respond with clarity.",
      },
      { property: "og:title", content: "ORCA — Ocean Intelligence Mesh" },
      {
        property: "og:description",
        content:
          "See the coast before it changes. Live coastal alerts, safe fishing zones, citizen reports and explainable AI risk reasoning for India's shore.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ------------------------------ demo data ------------------------------ */

type Region = {
  name: string;
  risk: "Safe" | "Moderate" | "High Risk" | "Critical";
  band: string;
  health: number;
  seaTemp: string;
  wave: string;
  weather: string;
  action: string;
  reports: string[];
  summary: string;
};

const REGIONS: Region[] = [
  {
    name: "Gulf of Mannar",
    risk: "High Risk",
    band: "Orange",
    health: 48,
    seaTemp: "30.4°C",
    wave: "2.4m",
    weather: "Humid / SST Anomaly",
    action: "Issue coral bleaching advisory & alert conservation squad.",
    reports: ["3 fish mortality reports", "Coral bleaching observed"],
    summary:
      "Signal blend from simulated satellite passes and community observations.",
  },
  {
    name: "Odisha Coast",
    risk: "Critical",
    band: "Red",
    health: 31,
    seaTemp: "29.1°C",
    wave: "4.8m",
    weather: "Cyclonic depression",
    action: "Issue no-sail order and open cyclone shelters in Kendrapara.",
    reports: ["Cyclone watch active", "Storm surge expected"],
    summary:
      "Cyclonic depression tracking north-west with high-wave energy along the shore.",
  },
  {
    name: "Mumbai Coast",
    risk: "Moderate",
    band: "Yellow",
    health: 66,
    seaTemp: "28.7°C",
    wave: "1.6m",
    weather: "Overcast / Slick report",
    action: "Dispatch verification team for the reported surface slick.",
    reports: ["Plastic waste logged", "Possible oil slick"],
    summary:
      "Citizen reports matched to a dark surface slick near Sewri mudflats.",
  },
  {
    name: "Lakshadweep Reefs",
    risk: "Safe",
    band: "Green",
    health: 84,
    seaTemp: "28.2°C",
    wave: "0.9m",
    weather: "Clear / Light wind",
    action: "Routine reef survey. No intervention required.",
    reports: ["Reef survey nominal"],
    summary:
      "Stable reef signal with healthy chlorophyll and temperature baselines.",
  },
];

const DISTRICTS = [
  { name: "Tuticorin, Tamil Nadu", verdict: "Do Not Sail", note: "High wave energy and wind create unsafe conditions for small craft.", wave: "2.4m", wind: "28 km/h", window: "06:00–09:30", pfz: "Confirmed" },
  { name: "Kendrapara, Odisha", verdict: "Do Not Sail", note: "Cyclonic depression approaching. Harbour return mandatory.", wave: "4.8m", wind: "46 km/h", window: "None today", pfz: "Suspended" },
  { name: "Alappuzha, Kerala", verdict: "Sail With Caution", note: "Moderate swell. Stay within 8 nautical miles of shore.", wave: "1.7m", wind: "19 km/h", window: "05:30–11:00", pfz: "Confirmed" },
  { name: "Veraval, Gujarat", verdict: "Safe To Sail", note: "Calm seas with a confirmed fishing zone south-west of harbour.", wave: "0.8m", wind: "12 km/h", window: "04:30–12:00", pfz: "Confirmed" },
];

const ALERTS = [
  {
    level: "Critical",
    state: "Active",
    title: "Cyclone & high-wave warning",
    place: "Odisha Coast · Kendrapara",
    cause: "Cyclonic depression moving north-west",
    response: "Do not sail. Follow district disaster authority instructions.",
  },
  {
    level: "High",
    state: "Monitoring",
    title: "Coral bleaching risk",
    place: "Gulf of Mannar · Tuticorin",
    cause: "Sea surface temperature +2.1°C above normal",
    response: "Inspect local water quality and pause reef-adjacent activity.",
  },
  {
    level: "Moderate",
    state: "Monitoring",
    title: "Possible oil pollution",
    place: "Mumbai Coast · Sewri",
    cause: "Citizen report matched to a dark surface slick",
    response: "Dispatch a verification team and contain shoreline spread.",
  },
];

const MODULES = [
  { n: "01", tag: "OBSERVATION LAYERS", title: "Satellite Ocean View", desc: "Read the sea through temperature, colour, chlorophyll, rain and wave signals.", icon: Satellite },
  { n: "02", tag: "LIVING SYSTEMS", title: "Ecosystem Health", desc: "See how reefs, mangroves, fish habitats and beaches are holding up.", icon: Leaf },
  { n: "03", tag: "RISK OPERATIONS", title: "Coastal Alert Centre", desc: "Move from early warning to a clear, human response plan.", icon: AlertTriangle },
  { n: "04", tag: "SEA-READY GUIDANCE", title: "Fisherman Support", desc: "Find safer routes, fishing windows and a clear no-sail signal.", icon: Sailboat },
  { n: "05", tag: "COMMUNITY SIGNAL", title: "Citizen Reports", desc: "Turn a shoreline observation into a traceable response workflow.", icon: Camera },
  { n: "06", tag: "EXPLAINABLE INTELLIGENCE", title: "ORCA AI Reasoning Engine", desc: "Understand why a risk is rising and what teams should do next.", icon: Bot },
];

const ROLES = [
  { title: "Fishermen", desc: "Receive safety and fishing-zone guidance.", icon: Sailboat },
  { title: "Citizens", desc: "Report pollution or injured animals.", icon: Camera },
  { title: "Researchers", desc: "Validate ecosystem observations.", icon: Activity },
  { title: "NGOs", desc: "Organize cleanup actions.", icon: Users },
  { title: "Authorities", desc: "Monitor high-risk zones.", icon: ShieldAlert },
];

const NAV = [
  ["Home", "#home"],
  ["Ocean Map", "#map"],
  ["Alerts", "#alerts"],
  ["Fisherman Support", "#fisherman"],
  ["Citizen Reports", "#reports"],
  ["AI Assistant", "#ai"],
  ["Collaboration Hub", "#hub"],
] as const;

/* --------------------------- small ui pieces ---------------------------- */

function SectionHeading({
  index,
  tag,
  title,
  desc,
}: {
  index: string;
  tag: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="text-xs font-semibold tracking-mega text-primary">
        {index} · {tag}
      </p>
      <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-3 text-muted-foreground">{desc}</p>
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    Critical: "border-critical/50 text-critical",
    High: "border-warning/60 text-warning",
    "High Risk": "border-warning/60 text-warning",
    Moderate: "border-warning/40 text-warning",
    Safe: "border-safe/50 text-safe",
  };
  return (
    <Badge variant="outline" className={`rounded-full ${styles[level] ?? ""}`}>
      {level}
    </Badge>
  );
}

function StatTile({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Wind;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-3 font-display text-xl font-semibold text-foreground">
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

/* --------------------------------- page --------------------------------- */

function Index() {
  const [region, setRegion] = useState<Region>(REGIONS[0]!);
  const [district, setDistrict] = useState(DISTRICTS[0]!);
  const [saved, setSaved] = useState(0);
  const [reportId, setReportId] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const healthTone = useMemo(() => {
    if (region.health >= 75) return "text-safe";
    if (region.health >= 55) return "text-warning";
    return "text-critical";
  }, [region]);

  return (
    <div className="min-h-screen bg-background">
      {/* ------------------------------ header ------------------------------ */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
          <a href="#home" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/40 bg-secondary">
              <Waves className="h-5 w-5 text-primary" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold tracking-wide">
                ORCA
              </span>
              <span className="block text-[9px] font-medium tracking-[0.3em] text-muted-foreground">
                OCEAN INTELLIGENCE MESH
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
            {NAV.map(([label, href]) => (
              <a key={href} href={href} className="transition-colors hover:text-primary">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="hidden gap-2 rounded-full border-safe/40 px-3 py-1 text-safe sm:flex"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-safe" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-safe" />
              </span>
              Simulation live
            </Badge>
            <Button variant="outline" size="sm" className="rounded-full">
              Sign in with Google
            </Button>
          </div>
        </div>
      </header>

      {/* ------------------------------- hero ------------------------------- */}
      <section id="home" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_10%,oklch(0.35_0.08_220/45%),transparent)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_1fr] lg:py-28">
          <div>
            <Badge
              variant="outline"
              className="gap-2 rounded-full border-primary/40 px-4 py-1.5 text-[11px] tracking-[0.25em] text-primary"
            >
              <Radio className="h-3.5 w-3.5" />
              MISSION CONSOLE · INDIA COASTAL WATCH
            </Badge>
            <h1 className="mt-8 font-display text-6xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
              See the coast
              <br />
              <span className="text-primary">before it changes.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              ORCA connects satellite observations, marine ecosystems, local
              knowledge, and action — so India's coastline can respond with
              clarity.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="gap-2 rounded-lg glow-signal" asChild>
                <a href="#map">
                  Explore My Coast <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 rounded-lg" asChild>
                <a href="#alerts">
                  View live alerts <AlertTriangle className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                INSAT-inspired signal fusion
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-safe" />
                Decision support for people
              </span>
            </div>
          </div>

          {/* operations card */}
          <div className="self-center rounded-2xl border border-border bg-card/80 p-6 backdrop-blur">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.25em] text-primary">
                  COASTAL OPERATIONS
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold">
                  Good morning, India.
                </h3>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-safe/40 bg-safe/10">
                <Activity className="h-5 w-5 text-safe" />
              </span>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Network readiness</span>
                <span className="font-medium text-primary">92%</span>
              </div>
              <Progress value={92} className="mt-2 h-2 bg-secondary [&>div]:bg-primary" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <StatTile icon={Thermometer} value="+2.1°C" label="SST anomaly" />
              <StatTile icon={Wind} value="18 km/h" label="Mean coastal wind" />
            </div>
            <div className="mt-5 flex justify-between border-t border-border pt-4 text-xs text-muted-foreground">
              <span>Last simulation sync</span>
              <span className="font-medium tracking-widest text-foreground">
                08 MAR · 09:42 IST
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ stats ------------------------------- */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "ACTIVE COASTAL ALERTS", value: "2", icon: AlertTriangle, tone: "text-warning" },
            { label: "SAFE FISHING ZONES", value: "18", icon: Compass, tone: "text-safe" },
            { label: "CITIZEN REPORTS", value: "41", icon: Camera, tone: "text-safe" },
            { label: "ECOSYSTEM HEALTH SCORE", value: "72/100", icon: Leaf, tone: "text-safe" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-start justify-between rounded-2xl border border-border bg-card p-5"
            >
              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>
                <p className={`mt-1 flex items-center gap-1.5 text-xs ${s.tone}`}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Demo signal stable
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary">
                <s.icon className="h-5 w-5 text-primary" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------- 01 · ocean map -------------------------- */}
      <section id="map" className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading
          index="01"
          tag="COASTAL INTELLIGENCE"
          title="A living map of India's shore"
          desc="Select a coastal region to open its current health signal, marine conditions, and a recommended next move."
        />
        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          {/* stylised map */}
          <div className="bg-grid-ocean relative min-h-[420px] overflow-hidden rounded-2xl border border-border bg-abyss">
            <svg viewBox="0 0 520 480" className="absolute inset-0 h-full w-full" aria-hidden>
              {/* india coastline silhouette */}
              <path
                d="M150 60 L210 90 L235 140 L260 170 L250 220 L275 260 L255 320 L225 380 L205 430 L190 400 L175 340 L160 280 L140 230 L120 180 L110 130 Z"
                fill="oklch(0.30 0.06 235 / 55%)"
                stroke="oklch(0.86 0.14 200 / 45%)"
                strokeWidth="1.5"
              />
              <path
                d="M255 320 Q300 340 330 300"
                fill="none"
                stroke="oklch(0.86 0.14 200 / 35%)"
                strokeDasharray="4 6"
              />
              <circle cx="300" cy="420" r="26" fill="none" stroke="oklch(0.86 0.14 200 / 30%)" strokeDasharray="3 5" />
            </svg>
            {[
              { top: "72%", left: "62%", tone: "bg-safe", label: "Lakshadweep" },
              { top: "58%", left: "66%", tone: "bg-critical", label: "Gulf of Mannar" },
              { top: "30%", left: "46%", tone: "bg-warning", label: "Mumbai Coast" },
              { top: "38%", left: "72%", tone: "bg-warning", label: "Odisha Coast" },
            ].map((m) => (
              <button
                key={m.label}
                onClick={() => {
                  const key = m.label.split(" ")[0] ?? m.label;
                  const found = REGIONS.find((r) => r.name.startsWith(key));
                  if (found) setRegion(found);
                }}

                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ top: m.top, left: m.left }}
                aria-label={m.label}
              >
                <span className={`absolute inset-0 animate-ping-slow rounded-full ${m.tone} opacity-60`} />
                <span className={`relative block h-4 w-4 rounded-full border-2 border-background ${m.tone}`} />
                <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-[10px] text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  {m.label}
                </span>
              </button>
            ))}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-4 rounded-lg border border-border bg-card/80 px-4 py-2 text-[11px] text-muted-foreground backdrop-blur">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-safe" /> Safe</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> Moderate</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-critical" /> High</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-critical" /> Critical</span>
            </div>
          </div>

          {/* regional dashboard */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start justify-between">
              <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] text-primary">
                <MapPin className="h-3.5 w-3.5" /> REGIONAL DASHBOARD
              </p>
              <RiskBadge level={region.risk} />
            </div>
            <h3 className="mt-3 font-display text-3xl font-bold">{region.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{region.summary}</p>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.25em] text-muted-foreground">
                  ECOSYSTEM HEALTH
                </p>
                <p className={`mt-1 font-display text-5xl font-bold ${healthTone}`}>
                  {region.health}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </p>
              </div>
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/40 text-sm font-semibold text-primary">
                {region.band}
              </span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <StatTile icon={Thermometer} value={region.seaTemp} label="Sea temp" />
              <StatTile icon={Waves} value={region.wave} label="Wave height" />
              <StatTile icon={Wind} value={region.weather} label="Weather" />
            </div>
            <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-4">
              <p className="text-[11px] font-semibold tracking-[0.25em] text-muted-foreground">
                RECOMMENDED ACTION
              </p>
              <p className="mt-2 text-sm">{region.action}</p>
            </div>
            <div className="mt-5">
              <p className="text-[11px] font-semibold tracking-[0.25em] text-muted-foreground">
                RECENT CITIZEN REPORTS
              </p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {region.reports.map((r) => (
                  <li key={r} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* region quick-list */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {REGIONS.map((r) => (
            <button
              key={r.name}
              onClick={() => setRegion(r)}
              className={`flex items-center justify-between rounded-xl border p-4 text-left transition-colors ${
                region.name === r.name
                  ? "border-primary/60 bg-accent"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div>
                <p className="font-medium">{r.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {r.summary.split(".")[0]!.slice(0, 42)}…
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>

      {/* ------------------------- 02 · mission modules ------------------------ */}
      <section className="border-t border-border bg-abyss/60">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHeading
            index="02"
            tag="MISSION MODULES"
            title="One signal. Many ways to act."
            desc="Open any console to move from raw observation to a clear decision. Every module is built for a different coastal role."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m) => (
              <div
                key={m.n}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-secondary">
                    <m.icon className="h-5 w-5 text-primary" />
                  </span>
                  <span className="text-xs text-muted-foreground">{m.n}</span>
                </div>
                <p className="mt-5 text-[10px] font-semibold tracking-[0.25em] text-primary">
                  {m.tag}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold">{m.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{m.desc}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    Open console <ArrowRight className="h-4 w-4" />
                  </span>
                  <span className="text-xs text-muted-foreground">Full view</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------- 03 · alerts ---------------------------- */}
      <section id="alerts" className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading
          index="03"
          tag="COASTAL ALERT CENTRE"
          title="Warnings with a response attached"
          desc="ORCA does not stop at a red dot. Every alert includes cause, location, timing, and the next practical action."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {ALERTS.map((a) => (
            <div key={a.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <RiskBadge level={a.level} />
                <span className="flex items-center gap-1.5 text-xs text-primary">
                  <Radio className="h-3.5 w-3.5" /> {a.state}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{a.title}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {a.place}
              </p>
              <p className="mt-4 text-sm">{a.cause}</p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-[10px] font-semibold tracking-[0.25em] text-primary">
                  SUGGESTED RESPONSE
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{a.response}</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-8 gap-2 rounded-lg">
          Open full alert centre <ArrowRight className="h-4 w-4" />
        </Button>
      </section>

      {/* ------------------------ 04 · fisherman support ----------------------- */}
      <section id="fisherman" className="border-t border-border bg-abyss/60">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHeading
            index="04"
            tag="FISHERMAN SUPPORT"
            title="A safer answer before you sail"
            desc="Choose a coastal district and get a simple, visual sea-condition brief for the next trip."
          />
          <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] text-primary">
                <LifeBuoy className="h-4 w-4" /> DISTRICT ADVISORY
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold">
                Where are you sailing from?
              </h3>
              <label className="mt-5 block text-sm text-muted-foreground">
                Coastal district
              </label>
              <Select
                value={district.name}
                onValueChange={(v) =>
                  setDistrict(DISTRICTS.find((d) => d.name === v) ?? DISTRICTS[0]!)
                }
              >
                <SelectTrigger className="mt-2 w-full rounded-lg bg-secondary/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map((d) => (
                    <SelectItem key={d.name} value={d.name}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div
                className={`mt-4 flex items-start gap-3 rounded-xl border p-4 ${
                  district.verdict === "Do Not Sail"
                    ? "border-critical/50 bg-critical/10"
                    : district.verdict === "Safe To Sail"
                      ? "border-safe/40 bg-safe/10"
                      : "border-warning/40 bg-warning/10"
                }`}
              >
                <AlertTriangle
                  className={`mt-0.5 h-5 w-5 ${
                    district.verdict === "Do Not Sail"
                      ? "text-critical"
                      : district.verdict === "Safe To Sail"
                        ? "text-safe"
                        : "text-warning"
                  }`}
                />
                <div>
                  <p className="font-semibold">{district.verdict}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{district.note}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ["Wave height", district.wave],
                  ["Wind speed", district.wind],
                  ["Fishing window", district.window],
                  ["PFZ signal", district.pfz],
                ].map(([l, v]) => (
                  <div key={l} className="rounded-xl border border-border bg-secondary/40 p-3.5">
                    <p className="text-xs text-muted-foreground">{l}</p>
                    <p className="mt-1 font-display text-lg font-semibold">{v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  className="gap-2 rounded-lg"
                  onClick={() => setSaved((s) => s + 1)}
                >
                  <Download className="h-4 w-4" /> Save offline
                </Button>
                <Button variant="outline" className="gap-2 rounded-lg">
                  Download PDF
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                LOW-CONNECTIVITY KIT · Saved offline advisories ·{" "}
                <span className="text-foreground">{saved} saved</span> — saved
                briefs stay available in this browser.
              </p>
            </div>

            {/* route map */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold">Safe route map</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Potential fishing zone and return route · simulated telemetry
                  </p>
                </div>
                <Badge variant="outline" className="rounded-full text-primary">
                  8.82°N · 78.12°E
                </Badge>
              </div>
              <div className="relative mt-5 overflow-hidden rounded-xl border border-border bg-abyss">
                <svg viewBox="0 0 640 360" className="h-auto w-full" aria-hidden>
                  <defs>
                    <pattern id="net" width="48" height="48" patternUnits="userSpaceOnUse">
                      <path d="M0 48 L48 0" stroke="oklch(0.32 0.04 245 / 25%)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="640" height="360" fill="url(#net)" />
                  <path
                    d="M90 290 C 200 250, 260 160, 360 170 S 520 120, 560 90"
                    fill="none"
                    stroke="oklch(0.86 0.14 200)"
                    strokeWidth="3"
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 330 Q 120 300 200 360 L 0 360 Z"
                    fill="oklch(0.30 0.05 235 / 60%)"
                  />
                  <circle cx="90" cy="290" r="7" fill="oklch(0.94 0.015 225)" />
                  <circle cx="560" cy="90" r="9" fill="oklch(0.78 0.15 165)" />
                  <circle cx="560" cy="90" r="18" fill="none" stroke="oklch(0.78 0.15 165 / 50%)" />
                </svg>
                <span className="absolute left-[12%] top-[76%] text-xs text-muted-foreground">
                  Harbour
                </span>
                <span className="absolute right-[6%] top-[18%] flex items-center gap-2 rounded-full border border-safe/40 bg-card/80 px-3 py-1 text-xs text-safe">
                  <Fish className="h-3.5 w-3.5" /> PFZ · ACTIVE
                </span>
                <span className="absolute left-[8%] top-[12%] flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary">
                  <Anchor className="h-4 w-4 text-muted-foreground" />
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Recommended route
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-safe" /> Fishing zone
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground" /> Shoreline
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------- 05 · citizen reports ------------------------ */}
      <section id="reports" className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading
          index="05"
          tag="CITIZEN REPORTS"
          title="Your observation is a coastal sensor"
          desc="Upload a local photo, describe what you see, and let the demo workflow route it to the right response team."
        />
        <div className="grid gap-10 lg:grid-cols-2">
          <ol className="space-y-6">
            {[
              "Share the location and signal type.",
              "ORCA AI classifies urgency using simulated reasoning.",
              "Response teams receive a traceable report ID.",
            ].map((step, i) => (
              <li key={step} className="flex gap-5">
                <span className="font-display text-lg font-bold text-primary">
                  0{i + 1}
                </span>
                <p className="pt-0.5 text-muted-foreground">{step}</p>
              </li>
            ))}
          </ol>

          <form
            className="rounded-2xl border border-border bg-card p-6"
            onSubmit={(e) => {
              e.preventDefault();
              setReportId(
                `ORCA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
              );
            }}
          >
            <h3 className="font-display text-xl font-semibold">Create a field report</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Demo submission · local image preview only
            </p>
            {reportId && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-safe/40 bg-safe/10 p-3 text-sm text-safe">
                <CheckCircle2 className="h-4 w-4" />
                Report submitted. Tracking ID: <span className="font-semibold">{reportId}</span>
              </div>
            )}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-muted-foreground">Location</label>
                <Select defaultValue="Gulf of Mannar">
                  <SelectTrigger className="mt-1.5 w-full rounded-lg bg-secondary/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((r) => (
                      <SelectItem key={r.name} value={r.name}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Issue type</label>
                <Select defaultValue="Plastic Waste">
                  <SelectTrigger className="mt-1.5 w-full rounded-lg bg-secondary/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Plastic Waste", "Oil Slick", "Fish Mortality", "Coral Bleaching", "Injured Animal", "Other"].map(
                      (t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm text-muted-foreground">Date</label>
              <Input type="date" className="mt-1.5 rounded-lg bg-secondary/60" />
            </div>
            <div className="mt-4">
              <label className="text-sm text-muted-foreground">Description</label>
              <Textarea
                rows={3}
                placeholder="Describe what you saw on the shoreline…"
                className="mt-1.5 rounded-lg bg-secondary/60"
              />
            </div>
            <div className="mt-4">
              <label className="text-sm text-muted-foreground">
                Upload image <span className="text-xs">(optional, local preview)</span>
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageName(e.target.files?.[0]?.name ?? null)}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                <Camera className="h-4 w-4" />
                {imageName ?? "Choose a shoreline image"}
              </button>
            </div>
            <Button type="submit" className="mt-5 w-full gap-2 rounded-lg glow-signal">
              Submit citizen report <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>

      {/* ------------------------- 06 · reasoning engine ----------------------- */}
      <section id="ai" className="border-t border-border bg-abyss/60">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-2">
          <div>
            <SectionHeading
              index="06"
              tag="REASONING ENGINE"
              title="Not just a warning. A why."
              desc="ORCA turns a noisy ocean signal into an explanation people can trust and teams can act on."
            />
            <div className="flex max-w-md flex-wrap gap-3">
              {["Ask About a Region", "Ecosystem Risk Analysis", "Recommended Action", "Emergency Contact"].map(
                (c) => (
                  <Button key={c} variant="outline" className="rounded-full" size="sm">
                    {c}
                  </Button>
                ),
              )}
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-secondary">
                  <Bot className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="font-display font-semibold">Gulf of Mannar</p>
                  <p className="text-xs text-muted-foreground">
                    Explainable risk synthesis · 09:42 IST
                  </p>
                </div>
              </div>
              <span className="text-sm text-warning">High risk</span>
            </div>
            <div className="space-y-5 p-6">
              {[
                { n: "01", icon: Thermometer, title: "Observation", text: "Sea surface temperature is 2.1°C above the seasonal baseline." },
                { n: "02", icon: Fish, title: "Ecosystem signal", text: "Coral health is declining, increasing local bleaching probability." },
                { n: "03", icon: Users, title: "Community evidence", text: "Three citizen reports indicate fish deaths near the coast." },
              ].map((s) => (
                <div key={s.n} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-secondary">
                    <s.icon className="h-4 w-4 text-primary" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      <span className="mr-2 text-xs text-muted-foreground">{s.n}</span>
                      {s.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                  </div>
                </div>
              ))}
              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <p className="text-[10px] font-semibold tracking-[0.25em] text-primary">
                  RECOMMENDED ACTION
                </p>
                <p className="mt-2 text-sm">
                  Issue an advisory for fishermen, inspect local water quality, and
                  alert marine conservation teams.
                </p>
              </div>
              <Button variant="secondary" className="gap-2 rounded-lg">
                Ask ORCA about this region <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------- 07 · collaboration hub ---------------------- */}
      <section id="hub" className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading
          index="07"
          tag="COLLABORATION HUB"
          title="A coastline is safer together"
          desc="ORCA creates a shared operational language across the people who see, study, protect, and govern the shore."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ROLES.map((r) => (
            <div key={r.title} className="rounded-2xl border border-border bg-card p-5">
              <r.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-display text-lg font-semibold">{r.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.25em] text-primary">
                SIGNAL TO ACTION
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold">Report workflow</h3>
            </div>
            <p className="text-[11px] tracking-[0.25em] text-muted-foreground">
              DEMO PROTOCOL · 5 STEPS
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {["Reported", "AI Analyzed", "Verified", "Action Started", "Resolved"].map(
              (s, i) => (
                <div
                  key={s}
                  className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-display text-sm font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">{s}</span>
                  {i < 4 && (
                    <ChevronRight className="ml-auto hidden h-4 w-4 text-muted-foreground lg:block" />
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* -------------------------------- footer ------------------------------ */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 font-display text-lg font-bold">
              <Waves className="h-5 w-5 text-primary" /> ORCA
            </p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Prototype using simulated data for hackathon demonstration. This is
              not an official ISRO platform.
            </p>
          </div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Built for India's blue future
          </p>
        </div>
      </footer>
    </div>
  );
}
