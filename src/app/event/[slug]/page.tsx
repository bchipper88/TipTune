"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
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
  Heart,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PaymentForm } from "@/components/PaymentForm";

interface QueueItem {
  id: string;
  song: { id: string; title: string; originalArtist: string; albumArtUrl?: string };
  totalTips: number;
  status: string;
}

interface LibrarySong {
  id: string;
  title: string;
  originalArtist: string;
  albumArtUrl?: string;
}

interface EventData {
  id: string;
  name: string;
  status: string;
  eventSlug: string;
  stripeConnected: boolean;
  artistProfile: { stageName: string; profileSlug: string };
}

const TIP_AMOUNTS = [
  { label: "$1", value: 100 },
  { label: "$3", value: 300 },
  { label: "$5", value: 500 },
  { label: "$10", value: 1000 },
  { label: "$20", value: 2000 },
];

export default function PublicEventPage() {
  const { slug } = useParams<{ slug: string }>();
  const [view, setView] = useState<"queue" | "browse" | "tip" | "general-tip" | "payment">("queue");
  const [selectedSong, setSelectedSong] = useState<LibrarySong | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tipSuccess, setTipSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tipMessage, setTipMessage] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [event, setEvent] = useState<EventData | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [library, setLibrary] = useState<LibrarySong[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    fetch(`/api/events/by-slug/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.event) setEvent(data.event);
        if (data.requests) setQueue(data.requests);
        if (data.library) setLibrary(data.library);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

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

  const getTipAmount = () => {
    return customAmount ? parseInt(customAmount) * 100 : selectedAmount;
  };

  const estimateFees = (cents: number) => {
    const stripeFee = Math.ceil(cents * 0.029 + 30);
    const platformFee = 15;
    const total = stripeFee + platformFee;
    return { stripeFee, platformFee, total };
  };

  const fmtCents = (c: number) => `$${(c / 100).toFixed(2)}`;

  const handleTipSubmit = async () => {
    if (!selectedSong || !event) return;
    const amount = getTipAmount();
    if (amount < 100) return;

    setSubmitting(true);
    setPaymentError(null);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          songId: selectedSong.id,
          tipAmount: amount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPaymentError(data.error || "Failed to create payment");
        return;
      }

      setClientSecret(data.clientSecret);
      setView("payment");
    } catch (err) {
      console.error("Payment intent creation failed:", err);
      setPaymentError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGeneralTipSubmit = async () => {
    if (!event) return;
    const amount = getTipAmount();
    if (amount < 100) return;

    setSubmitting(true);
    setPaymentError(null);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          tipAmount: amount,
          message: tipMessage || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPaymentError(data.error || "Failed to create payment");
        return;
      }

      setClientSecret(data.clientSecret);
      setSelectedSong({ id: "", title: "General Tip", originalArtist: "", albumArtUrl: undefined });
      setView("payment");
    } catch (err) {
      console.error("Payment intent creation failed:", err);
      setPaymentError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg px-4">
        <div className="text-center">
          <Music className="mx-auto mb-4 h-12 w-12 text-muted" />
          <h2 className="mb-2 text-xl font-bold">Event Not Found</h2>
          <p className="text-muted">This event may have ended or the link is incorrect.</p>
          <Link href="/explore" className="mt-4 inline-block text-primary hover:underline">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const artistName = event.artistProfile.stageName;

  if (tipSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
            <ChevronUp className="h-10 w-10 text-success" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-text-white">Tip Sent!</h2>
          <p className="text-muted">
            {selectedSong?.title === "General Tip" ? (
              <>Your tip has been sent to {artistName}!</>
            ) : (
              <>
                Your tip for &ldquo;{selectedSong?.title}&rdquo; has been submitted.
                <br />
                Watch it climb the queue!
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  // Payment View — Stripe Embedded Checkout
  if (view === "payment" && clientSecret) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <div className="mx-auto max-w-md px-4 pb-8 pt-4">
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => {
                setView(selectedSong?.title === "General Tip" ? "general-tip" : "tip");
                setClientSecret(null);
                setPaymentError(null);
              }}
              className="rounded-lg p-1.5 text-muted hover:text-text-white"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-bold">Secure Checkout</h1>
              <p className="text-sm text-muted">Powered by Stripe</p>
            </div>
          </div>

          <PaymentForm clientSecret={clientSecret} />
        </div>
      </div>
    );
  }

  // Browse Library View
  if (view === "browse") {
    return (
      <div className="min-h-screen bg-dark-bg">
        <div className="mx-auto max-w-md px-4 pb-8 pt-4">
          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={() => setView("queue")}
              className="rounded-lg p-1.5 text-muted hover:text-text-white"
              aria-label="Back to queue"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-bold">Choose a Song</h1>
              <p className="text-sm text-muted">{artistName}&apos;s library</p>
            </div>
          </div>

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
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

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
                {song.albumArtUrl ? (
                  <img
                    src={song.albumArtUrl}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-bg">
                    <Music className="h-5 w-5 text-muted" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-text-white">{song.title}</p>
                  <p className="text-sm text-muted">{song.originalArtist}</p>
                </div>
                <DollarSign className="h-5 w-5 text-warm" />
              </button>
            ))}
            {filteredLibrary.length === 0 && (
              <p className="py-8 text-center text-muted">No songs found</p>
            )}
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
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => setView("browse")}
              className="rounded-lg p-1.5 text-muted hover:text-text-white"
              aria-label="Back to song list"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-bold">Add Your Tip</h1>
              <p className="text-sm text-muted">The bigger the tip, the sooner it plays</p>
            </div>
          </div>

          <Card className="mb-6 border-primary/20">
            <div className="flex items-center gap-3">
              {selectedSong.albumArtUrl ? (
                <img
                  src={selectedSong.albumArtUrl}
                  alt=""
                  className="h-12 w-12 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Music className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <p className="font-semibold text-text-white">{selectedSong.title}</p>
                <p className="text-sm text-muted">{selectedSong.originalArtist}</p>
              </div>
            </div>
          </Card>

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

          {nextUp && (
            <div className="mb-6 rounded-xl bg-card-bg p-3 text-center text-sm text-muted">
              <p>
                Current #1 is at{" "}
                <span className="font-mono font-semibold text-warm">
                  {formatCents(nextUp.totalTips)}
                </span>
              </p>
              <p className="mt-1">Tip higher to get your song to #1!</p>
            </div>
          )}

          {paymentError && (
            <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-400">
              {paymentError}
            </div>
          )}

          <Button
            variant="warm"
            size="lg"
            className="w-full gap-2 text-lg"
            onClick={handleTipSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <DollarSign className="h-5 w-5" />
            )}
            {submitting
              ? "Submitting..."
              : `Tip ${fmtCents(getTipAmount() + estimateFees(getTipAmount()).total)} for this song`}
          </Button>

          {(() => {
            const amt = getTipAmount();
            const f = estimateFees(amt);
            return (
              <div className="mt-4 rounded-xl bg-card-bg/60 px-4 py-3">
                <p className="mb-2 text-center text-sm font-medium text-muted">
                  +{fmtCents(f.total)} fee
                </p>
                <div className="flex justify-between text-xs text-muted">
                  <span>Stripe fee</span>
                  <span>{fmtCents(f.stripeFee)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted">
                  <span>Service fee</span>
                  <span>{fmtCents(f.platformFee)}</span>
                </div>
                <div className="mt-1.5 flex justify-between border-t border-border pt-1.5 text-xs font-medium text-text-white">
                  <span>Total</span>
                  <span>{fmtCents(amt + f.total)}</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  // General Tip View (no song)
  if (view === "general-tip") {
    return (
      <div className="min-h-screen bg-dark-bg">
        <div className="mx-auto max-w-md px-4 pb-8 pt-4">
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => setView("queue")}
              className="rounded-lg p-1.5 text-muted hover:text-text-white"
              aria-label="Back to queue"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-bold">Send a Tip</h1>
              <p className="text-sm text-muted">Show {artistName} some love</p>
            </div>
          </div>

          <Card className="mb-6 border-warm/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warm/10">
                <Heart className="h-6 w-6 text-warm" />
              </div>
              <div>
                <p className="font-semibold text-text-white">Tip for {artistName}</p>
                <p className="text-sm text-muted">No song request — just a tip</p>
              </div>
            </div>
          </Card>

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

          <div className="mb-4">
            <Input
              placeholder="Add a message (optional)"
              value={tipMessage}
              onChange={(e) => setTipMessage(e.target.value)}
            />
          </div>

          {paymentError && (
            <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-400">
              {paymentError}
            </div>
          )}

          <Button
            variant="warm"
            size="lg"
            className="w-full gap-2 text-lg"
            onClick={handleGeneralTipSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Heart className="h-5 w-5" />
            )}
            {submitting
              ? "Sending..."
              : `Send ${fmtCents(getTipAmount() + estimateFees(getTipAmount()).total)} Tip`}
          </Button>

          {(() => {
            const amt = getTipAmount();
            const f = estimateFees(amt);
            return (
              <div className="mt-4 rounded-xl bg-card-bg/60 px-4 py-3">
                <p className="mb-2 text-center text-sm font-medium text-muted">
                  +{fmtCents(f.total)} fee
                </p>
                <div className="flex justify-between text-xs text-muted">
                  <span>Stripe fee</span>
                  <span>{fmtCents(f.stripeFee)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted">
                  <span>Service fee</span>
                  <span>{fmtCents(f.platformFee)}</span>
                </div>
                <div className="mt-1.5 flex justify-between border-t border-border pt-1.5 text-xs font-medium text-text-white">
                  <span>Total</span>
                  <span>{fmtCents(amt + f.total)}</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  // Main Queue View
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="mx-auto max-w-md px-4 pb-24 pt-4">
        <div className="mb-6 text-center">
          <Link href="/" className="mb-2 inline-flex items-center gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Music className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-text-white">PlayThatJam</span>
          </Link>
          <h1 className="text-xl font-bold">{event.name}</h1>
          <Link
            href={`/artist/${event.artistProfile.profileSlug}`}
            className="text-sm text-primary hover:underline"
          >
            {artistName}
          </Link>
          {event.status === "LIVE" && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-warm/10 px-3 py-1 text-xs font-semibold text-warm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warm" />
              LIVE NOW
            </div>
          )}
        </div>

        {nextUp && (
          <div className="mb-6">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-warm">
              <Crown className="h-3.5 w-3.5" />
              Next Up
            </p>
            <Card glow="warm" className="next-up-glow border-warm/30 bg-warm/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {nextUp.song.albumArtUrl ? (
                    <img
                      src={nextUp.song.albumArtUrl}
                      alt=""
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warm/20">
                      <Flame className="h-6 w-6 text-warm" />
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-bold text-text-white">
                      {nextUp.song.title}
                    </p>
                    <p className="text-sm text-muted">{nextUp.song.originalArtist}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedSong({
                    id: nextUp.song.id,
                    title: nextUp.song.title,
                    originalArtist: nextUp.song.originalArtist,
                    albumArtUrl: nextUp.song.albumArtUrl,
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

        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            In the Queue
          </p>
          {queue.length > 1 ? (
            <div className="space-y-2">
              {queue.slice(1).map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between rounded-xl border p-3 ${
                    index === 0
                      ? "queue-first-glow border-primary/25 bg-primary/5"
                      : "border-border bg-card-bg"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.song.albumArtUrl ? (
                      <img
                        src={item.song.albumArtUrl}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-bg font-mono text-sm text-muted">
                        {index + 2}
                      </span>
                    )}
                    <div>
                      <p className="font-medium text-text-white">{item.song.title}</p>
                      <p className="text-sm text-muted">{item.song.originalArtist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedSong({
                          id: item.song.id,
                          title: item.song.title,
                          originalArtist: item.song.originalArtist,
                          albumArtUrl: item.song.albumArtUrl,
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
          ) : !nextUp ? (
            <p className="py-4 text-center text-sm text-muted">
              No songs in the queue yet. Be the first to request!
            </p>
          ) : null}
        </div>

        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-dark-bg/95 p-4 backdrop-blur-sm">
          <div className="mx-auto flex max-w-md gap-3">
            <Button
              variant="primary"
              size="lg"
              className="flex-1 gap-2 text-base"
              onClick={() => setView("browse")}
            >
              <Music className="h-5 w-5" />
              Request a Song
            </Button>
            <Button
              variant="warm"
              size="lg"
              className="gap-2 text-base"
              onClick={() => {
                setSelectedAmount(500);
                setCustomAmount("");
                setTipMessage("");
                setView("general-tip");
              }}
            >
              <Heart className="h-5 w-5" />
              Tip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
