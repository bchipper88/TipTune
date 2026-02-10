"use client";

import Link from "next/link";
import {
  Music,
  Calendar,
  MapPin,
  Users,
  QrCode,
  ExternalLink,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ArtistProfilePage() {
  // Demo data — in production this fetches from /api/artists/:slug
  const artist = {
    stageName: "The House Band",
    bio: "Covering your favorite hits every weekend at venues across the city. From classic rock to modern pop — if you can sing along, we can play it.",
    genres: ["Rock", "Pop", "Country", "Classic Rock"],
    socialLinks: {
      instagram: "https://instagram.com/thehouseband",
      facebook: "https://facebook.com/thehouseband",
    },
    followerCount: 142,
  };

  const upcomingEvents = [
    {
      id: "1",
      name: "Friday Night Live",
      venueName: "The Blue Note",
      venueAddress: "123 Main St",
      startsAt: "2026-02-13T20:00:00",
      status: "UPCOMING" as const,
      eventSlug: "friday-night-live-abc123",
    },
    {
      id: "2",
      name: "Saturday Showdown",
      venueName: "Rusty Tap",
      venueAddress: "456 Oak Ave",
      startsAt: "2026-02-14T21:00:00",
      status: "UPCOMING" as const,
      eventSlug: "saturday-showdown-def456",
    },
  ];

  const pastEvents = [
    {
      id: "3",
      name: "Last Weekend Jam",
      venueName: "The Blue Note",
      startsAt: "2026-02-07T20:00:00",
      status: "COMPLETED" as const,
      eventSlug: "last-weekend-jam-ghi789",
    },
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="mx-auto max-w-2xl px-4 pb-12 pt-6">
        {/* Header */}
        <div className="mb-2">
          <Link href="/" className="inline-flex items-center gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Music className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-text-white">TipTune</span>
          </Link>
        </div>

        {/* Artist Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
            <Music className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold">{artist.stageName}</h1>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {artist.genres.map((genre) => (
              <Badge key={genre} variant="secondary">
                {genre}
              </Badge>
            ))}
          </div>
          <p className="mx-auto mt-4 max-w-md text-muted">{artist.bio}</p>

          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1 text-sm text-muted">
              <Users className="h-4 w-4" />
              {artist.followerCount} followers
            </div>
            {artist.socialLinks.instagram && (
              <a
                href={artist.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted hover:text-text-white"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Instagram
              </a>
            )}
          </div>

          <div className="mt-4 flex justify-center gap-3">
            <Button variant="primary" className="gap-2">
              <Users className="h-4 w-4" />
              Follow
            </Button>
            <Button variant="ghost" className="gap-2">
              <QrCode className="h-4 w-4" />
              QR Code
            </Button>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Upcoming Events</h2>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <Link key={event.id} href={`/event/${event.eventSlug}`}>
                <Card className="group cursor-pointer transition-all hover:border-warm/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-warm/10 p-2.5">
                        <Calendar className="h-5 w-5 text-warm" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-white">{event.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.venueName}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(event.startsAt).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="warm">
                      View
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">Past Events</h2>
            <div className="space-y-3">
              {pastEvents.map((event) => (
                <Card key={event.id} className="opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-card-hover p-2.5">
                      <Calendar className="h-5 w-5 text-muted" />
                    </div>
                    <div>
                      <p className="font-medium text-text-white">{event.name}</p>
                      <p className="text-sm text-muted">
                        {event.venueName} ·{" "}
                        {new Date(event.startsAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
