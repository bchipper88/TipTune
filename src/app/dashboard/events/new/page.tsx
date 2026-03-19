"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Clock, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTE_PRESETS = ["00", "15", "30", "45"];

function TimeSelector({
  label,
  date,
  hour,
  minute,
  period,
  onDateChange,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
  required = false,
}: {
  label: string;
  date: string;
  hour: string;
  minute: string;
  period: "AM" | "PM";
  onDateChange: (v: string) => void;
  onHourChange: (v: string) => void;
  onMinuteChange: (v: string) => void;
  onPeriodChange: (v: "AM" | "PM") => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="mb-1.5 block text-sm font-medium text-muted">
        <Clock className="mr-1 inline h-3.5 w-3.5" />
        {label}
      </label>
      <Input
        type="date"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        required={required}
      />
      <div className="flex items-center gap-2">
        <select
          value={hour}
          onChange={(e) => onHourChange(e.target.value)}
          className="rounded-lg border border-border bg-card-bg px-2 py-2 text-sm text-text-white focus:border-primary focus:outline-none"
          required={required}
        >
          <option value="" disabled>
            Hr
          </option>
          {HOURS.map((h) => (
            <option key={h} value={String(h)}>
              {h}
            </option>
          ))}
        </select>
        <span className="text-muted">:</span>
        <div className="flex gap-1">
          {MINUTE_PRESETS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onMinuteChange(m)}
              className={`rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                minute === m
                  ? "bg-primary text-white"
                  : "border border-border bg-card-bg text-muted hover:text-text-white"
              }`}
            >
              :{m}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onPeriodChange(period === "AM" ? "PM" : "AM")}
          className="rounded-lg border border-border bg-card-bg px-2.5 py-2 text-sm font-medium text-text-white hover:border-primary transition-colors"
        >
          {period}
        </button>
      </div>
    </div>
  );
}

function toDatetimeLocal(date: string, hour: string, minute: string, period: "AM" | "PM"): string {
  if (!date || !hour || !minute) return "";
  let h = parseInt(hour, 10);
  if (period === "AM" && h === 12) h = 0;
  if (period === "PM" && h !== 12) h += 12;
  return `${date}T${String(h).padStart(2, "0")}:${minute}`;
}

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState("");
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("00");
  const [startPeriod, setStartPeriod] = useState<"AM" | "PM">("PM");

  const [endDate, setEndDate] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("00");
  const [endPeriod, setEndPeriod] = useState<"AM" | "PM">("PM");

  const [form, setForm] = useState({
    name: "",
    venueName: "",
    venueAddress: "",
    description: "",
  });

  const startsAt = toDatetimeLocal(startDate, startHour, startMinute, startPeriod);
  const endsAt = toDatetimeLocal(endDate, endHour, endMinute, endPeriod);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, startsAt, endsAt }),
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
            <TimeSelector
              label="Start Time"
              date={startDate}
              hour={startHour}
              minute={startMinute}
              period={startPeriod}
              onDateChange={setStartDate}
              onHourChange={setStartHour}
              onMinuteChange={setStartMinute}
              onPeriodChange={setStartPeriod}
              required
            />
            <TimeSelector
              label="End Time (optional)"
              date={endDate}
              hour={endHour}
              minute={endMinute}
              period={endPeriod}
              onDateChange={setEndDate}
              onHourChange={setEndHour}
              onMinuteChange={setEndMinute}
              onPeriodChange={setEndPeriod}
            />
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
