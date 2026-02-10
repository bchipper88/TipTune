"use client";

import { useState } from "react";
import { User, Mic2, FileText, Link as LinkIcon, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ProfilePage() {
  const [form, setForm] = useState({
    stageName: "",
    bio: "",
    genres: "",
    instagram: "",
    facebook: "",
    twitter: "",
    website: "",
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Artist Profile</h1>
        <p className="text-muted">Manage your public profile and social links</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="mb-4 font-semibold">Basic Info</h2>
            <div className="space-y-4">
              <div className="relative">
                <Mic2 className="absolute left-3 top-3 h-4 w-4 text-muted" />
                <Input
                  id="stageName"
                  label="Stage Name"
                  placeholder="Your stage name or band name"
                  className="pl-10"
                  value={form.stageName}
                  onChange={(e) => setForm({ ...form, stageName: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-muted">
                  <FileText className="mr-1 inline h-3.5 w-3.5" />
                  Bio
                </label>
                <textarea
                  className="w-full rounded-xl border border-border bg-card-bg px-4 py-2.5 text-text-white placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={4}
                  placeholder="Tell fans about yourself..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>

              <Input
                id="genres"
                label="Genres"
                placeholder="Rock, Pop, Country (comma separated)"
                value={form.genres}
                onChange={(e) => setForm({ ...form, genres: e.target.value })}
              />
            </div>

            <h2 className="mb-4 mt-8 font-semibold">Social Links</h2>
            <div className="space-y-3">
              {[
                { key: "instagram" as const, label: "Instagram URL" },
                { key: "facebook" as const, label: "Facebook URL" },
                { key: "twitter" as const, label: "X / Twitter URL" },
                { key: "website" as const, label: "Website URL" },
              ].map((social) => (
                <div key={social.key} className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted" />
                  <Input
                    id={social.key}
                    placeholder={social.label}
                    className="pl-10"
                    value={form[social.key]}
                    onChange={(e) =>
                      setForm({ ...form, [social.key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>

            <Button variant="primary" size="lg" className="mt-6 w-full">
              Save Profile
            </Button>
          </Card>
        </div>

        {/* Preview & QR */}
        <div className="space-y-4">
          <Card>
            <h2 className="mb-4 font-semibold">Profile Preview</h2>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
                <User className="h-10 w-10 text-white" />
              </div>
              <p className="font-bold text-text-white">
                {form.stageName || "Your Stage Name"}
              </p>
              <p className="mt-1 text-sm text-muted">
                {form.bio || "Your bio will appear here"}
              </p>
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold">Your QR Code</h2>
            <div className="flex flex-col items-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-text-white">
                <QrCode className="h-28 w-28 text-dark-bg" />
              </div>
              <p className="mt-3 text-xs text-muted">
                Share this QR code for your artist profile
              </p>
              <Button variant="ghost" size="sm" className="mt-2">
                Download QR
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
