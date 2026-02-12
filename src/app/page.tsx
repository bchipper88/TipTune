"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Music,
  DollarSign,
  QrCode,
  Zap,
  ArrowRight,
  ChevronUp,
  Users,
  BarChart3,
  Mic2,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: Smartphone,
    title: "Find an Event",
    description:
      "Scan a QR code at the venue or search for a live event nearby — no app download needed.",
    step: 1,
  },
  {
    icon: Music,
    title: "Pick Your Song",
    description:
      "Browse the artist's library, find the song you want to hear, and submit your request.",
    step: 2,
  },
  {
    icon: DollarSign,
    title: "Tip to Compete",
    description:
      "Attach a tip to your request. The song with the most money plays next. Want yours sooner? Tip more.",
    step: 3,
  },
];

const features = [
  {
    icon: Music,
    title: "Song Library",
    description:
      "Build your library by searching millions of songs. Organize by genre, decade, or your preferred order.",
  },
  {
    icon: QrCode,
    title: "QR Codes",
    description:
      "Auto-generated QR codes for your profile and each event. Print them out, put them on tables.",
  },
  {
    icon: DollarSign,
    title: "Instant Payouts",
    description:
      "Get paid directly to your bank account via Stripe. See your earnings in real-time.",
  },
  {
    icon: BarChart3,
    title: "Live Dashboard",
    description:
      "See the queue in real-time. Accept, skip, or reorder songs. You stay in control.",
  },
  {
    icon: Users,
    title: "Build Your Audience",
    description:
      "Fans can follow you and get notified of your upcoming events. Grow your fanbase.",
  },
  {
    icon: Zap,
    title: "Zero Setup",
    description:
      "Create your account, add songs, create an event. You're live in minutes, not days.",
  },
];

const stats = [
  { value: "90", label: "Songs Available", color: "text-primary", accent: "stat-card-primary", suffix: "M+", countUp: true },
  { value: "$0", label: "To Get Started", color: "text-warm", accent: "stat-card-warm" },
  { value: "60", label: "To Go Live", color: "text-secondary", accent: "stat-card-secondary", suffix: "s", countUp: true },
];

