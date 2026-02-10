"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Music,
  ChevronUp,
  DollarSign,
  Search,
  X,
  ArrowLeft,
  Flame,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface QueueItem {
  id: string;
  song: { title: string; originalArtist: string; albumArtUrl?: string };
  totalTips: number;
  status: string;
}

interface LibrarySong {
  id: string;
  title: string;
  originalArtist: string;
  albumArtUrl?: string;
}

// Tip amount presets in cents
const TIP_AMOUNTS = [
  { label: "$1", value: 100 },
  { label: "$3", value: 300 },
  { label: "$5", value: 500 },
  { label: "$10", value: 1000 },
  { label: "$20", value: 2000 },
];

export default function PublicEventPage() {
  const [view, setView] = useState<"queue" | "browse" | "tip">("queue");
  const [selectedSong, setSelectedSong] = useState<LibrarySong | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tipSuccess, setTipSuccess] = useState(false);

  // Demo data
  const eventName = "Friday Night Live";
  const artistName = "The House Band";
  const queue: QueueItem[] = [
    {
      id: "1",
      song: { title: "Don't Stop Believin'", originalArtist: "Journey" },
      totalTips: 4700,
      status: "QUEUED",
    },
    {
      id: "2",
      song: { title: "Sweet Caroline", originalArtist: "Neil Diamond" },
      totalTips: 3200,
      status: "QUEUED",
    },
    {
      id: "3",
      song: { title: "Piano Man", originalArtist: "Billy Joel" },
      totalTips: 2800,
      status: "QUEUED",
    },
    {
      id: "4",
      song: { title: "Bohemian Rhapsody", originalArtist: "Queen" },
      totalTips: 1500,
      status: "QUEUED",
    },
    {
      id: "5",
      song: { title: "Living on a Prayer", originalArtist: "Bon Jovi" },
      totalTips: 800,
      status: "QUEUED",
    },
  ];

  const library: LibrarySong[] = [
    { id: "s1", title: "Sweet Home Alabama", originalArtist: "Lynyrd Skynyrd" },
    { id: "s2", title: "Mr. Brightside", originalArtist: "The Killers" },
    { id: "s3", title: "Wonderwall", originalArtist: "Oasis" },
    { id: "s4", title: "Livin' on a Prayer", originalArtist: "Bon Jovi" },
    { id: "s5", title: "Tiny Dancer", originalArtist: "Elton John" },
    { id: "s6", title: "Brown Eyed Girl", originalArtist: "Van Morrison" },
    { id: "s7", title: "Take Me Home, Country Roads", originalArtist: "John Denver" },
    { id: "s8", title: "Friends in Low Places", originalArtist: "Garth Brooks" },
    { id: "s9", title: "Hey Jude", originalArtist: "The Beatles" },
    { id: "s10", title: "Hotel California", originalArtist: "Eagles" },
  ];

  const filteredLibrary = library.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.originalArtist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCents = (cents: number) => {
    const dollars = cents / 100;
    return dollars % 1 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`;
  };

  const nextUp = queue[0];

  const handleTipSubmit = () => {
    const amount = customAmount ? parseInt(customAmount) * 100 : selectedAmount;
    if (amount < 100) return;
    // In production: POST to /api/events/:id/requests with songId + tipAmount
    // Then integrate Stripe for payment
    setTipSuccess(true);
    setTimeout(() => {
      setTipSuccess(false);
      setView("queue");
      setSelectedSong(null);
      setCustomAmount("");
    }, 2000);
  };

  // Tip Success State
  if (tipSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
            <ChevronUp className="h-10 w-10 text-success" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-text-white">Tip Sent!</h2>
          <p className="text-muted">
            Your tip for &ldquo;{selectedSong?.title}&rdquo; has been submitted.
            <br />
            Watch it climb the queue!
          </p>
        </div>
      </div>
    );
  }

  // Browse Library View
  if (view === "browse") {
    return (
      <div className="min-h-screen bg-dark-bg">
        <div className="mx-auto max-w-md px-4 pb-8 pt-4">
          {/* Header */}
          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={() => setView("queue")}
              className="rounded-lg p-1.5 text-muted hover:text-text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-bold">Choose a Song</h1>
              <p className="text-sm text-muted">{artistName}&apos;s library</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted" />
            <Input
              placeholder="Search songs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-muted"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Song List */}
          <div className="space-y-2">
            {filteredLibrary.map((song) => (
              <button
                key={song.id}
                onClick={() => {
                  setSelectedSong(song);
                  setView("tip");
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-card-bg p-3 text-left transition-all hover:border-primary/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-bg">
                  <Music className="h-5 w-5 text-muted" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-white">{song.title}</p>
                  <p className="text-sm text-muted">{song.originalArtist}</p>
                </div>
                <DollarSign className="h-5 w-5 text-warm" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Tip Amount Selection View
  if (view === "tip" && selectedSong) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <div className="mx-auto max-w-md px-4 pb-8 pt-4">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => setView("browse")}
              className="rounded-lg p-1.5 text-muted hover:text-text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-bold">Add Your Tip</h1>
              <p className="text-sm text-muted">The bigger the tip, the sooner it plays</p>
            </div>
          </div>

          {/* Selected Song */}
          <Card className="mb-6 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-text-white">{selectedSong.title}</p>
                <p className="text-sm text-muted">{selectedSong.originalArtist}</p>
              </div>
            </div>
          </Card>

          {/* Tip Amount Grid */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            {TIP_AMOUNTS.map((amount) => (
              <button
                key={amount.value}
                onClick={() => {
                  setSelectedAmount(amount.value);
                  setCustomAmount("");
                }}
                className={`rounded-xl border-2 p-4 text-center font-mono text-lg font-bold transition-all ${
                  selectedAmount === amount.value && !customAmount
                    ? "border-warm bg-warm/10 text-warm"
                    : "border-border bg-card-bg text-text-white hover:border-warm/50"
                }`}
              >
                {amount.label}
              </button>
            ))}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-lg font-bold text-muted">
                $
              </span>
              <input
                type="number"
                placeholder="Other"
                min="1"
                className="h-full w-full rounded-xl border-2 border-border bg-card-bg p-4 pl-8 text-center font-mono text-lg font-bold text-text-white placeholder:text-muted focus:border-warm focus:outline-none"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
              />
            </div>
          </div>

          {/* Current Position Info */}
          <div className="mb-6 rounded-xl bg-card-bg p-3 text-center text-sm text-muted">
            <p>
              Current #1 is at{" "}
              <span className="font-mono font-semibold text-warm">
                {formatCents(nextUp?.totalTips || 0)}
              </span>
            </p>
            <p className="mt-1">Tip higher to get your song to #1!</p>
          </div>

          {/* Submit */}
          <Button
            variant="warm"
            size="lg"
            className="w-full gap-2 text-lg"
            onClick={handleTipSubmit}
          >
            <DollarSign className="h-5 w-5" />
            Tip{" "}
            {customAmount
              ? `$${customAmount}`
              : formatCents(selectedAmount)}{" "}
            for this song
          </Button>

          <p className="mt-3 text-center text-xs text-muted">
            Payments processed securely via Stripe
          </p>
        </div>
      </div>
    );
  }

  // Main Queue View (default)
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="mx-auto max-w-md px-4 pb-24 pt-4">
        {/* Event Header */}
        <div className="mb-6 text-center">
          <Link href="/" className="mb-2 inline-flex items-center gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Music className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-text-white">TipTune</span>
          </Link>
          <h1 className="text-xl font-bold">{eventName}</h1>
          <p className="text-sm text-muted">{artistName}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-warm/10 px-3 py-1 text-xs font-semibold text-warm">
            <span className="h-1.5 w-1.5 rounded-full bg-warm animate-pulse" />
            LIVE NOW
          </div>
        </div>

        {/* Next Up - Featured */}
        {nextUp && (
          <div className="mb-6">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-warm">
              <Crown className="h-3.5 w-3.5" />
              Next Up
            </p>
            <Card glow="warm" className="next-up-glow border-warm/30 bg-warm/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warm/20">
                    <Flame className="h-6 w-6 text-warm" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-text-white">
                      {nextUp.song.title}
                    </p>
                    <p className="text-sm text-muted">{nextUp.song.originalArtist}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-2xl font-bold text-warm">
                    {formatCents(nextUp.totalTips)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedSong({
                    id: nextUp.id,
                    title: nextUp.song.title,
                    originalArtist: nextUp.song.originalArtist,
                  });
                  setView("tip");
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-warm py-2.5 font-semibold text-white transition-opacity hover:opacity-90"
              >
                <ChevronUp className="h-4 w-4" />
                Boost This Song
              </button>
            </Card>
          </div>
        )}

        {/* Rest of Queue */}
        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            In the Queue
          </p>
          <div className="space-y-2">
            {queue.slice(1).map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card-bg p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-bg font-mono text-sm text-muted">
                    {index + 2}
                  </span>
                  <div>
                    <p className="font-medium text-text-white">{item.song.title}</p>
                    <p className="text-sm text-muted">{item.song.originalArtist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-muted">
                    {formatCents(item.totalTips)}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedSong({
                        id: item.id,
                        title: item.song.title,
                        originalArtist: item.song.originalArtist,
                      });
                      setView("tip");
                    }}
                    className="rounded-lg bg-primary/20 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/30"
                  >
                    Boost
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-dark-bg/95 p-4 backdrop-blur-sm">
          <div className="mx-auto max-w-md">
            <Button
              variant="primary"
              size="lg"
              className="w-full gap-2 text-base"
              onClick={() => setView("browse")}
            >
              <Music className="h-5 w-5" />
              Request a Song
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
