"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  CircuitBoard,
  CloudCog,
  Code2,
  Cpu,
  ExternalLink,
  Globe2,
  Headphones,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Network,
  Phone,
  ShieldCheck,
  TerminalSquare,
  Wrench,
  Zap
} from "lucide-react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" }
];

const services = [
  {
    title: "IT Support",
    text: "Hands-on support for devices, users, software, printers, connectivity, and daily technical issues.",
    icon: Headphones
  },
  {
    title: "Network Solutions",
    text: "Router, switch, Wi-Fi, cabling, access point, and connectivity planning for modern offices.",
    icon: Network
  },
  {
    title: "CCTV Systems",
    text: "Camera system setup, recording, basic security layouts, and reliable business surveillance.",
    icon: Camera
  },
  {
    title: "Microsoft 365",
    text: "Email, Teams, OneDrive, users, security basics, migration support, and productivity setup.",
    icon: CloudCog
  },
  {
    title: "Website Solutions",
    text: "Clean business websites, digital presence, domain setup, hosting guidance, and launch support.",
    icon: Code2
  },
  {
    title: "Troubleshooting",
    text: "Fast diagnosis for Windows, networks, applications, hardware, email, and workflow interruptions.",
    icon: Wrench
  },
  {
    title: "Office Setup",
    text: "New office technology setup, workstation preparation, network readiness, and equipment rollout.",
    icon: Building2
  },
  {
    title: "Technical Consultation",
    text: "Practical recommendations for upgrades, tools, infrastructure, security, and business technology.",
    icon: CircuitBoard
  }
];

const stats = [
  {
    title: "Fast Response",
    value: "Priority",
    text: "Clear communication and focused action when technology slows work down.",
    icon: Zap
  },
  {
    title: "Reliable Support",
    value: "Steady",
    text: "Support built around practical fixes, continuity, and long-term confidence.",
    icon: ShieldCheck
  },
  {
    title: "Modern Solutions",
    value: "Current",
    text: "Cloud-aware, security-minded, and suitable for growing Dubai businesses.",
    icon: Cpu
  },
  {
    title: "Professional Service",
    value: "Direct",
    text: "A solo-operated brand with accountable, founder-led technical execution.",
    icon: CheckCircle2
  },
  {
    title: "Flexible Solutions",
    value: "Tailored",
    text: "Right-sized technology decisions for individuals, startups, and small teams.",
    icon: Globe2
  }
];

