# TipTune - Full Project Plan

## 1. Brand Package

### Name Options

| Name | Vibe | Available (.com likely) |
|------|------|------------------------|
| **TipTune** | Clean, memorable, says what it does | Domain exists (tiptune.app) — we'd need .io or similar |
| **CrowdQueue** | Emphasizes the crowd-powered queue mechanic | Fresh |
| **BidBeat** | Highlights the bidding/competition angle | Fresh |
| **NextUp** | Simple, focused on "what plays next" | Common word — harder to own |
| **SongWar** | Aggressive, fun, captures the dueling vibe | Fresh |
| **TipTrax** | Tipping + tracks | Fresh |

**Recommendation: TipTune** — it's intuitive, brandable, and directly communicates the value prop (tip to tune the queue). We'll use this throughout the plan.

### Color Scheme

```
Primary:     #6C5CE7  (Electric Purple — energy, nightlife, premium feel)
Secondary:   #00D2FF  (Cyan/Neon Blue — digital, modern, contrast)
Accent:      #FFD93D  (Gold — money, tipping, reward)
Success:     #00E676  (Green — confirmations, active states)
Dark BG:     #0D0D1A  (Near Black — nightclub/venue feel)
Card BG:     #1A1A2E  (Dark Navy — elevated surfaces)
Text:        #F5F5F5  (Off-white — readability on dark)
Muted Text:  #8B8BA3  (Gray-purple — secondary info)
Danger:      #FF6B6B  (Red — warnings, alerts)
```

**Design Rationale:** Dark-first design mirrors the venue environment (bars, clubs, stages). Purple/cyan/gold evokes nightlife energy. Gold specifically reinforces the tipping/money mechanic.

### Typography
- **Headings:** Inter (bold/black weight) — clean, modern, great on mobile
- **Body:** Inter (regular/medium) — highly readable at small sizes
- **Accent/Numbers (tip amounts):** JetBrains Mono or Space Mono — makes dollar amounts feel distinct and precise

### Visual Design Principles
1. **Dark-first, mobile-first** — 90%+ users will be on phones in a dark venue
2. **Large touch targets** — users are holding drinks, in crowds, in low light
3. **High contrast** — readability in any lighting
4. **Minimal friction** — every tap counts; reduce steps to tip
5. **Animated tip queue** — the "next up" board should feel alive (subtle glow, position animations)
6. **Glassmorphism cards** — frosted glass effect on dark backgrounds for depth

### Logo Concept
- Stylized music note combined with an upward arrow (tip going up)
- Or: A crown/flame on top of a music note (king of the queue)
- Clean, works as favicon and app icon at 16x16 through 512x512

---

## 2. Competitive Analysis Summary

### Direct Competitors
| Platform | Strength | Weakness | Our Edge |
|----------|----------|----------|----------|
| RequestNow | 4000+ DJs, SMS-based | No bidding/competition | Gamified queue |
| mySet | 100% to artist model | Basic UI, no queue competition | Better UX + competition |
| Tiply | Free, QR-based | No song library API | Rich library + bidding |
| PickleJar | VIP tiers, merch | Complex, not focused | Simplicity + core focus |
| Lime DJ | Stripe, messaging | DJ-focused only | All performers |
| NoSongRequests | 16k performers | Basic feature set | Modern tech, real-time |

### Key Market Gap We Fill
**No one does competitive song bidding well.** Existing apps treat tips as gratuities — we treat tips as *votes in a live auction*. The "SongWar" / bidding mechanic is the core differentiator.

---

## 3. Feature Set

### MVP (Phase 1) — Core Product

