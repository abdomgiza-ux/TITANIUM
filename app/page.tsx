"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Building2,
  Camera,
  CheckCircle2,
  CircuitBoard,
  CloudCog,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Fingerprint,
  Globe2,
  Headphones,
  Instagram,
  Linkedin,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  MousePointer2,
  Network,
  Phone,
  Radio,
  Router,
  Send,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Workflow,
  Wrench,
  Zap
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Service = {
  title: string;
  text: string;
  icon: LucideIcon;
  metric: string;
};

type Project = {
  name: string;
  type: string;
  desc: string;
  image: string;
  tags: string[];
  stack: string[];
  icon: LucideIcon;
};

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  website: string;
};

type ToastState = {
  type: "success" | "error";
  title: string;
  message: string;
} | null;

const heroVideo =
  "https://cdn.pixabay.com/video/2018/03/09/14900-259623335_tiny.mp4";
const heroPoster =
  "https://cdn.pixabay.com/video/2018/03/09/14900-259623335_tiny.jpg";

const imageUrls = {
  dataCenter:
    "https://images.pexels.com/photos/6466141/pexels-photo-6466141.jpeg?auto=compress&cs=tinysrgb&w=1600",
  serverBlue:
    "https://images.pexels.com/photos/17489150/pexels-photo-17489150.jpeg?auto=compress&cs=tinysrgb&w=1600",
  serverDetail:
    "https://images.pexels.com/photos/37605910/pexels-photo-37605910.jpeg?auto=compress&cs=tinysrgb&w=1600",
  networkSwitch:
    "https://images.pexels.com/photos/5050305/pexels-photo-5050305.jpeg?auto=compress&cs=tinysrgb&w=1600",
  fiber:
    "https://images.pexels.com/photos/4508748/pexels-photo-4508748.jpeg?auto=compress&cs=tinysrgb&w=1600",
  engineer:
    "https://images.pexels.com/photos/19226353/pexels-photo-19226353.jpeg?auto=compress&cs=tinysrgb&w=1600",
  securityDashboard:
    "https://images.unsplash.com/photo-1751448555253-f39c06e29d82?auto=format&fit=crop&q=80&w=1600",
  rackCloseup:
    "https://images.unsplash.com/photo-1507333199169-84fd735371fb?auto=format&fit=crop&q=80&w=1600"
};

const navItems = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" }
];

const services: Service[] = [
  {
    title: "IT Support Command",
    text: "Responsive endpoint, user, printer, software, and day-to-day technical support with clean escalation paths.",
    icon: Headphones,
    metric: "User continuity"
  },
  {
    title: "Network Architecture",
    text: "Router, switch, Wi-Fi, access point, cabling, segmentation, and secure office connectivity planning.",
    icon: Network,
    metric: "Stable traffic"
  },
  {
    title: "CCTV & Site Security",
    text: "Camera planning, recorder setup, remote access basics, and practical surveillance layouts for business spaces.",
    icon: Camera,
    metric: "Visible control"
  },
  {
    title: "Microsoft 365 Cloud",
    text: "Email, Teams, OneDrive, account security, migrations, policies, and productivity setup for growing teams.",
    icon: CloudCog,
    metric: "Cloud ready"
  },
  {
    title: "Web Presence Systems",
    text: "Premium websites, hosting guidance, domain setup, conversion flow, and launch-ready digital foundations.",
    icon: Code2,
    metric: "Launch flow"
  },
  {
    title: "Rapid Troubleshooting",
    text: "Focused diagnosis for Windows, apps, networks, hardware, email, connectivity, and workflow interruptions.",
    icon: Wrench,
    metric: "Fast clarity"
  },
  {
    title: "Office Infrastructure",
    text: "New office technology setup, workstations, rack readiness, access planning, device rollout, and documentation.",
    icon: Building2,
    metric: "Move-in ready"
  },
  {
    title: "Cyber & IT Consulting",
    text: "Practical guidance for security posture, upgrades, tools, backup planning, admin standards, and roadmaps.",
    icon: ShieldCheck,
    metric: "Risk aware"
  }
];

