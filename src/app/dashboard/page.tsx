"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Library, Calendar, DollarSign, Plus, ArrowRight, Music, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  totalSongs: number;
  totalEvents: number;
  totalEarnings: number;
  activeEvent: { name: string; id: string } | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSongs: 0,
    totalEvents: 0,
    totalEarnings: 0,
    activeEvent: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setStats(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatCents = (cents: number) => {
    const dollars = cents / 100;
    return `$${dollars.toFixed(2)}`;
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted">Welcome back! Here&apos;s your overview.</p>
        </div>
        <Link href="/dashboard/events/new">
          <Button variant="warm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <Library className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted">Songs in Library</p>
              {loading ? (
                <Loader2 className="mt-1 h-5 w-5 animate-spin text-muted" />
              ) : (
                <p className="text-2xl font-bold">{stats.totalSongs}</p>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-secondary/10 p-2.5">
              <Calendar className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted">Total Events</p>
              {loading ? (
                <Loader2 className="mt-1 h-5 w-5 animate-spin text-muted" />
              ) : (
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-warm/10 p-2.5">
              <DollarSign className="h-5 w-5 text-warm" />
            </div>
            <div>
              <p className="text-sm text-muted">Total Earnings</p>
              {loading ? (
                <Loader2 className="mt-1 h-5 w-5 animate-spin text-muted" />
              ) : (
                <p className="font-mono text-2xl font-bold">
                  {formatCents(stats.totalEarnings)}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Get Started</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/dashboard/library">
            <Card className="group cursor-pointer transition-all hover:border-primary/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2.5">
                    <Music className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Build Your Library</p>
                    <p className="text-sm text-muted">
                      Search and add songs you can play
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/events/new">
            <Card className="group cursor-pointer transition-all hover:border-warm/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-warm/10 p-2.5">
                    <Calendar className="h-5 w-5 text-warm" />
                  </div>
                  <div>
                    <p className="font-semibold">Create an Event</p>
                    <p className="text-sm text-muted">
                      Set up your next gig to take requests
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted transition-transform group-hover:translate-x-1 group-hover:text-warm" />
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Active Event */}
      {stats.activeEvent && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Active Event</h2>
          <Card glow="warm" className="border-warm/20">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="warm">LIVE</Badge>
                <p className="mt-2 text-lg font-semibold">{stats.activeEvent.name}</p>
              </div>
              <Link href={`/dashboard/events/${stats.activeEvent.id}/live`}>
                <Button variant="warm" className="gap-2">
                  Open Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