#### Artist Side
- **Account creation** (email/password + OAuth with Google)
- **Artist profile** (name, bio, photo, genres, social links)
- **Song library builder**
  - Search via Spotify API (metadata only — title, artist, album art, genre)
  - Songs are copied into our DB (we don't stream from Spotify)
  - Manual song entry option
  - Drag-and-drop reordering / preferred order
  - Categories/tags (genre, decade, mood)
- **Event creation**
  - Event name, date/time, venue name, venue address
  - Auto-generated QR code (for event page)
  - Auto-generated QR code (for artist page)
  - Printable QR code sheet (styled, ready to put on a table/wall)
  - Event status: upcoming / live / completed
- **Live event dashboard**
  - Real-time queue showing songs ranked by tip total
  - Accept/skip/complete song controls
  - Running total of tips earned this event
  - Ability to pause requests
- **Payout setup** (Stripe Connect onboarding)

#### Audience Side
- **No account required** to browse and tip (reduces friction)
- **Optional account** for history, favorites, following artists
- **Find events**
  - Scan QR code (primary)
  - Search by artist name, venue, or location
  - Browse nearby events (geolocation)
- **Event page**
  - "NEXT UP" song prominently displayed with tip total
  - Blurred/collapsed list of other queued songs
  - Tap to reveal queue (shows song + tip amount, your contribution highlighted)
  - "Boost" button on any song to add more tip
- **Song request flow**
  1. Browse artist's library (search, filter by genre/decade)
  2. Select a song
  3. Choose tip amount ($1, $3, $5, $10, custom)
  4. Apple Pay / Google Pay / Card (Stripe Payment Intent)
  5. Confirmation with queue position
- **Artist profile page**
  - Bio, photo, social links
  - Upcoming events
  - Past events
  - Follow button (get notified of new events)

### Phase 2 — Enhanced Features

- **Song Wars mode** — two songs go head-to-head with a timer, crowd tips to their pick
- **Dedications** — add a message with your request ("Happy birthday Sarah!")
- **Group tipping** — share a link, friends can pool tips on one song
- **Recurring events** — weekly gig auto-creates events
- **Set list mode** — artist pre-loads a set list, audience bids to reorder
- **Analytics dashboard** — most requested songs, peak tipping times, earnings over time, venue performance
- **Venue accounts** — venues can list their recurring live music, get a venue page
- **Push notifications** — "Your song is up next!" "Artist X is live nearby!"
- **Chat/shoutouts** — audience can send messages to the stage display

### Phase 3 — Growth Features

- **Artist discovery feed** — find live music near you right now
- **Audience leaderboard** — top tippers at an event get recognized
- **Merch integration** — sell merch through your artist page
- **Livestream tipping** — extend to Twitch/YouTube performers
- **DJ software integration** — sync with VirtualDJ, Serato
- **Multi-artist events** — festivals, multi-act lineups
- **Subscription tier** — premium artists get lower fees, analytics, custom branding
- **Embeddable widget** — venue websites can embed the request queue
- **API for third parties** — let POS systems, venue apps integrate

---

## 4. Technical Architecture

### Tech Stack

| Layer | Technology | Reasoning |
|-------|-----------|-----------|
| **Framework** | Next.js 14 (App Router) | SSR for SEO (artist pages), RSC for performance, API routes built-in |
| **Language** | TypeScript | Type safety across full stack |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid mobile-first development, dark mode native |
| **Database** | PostgreSQL (via Supabase) | Relational data (users, songs, events, tips), real-time subscriptions |
| **ORM** | Prisma | Type-safe DB access, migrations |
| **Auth** | NextAuth.js (Auth.js v5) | Email/password + Google OAuth, session management |
| **Payments** | Stripe (Payment Intents + Connect) | Apple Pay/Google Pay, instant payouts, marketplace model |
| **Real-time** | Supabase Realtime (or Socket.io) | Live queue updates as tips come in |
| **Song API** | Spotify Web API | Search/metadata for library building (free tier) |
| **QR Codes** | `qrcode` npm package | Generate QR codes server-side |
| **File Storage** | Supabase Storage (or S3) | Artist photos, event images |
| **Hosting** | Vercel | Optimized for Next.js, edge functions, easy deploy |
| **Email** | Resend | Transactional emails (confirmations, receipts) |

### Data Model (Core Entities)

```
User
├── id, email, password_hash, name, role (ARTIST | AUDIENCE | ADMIN)
├── avatar_url, created_at
│
├── ArtistProfile (1:1 for ARTIST role)
│   ├── id, user_id, stage_name, bio, genres[], social_links{}
│   ├── profile_slug (unique URL), qr_code_url
│   ├── stripe_account_id (Stripe Connect)
│   │
│   ├── Songs[] (artist's library)
│   │   ├── id, artist_profile_id, title, original_artist
│   │   ├── album_art_url, genre, decade, spotify_id
│   │   ├── sort_order, is_active
│   │   │
│   ├── Events[]
│   │   ├── id, artist_profile_id, name, venue_name, venue_address
│   │   ├── starts_at, ends_at, status (UPCOMING|LIVE|COMPLETED)
│   │   ├── qr_code_url, event_slug
│   │   │
│   │   ├── Requests[] (song requests for this event)
│   │   │   ├── id, event_id, song_id, status (QUEUED|PLAYING|COMPLETED|SKIPPED)
│   │   │   ├── total_tips (aggregated), position
│   │   │   │
│   │   │   ├── Tips[] (individual tips on this request)
│   │   │   │   ├── id, request_id, tipper_id (nullable), amount
│   │   │   │   ├── stripe_payment_intent_id, status (PENDING|COMPLETED|FAILED)
│   │   │   │   ├── message (optional dedication)
│   │   │   │   ├── created_at

Follow (audience follows artist)
├── id, user_id, artist_profile_id
```

### Key API Routes

```
AUTH
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/session

ARTIST
GET    /api/artists/:slug              — public profile
PUT    /api/artists/profile             — update own profile
GET    /api/artists/:slug/events        — list events

SONGS (Artist Library)
GET    /api/songs                       — list own library
POST   /api/songs                       — add song to library
PUT    /api/songs/:id                   — update song
DELETE /api/songs/:id                   — remove song
PUT    /api/songs/reorder               — bulk reorder
GET    /api/songs/search/spotify        — search Spotify API

EVENTS
POST   /api/events                      — create event
GET    /api/events/:slug                — public event page data
PUT    /api/events/:id                  — update event
PUT    /api/events/:id/status           — go live / end event
GET    /api/events/nearby               — geolocation search

REQUESTS & TIPS
GET    /api/events/:id/queue            — live queue (sorted by tips)
POST   /api/events/:id/requests         — submit song request
POST   /api/requests/:id/tip            — tip on existing request
PUT    /api/requests/:id/status         — artist: mark playing/completed/skipped

PAYMENTS
POST   /api/payments/create-intent      — Stripe payment intent
POST   /api/payments/webhook            — Stripe webhook handler
GET    /api/payments/earnings            — artist earnings summary
POST   /api/payments/connect-setup      — Stripe Connect onboarding

QR
GET    /api/qr/artist/:slug             — generate artist QR
GET    /api/qr/event/:slug              — generate event QR
GET    /api/qr/event/:slug/printable    — printable QR sheet
```

### Real-Time Architecture

```
When a tip is submitted:
1. Client → POST /api/requests/:id/tip (creates Stripe PaymentIntent)
2. Stripe webhook confirms payment → update tip status in DB
3. DB trigger / server event → broadcast to Supabase Realtime channel
4. All clients subscribed to event channel receive update
5. Queue re-sorts by total_tips in real-time
6. "NEXT UP" display updates with animation
```

---

## 5. Page Structure

```
/                                    — Landing page (marketing)
/login                               — Login
/register                            — Register (choose artist or fan)
/register/artist                     — Artist onboarding flow

/dashboard                           — Artist dashboard (events, earnings)
/dashboard/library                   — Manage song library
/dashboard/library/add               — Add songs (Spotify search)
/dashboard/events                    — Manage events
/dashboard/events/new                — Create event
/dashboard/events/:id                — Event management + live controls
/dashboard/events/:id/live           — Live event control panel
/dashboard/profile                   — Edit artist profile
/dashboard/earnings                  — Payout history + Stripe setup

/artist/:slug                        — Public artist profile
/artist/:slug/events                 — Artist's events list

/event/:slug                         — Public event page (audience view)
/event/:slug/request                 — Browse library + make request
/event/:slug/queue                   — Live queue view

/explore                             — Find events near me
/search                              — Search artists/events

/account                             — Audience account (history, follows)
```

---

## 6. Implementation Roadmap

### Sprint 1 (Week 1-2): Foundation
- [ ] Next.js project setup with TypeScript, Tailwind, shadcn/ui
- [ ] Database schema + Prisma setup (Supabase PostgreSQL)
- [ ] Auth system (NextAuth — email/password + Google)
- [ ] Basic layout: dark theme, mobile-first responsive shell
- [ ] Landing page
- [ ] Artist registration + profile creation

### Sprint 2 (Week 3-4): Artist Core
- [ ] Spotify API integration (search endpoint)
- [ ] Song library: add, remove, reorder, search
- [ ] Event CRUD (create, edit, delete)
- [ ] QR code generation (artist page + event page)
- [ ] Artist public profile page
- [ ] Artist dashboard layout

### Sprint 3 (Week 5-6): Audience Core
- [ ] Public event page with live queue
- [ ] Song browsing + request flow
- [ ] Tip amount selection UI
- [ ] Stripe Payment Intents integration
- [ ] Apple Pay / Google Pay setup
- [ ] Payment confirmation + queue position feedback

### Sprint 4 (Week 7-8): Real-Time + Live
- [ ] Real-time queue updates (Supabase Realtime)
- [ ] "Next Up" display with blur on other songs
- [ ] Artist live event control panel
- [ ] Song status management (playing, completed, skipped)
- [ ] Earnings tracker (live event + historical)
- [ ] Stripe Connect for artist payouts

### Sprint 5 (Week 9-10): Polish + Launch
- [ ] Event search + nearby events (geolocation)
- [ ] Printable QR code sheets (styled PDF)
- [ ] Audience accounts (optional — follow artists, tip history)
- [ ] Email notifications (Resend)
- [ ] Error handling, loading states, empty states
- [ ] Performance optimization, accessibility audit
- [ ] Production deployment (Vercel + Supabase)

---

## 7. Payment Architecture (Stripe)

### Model: Marketplace via Stripe Connect

```
Audience pays → TipTune (platform) → Artist (connected account)

Flow:
1. Artist onboards via Stripe Connect (Standard or Express)
2. Audience tips create a PaymentIntent with `transfer_data`
3. Platform takes X% fee, rest goes to artist's connected account
4. Artists can set up instant payouts or standard (2-day) payouts
```

### Fee Structure (Recommended)
- **Platform fee:** 10% of tips (competitive with market)
- **Stripe processing:** ~2.9% + $0.30 per transaction (passed to tipper or absorbed)
- **Artist receives:** ~87% of tip amount
- **Alternative model:** Charge tippers a $0.50 "service fee" per transaction, give 100% of tip to artist

### Minimum Tip: $1.00 (below this, processing fees eat too much)

---

## 8. Spotify API Integration Plan

### What We Use
- **Search endpoint** (`/v1/search`) — find songs by title/artist
- **Track metadata** — title, artist(s), album, album art URL, duration, popularity
- **We do NOT stream music** — we only use metadata to build the artist's library

### Auth Flow
- Server-side Client Credentials flow (no user login needed)
- Store `client_id` and `client_secret` in env vars
- Token refresh handled automatically

### Data Flow
```
1. Artist searches "Sweet Caroline" in library builder
2. Frontend → GET /api/songs/search/spotify?q=Sweet+Caroline
3. Backend → Spotify Search API → returns top results
4. Artist clicks "Add to Library" on a result
5. We copy: title, artist, album_art_url, spotify_track_id, genre
6. Song is stored in OUR database (no ongoing Spotify dependency)
7. Artist can then reorder, categorize, toggle active/inactive
```

---

## 9. What We Build First (Immediate Implementation)

For this session, I'll scaffold the entire project and build out Sprint 1 + partial Sprint 2:

1. **Next.js 14 project** with TypeScript, Tailwind, shadcn/ui
2. **Complete Prisma schema** for all entities
3. **Auth system** with NextAuth (email/password + Google OAuth)
4. **Dark-themed mobile-first layout** with the TipTune brand
5. **Landing page** — marketing page explaining the product
6. **Artist registration + dashboard shell**
7. **Song library** with Spotify search integration
8. **Event creation** with QR code generation
9. **Public event page** with queue display
10. **Audience request + tip flow** (UI — Stripe integration stubbed)

This gives us a functional prototype that demonstrates the core concept.
