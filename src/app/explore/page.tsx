"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Radio,
  Compass,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventListing {
  id: string;
  name: string;
  venueName: string;
  venueAddress: string;
  startsAt: string;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
  eventSlug: string;
  artistProfile: { stageName: string; profileSlug: string; genres: string[] };
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<EventListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events/public")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.artistProfile.stageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venueName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="border-b border-border bg-dark-bg/95 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className="mb-2 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/playthatjamlogo.png"
                alt="PlayThatJam"
                width={440}
                height={340}
                priority
                className="h-10 w-auto"
              />
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
          </div>

          <h1 className="mb-1 text-2xl font-bold">
            <Compass className="mr-2 inline h-6 w-6 text-primary" />
            Find Live Music
          </h1>
          <p className="mb-4 text-muted">
            Discover events near you and request songs
          </p>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted" />
            <Input
              placeholder="Search by artist, venue, or event..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="mx-auto max-w-2xl px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted" />
          </div>
        ) : (
          <>
            {/* Live Now Section */}
            {filteredEvents.some((e) => e.status === "LIVE") && (
              <div className="mb-8">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-warm">
                  <Radio className="h-4 w-4" />
                  Live Now
                </h2>
                <div className="space-y-3">
                  {filteredEvents
                    .filter((e) => e.status === "LIVE")
                    .map((event) => (
                      <Link key={event.id} href={`/event/${event.eventSlug}`}>
                        <Card
                          glow="warm"
                          className="group cursor-pointer border-warm/20 transition-all hover:border-warm/40"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-text-white">
                                  {event.name}
                                </p>
                                <Badge variant="warm">LIVE</Badge>
                              </div>
                              <Link
                                href={`/artist/${event.artistProfile.profileSlug}`}
                                className="text-sm text-primary hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {event.artistProfile.stageName}
                              </Link>
                              <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                                <MapPin className="h-3.5 w-3.5" />
                                {event.venueName}
                              </div>
                            </div>
                            <Button size="sm" variant="warm">
                              Join
                            </Button>
                          </div>
                        </Card>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
                Upcoming Events
              </h2>
              <div className="space-y-3">
                {filteredEvents
                  .filter((e) => e.status === "UPCOMING")
                  .map((event) => (
                    <Link key={event.id} href={`/event/${event.eventSlug}`}>
                      <Card className="group cursor-pointer transition-all hover:border-primary/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-text-white">{event.name}</p>
                            <Link
                              href={`/artist/${event.artistProfile.profileSlug}`}
                              className="text-sm text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {event.artistProfile.stageName}
                            </Link>
                            <div className="mt-1 flex items-center gap-3 text-sm text-muted">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {event.venueName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {new Date(event.startsAt).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <div className="mt-2 flex gap-1.5">
                              {event.artistProfile.genres.map((g) => (
                                <Badge key={g} variant="muted">
                                  {g}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Calendar className="h-5 w-5 text-muted" />
                        </div>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>

            {filteredEvents.length === 0 && (
              <Card className="text-center">
                <div className="py-12">
                  <Compass className="mx-auto mb-4 h-12 w-12 text-muted" />
                  <h3 className="mb-2 text-lg font-semibold">No events found</h3>
                  <p className="text-muted">
                    {searchQuery
                      ? "Try a different search term"
                      : "No events are currently listed. Check back soon!"}
                  </p>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
