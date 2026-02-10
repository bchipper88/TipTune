"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Clock, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    venueName: "",
    venueAddress: "",
    startsAt: "",
    endsAt: "",
    description: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create event");
        return;
      }

      const event = await res.json();
      router.push(`/dashboard/events/${event.id}/live`);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/events"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
        <h1 className="text-2xl font-bold">Create New Event</h1>
        <p className="text-muted">Set up your next gig to start taking requests</p>
      </div>

      <Card className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</div>
          )}

          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted" />
            <Input
              id="name"
              placeholder="Event name (e.g., Friday Night Live)"
              className="pl-10"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted" />
            <Input
              id="venueName"
              placeholder="Venue name"
              className="pl-10"
              value={form.venueName}
              onChange={(e) => setForm({ ...form, venueName: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted" />
            <Input
              id="venueAddress"
              placeholder="Venue address (optional)"
              className="pl-10"
              value={form.venueAddress}
              onChange={(e) => setForm({ ...form, venueAddress: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">
                <Clock className="mr-1 inline h-3.5 w-3.5" />
                Start Time
              </label>
              <Input
                id="startsAt"
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">
                <Clock className="mr-1 inline h-3.5 w-3.5" />
                End Time (optional)
              </label>
              <Input
                id="endsAt"
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
              />
            </div>
          </div>

          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted" />
            <textarea
              id="description"
              placeholder="Event description (optional)"
              className="w-full rounded-xl border border-border bg-card-bg px-4 py-2.5 pl-10 text-text-white placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <Button type="submit" variant="warm" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