const stats = [
  { label: "Service domains", value: 8, suffix: "+", text: "Support, cloud, networks, CCTV, web, security, consulting, and setup." },
  { label: "Readiness checks", value: 24, suffix: "", text: "A structured review mindset for devices, access, network, backup, and security." },
  { label: "Response channels", value: 4, suffix: "", text: "WhatsApp, email, phone, and website intake for direct communication." },
  { label: "Dubai focus", value: 100, suffix: "%", text: "Built around practical needs for UAE individuals, startups, and small teams." }
];

const projects: Project[] = [
  {
    name: "Secure Office Network Core",
    type: "Networking",
    desc: "Structured router, switch, Wi-Fi, cabling, and endpoint planning for a modern office environment.",
    image: imageUrls.networkSwitch,
    tags: ["Network design", "Wi-Fi", "Switching"],
    stack: ["VLAN planning", "Access points", "Patch mapping"],
    icon: Router
  },
  {
    name: "Server Rack Modernization",
    type: "Infrastructure",
    desc: "Rack cleanup, documentation, server readiness, continuity planning, and visibility over critical equipment.",
    image: imageUrls.serverBlue,
    tags: ["Server room", "Continuity", "Documentation"],
    stack: ["Rack audit", "Backup review", "Asset list"],
    icon: Server
  },
  {
    name: "Cyber Monitoring Workspace",
    type: "Security",
    desc: "Security-focused endpoint and cloud review with alert hygiene, access basics, and practical guardrails.",
    image: imageUrls.securityDashboard,
    tags: ["Security", "Monitoring", "Hardening"],
    stack: ["M365 policies", "Endpoint review", "Access control"],
    icon: LockKeyhole
  },
  {
    name: "Fiber & Cabling Deployment",
    type: "Connectivity",
    desc: "Fiber patching, cable organization, network port mapping, and reliable connectivity for busy teams.",
    image: imageUrls.fiber,
    tags: ["Fiber", "Cabling", "Patch panels"],
    stack: ["Labeling", "Port map", "Signal checks"],
    icon: Workflow
  }
];

const timeline = [
  {
    title: "Discovery",
    text: "Understand the business workflow, pain points, existing equipment, and risk exposure.",
    icon: MousePointer2
  },
  {
    title: "Architecture",
    text: "Map the cleanest path across devices, network, cloud, security, and support operations.",
    icon: CircuitBoard
  },
  {
    title: "Deployment",
    text: "Execute with direct communication, practical documentation, and a bias for reliable outcomes.",
    icon: Zap
  },
  {
    title: "Continuity",
    text: "Keep the environment easier to support, monitor, scale, and improve over time.",
    icon: Activity
  }
];

