"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, Plus, Music, GripVertical, Trash2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Song {
  id?: string;
  title: string;
  originalArtist: string;
  albumArtUrl?: string;
  deezerTrackId?: string;
  duration?: number;
  genre?: string;
  sortOrder?: number;
  isActive?: boolean;
}

interface SearchResult {
  deezerTrackId: string;
  title: string;
  originalArtist: string;
  albumArtUrl: string;
  duration: number;
}

export default function LibraryPage() {
  const [library, setLibrary] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Load existing songs from database on mount
  useEffect(() => {
    async function loadSongs() {
      try {
        const res = await fetch("/api/songs");
        if (res.ok) {
          const songs = await res.json();
          setLibrary(songs);
        }
      } catch {
        console.error("Failed to load songs");
      }
    }
    loadSongs();
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/songs/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch {
      console.error("Search failed");
    } finally {
      setSearching(false);
    }
  }, [searchQuery]);

  const addToLibrary = async (result: SearchResult) => {
    setAddingId(result.deezerTrackId);
    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      if (res.ok) {
        const song = await res.json();
        setLibrary((prev) => [...prev, song]);
        setSearchResults((prev) =>
          prev.filter((r) => r.deezerTrackId !== result.deezerTrackId)
        );
      }
    } catch {
      console.error("Failed to add song");
    } finally {
      setAddingId(null);
    }
  };

  const removeSong = async (songId: string) => {
    try {
      await fetch(`/api/songs?id=${songId}`, { method: "DELETE" });
      setLibrary((prev) => prev.filter((s) => s.id !== songId));
    } catch {
      console.error("Failed to remove song");
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Song Library</h1>
          <p className="text-muted">
            {library.length} songs in your library
          </p>
        </div>
        <Button
          variant="primary"
          className="gap-2"
          onClick={() => setShowSearch(!showSearch)}
        >
          {showSearch ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showSearch ? "Close" : "Add Songs"}
        </Button>
      </div>

      {/* Deezer Search Panel */}
      {showSearch && (
        <Card className="mb-8 border-primary/20">
          <h3 className="mb-4 font-semibold">Search for songs to add</h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted" />
              <Input
                placeholder="Search by song title or artist..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={searching}>
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 max-h-96 space-y-2 overflow-y-auto">
              {searchResults.map((result) => {
                const alreadyAdded = library.some(
                  (s) => s.deezerTrackId === result.deezerTrackId
                );
                return (
                  <div
                    key={result.deezerTrackId}
                    className="flex items-center justify-between rounded-xl border border-border bg-dark-bg p-3"
                  >
                    <div className="flex items-center gap-3">
                      {result.albumArtUrl ? (
                        <img
                          src={result.albumArtUrl}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card-bg">
                          <Music className="h-5 w-5 text-muted" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-text-white">{result.title}</p>
                        <p className="text-sm text-muted">
                          {result.originalArtist}
                          {result.duration ? ` · ${formatDuration(result.duration)}` : ""}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={alreadyAdded ? "ghost" : "primary"}
                      disabled={alreadyAdded || addingId === result.deezerTrackId}
                      onClick={() => addToLibrary(result)}
                    >
                      {addingId === result.deezerTrackId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : alreadyAdded ? (
                        "Added"
                      ) : (
                        <>
                          <Plus className="mr-1 h-3 w-3" /> Add
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {searching && (
            <div className="mt-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {!searching && searchResults.length === 0 && searchQuery && (
            <p className="mt-4 text-center text-sm text-muted">
              No results found. Try a different search term.
            </p>
          )}
        </Card>
      )}

      {/* Library List */}
      {library.length > 0 ? (
        <div className="space-y-2">
          {library.map((song, index) => (
            <div
              key={song.id || index}
              className="flex items-center gap-3 rounded-xl border border-border bg-card-bg p-3 transition-colors hover:border-border"
            >
              <GripVertical className="h-4 w-4 flex-shrink-0 cursor-grab text-muted" />

              <span className="w-8 text-center font-mono text-sm text-muted">
                {index + 1}
              </span>

              {song.albumArtUrl ? (
                <img
                  src={song.albumArtUrl}
                  alt=""
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-bg">
                  <Music className="h-5 w-5 text-muted" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-text-white">{song.title}</p>
                <p className="truncate text-sm text-muted">{song.originalArtist}</p>
              </div>

              {song.duration && (
                <span className="font-mono text-xs text-muted">
                  {formatDuration(song.duration)}
                </span>
              )}

              <button
                onClick={() => song.id && removeSong(song.id)}
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <div className="py-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Music className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No songs yet</h3>
            <p className="mx-auto mb-6 max-w-sm text-muted">
              Start building your library by searching for songs you can play
              at your gigs.
            </p>
            <Button
              variant="primary"
              className="gap-2"
              onClick={() => setShowSearch(true)}
            >
              <Plus className="h-4 w-4" />
              Add Your First Song
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
