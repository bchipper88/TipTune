"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Music,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ArtistData {
  stageName: string;
  bio: string | null;
  genres: string[];
  socialLinks: Record<string, string> | null;
  avatarUrl: string | null;
  followerCount: number;
}

interface EventItem {
  id: string;
  name: string;
  venueName: string;
  venueAddress?: string;
  startsAt: string;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
  eventSlug: string;
}

export default function ArtistProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [pastEvents, setPastEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/artists/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) setArtist(data.profile);
        if (data.upcomingEvents) setUpcomingEvents(data.upcomingEvents);
        if (data.pastEvents) setPastEvents(data.pastEvents);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg px-4">
        <div className="text-center">
          <Music className="mx-auto mb-4 h-12 w-12 text-muted" />
          <h2 className="mb-2 text-xl font-bold">Artist Not Found</h2>
          <p className="text-muted">This artist profile doesn&apos;t exist.</p>
          <Link href="/explore" className="mt-4 inline-block text-primary hover:underline">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const socialLinks = (artist.socialLinks || {}) as Record<string, string>;

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
          {artist.bio && (
            <p className="mx-auto mt-4 max-w-md text-muted">{artist.bio}</p>
          )}

          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1 text-sm text-muted">
              <Users className="h-4 w-4" />
              {artist.followerCount} followers
            </div>
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
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
          </div>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
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
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-text-white">{event.name}</p>
                            {event.status === "LIVE" && <Badge variant="warm">LIVE</Badge>}
                          </div>
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
        )}

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

        {upcomingEvents.length === 0 && pastEvents.length === 0 && (
          <Card className="text-center">
            <div className="py-8">
              <Calendar className="mx-auto mb-3 h-10 w-10 text-muted" />
              <p className="text-muted">No events yet</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
