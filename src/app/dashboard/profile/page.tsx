"use client";

import { useState, useEffect, useRef } from "react";
import { User, Mic2, FileText, Link as LinkIcon, QrCode, Loader2, Check, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
}

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
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileSlug, setProfileSlug] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          const social = (data.socialLinks || {}) as SocialLinks;
          setForm({
            stageName: data.stageName || "",
            bio: data.bio || "",
            genres: (data.genres || []).join(", "),
            instagram: social.instagram || "",
            facebook: social.facebook || "",
            twitter: social.twitter || "",
            website: social.website || "",
          });
          setProfileSlug(data.profileSlug || "");
          setAvatarUrl(data.avatarUrl || "");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large. Please use a file under 2 MB.");
      return;
    }
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "avatars");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setAvatarUrl(data.url);
        // Auto-save the avatar URL
        await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatarUrl: data.url }),
        });
      } else {
        alert(data.error || "Upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stageName: form.stageName,
          bio: form.bio,
          genres: form.genres.split(",").map((g) => g.trim()).filter(Boolean),
          socialLinks: {
            instagram: form.instagram || undefined,
            facebook: form.facebook || undefined,
            twitter: form.twitter || undefined,
            website: form.website || undefined,
          },
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateQR = async () => {
    if (!profileSlug) return;
    try {
      const baseUrl = window.location.origin;
      const { generateQRCodeDataURL } = await import("@/lib/qr");
      const dataUrl = await generateQRCodeDataURL(`${baseUrl}/artist/${profileSlug}`);
      setQrDataUrl(dataUrl);
    } catch {
      // QR generation failed
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

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

            <Button
              variant="primary"
              size="lg"
              className="mt-6 w-full gap-2"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : saved ? (
                <Check className="h-4 w-4" />
              ) : null}
              {saving ? "Saving..." : saved ? "Saved!" : "Save Profile"}
            </Button>
          </Card>
        </div>

        {/* Preview & QR */}
        <div className="space-y-4">
          <Card>
            <h2 className="mb-4 font-semibold">Profile Picture</h2>
            <div className="text-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="group relative mx-auto mb-3 block h-24 w-24 cursor-pointer"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover transition-opacity group-hover:opacity-75"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary transition-opacity group-hover:opacity-75">
                    <User className="h-12 w-12 text-white" />
                  </div>
                )}
                <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card-bg bg-primary text-white transition-colors group-hover:bg-primary/80">
                  {uploadingAvatar ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </button>
              <p className="font-bold text-text-white">
                {form.stageName || "Your Stage Name"}
              </p>
              <p className="mt-1 text-sm text-muted">
                {form.bio || "Your bio will appear here"}
              </p>
              {profileSlug && (
                <a
                  href={`/artist/${profileSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-primary hover:underline"
                >
                  View Public Profile
                </a>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold">Your QR Code</h2>
            <div className="flex flex-col items-center">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrDataUrl} alt="Profile QR Code" className="h-40 w-40 rounded-2xl" />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-text-white">
                  <QrCode className="h-28 w-28 text-dark-bg" />
                </div>
              )}
              <p className="mt-3 text-xs text-muted">
                Share this QR code for your artist profile
              </p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={handleGenerateQR}>
                {qrDataUrl ? "Regenerate QR" : "Generate QR Code"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
