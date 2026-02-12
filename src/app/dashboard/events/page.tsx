"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Plus, MapPin, Clock, ArrowRight, Radio, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  name: string;
  venueName: string;
  venueAddress?: string;
  startsAt: string;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
  eventSlug: string;
  _count: { requests: number };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"active" | "past">("active");

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = (status: Event["status"]) => {
    switch (status) {
      case "LIVE":
        return <Badge variant="warm">LIVE</Badge>;
      case "UPCOMING":
        return <Badge variant="primary">Upcoming</Badge>;
      case "COMPLETED":
        return <Badge variant="muted">Completed</Badge>;
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-muted">
            {events.length} {events.length === 1 ? "event" : "events"}
          </p>
        </div>
        <Link href="/dashboard/events/new">
          <Button variant="warm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </Link>
      </div>

      {/* Tab Toggle */}
      {!loading && events.length > 0 && (
        <div className="mb-6 flex gap-1 rounded-xl bg-card-bg p-1">
          <button
            onClick={() => setTab("active")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === "active"
                ? "bg-primary text-white"
                : "text-muted hover:text-text-white"
            }`}
          >
            Current & Upcoming
          </button>
          <button
            onClick={() => setTab("past")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === "past"
                ? "bg-primary text-white"
                : "text-muted hover:text-text-white"
            }`}
          >
            Past
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-4">
          {events
            .filter((e) =>
              tab === "active"
                ? e.status === "LIVE" || e.status === "UPCOMING"
                : e.status === "COMPLETED"
            )
            .map((event) => (
            <Link key={event.id} href={`/dashboard/events/${event.id}/live`}>
              <Card className="group cursor-pointer transition-all hover:border-primary/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded-xl p-2.5 ${
                        event.status === "LIVE" ? "bg-warm/10" : "bg-card-hover"
                      }`}
                    >
                      {event.status === "LIVE" ? (
                        <Radio className="h-5 w-5 text-warm" />
                      ) : (
                        <Calendar className="h-5 w-5 text-muted" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-text-white">{event.name}</p>
                        {statusBadge(event.status)}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-muted">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.venueName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(event.startsAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted">
                      {event._count.requests} requests
                    </span>
                    <ArrowRight className="h-5 w-5 text-muted transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          {events.filter((e) =>
            tab === "active"
              ? e.status === "LIVE" || e.status === "UPCOMING"
              : e.status === "COMPLETED"
          ).length === 0 && (
            <p className="py-8 text-center text-sm text-muted">
              {tab === "active" ? "No upcoming or live events" : "No past events yet"}
            </p>
          )}
        </div>
      ) : (
        <Card className="text-center">
          <div className="py-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-warm/10">
              <Calendar className="h-8 w-8 text-warm" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No events yet</h3>
            <p className="mx-auto mb-6 max-w-sm text-muted">
              Create your first event to start taking song requests and earning
              tips at your next gig.
            </p>
            <Link href="/dashboard/events/new">
              <Button variant="warm" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Event
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