export default function LandingPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const countUpRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    countUpRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const target = parseInt(el.dataset.countup || "0", 10);

            if (prefersReducedMotion) {
              el.textContent = target.toString();
            } else {
              const duration = 1500;
              const start = performance.now();
              function tick(now: number) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(eased * target).toString();
                if (progress < 1) requestAnimationFrame(tick);
              }
              requestAnimationFrame(tick);
            }
            countUpRef.current?.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("[data-countup]").forEach((el) => {
      countUpRef.current?.observe(el);
    });

    return () => countUpRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Music className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-text-white">TipTune</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="warm" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-16 pt-32 sm:pt-36">
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="hero-orb-1 absolute -left-40 -top-20 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px]" />
          <div className="hero-orb-2 absolute -right-20 top-1/4 h-[400px] w-[400px] rounded-full bg-secondary/15 blur-[100px]" />
          <div className="hero-orb-3 absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-warm/10 blur-[100px]" />
          <div className="hero-orb-2 absolute left-1/2 top-1/3 h-[200px] w-[200px] rounded-full bg-primary/10 blur-[80px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Text Content */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="hero-animate hero-animate-delay-1 mb-6 inline-flex items-center gap-2 rounded-full border border-warm/30 bg-warm/5 px-4 py-1.5 text-sm text-warm">
              <Zap className="h-3.5 w-3.5" />
              Live song requests powered by tips
            </div>

            <h1 className="hero-animate hero-animate-delay-2 mb-6 text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Your tip decides{" "}
              <span className="gradient-text">what plays next</span>
            </h1>

            <p className="hero-animate hero-animate-delay-3 mx-auto mb-10 max-w-2xl text-lg text-muted sm:text-xl">
              The live music request platform where audiences compete to hear
              their favorite song. Tip to boost your request up the queue —
              the highest bid plays next.
            </p>

            <div className="hero-animate hero-animate-delay-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button variant="warm" size="lg" className="gap-2 text-base">
                  <Mic2 className="h-5 w-5" />
                  I&apos;m an Artist
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="ghost" size="lg" className="gap-2 text-base">
                  <Smartphone className="h-5 w-5" />
                  Find an Event
                </Button>
              </Link>
            </div>
          </div>

          {/* Banner Image + Queue Preview side by side */}
          <div className="hero-animate hero-animate-delay-4 mx-auto mt-14 max-w-5xl">
            <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_340px]">
              {/* Banner Image */}
              <div className="overflow-hidden rounded-2xl border border-border/50 shadow-2xl shadow-black/40">
                <Image
                  src="/banner.png"
                  alt="Live band performing on stage"
                  width={1920}
                  height={1080}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>

              {/* Mock Queue Preview */}
              <div className="rounded-2xl border border-border bg-card-bg/80 p-4 backdrop-blur-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                  Live Queue Preview
                </p>

                {/* Next Up */}
                <div className="next-up-glow mb-3 rounded-xl border border-warm/30 bg-warm/10 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warm/20">
                        <Music className="h-5 w-5 text-warm" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold uppercase text-warm">
                          Next Up
                        </p>
                        <p className="font-semibold text-text-white">
                          Don&apos;t Stop Believin&apos;
                        </p>
                        <p className="text-xs text-muted">Journey</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-lg font-bold text-warm">$47</p>
                      <div className="flex items-center gap-1 text-xs text-success">
                        <ChevronUp className="h-3 w-3" />
                        +$5
                      </div>
                    </div>
                  </div>
                </div>

                {/* Queue items */}
                <div className="space-y-2">
                  {[
                    { song: "Sweet Caroline", artist: "Neil Diamond", amount: "$32" },
                    { song: "Piano Man", artist: "Billy Joel", amount: "$28" },
                    { song: "Bohemian Rhapsody", artist: "Queen", amount: "$15" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-dark-bg/50 p-2.5 opacity-60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card-bg">
                          <Music className="h-4 w-4 text-muted" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-text-white">
                            {item.song}
                          </p>
                          <p className="text-xs text-muted">{item.artist}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-muted">
                          {item.amount}
                        </span>
                        <button className="rounded-lg bg-primary/20 px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/30">
                          Boost
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider mx-auto max-w-4xl" />

      {/* How It Works */}
      <section className="section-gradient-blue px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="animate-on-scroll mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">How it works</h2>
            <p className="text-lg text-muted">
              Three steps to get the crowd involved
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3 steps-connector">
            {steps.map((item, i) => (
              <div
                key={item.step}
                className={`animate-on-scroll stagger-${i + 1} relative z-10 text-center`}
              >
                {/* Step circle */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl font-black text-white shadow-lg shadow-primary/20">
                  {item.step}
                </div>
                {/* Icon */}
                <div className="mx-auto mb-4 inline-flex rounded-2xl border border-border bg-card-bg p-4">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                <p className="mx-auto max-w-xs text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider mx-auto max-w-4xl" />

      {/* Stats Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`stat-card ${stat.accent} animate-on-scroll stagger-${i + 1} rounded-2xl border border-border bg-card-bg/60 p-8 text-center backdrop-blur-sm`}
              >
                <p
                  className={`mb-2 font-mono text-4xl font-black sm:text-5xl ${stat.color}`}
                >
                  {stat.countUp ? (
                    <>
                      <span data-countup={stat.value}>0</span>
                      {stat.suffix}
                    </>
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Artists */}
      <section className="section-gradient-purple px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="animate-on-scroll mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Built for performers
            </h2>
            <p className="text-lg text-muted">
              Everything you need to manage requests and earn more
            </p>
          </div>

          {/* Venue Photo Banner */}
          <div className="animate-on-scroll mb-12 overflow-hidden rounded-2xl border border-border/50 shadow-2xl shadow-black/40">
            <div className="relative">
              <Image
                src="/venue.jpg"
                alt="Live performer engaging with crowd at a venue"
                width={1920}
                height={600}
                className="h-48 w-full object-cover sm:h-64 lg:h-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Card
                key={feature.title}
                className={`feature-card animate-on-scroll stagger-${i + 1} hover:border-primary/30`}
              >
                <div
                  className={`mb-3 inline-flex rounded-xl p-2.5 ${
                    i % 2 === 0
                      ? "bg-gradient-to-br from-primary/20 to-secondary/20"
                      : "bg-gradient-to-br from-warm/20 to-secondary/15"
                  }`}
                >
                  <feature.icon
                    className={`h-5 w-5 ${i % 2 === 0 ? "text-primary" : "text-warm"}`}
                  />
                </div>
                <h3 className="mb-1.5 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-gradient-warm px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <Card className="animate-on-scroll relative overflow-hidden border-warm/20 text-center" glow="warm">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              <div className="cta-bg-glow absolute left-1/2 top-1/2 h-64 w-96 -translate-x-1/2 -translate-y-1/2 bg-warm/15 blur-[80px]" />
              <div className="absolute -left-20 top-0 h-40 w-40 bg-primary/10 blur-[60px]" />
              <div className="absolute -right-20 bottom-0 h-40 w-40 bg-secondary/10 blur-[60px]" />
            </div>
            <div className="relative z-10 py-12">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                Ready to let the crowd decide?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-lg text-muted">
                Join artists already using TipTune to engage their audience and
                earn more from every gig.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/register">
                  <Button variant="warm" size="lg" className="gap-2">
                    Create Artist Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="ghost" size="lg">
                    Browse Events
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <div className="section-divider mx-auto max-w-4xl" />
      <footer className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Music className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-text-white">TipTune</span>
            </div>
            <div className="flex gap-6 text-sm text-muted">
              <Link href="/explore" className="transition-colors hover:text-text-white">
                Explore
              </Link>
              <Link href="/register" className="transition-colors hover:text-text-white">
                For Artists
              </Link>
              <Link href="/login" className="transition-colors hover:text-text-white">
                Log In
              </Link>
            </div>
            <p className="text-sm text-muted">
              &copy; {new Date().getFullYear()} TipTune
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
