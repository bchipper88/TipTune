"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Music,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ConnectStatus {
  connected: boolean;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  detailsSubmitted?: boolean;
}

interface EarningsData {
  totalEarnings: number;
  thisMonth: number;
  lastEventEarnings: number;
  lastEventName: string | null;
  recentTips: {
    id: string;
    amount: number;
    message: string | null;
    createdAt: string;
    songTitle: string;
    eventName: string;
  }[];
}

export default function EarningsPage() {
  const searchParams = useSearchParams();
  const [connectStatus, setConnectStatus] = useState<ConnectStatus | null>(null);
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const stripeReturn = searchParams.get("stripe");

  useEffect(() => {
    Promise.all([
      fetch("/api/stripe/connect/status").then((r) => r.json()),
      fetch("/api/stripe/earnings").then((r) => r.json()),
    ])
      .then(([status, earningsData]) => {
        setConnectStatus(status);
        if (earningsData.totalEarnings !== undefined) setEarnings(earningsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleConnectStripe = async () => {
    setConnecting(true);
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Connect failed:", err);
      setConnecting(false);
    }
  };

  const formatCents = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  const isFullyConnected =
    connectStatus?.connected &&
    connectStatus?.chargesEnabled &&
    connectStatus?.detailsSubmitted;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Earnings</h1>
        <p className="text-muted">Track your tips and manage payouts</p>
      </div>

      {/* Success banner after returning from Stripe */}
      {stripeReturn === "success" && isFullyConnected && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-success/10 p-4 text-success">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            Stripe account connected! You&apos;re ready to receive tips.
          </p>
        </div>
      )}

      {/* Earnings Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-warm/10 p-2.5">
              <DollarSign className="h-5 w-5 text-warm" />
            </div>
            <div>
              <p className="text-sm text-muted">Total Earnings</p>
              <p className="font-mono text-2xl font-bold text-warm">
                {formatCents(earnings?.totalEarnings || 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted">This Month</p>
              <p className="font-mono text-2xl font-bold">
                {formatCents(earnings?.thisMonth || 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-secondary/10 p-2.5">
              <Calendar className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted">Last Event</p>
              <p className="font-mono text-2xl font-bold">
                {formatCents(earnings?.lastEventEarnings || 0)}
              </p>
              {earnings?.lastEventName && (
                <p className="text-xs text-muted">{earnings.lastEventName}</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Stripe Connect Status */}
      {!isFullyConnected && (
        <Card className="mb-8 border-warm/20">
          <div className="flex flex-col items-center py-8 text-center sm:flex-row sm:text-left">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-warm/10 sm:mb-0 sm:mr-6">
              <DollarSign className="h-8 w-8 text-warm" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {connectStatus?.connected && !connectStatus?.detailsSubmitted
                  ? "Finish Setting Up Stripe"
                  : "Set Up Payouts"}
              </h2>
              <p className="mt-1 text-muted">
                {connectStatus?.connected && !connectStatus?.detailsSubmitted
                  ? "Your Stripe account setup is incomplete. Finish onboarding to start receiving tips."
                  : "Connect your Stripe account to receive payouts directly to your bank account. Tips are transferred after each event."}
              </p>
            </div>
            <Button
              variant="warm"
              className="mt-4 gap-2 sm:ml-4 sm:mt-0"
              onClick={handleConnectStripe}
              disabled={connecting}
            >
              {connecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {connectStatus?.connected ? "Complete Setup" : "Connect Stripe"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {isFullyConnected && (
        <div className="mb-8 flex items-center gap-3 rounded-xl bg-card-bg p-4">
          <CheckCircle className="h-5 w-5 text-success" />
          <p className="text-sm text-muted">
            Stripe connected — payouts are handled automatically by Stripe.
          </p>
        </div>
      )}

      {/* Recent Tips */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Tips</h2>
        {earnings?.recentTips && earnings.recentTips.length > 0 ? (
          <div className="space-y-2">
            {earnings.recentTips.map((tip) => (
              <Card key={tip.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warm/10">
                      {tip.songTitle === "General Tip" ? (
                        <DollarSign className="h-5 w-5 text-warm" />
                      ) : (
                        <Music className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {tip.songTitle === "General Tip" ? "General Tip" : tip.songTitle}
                      </p>
                      <p className="text-xs text-muted">
                        {tip.eventName} &middot;{" "}
                        {new Date(tip.createdAt).toLocaleDateString()}
                      </p>
                      {tip.message && (
                        <p className="mt-0.5 text-xs italic text-muted">
                          &ldquo;{tip.message}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="font-mono font-semibold text-warm">
                    {formatCents(tip.amount)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center">
            <div className="py-8">
              <p className="text-muted">
                No tips yet. Start taking tips at your next event!
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
