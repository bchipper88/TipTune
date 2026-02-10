"use client";

import { useState } from "react";
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
} from "lucide-react";
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

export default function LiveEventPage() {
  const [eventStatus, setEventStatus] = useState<"UPCOMING" | "LIVE" | "COMPLETED">("UPCOMING");
  const [queue] = useState<QueueItem[]>([
    // Demo data
    {
      id: "1",
      song: { title: "Don't Stop Believin'", originalArtist: "Journey", albumArtUrl: "" },
      totalTips: 4700,
      status: "QUEUED",
      _count: { tips: 8 },
    },
    {
      id: "2",
      song: { title: "Sweet Caroline", originalArtist: "Neil Diamond", albumArtUrl: "" },
      totalTips: 3200,
      status: "QUEUED",
      _count: { tips: 5 },
    },
    {
      id: "3",
      song: { title: "Piano Man", originalArtist: "Billy Joel", albumArtUrl: "" },
      totalTips: 2800,
      status: "QUEUED",
      _count: { tips: 4 },
    },
    {
      id: "4",
      song: { title: "Bohemian Rhapsody", originalArtist: "Queen", albumArtUrl: "" },
      totalTips: 1500,
      status: "QUEUED",
      _count: { tips: 2 },
    },
  ]);
  const [showQR, setShowQR] = useState(false);

  const totalEarnings = queue.reduce((sum, item) => sum + item.totalTips, 0);
  const nextUp = queue.filter((q) => q.status === "QUEUED").sort((a, b) => b.totalTips - a.totalTips)[0];

  const formatCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div>
      {/* Event Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Friday Night Live</h1>
            <Badge variant={eventStatus === "LIVE" ? "warm" : eventStatus === "UPCOMING" ? "primary" : "muted"}>
              {eventStatus}
            </Badge>
          </div>
          <p className="text-muted">The Blue Note · Tonight</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => setShowQR(!showQR)}
          >
            <QrCode className="h-4 w-4" />
            QR Code
          </Button>
          {eventStatus === "UPCOMING" && (
            <Button
              variant="warm"
              className="gap-2"
              onClick={() => setEventStatus("LIVE")}
            >
              <Radio className="h-4 w-4" />
              Go Live
            </Button>
          )}
          {eventStatus === "LIVE" && (
            <Button
              variant="danger"
              className="gap-2"
              onClick={() => setEventStatus("COMPLETED")}
            >
              <Pause className="h-4 w-4" />
              End Event
            </Button>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <Card className="mb-6 border-primary/20 text-center">
          <p className="mb-3 text-sm text-muted">
            Display this QR code at your venue so the audience can scan and request songs
          </p>
          <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl bg-text-white">
            <QrCode className="h-32 w-32 text-dark-bg" />
          </div>
          <p className="mt-3 text-xs text-muted">
            tiptune.com/event/friday-night-live-abc123
          </p>
          <Button variant="ghost" size="sm" className="mt-3">
            Download Printable Version
          </Button>
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
          <p className="text-xl font-bold">{queue.length}</p>
          <p className="text-xs text-muted">In Queue</p>
        </Card>
        <Card className="text-center">
          <Users className="mx-auto mb-1 h-5 w-5 text-secondary" />
          <p className="text-xl font-bold">{queue.reduce((sum, q) => sum + q._count.tips, 0)}</p>
          <p className="text-xs text-muted">Total Tips</p>
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
                  <Button size="sm" variant="warm" className="gap-1">
                    <Play className="h-3 w-3" />
                    Play
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1">
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
      <div className="space-y-2">
        {queue
          .filter((q) => q.status === "QUEUED" && q.id !== nextUp?.id)
          .sort((a, b) => b.totalTips - a.totalTips)
          .map((item, index) => (
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
                  <button className="rounded-lg p-1.5 text-muted transition-colors hover:bg-success/10 hover:text-success">
                    <Check className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-1.5 text-muted transition-colors hover:bg-muted/10">
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