const particles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 29) % 100}%`,
  top: `${(index * 47) % 100}%`,
  delay: `${(index % 9) * 0.45}s`,
  duration: `${6 + (index % 7)}s`
}));

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09
    }
  }
};

const initialFormState: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
  website: ""
};

function Logo({ size = "nav" }: { size?: "nav" | "hero" | "footer" | "loader" }) {
  const sizes = {
    nav: "h-12 w-44 sm:w-52",
    hero: "h-24 w-full max-w-[520px] sm:h-32",
    footer: "h-14 w-52",
    loader: "h-20 w-72"
  };

  return (
    <div className={`relative overflow-hidden rounded bg-white shadow-[0_18px_60px_rgba(0,0,0,0.32)] ring-1 ring-white/15 ${sizes[size]}`}>
      <Image
        src="/logo-cropped.png"
        alt="TiTANiUM Technology"
        fill
        priority={size === "hero" || size === "loader"}
        sizes={size === "hero" ? "(min-width: 1024px) 520px, 92vw" : "300px"}
        className="object-contain p-2"
      />
    </div>
  );
}

function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1250);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-titanium-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: "easeOut" } }}
        >
          <div className="absolute inset-0 animated-mesh opacity-80" />
          <div className="absolute inset-0 circuit-grid opacity-40" />
          <motion.div
            className="relative z-10 grid justify-items-center gap-7 text-center"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Logo size="loader" />
            <div className="h-1 w-64 overflow-hidden rounded bg-white/10">
              <motion.div
                className="h-full rounded bg-gradient-to-r from-electric-600 via-cyan-300 to-emerald-300"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-electric-200">
              Initializing secure infrastructure
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function MouseGlow() {
  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return <div className="mouse-glow" aria-hidden="true" />;
}

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition duration-500 ${
        scrolled
          ? "border-white/10 bg-titanium-950/90 shadow-[0_18px_60px_rgba(0,0,0,0.36)] backdrop-blur-2xl"
          : "border-white/5 bg-titanium-950/40 backdrop-blur-xl"
      }`}
    >
      <nav className="section-shell flex h-[var(--header-height)] items-center justify-between gap-4">
        <a href="#home" aria-label="TiTANiUM Technology home" className="shrink-0">
          <Logo />
        </a>
        <div className="hidden items-center gap-8 text-sm font-medium text-titanium-100 lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </div>
        <a href="https://wa.me/971541938341" className="glow-button compact-button">
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </nav>
    </header>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
  align = "center"
}: {
  eyebrow: string;
  title: string;
  text: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      className={`${align === "center" ? "mx-auto text-center" : ""} mb-12 max-w-3xl`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={fadeUp}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-titanium-200 sm:text-lg">{text}</p>
    </motion.div>
  );
}

function ParticleField() {
  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
            animationDuration: particle.duration
          }}
        />
      ))}
    </div>
  );
}

