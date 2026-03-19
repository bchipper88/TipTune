"use client";

import { useState, useEffect } from "react";
import {
  X,
  DollarSign,
  Music,
  Users,
  SkipForward,
  Check,
  Trophy,
  Loader2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShowSummary {
  totalTips: number;
  tipCount: number;
  songsPlayed: number;
  songsSkipped: number;
  songsQueued: number;
  totalRequests: number;
  topSongs: { title: string; artist: string; tips: number }[];
}

interface EndShowSummaryModalProps {
  eventId: string;
  eventName: string;
  onClose: () => void;
  onConfirmEnd: (updates: { name: string; notes: string }) => Promise<void>;
}

export function EndShowSummaryModal({
  eventId,
  eventName,
  onClose,
  onConfirmEnd,
}: EndShowSummaryModalProps) {
  const [summary, setSummary] = useState<ShowSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(eventName);
  const [notes, setNotes] = useState("");
  const [editingName, setEditingName] = useState(false);

  const formatCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  useEffect(() => {
    fetch(`/api/events/${eventId}/summary`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load summary");
        return res.json();
      })
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleConfirm = async () => {
    setSaving(true);
    await onConfirmEnd({ name, notes });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-dark-bg p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted transition-colors hover:bg-card-bg hover:text-text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-1 text-xl font-bold text-text-white">End Show</h2>
        <p className="mb-5 text-sm text-muted">
          Here&apos;s how the show went
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted" />
          </div>
        ) : summary ? (
          <>
            {/* Stats Grid */}
            <div className="mb-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card-bg p-4 text-center">
                <DollarSign className="mx-auto mb-1.5 h-5 w-5 text-warm" />
                <p className="font-mono text-2xl font-bold text-warm">
                  {formatCents(summary.totalTips)}
                </p>
                <p className="text-xs text-muted">Total Earned</p>
              </div>
              <div className="rounded-xl border border-border bg-card-bg p-4 text-center">
                <Users className="mx-auto mb-1.5 h-5 w-5 text-primary" />
                <p className="text-2xl font-bold text-text-white">
                  {summary.tipCount}
                </p>
                <p className="text-xs text-muted">Tips</p>
              </div>
              <div className="rounded-xl border border-border bg-card-bg p-4 text-center">
                <Check className="mx-auto mb-1.5 h-5 w-5 text-success" />
                <p className="text-2xl font-bold text-text-white">
                  {summary.songsPlayed}
                </p>
                <p className="text-xs text-muted">Songs Played</p>
              </div>
              <div className="rounded-xl border border-border bg-card-bg p-4 text-center">
                <Music className="mx-auto mb-1.5 h-5 w-5 text-secondary" />
                <p className="text-2xl font-bold text-text-white">
                  {summary.totalRequests}
                </p>
                <p className="text-xs text-muted">Total Requests</p>
              </div>
            </div>

            {/* Skipped note if any */}
            {summary.songsSkipped > 0 && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-border bg-card-bg px-4 py-2.5 text-sm text-muted">
                <SkipForward className="h-4 w-4 shrink-0" />
                {summary.songsSkipped} song{summary.songsSkipped > 1 ? "s" : ""} skipped
              </div>
            )}

            {/* Top Songs */}
            {summary.topSongs.length > 0 && (
              <div className="mb-5">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                  <Trophy className="h-3.5 w-3.5" />
                  Top Songs
                </p>
                <div className="space-y-1.5">
                  {summary.topSongs.map((song, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-border bg-card-bg px-3 py-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-dark-bg font-mono text-xs text-muted">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-text-white">
                            {song.title}
                          </p>
                          <p className="text-xs text-muted">{song.artist}</p>
                        </div>
                      </div>
                      <p className="font-mono text-sm font-semibold text-warm">
                        {formatCents(song.tips)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rename Show */}
            <div className="mb-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                Show Name
              </p>
              {editingName ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setEditingName(false)}
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setEditingName(true)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-card-bg px-4 py-2.5 text-left text-text-white transition-colors hover:border-primary/40"
                >
                  <span>{name}</span>
                  <Pencil className="h-3.5 w-3.5 text-muted" />
                </button>
              )}
            </div>

            {/* Notes */}
            <div className="mb-6">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                Notes
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did the show go? Any notes for next time..."
                rows={3}
                className="w-full rounded-xl border border-border bg-card-bg px-4 py-2.5 text-text-white placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
              />
            </div>
          </>
        ) : (
          <p className="py-8 text-center text-muted">
            Could not load summary
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1 gap-2"
            onClick={handleConfirm}
            disabled={saving || loading}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            End Show
          </Button>
        </div>
      </div>
    </div>
  );
}
