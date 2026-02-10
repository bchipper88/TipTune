"use client";

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

export default function LandingPage() {
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

      {/* Hero Banner Section */}
      <section
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16"
        style={{ backgroundImage: "url(/banner.png)", backgroundSize: "cover", backgroundPosition: "center 30%" }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/80 via-dark-bg/70 to-dark-bg" />
        {/* Atmospheric light effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-warm/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card-bg/50 px-4 py-1.5 text-sm text-muted">
            <Zap className="h-3.5 w-3.5 text-warm" />
            Live song requests powered by tips
          </div>

          <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Your tip decides{" "}
            <span className="gradient-text">what plays next</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted sm:text-xl">
            The live music request platform where audiences compete to hear their
            favorite song. Tip to boost your request up the queue — the highest
            bid plays next.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
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

          {/* Mock Queue Preview */}
          <div className="mx-auto mt-16 max-w-md">
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
      </section>

      {/* How It Works */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">How it works</h2>
            <p className="text-lg text-muted">
              Three steps to get the crowd involved
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: QrCode,
                title: "Scan the QR Code",
                description:
                  "The artist displays a QR code at the venue. Scan it with your phone — no app download needed.",
                step: "01",
              },
              {
                icon: Music,
                title: "Pick Your Song",
                description:
                  "Browse the artist's library, find the song you want to hear, and submit your request.",
                step: "02",
              },
              {
                icon: DollarSign,
                title: "Tip to Compete",
                description:
                  "Attach a tip to your request. The song with the most money plays next. Want yours sooner? Tip more.",
                step: "03",
              },
            ].map((item) => (
              <Card key={item.step} className="relative overflow-hidden">
                <span className="absolute -right-2 -top-4 font-mono text-7xl font-black text-border/30">
                  {item.step}
                </span>
                <div className="relative z-10">
                  <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                  <p className="text-muted">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Artists */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Built for performers
            </h2>
            <p className="text-lg text-muted">
              Everything you need to manage requests and earn more
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
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
            ].map((feature) => (
              <Card
                key={feature.title}
                className="transition-colors hover:border-primary/30"
              >
                <div className="mb-3 inline-flex rounded-xl bg-secondary/10 p-2.5">
                  <feature.icon className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="mb-1.5 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <Card className="relative overflow-hidden border-warm/20 text-center" glow="warm">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 bg-warm/10 blur-3xl" />
            </div>
            <div className="relative z-10 py-8">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Ready to let the crowd decide?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-lg text-muted">
                Join hundreds of artists already using TipTune to engage their
                audience and earn more from every gig.
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
      <footer className="border-t border-border px-4 py-12">
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
