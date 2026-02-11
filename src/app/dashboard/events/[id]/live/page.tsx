"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Music,
  Play,
  SkipForward,
  Check,
  Pause,
  QrCode,
  DollarSign,
  Users,
  Radio,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QueueItem {
  id: string;
  song: { title: string; originalArtist: string; albumArtUrl?: string };
  totalTips: number;
  status: "QUEUED" | "PLAYING" | "COMPLETED" | "SKIPPED";
  _count: { tips: number };
}

interface EventData {
  id: string;
  name: string;
  venueName: string;
  venueAddress?: string;
  startsAt: string;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
  eventSlug: string;
}

export default function LiveEventPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventData | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const fetchData = useCallback(() => {
    fetch(`/api/events/${id}/queue`)
      .then((res) => res.json())
      .then((data) => {
        if (data.event) setEvent(data.event);
        if (data.requests) setQueue(data.requests);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const updateEventStatus = async (status: "LIVE" | "COMPLETED") => {
    const res = await fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setEvent((prev) => prev ? { ...prev, status: updated.status } : prev);
    }
  };

  const updateRequestStatus = async (requestId: string, status: "PLAYING" | "COMPLETED" | "SKIPPED") => {
    const res = await fetch(`/api/events/${id}/requests/${requestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      fetchData();
    }
  };

  const handleShowQR = async () => {
    if (!showQR && !qrDataUrl && event) {
      const baseUrl = window.location.origin;
      const eventUrl = `${baseUrl}/event/${event.eventSlug}`;
      try {
        const { generateQRCodeDataURL } = await import("@/lib/qr");
        const dataUrl = await generateQRCodeDataURL(eventUrl);
        setQrDataUrl(dataUrl);
      } catch {
        // QR generation failed silently
      }
    }
    setShowQR(!showQR);
  };

  const totalEarnings = queue.reduce((sum, item) => sum + item.totalTips, 0);
  const queuedItems = queue.filter((q) => q.status === "QUEUED").sort((a, b) => b.totalTips - a.totalTips);
  const nextUp = queuedItems[0];

  const formatCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted">Event not found</p>
        <Link href="/dashboard/events" className="mt-4 inline-block text-primary hover:underline">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Event Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/dashboard/events" className="mb-2 inline-flex items-center gap-1 text-sm text-muted hover:text-text-white">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Events
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{event.name}</h1>
            <Badge variant={event.status === "LIVE" ? "warm" : event.status === "UPCOMING" ? "primary" : "muted"}>
              {event.status}
            </Badge>
          </div>
          <p className="text-muted">{event.venueName}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={handleShowQR}
          >
            <QrCode className="h-4 w-4" />
            QR Code
          </Button>
          {event.status === "UPCOMING" && (
            <Button
              variant="warm"
              className="gap-2"
              onClick={() => updateEventStatus("LIVE")}
            >
              <Radio className="h-4 w-4" />
              Go Live
            </Button>
          )}
          {event.status === "LIVE" && (
            <Button
              variant="danger"
              className="gap-2"
              onClick={() => updateEventStatus("COMPLETED")}
            >
              <Pause className="h-4 w-4" />
              End Event
            </Button>
          )}
        </div>
      </div>

      {/* QR Code */}
      {showQR && (
        <Card className="mb-6 border-primary/20 text-center">
          <p className="mb-3 text-sm text-muted">
            Display this QR code at your venue so the audience can scan and request songs
          </p>
          <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl bg-text-white">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="Event QR Code" className="h-44 w-44 rounded-xl" />
            ) : (
              <QrCode className="h-32 w-32 text-dark-bg" />
            )}
          </div>
          <p className="mt-3 text-xs text-muted">
            {typeof window !== "undefined" ? window.location.origin : ""}/event/{event.eventSlug}
          </p>
        </Card>
      )}

      {/* Stats Bar */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <Card className="text-center">
          <DollarSign className="mx-auto mb-1 h-5 w-5 text-warm" />
          <p className="font-mono text-xl font-bold text-warm">{formatCents(totalEarnings)}</p>
          <p className="text-xs text-muted">Total Tips</p>
        </Card>
        <Card className="text-center">
          <Music className="mx-auto mb-1 h-5 w-5 text-primary" />
          <p className="text-xl font-bold">{queuedItems.length}</p>
          <p className="text-xs text-muted">In Queue</p>
        </Card>
        <Card className="text-center">
          <Users className="mx-auto mb-1 h-5 w-5 text-secondary" />
          <p className="text-xl font-bold">{queue.reduce((sum, q) => sum + q._count.tips, 0)}</p>
          <p className="text-xs text-muted">Tip Count</p>
        </Card>
      </div>

      {/* Next Up */}
      {nextUp && (
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
            Next Up
          </h2>
          <Card glow="warm" className="border-warm/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-warm/20">
                  <Music className="h-7 w-7 text-warm" />
                </div>
                <div>
                  <p className="text-lg font-bold text-text-white">{nextUp.song.title}</p>
                  <p className="text-muted">{nextUp.song.originalArtist}</p>
                  <p className="mt-1 text-sm text-muted">{nextUp._count.tips} tippers</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-2xl font-bold text-warm">
                  {formatCents(nextUp.totalTips)}
                </p>
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="warm"
                    className="gap-1"
                    onClick={() => updateRequestStatus(nextUp.id, "COMPLETED")}
                  >
                    <Play className="h-3 w-3" />
                    Played
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1"
                    onClick={() => updateRequestStatus(nextUp.id, "SKIPPED")}
                  >
                    <SkipForward className="h-3 w-3" />
                    Skip
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Queue */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
        Queue
      </h2>
      {queuedItems.length > 1 ? (
        <div className="space-y-2">
          {queuedItems.slice(1).map((item, index) => (
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
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-mono font-semibold text-text-white">
                    {formatCents(item.totalTips)}
                  </p>
                  <p className="text-xs text-muted">{item._count.tips} tips</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => updateRequestStatus(item.id, "COMPLETED")}
                    className="rounded-lg p-1.5 text-muted transition-colors hover:bg-success/10 hover:text-success"
                    aria-label="Mark as played"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => updateRequestStatus(item.id, "SKIPPED")}
                    className="rounded-lg p-1.5 text-muted transition-colors hover:bg-muted/10"
                    aria-label="Skip song"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !nextUp ? (
        <Card className="text-center">
          <div className="py-8">
            <Music className="mx-auto mb-3 h-10 w-10 text-muted" />
            <p className="text-muted">No song requests yet</p>
            <p className="mt-1 text-sm text-muted">Share your QR code to get the audience requesting songs!</p>
          </div>
        </Card>
      ) : (
        <p className="py-4 text-center text-sm text-muted">No more songs in queue</p>
      )}
    </div>
  );
}