const projects = [
  {
    name: "Office Network Setup",
    type: "Networking",
    status: "Ready concept",
    desc: "Structured office connectivity with router, switch, Wi-Fi zones, and endpoint planning.",
    icon: Network,
    bars: [82, 66, 74, 91]
  },
  {
    name: "CCTV Installation",
    type: "Security",
    status: "Deployment model",
    desc: "Camera placement, recording setup, remote access basics, and clean security documentation.",
    icon: Camera,
    bars: [68, 88, 58, 79]
  },
  {
    name: "IT Infrastructure Upgrade",
    type: "Systems",
    status: "Upgrade path",
    desc: "Endpoint refresh, access control, Microsoft 365 readiness, backups, and admin standards.",
    icon: TerminalSquare,
    bars: [76, 92, 84, 71]
  },
  {
    name: "Business Website Setup",
    type: "Digital",
    status: "Launch-ready",
    desc: "Modern website presence with domain, hosting guidance, responsive UI, and contact flow.",
    icon: Code2,
    bars: [90, 64, 80, 86]
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

function Logo({ size = "nav" }: { size?: "nav" | "hero" | "footer" }) {
  const sizes = {
    nav: "h-12 w-44 sm:w-52",
    hero: "h-28 w-full max-w-[560px] sm:h-36",
    footer: "h-14 w-52"
  };

  return (
    <div
      className={`relative overflow-hidden rounded bg-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] ring-1 ring-white/15 ${sizes[size]}`}
    >
      <Image
        src="/logo-cropped.png"
        alt="TiTANiUM Technology"
        fill
        priority={size !== "footer"}
        sizes={size === "hero" ? "(min-width: 1024px) 520px, 92vw" : "230px"}
        className="object-contain p-2"
      />
    </div>
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

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-titanium-950/78 backdrop-blur-2xl">
      <nav className="section-shell flex h-[var(--header-height)] items-center justify-between gap-4">
        <a href="#home" aria-label="TiTANiUM Technology home" className="shrink-0">
          <Logo />
        </a>
        <div className="hidden items-center gap-8 text-sm font-medium text-titanium-100 lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-electric-300">
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="https://wa.me/971541938341"
          className="inline-flex items-center justify-center gap-2 rounded border border-electric-300/40 bg-electric-500/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-electric-300 hover:bg-electric-500/20"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </nav>
    </header>
  );
}

function HeroVisual() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-x-0 top-28 h-px bg-gradient-to-r from-transparent via-electric-300/50 to-transparent"
        animate={{ opacity: [0.2, 0.85, 0.2], x: ["-8%", "8%", "-8%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-x-[-10%] bottom-[-30%] h-[58%] hero-grid opacity-50" />
      <motion.div
        className="absolute right-[5%] top-[21%] hidden w-[34rem] max-w-[43vw] lg:block"
        initial={{ opacity: 0, x: 50, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1.05, delay: 0.35, ease: "easeOut" }}
      >
        <div className="glass-panel relative overflow-hidden rounded-lg p-5">
          <div className="scan-line absolute left-0 top-10 h-px w-full" />
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-electric-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-titanium-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-titanium-500" />
            </div>
            <span className="font-display text-xs uppercase tracking-[0.2em] text-electric-300">
              Infrastructure View
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Network", "M365", "Devices", "CCTV", "Backup", "Web"].map((label, index) => (
              <motion.div
                key={label}
                className="rounded border border-white/10 bg-white/[0.035] p-4"
                animate={{ opacity: [0.66, 1, 0.66] }}
                transition={{ duration: 3.6, delay: index * 0.18, repeat: Infinity }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <Cpu className="h-4 w-4 text-electric-300" />
                  <span className="h-1.5 w-1.5 rounded-full bg-electric-300 shadow-glow" />
                </div>
                <p className="font-display text-sm font-semibold text-white">{label}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-electric-400"
                    style={{ width: `${56 + index * 6}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded border border-electric-300/20 bg-electric-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-titanium-300">Response</p>
              <p className="mt-2 font-display text-xl font-semibold text-white">Fast</p>
            </div>
            <div className="rounded border border-electric-300/20 bg-electric-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-titanium-300">Focus</p>
              <p className="mt-2 font-display text-xl font-semibold text-white">Business IT</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-radial-grid pt-[var(--header-height)]">
      <HeroVisual />
      <div className="section-shell relative z-10 flex min-h-[calc(100vh-var(--header-height))] items-center py-16 sm:py-20">
        <motion.div
          className="max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Logo size="hero" />
          <p className="eyebrow mt-8">Dubai, UAE | Independent Technology Brand</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            Modern IT & Infrastructure Solutions
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-titanium-100 sm:text-xl">
            Reliable technology services, IT support, networking, troubleshooting,
            and digital solutions for businesses and individuals in Dubai.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded bg-electric-500 px-6 py-3.5 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-electric-400"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-electric-300/60 hover:bg-white/10"
            >
              Our Services
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  const expertise = [
    "IT Support",
    "Infrastructure",
    "Network Solutions",
    "System Administration",
    "Troubleshooting",
    "Technical Consultation"
  ];

  return (
    <section id="about" className="relative border-y border-white/10 bg-titanium-900 py-24">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <motion.div
          className="glass-panel rounded-lg p-6 sm:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={fadeUp}
          transition={{ duration: 0.65 }}
        >
          <p className="eyebrow">About TiTANiUM</p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">
            Independent, direct, and built for real technical work.
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {expertise.map((item) => (
              <div key={item} className="rounded border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-titanium-100">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="space-y-6 text-lg leading-9 text-titanium-100"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={fadeUp}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <p>
            TiTANiUM Technology is a growing independent technology brand based in
            Dubai, UAE, focused on practical IT support, infrastructure,
            network solutions, system administration, troubleshooting, and
            technical consultation.
          </p>
          <p>
            The brand is designed for businesses and individuals who need clear
            communication, dependable execution, and modern technology decisions
            without unnecessary complexity. Every solution is approached with a
            professional, business-oriented mindset.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="bg-titanium-950 py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Services"
          title="Focused technology services for modern work."
          text="Right-sized support for office technology, infrastructure, networking, cloud tools, security systems, and digital presence."
        />
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={stagger}
        >
          {services.map((service) => (
            <motion.article
              key={service.title}
              className="group glass-panel rounded-lg p-6 transition duration-300 hover:-translate-y-1 hover:border-electric-300/45 hover:bg-white/[0.055]"
              variants={fadeUp}
              transition={{ duration: 0.55 }}
            >
              <div className="grid h-12 w-12 place-items-center rounded border border-electric-300/25 bg-electric-500/10 text-electric-300 transition group-hover:border-electric-300/60 group-hover:shadow-glow">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-white">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-titanium-200">{service.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  return (
    <section className="border-y border-white/10 bg-titanium-900 py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="A premium service feel, built for a growing independent brand."
          text="TiTANiUM Technology keeps the experience direct, flexible, and professional while staying focused on the technical details that matter."
        />
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={stagger}
        >
          {stats.map((item) => (
            <motion.div key={item.title} className="glass-panel rounded-lg p-5" variants={fadeUp}>
              <item.icon className="h-6 w-6 text-electric-300" />
              <p className="mt-6 font-display text-2xl font-semibold text-white">{item.value}</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-titanium-300">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="bg-titanium-950 py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Portfolio"
          title="Realistic project directions for business technology."
          text="Early portfolio placeholders that show the kind of practical deployments TiTANiUM Technology is built to deliver."
        />
        <motion.div
          className="grid gap-5 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
          variants={stagger}
        >
          {projects.map((project) => (
            <motion.article key={project.name} className="glass-panel overflow-hidden rounded-lg" variants={fadeUp}>
              <div className="relative border-b border-white/10 bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded border border-electric-300/25 bg-electric-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-electric-300">
                    {project.type}
                  </span>
                  <project.icon className="h-5 w-5 text-titanium-200" />
                </div>
                <div className="mt-8 rounded border border-white/10 bg-titanium-950/70 p-4">
                  <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-titanium-400">
                    <span>Mockup</span>
                    <span>{project.status}</span>
                  </div>
                  <div className="grid gap-3">
                    {project.bars.map((bar, index) => (
                      <div key={index} className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-electric-600 to-electric-300" style={{ width: `${bar}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 grid grid-cols-4 gap-2">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="h-10 rounded border border-white/10 bg-white/[0.035]" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-white">{project.name}</h3>
                <p className="mt-4 leading-7 text-titanium-200">{project.desc}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-titanium-900 py-24">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.65 }}
        >
          <SectionHeading
            eyebrow="Contact"
            title="Start with the technology problem in front of you."
            text="Reach out for IT support, office setup, troubleshooting, infrastructure planning, Microsoft 365, networking, CCTV systems, or website solutions in Dubai."
            align="left"
          />
          <div className="grid gap-4">
            <a
              href="https://wa.me/971541938341"
              className="flex items-center gap-4 rounded border border-electric-300/30 bg-electric-500/10 p-4 text-white transition hover:border-electric-300/60 hover:bg-electric-500/20"
            >
              <MessageCircle className="h-5 w-5 text-electric-300" />
              <span>WhatsApp: +971541938341</span>
            </a>
            <a
              href="mailto:abdomansourshalaby@gmail.com"
              className="flex items-center gap-4 rounded border border-white/10 bg-white/[0.035] p-4 text-titanium-100 transition hover:border-electric-300/30"
            >
              <Mail className="h-5 w-5 text-electric-300" />
              <span>abdomansourshalaby@gmail.com</span>
            </a>
            <div className="flex items-center gap-4 rounded border border-white/10 bg-white/[0.035] p-4 text-titanium-100">
              <MapPin className="h-5 w-5 text-electric-300" />
              <span>Dubai, UAE</span>
            </div>
          </div>
        </motion.div>
        <motion.form
          className="glass-panel rounded-lg p-6 sm:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.65, delay: 0.08 }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-titanium-100">
              Name
              <input
                className="rounded border border-white/10 bg-titanium-950 px-4 py-3 text-white outline-none transition placeholder:text-titanium-500 focus:border-electric-300"
                placeholder="Your name"
                type="text"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-titanium-100">
              Email
              <input
                className="rounded border border-white/10 bg-titanium-950 px-4 py-3 text-white outline-none transition placeholder:text-titanium-500 focus:border-electric-300"
                placeholder="you@example.com"
                type="email"
              />
            </label>
          </div>
          <label className="mt-5 grid gap-2 text-sm font-semibold text-titanium-100">
            Service
            <input
              className="rounded border border-white/10 bg-titanium-950 px-4 py-3 text-white outline-none transition placeholder:text-titanium-500 focus:border-electric-300"
              placeholder="IT support, networking, CCTV, website..."
              type="text"
            />
          </label>
          <label className="mt-5 grid gap-2 text-sm font-semibold text-titanium-100">
            Message
            <textarea
              className="min-h-36 resize-y rounded border border-white/10 bg-titanium-950 px-4 py-3 text-white outline-none transition placeholder:text-titanium-500 focus:border-electric-300"
              placeholder="Tell us what you need help with."
            />
          </label>
          <button
            type="button"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded bg-electric-500 px-6 py-3.5 text-sm font-bold text-white shadow-glow transition hover:bg-electric-400"
          >
            Send Message
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.form>
      </div>
    </section>
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
              Modern IT support, infrastructure, networking, troubleshooting, and
              digital solutions for Dubai businesses and individuals.
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
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="grid h-10 w-10 place-items-center rounded border border-white/10 bg-white/[0.035] text-titanium-100 transition hover:border-electric-300/40 hover:text-electric-300"
                >
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
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full border border-electric-300/45 bg-electric-500 text-white shadow-glow transition hover:-translate-y-1 hover:bg-electric-400"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}

export default function Home() {
  return (
    <main>
      <div className="noise" />
      <Header />
      <Hero />
      <About />
      <Services />
      <WhyChooseUs />
      <Projects />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
