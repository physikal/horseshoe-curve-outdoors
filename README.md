# Horseshoe Curve Outdoors

Marketing site and hunt scheduling app for **Horseshoe Curve Outdoors** (Pendleton / Echo, Oregon). Guests browse packages and book open hunt slots; lodge staff manage availability in an admin panel; agents can drive the same schedule through an HTTP API.

Inspired by [horseshoecurveoutdoors.com](https://horseshoecurveoutdoors.com/).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- In-memory / local JSON persistence (no cloud DB credentials required)
- Cookie session auth for admin; Bearer token for agent API

## Run locally

```bash
npm install
npm run dev
```

App: [http://127.0.0.1:43147](http://127.0.0.1:43147)

```bash
npm run build && npm run start -- --port 43147
```

## Admin access

1. Open `/admin/login`
2. Default credentials (local / mock fallback):
   - **Username:** `admin`
   - **Password:** `horseshoe`

Set real credentials in the environment:

```bash
ADMIN_USERNAME=your-user
ADMIN_PASSWORD=your-strong-password
ADMIN_SESSION_SECRET=long-random-string
AGENT_API_KEY=long-random-agent-key
```

Copy `.env.example` to `.env.local` when ready.

Admin can create/edit/cancel hunt packages and slots, and confirm/cancel bookings at `/admin/dashboard`, `/admin/hunts`, and `/admin/bookings`.

## Data persistence

- **Local:** writes to `data/store.json` (created automatically from seed data).
- **Vercel / serverless:** uses an in-memory store seeded on cold start (survives warm invocations via `globalThis`). Data may reset on cold starts.
- For durable production data, point a Turso/libSQL or similar store at this app later; the current layer is intentionally credential-free so previews deploy immediately.

## Agent / Grok-bot API

Base path: `/api`

Auth for mutating admin endpoints and listing bookings:

```http
Authorization: Bearer <AGENT_API_KEY>
```

Default mock key: `hco-agent-dev-key`

### Public

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/hunts` | List active hunt packages |
| `GET` | `/api/hunts/:id` | Get one hunt |
| `GET` | `/api/slots?availableOnly=true` | List open slots (`huntId` optional) |
| `GET` | `/api/slots/:id` | Get one slot (+ hunt) |
| `POST` | `/api/bookings` | Create a guest booking |
| `GET` | `/api/bookings/:id` | Fetch booking confirmation |

### Agent / admin (Bearer or admin cookie)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/hunts` | Create hunt package |
| `PATCH` | `/api/hunts/:id` | Update hunt |
| `DELETE` | `/api/hunts/:id` | Cancel hunt (+ cascade cancel slots) |
| `POST` | `/api/slots` | Create availability slot |
| `PATCH` | `/api/slots/:id` | Update slot |
| `DELETE` | `/api/slots/:id` | Cancel slot |
| `GET` | `/api/bookings` | List bookings |
| `PATCH` | `/api/bookings/:id` | Set `status` to `confirmed` or `cancelled` |

### Example: open a slot, then book it

```bash
# List packages
curl -s http://127.0.0.1:43147/api/hunts | jq

# Create a slot (agent)
curl -s -X POST http://127.0.0.1:43147/api/slots \
  -H "Authorization: Bearer hco-agent-dev-key" \
  -H "Content-Type: application/json" \
  -d '{
    "huntId": "hunt_upland",
    "startAt": "2026-10-01T14:00:00.000Z",
    "endAt": "2026-10-01T22:00:00.000Z",
    "capacity": 4,
    "notes": "Agent-created weekend"
  }' | jq

# Book for a guest
curl -s -X POST http://127.0.0.1:43147/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": "slot_…",
    "guestName": "Alex Hunter",
    "guestEmail": "alex@example.com",
    "guestPhone": "(541) 555-0100",
    "partySize": 2
  }' | jq
```

## Site map

- `/` — brand home
- `/gallery` — hunts / land / lodging gallery
- `/hunts` — package info
- `/book` — browse slots + book
- `/book/confirmation/:id` — confirmation
- `/contact` — lodge contact
- `/admin` — schedule management