function HeroConsole() {
  const signals = [
    { label: "Threat surface", value: "Observed", icon: ShieldAlert },
    { label: "Cloud identity", value: "Hardened", icon: Fingerprint },
    { label: "Network edge", value: "Mapped", icon: Radio },
    { label: "Infrastructure", value: "Ready", icon: Database }
  ];

  return (
    <motion.div
      className="hero-console"
      initial={{ opacity: 0, x: 52, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.45, ease: "easeOut" }}
    >
      <div className="scan-line absolute left-0 top-12 h-px w-full" />
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_22px_rgba(110,231,183,0.8)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-electric-300 shadow-glow" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
        </div>
        <span className="font-display text-xs uppercase tracking-[0.22em] text-electric-200">
          Infrastructure Pulse
        </span>
      </div>
      <div className="grid gap-3">
        {signals.map((signal, index) => (
          <motion.div
            key={signal.label}
            className="signal-row"
            animate={{ opacity: [0.68, 1, 0.68] }}
            transition={{ duration: 3.6, delay: index * 0.24, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded border border-electric-300/30 bg-electric-500/10 text-electric-200">
                <signal.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-white">{signal.label}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-titanium-400">{signal.value}</p>
              </div>
            </div>
            <div className="h-2 w-24 overflow-hidden rounded bg-white/10">
              <motion.div
                className="h-full rounded bg-gradient-to-r from-electric-600 to-emerald-300"
                initial={{ width: "35%" }}
                animate={{ width: [`${52 + index * 8}%`, `${78 + index * 5}%`, `${52 + index * 8}%`] }}
                transition={{ duration: 4.2, delay: index * 0.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
        {["Edge", "Cloud", "Cyber"].map((item) => (
          <div key={item}>
            <p className="font-display text-lg font-semibold text-white">{item}</p>
            <p className="mt-1 text-[0.68rem] uppercase tracking-[0.18em] text-titanium-400">online</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [-26, 26]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [-18, 18]);
  const consoleX = useTransform(mouseX, [-0.5, 0.5], [18, -18]);
  const consoleY = useTransform(mouseY, [-0.5, 0.5], [12, -12]);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-[var(--header-height)]" onMouseMove={handleMouseMove}>
      <video
        className="absolute inset-0 h-full w-full scale-105 object-cover"
        src={heroVideo}
        poster={heroPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,5,8,0.94)_0%,rgba(3,5,8,0.82)_38%,rgba(3,5,8,0.52)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,rgba(0,157,255,0.30),transparent_30%),linear-gradient(180deg,rgba(3,5,8,0.16),#030508_96%)]" />
      <motion.div className="absolute inset-x-[-10%] bottom-[-34%] h-[60%] hero-grid opacity-70" style={{ x: parallaxX, y: parallaxY }} />
      <div className="absolute inset-0 animated-mesh opacity-55" />
      <ParticleField />
      <motion.div className="pointer-events-none absolute right-[5%] top-[28%] z-10 hidden w-[34rem] max-w-[38vw] 2xl:block" style={{ x: consoleX, y: consoleY }}>
        <HeroConsole />
      </motion.div>
      <div className="section-shell relative z-10 flex min-h-[calc(100vh-var(--header-height))] items-center py-16 sm:py-20">
        <motion.div
          className="max-w-4xl lg:max-w-[48rem] xl:max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.7, ease: "easeOut" }}>
            <Logo size="hero" />
          </motion.div>
          <motion.p className="eyebrow mt-8" variants={fadeUp} transition={{ duration: 0.7, ease: "easeOut" }}>
            Dubai, UAE | Secure cloud, network, and infrastructure services
          </motion.p>
          <motion.h1
            className="mt-5 max-w-5xl font-display text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl"
            variants={fadeUp}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            Future-ready IT infrastructure for{" "}
            <span className="gradient-text">secure modern work.</span>
          </motion.h1>
          <motion.p
            className="mt-7 max-w-2xl text-lg leading-8 text-titanium-100 sm:text-xl"
            variants={fadeUp}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            TiTANiUM Technology delivers premium IT support, network engineering,
            cloud readiness, cybersecurity-minded operations, CCTV systems, and
            digital infrastructure for businesses and individuals in Dubai.
          </motion.p>
          <motion.div className="mt-10 flex flex-col gap-4 sm:flex-row" variants={fadeUp} transition={{ duration: 0.75, ease: "easeOut" }}>
            <a href="#contact" className="glow-button pulse-button">
              Start a Project
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#services" className="ghost-button">
              Explore Services
              <ExternalLink className="h-4 w-4" />
            </a>
          </motion.div>
          <motion.div className="mt-10 grid max-w-2xl grid-cols-3 gap-3" variants={fadeUp} transition={{ duration: 0.75, ease: "easeOut" }}>
            {["Secure", "Scalable", "Founder-led"].map((item) => (
              <div key={item} className="rounded border border-white/10 bg-white/[0.045] px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.16em] text-titanium-100 backdrop-blur">
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.7 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    const duration = 1500;
    const start = performance.now();
    let frame = 0;

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function About() {
  const words = useMemo(() => ["secure", "connected", "cloud-ready", "resilient"], []);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % words.length);
    }, 1900);
    return () => window.clearInterval(timer);
  }, [words.length]);

  return (
    <section id="about" className="section-band relative overflow-hidden border-y border-white/10 bg-titanium-900 py-24">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <motion.div
          className="relative overflow-hidden rounded-lg border border-white/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={fadeUp}
          transition={{ duration: 0.65 }}
        >
          <Image
            src={imageUrls.dataCenter}
            alt="Server racks and infrastructure in a data center"
            width={1400}
            height={1000}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="aspect-[4/3] w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-titanium-950 via-titanium-950/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <p className="eyebrow">About TiTANiUM</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">
              Built to keep your operation{" "}
              <span className="relative inline-block min-w-[11rem] text-electric-200">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={words[wordIndex]}
                    initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                    transition={{ duration: 0.35 }}
                    className="inline-block"
                  >
                    {words[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h2>
          </div>
        </motion.div>
        <motion.div
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.65 }} className="space-y-6 text-lg leading-9 text-titanium-100">
            <p>
              TiTANiUM Technology is an independent Dubai-based technology brand
              focused on practical IT support, secure infrastructure, network
              solutions, system administration, troubleshooting, and technical
              consultation.
            </p>
            <p>
              The experience is designed to feel direct, premium, and accountable:
              clear communication, sharp diagnosis, modern tooling, and technology
              decisions that help small teams and individuals work with confidence.
            </p>
          </motion.div>
          <motion.div className="grid gap-4 sm:grid-cols-2" variants={stagger}>
            {timeline.map((item, index) => (
              <motion.div key={item.title} className="timeline-item" variants={fadeUp} transition={{ duration: 0.55 }}>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded border border-electric-300/25 bg-electric-500/10 text-electric-200">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-xs uppercase tracking-[0.18em] text-titanium-400">Phase 0{index + 1}</p>
                    <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-titanium-300">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function TiltCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: y * -8, y: x * 8 });
  };

  return (
    <motion.article
      className="service-card group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      style={{ rotateX: rotate.x, rotateY: rotate.y, animationDelay: `${delay}s` }}
      variants={fadeUp}
      transition={{ duration: 0.55 }}
    >
      {children}
    </motion.article>
  );
}

function Services() {
  return (
    <section id="services" className="section-band relative overflow-hidden bg-titanium-950 py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Services"
          title="Interactive IT service lanes for secure, modern operations."
          text="Support, cloud, network, security, office setup, and digital services presented as a connected infrastructure layer instead of isolated tasks."
        />
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
          variants={stagger}
        >
          {services.map((service, index) => (
            <TiltCard key={service.title} delay={index * 0.08}>
              <div className="relative z-10">
                <div className="mb-7 flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded border border-electric-300/25 bg-electric-500/10 text-electric-200 transition group-hover:border-electric-300/70 group-hover:shadow-glow">
                    <service.icon className="h-6 w-6" />
                  </span>
                  <span className="rounded border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-titanium-300">
                    {service.metric}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-titanium-200">{service.text}</p>
              </div>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  return (
    <section className="section-band relative overflow-hidden border-y border-white/10 bg-titanium-900 py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Why TiTANiUM"
          title="Premium execution with a practical engineering mindset."
          text="A direct, founder-led service model with clean communication, documented thinking, and infrastructure decisions that can grow with the business."
        />
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={stagger}
        >
          {stats.map((item) => (
            <motion.div key={item.label} className="stat-panel" variants={fadeUp} transition={{ duration: 0.55 }}>
              <p className="font-display text-5xl font-semibold text-white">
                <CountUp value={item.value} suffix={item.suffix} />
              </p>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">{item.label}</h3>
              <p className="mt-3 text-sm leading-6 text-titanium-300">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function MediaShowcase() {
  const panels = [
    { title: "Data center readiness", image: imageUrls.serverDetail, icon: Server },
    { title: "Network engineering", image: imageUrls.engineer, icon: Network },
    { title: "Security monitoring", image: imageUrls.securityDashboard, icon: LockKeyhole }
  ];

  return (
    <section className="section-band bg-titanium-950 py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="IT Visual Layer"
          title="Real infrastructure imagery with cinematic depth."
          text="Server racks, fiber cabling, endpoint security screens, and engineering details set the tone for an enterprise-grade technology partner."
        />
        <motion.div
          className="grid gap-5 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={stagger}
        >
          {panels.map((panel) => (
            <motion.article key={panel.title} className="media-card group" variants={fadeUp} transition={{ duration: 0.6 }}>
              <Image
                src={panel.image}
                alt={panel.title}
                width={1100}
                height={820}
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-titanium-950 via-titanium-950/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="grid h-11 w-11 place-items-center rounded border border-electric-300/30 bg-electric-500/15 text-electric-200 backdrop-blur">
                  <panel.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold text-white">{panel.title}</h3>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="section-band relative overflow-hidden border-y border-white/10 bg-titanium-900 py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Portfolio"
          title="Premium project showcases built around real IT outcomes."
          text="A cinematic portfolio direction for infrastructure, network, security, and cabling engagements that TiTANiUM Technology can deliver."
        />
        <motion.div
          className="grid gap-5 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
          variants={stagger}
        >
          {projects.map((project) => (
            <motion.article key={project.name} className="project-card group" variants={fadeUp} transition={{ duration: 0.6 }}>
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-titanium-950 via-titanium-950/30 to-transparent" />
                <div className="absolute left-5 top-5 flex items-center gap-2 rounded border border-electric-300/25 bg-electric-500/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-electric-100 backdrop-blur">
                  <project.icon className="h-4 w-4" />
                  {project.type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl font-semibold text-white">{project.name}</h3>
                <p className="mt-4 leading-7 text-titanium-200">{project.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tech-pill">{tag}</span>
                  ))}
                </div>
                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {project.stack.map((item) => (
                    <span key={item} className="rounded border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-semibold text-titanium-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function validateContactForm(form: ContactFormState) {
  const errors: Partial<Record<keyof ContactFormState, string>> = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+()\d\s-]{6,25}$/;

  if (form.name.trim().length < 2) {
    errors.name = "Enter your full name.";
  }

  if (!emailRegex.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!phoneRegex.test(form.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }

  if (form.company.trim().length < 2) {
    errors.company = "Enter your company or project name.";
  }

  if (form.message.trim().length < 10) {
    errors.message = "Tell us a little more about the request.";
  }

  return errors;
}

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(onClose, 4800);
    return () => window.clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}
          initial={{ opacity: 0, y: -18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.98 }}
          role="status"
          aria-live="polite"
        >
          <div className="grid h-10 w-10 place-items-center rounded border border-white/10 bg-white/10">
            {toast.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-white">{toast.title}</p>
            <p className="mt-1 text-sm leading-6 text-titanium-200">{toast.message}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Contact() {
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [startedAt, setStartedAt] = useState(Date.now());

  const updateField = (field: keyof ContactFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateContactForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setToast({
        type: "error",
        title: "Check the form",
        message: "A few fields need attention before the message can be sent."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...form, startedAt })
      });

      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.message || "The message could not be sent right now.");
      }

      setForm(initialFormState);
      setStartedAt(Date.now());
      setToast({
        type: "success",
        title: "Message sent",
        message: "Your request reached TiTANiUM Technology. We will reply as soon as possible."
      });
    } catch (error) {
      setToast({
        type: "error",
        title: "Sending failed",
        message: error instanceof Error ? error.message : "Please try again or use WhatsApp."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-band relative overflow-hidden bg-titanium-950 py-24">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="section-shell grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.65 }}
        >
          <SectionHeading
            eyebrow="Contact"
            title="Bring the technology problem. We will map the clean path forward."
            text="Reach out for IT support, network infrastructure, cybersecurity readiness, Microsoft 365, CCTV systems, office setup, or premium website solutions in Dubai."
            align="left"
          />
          <div className="grid gap-4">
            <a href="https://wa.me/971541938341" className="contact-link contact-link-primary">
              <MessageCircle className="h-5 w-5 text-electric-200" />
              <span>WhatsApp: +971541938341</span>
            </a>
            <a href="mailto:abdomansourshalaby@gmail.com" className="contact-link">
              <Mail className="h-5 w-5 text-electric-200" />
              <span>abdomansourshalaby@gmail.com</span>
            </a>
            <div className="contact-link">
              <MapPin className="h-5 w-5 text-electric-200" />
              <span>Dubai, UAE</span>
            </div>
          </div>
          <div className="mt-8 overflow-hidden rounded-lg border border-white/10">
            <Image
              src={imageUrls.rackCloseup}
              alt="Close-up of network infrastructure cabling"
              width={1100}
              height={620}
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="aspect-[16/8] w-full object-cover opacity-90"
            />
          </div>
        </motion.div>
        <motion.form
          className="contact-form"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.65, delay: 0.08 }}
          onSubmit={handleSubmit}
          noValidate
        >
          <input
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) => updateField("website", event.target.value)}
            aria-hidden="true"
          />
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Secure Intake</p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-white">Tell us what needs fixing or building.</h3>
            </div>
            <span className="hidden h-12 w-12 place-items-center rounded border border-electric-300/25 bg-electric-500/10 text-electric-200 sm:grid">
              <Send className="h-5 w-5" />
            </span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Name"
              value={form.name}
              error={errors.name}
              placeholder="Your name"
              onChange={(value) => updateField("name", value)}
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              error={errors.email}
              placeholder="you@example.com"
              onChange={(value) => updateField("email", value)}
            />
            <Field
              label="Phone"
              value={form.phone}
              error={errors.phone}
              placeholder="+971..."
              onChange={(value) => updateField("phone", value)}
            />
            <Field
              label="Company"
              value={form.company}
              error={errors.company}
              placeholder="Company or project"
              onChange={(value) => updateField("company", value)}
            />
          </div>
          <label className="mt-5 grid gap-2 text-sm font-semibold text-titanium-100">
            Message
            <textarea
              className={`form-control min-h-40 resize-y ${errors.message ? "form-error" : ""}`}
              placeholder="Describe your IT, network, security, cloud, CCTV, or website request."
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
            />
            {errors.message ? <span className="text-xs font-medium text-rose-300">{errors.message}</span> : null}
          </label>
          <button type="submit" className="glow-button mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending secure message
              </>
            ) : (
              <>
                Send Message
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-titanium-100">
      {label}
      <input
        className={`form-control ${error ? "form-error" : ""}`}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span className="text-xs font-medium text-rose-300">{error}</span> : null}
    </label>
  );
}

function Footer() {
  const quickLinks = ["About", "Services", "Projects", "Contact"];
  const footerServices = ["IT Support", "Network Solutions", "CCTV Systems", "Microsoft 365", "Website Solutions"];

  return (
    <footer className="border-t border-white/10 bg-titanium-950 py-12">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.7fr_0.8fr_0.5fr]">
          <div>
            <Logo size="footer" />
            <p className="mt-5 max-w-sm leading-7 text-titanium-300">
              Premium IT support, infrastructure, network engineering, cloud readiness,
              cybersecurity-minded consulting, and digital solutions in Dubai.
            </p>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">Quick Links</h3>
            <div className="mt-5 grid gap-3 text-sm text-titanium-300">
              {quickLinks.map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} className="transition hover:text-electric-300">
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">Services</h3>
            <div className="mt-5 grid gap-3 text-sm text-titanium-300">
              {footerServices.map((service) => (
                <a key={service} href="#services" className="transition hover:text-electric-300">
                  {service}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">Social</h3>
            <div className="mt-5 flex items-center gap-3">
              {[
                { icon: Linkedin, label: "LinkedIn", href: "#" },
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Mail, label: "Email", href: "mailto:abdomansourshalaby@gmail.com" },
                { icon: Phone, label: "WhatsApp", href: "https://wa.me/971541938341" }
              ].map((item) => (
                <a key={item.label} href={item.href} aria-label={item.label} className="social-link">
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-titanium-400">
          Copyright 2026 TiTANiUM Technology. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/971541938341"
      aria-label="Contact TiTANiUM Technology on WhatsApp"
      className="whatsapp-float"
    >
      <span className="absolute inset-0 rounded-full bg-electric-400/30 blur-xl" />
      <span className="relative grid h-14 w-14 place-items-center rounded-full border border-electric-300/50 bg-electric-500 text-white shadow-glow transition hover:-translate-y-1 hover:bg-electric-400">
        <MessageCircle className="h-6 w-6" />
      </span>
    </a>
  );
}

export default function Home() {
  return (
    <main>
      <LoadingScreen />
      <MouseGlow />
      <div className="noise" />
      <Header />
      <Hero />
      <About />
      <Services />
      <WhyChooseUs />
      <MediaShowcase />
      <Projects />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
