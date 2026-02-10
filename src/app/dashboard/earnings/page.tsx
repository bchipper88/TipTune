"use client";

import { DollarSign, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EarningsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Earnings</h1>
        <p className="text-muted">Track your tips and manage payouts</p>
      </div>

      {/* Earnings Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-warm/10 p-2.5">
              <DollarSign className="h-5 w-5 text-warm" />
            </div>
            <div>
              <p className="text-sm text-muted">Total Earnings</p>
              <p className="font-mono text-2xl font-bold text-warm">$0.00</p>
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
              <p className="font-mono text-2xl font-bold">$0.00</p>
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
              <p className="font-mono text-2xl font-bold">$0.00</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Stripe Setup */}
      <Card className="border-warm/20">
        <div className="flex flex-col items-center py-8 text-center sm:flex-row sm:text-left">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-warm/10 sm:mb-0 sm:mr-6">
            <DollarSign className="h-8 w-8 text-warm" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Set Up Payouts</h2>
            <p className="mt-1 text-muted">
              Connect your Stripe account to receive payouts directly to your
              bank account. Tips are transferred after each event.
            </p>
          </div>
          <Button variant="warm" className="mt-4 gap-2 sm:ml-4 sm:mt-0">
            Connect Stripe
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Payout History */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Payout History</h2>
        <Card className="text-center">
          <div className="py-8">
            <p className="text-muted">No payouts yet. Start taking tips at your next event!</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
