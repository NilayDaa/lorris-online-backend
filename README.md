# Lorris Online 🃏

A real-time **3-vs-3 trick-taking card game** for 6 players. Players are divided into two teams (Team A: seats 1,3,5 · Team B: seats 2,4,6), bid on the tricks they will win, pick a trump suit, and play 8 tricks per round. The team that fulfills its contract earns points (and can penalty its opponent); first team to **32 points** wins the match.

Built as a full-stack, WebSocket-driven multiplayer web app:

- **Backend** — Spring Boot 3.5 / Java 21 (REST + STOMP-over-WebSocket)
- **Frontend** — React 19 + Vite 8
- **Realtime** — STOMP via SockJS, live state broadcasts every 500 ms
- **Deploy** — Frontend on Vercel, backend containerized (Docker) and running on Kubernetes (GKE)

> Live: [`lorris.nilaydas.com`](https://lorris.nilaydas.com)

---

## Repository Layout

```
lorris-online-backend/
├── lorris-backend/          # Spring Boot backend (Java 21, Maven)
│   └── src/main/java/com/nilay/lorrisbackend/
│       ├── config/          # WebSocket/STOMP, CORS, scheduler config
│       ├── controller/      # REST endpoints (GameController, HomeController)
│       ├── dto/             # Request & update DTOs
│       ├── exception/       # Global exception handler
│       ├── model/           # Domain model (Game, Card, Deck, Player, Trick...)
│       └── service/         # Game logic (GameService, TrickService, ...)
├── lorris-frontend/         # React frontend (Vite)
│   └── src/
│       ├── api/             # Thin REST client wrappers (one per action)
│       ├── components/      # UI components (BidPanel, TrumpPanel, ScoreBoard...)
│       ├── context/         # GameContext provider
│       ├── pages/           # Home, Lobby, Game, NotFound
│       ├── socket/          # STOMP WebSocket client
│       └── utils/           # Seat-layout helper
├── k8s/                     # Kubernetes manifests (deployment, service, ingress)
└── *.md, *.sh, *.mjs        # Docs, test & demo scripts
```

---

## Architecture

### Backend — Spring Boot

The backend keeps **all game state in memory** (`java.util.HashMap<String, Game>`) — a game is identified by a 6-character uppercase code. Clients drive the game through plain REST calls; every mutation pushes the latest state to all connected clients over WebSocket so the whole table stays in sync in real time.

```
                 ┌────────────────────────────────────────────┐
                 │              REST (axios)                  │
                 │   POST /games/{id}/bid, /play, /trump,     │
                 │       /join, /continue, /next-round        │
                 │                                            │
  Browser ───────┤   GameController  ──▶ GameService          │
     │           │         │                                  │
     │           │         v                                  │
     └───────────┤   TrickService · ScoreService ·            │
       STOMP/    │   ContinueService                          │
       SockJS    │         │                                  │
    /topic/      │         v                                  │
    game/{id} ◄──┼── GameSocketService ──▶ STOMP topic         │
                 └────────────────────────────────────────────┘
```

### Services

| Service | Responsibility |
|---------|----------------|
| **`GameService`** | Owns the in-memory game store. Lifecycle: `createGame`, `joinGame` (duplicate-name check, 6-player cap, auto-start on full), `placeBid`, `chooseTrump`, `playCard`, `nextRound`, `playerContinue`. Runs a **500 ms heartbeat** that re-broadcasts live state for active (BIDDING/PLAYING) games. |
| **`TrickService`** | Turn-based card-playing engine. Validates turn + card ownership + **follow-suit** rule, removes the card, adds it to the current trick, and on trick completion (6 cards) computes the winner (joker > trump > lead suit > rank) and updates trick scores. |
| **`ScoreService`** | Round scoring. Applies contract fulfillment (points) or failure (**2× bid penalty**), handles the 32-point match win, and sets up the next round (rotates the dealer, re-deals). |
| **`ContinueService`** | Synchronization barrier after each trick: accumulates "ready" acknowledgments and starts the next trick only once **all 6 players** have confirmed. |
| **`GameSocketService`** | Broadcasts game state to `/topic/game/{id}` as `GAME_UPDATED` or `HEARTBEAT` frames. |

### Domain model

| Model | Purpose |
|-------|---------|
| `Game` | Mutable aggregate: status, deck, players, trump suit, scores, bidding state, current trick, continue-acknowledgment list. |
| `Card` | `{suit, rank}` with joker detection and rank values (A=14 … 3=3, Joker=20). |
| `Deck` | Builds the 52-card deck (**4 suits × 13 ranks − 3♠ + 1 Joker**), shuffles, deals. 48 cards (8 per player) are dealt each round. |
| `Player` | `{id, name, hand, team}` with hand helpers. |
| `Trick` | Ordered map of `playerName → Card` (LinkedHashMap preserves play order), lead-suit tracking, and `isComplete()` at 6 cards. |
| `GameRules` | Static rule checks: `hasSuit`, `isValidPlay` (joker always legal, follow lead suit), lead-suit derivation. |
| `GameStatus` | State machine: `WAITING_FOR_PLAYERS → BIDDING → CHOOSING_TRUMP → PLAYING → ROUND_FINISHED / FINISHED`. |

### Configuration
- **`WebSocketConfig`** — enables the STOMP broker (`/topic`), endpoint `/ws` served with **SockJS**, and allow-lists the `https://lorris.nilaydas.com` origin (`setAllowedOriginPatterns`).
- **`CorsConfig`** — REST CORS restricted to `https://lorris.nilaydas.com` with credentials.
- **`SchedulerConfig`** — single-threaded `ScheduledExecutorService` bean (used by the heartbeat + trick service).
- **`GlobalExceptionHandler`** — maps exceptions to clean error responses.

---

## API Reference

Base URL (local): `http://localhost:8080`

### REST endpoints

#### Create a game
```
POST /games
```
Creates a new game in `WAITING_FOR_PLAYERS` and returns the `Game` (with the 6-char `gameId`).

#### Get game state
```
GET /games/{gameId}
```
Returns the full `Game` object (players, status, scores, current trick, ...).

#### Join a game
```
POST /games/{gameId}/join
Content-Type: application/json

{ "playerName": "Ada" }
```
Adds a player. Rejects empty names, duplicate names, and full tables (6 players). When the 6th player joins, the game **auto-starts**: the deck is shuffled and 8 cards are dealt to each player, status → `BIDDING`.

#### Get players
```
GET /games/{gameId}/players
```
Returns the list of joined players.

#### Get a player's hand
```
GET /games/{gameId}/players/{playerName}/hand
```
Returns only that player's cards.

#### Get game status
```
GET /games/{gameId}/status
```
Returns the current `GameStatus` enum value.

#### Place a bid
```
POST /games/{gameId}/bid
{ "playerName": "Ada", "bid": 5 }
```
Only the current bidder may bid. `bid = 0` passes; otherwise it must be **4–8** and **higher than the current highest bid**. The highest bidder becomes declarer. After 6 bids: if everyone passed, the round is re-dealt; otherwise status → `CHOOSING_TRUMP`.

#### Choose trump suit
```
POST /games/{gameId}/trump
{ "playerName": "Ada", "trump": "Hearts" }
```
Only the declarer may choose. Sets the trump suit and moves status → `PLAYING`.

#### Play a card
```
POST /games/{gameId}/play
{ "playerName": "Ada", "suit": "Hearts", "rank": "A" }
```
Validates turn, ownership, and the follow-suit rule; plays the card and advances the turn. On the 6th card, the trick winner is computed and scored (or the round finishes).

#### Continue to next trick
```
POST /games/{gameId}/continue
{ "playerName": "Ada" }
```
Acknowledges a completed trick. The next trick starts only after all 6 players acknowledge.

#### Start next round
```
POST /games/{gameId}/next-round
```
Rotates the dealer and re-deals for a new round (returns to `BIDDING`).

### WebSocket (STOMP)

Real-time updates use STOMP over **SockJS** at `/ws`.

- **Subscribe:** `/topic/game/{gameId}`
- **Frame payload** (JSON): `{ "type": String, "game": Game }` where `type` is `GAME_UPDATED` (state-changing action) or `HEARTBEAT` (periodic live refresh, every 500 ms).

Client starts a game, then calls REST actions (bid/play/trump/continue) and renders the state pushed over the WebSocket topic.

---

## Frontend

React 19 + Vite 8. Thin `src/api/*.js` modules wrap each REST action (axios); `src/socket/gameSocket.js` maintains the STOMP client (SockJS + `@stomp/stompjs`) with auto-reconnect, and hands every received `game` update to the page callback.

- **`pages/Home`** — create/join a game (name + optional 6-char code)
- **`pages/Lobby`** — waiting room; copy/share the game code; auto-enter when full
- **`pages/Game`** — the table: `ScoreBoard`, opponent seats (`TablePlayers`), current trick, your hand, plus the `BidPanel`, `TrumpPanel`, `TrickComplete`, and `RoundResult` modals for each phase
- Mobile-first with responsive portrait/landscape layouts, toasts (`react-hot-toast`), loading states, and haptic feedback.

---

## Running Locally

Prerequisites: **Java 21**, **Maven** (or the bundled `mvnw`), **Node.js 18+**.

```bash
# From the repo root — runs both servers
npm run dev
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/games
- WebSocket: ws://localhost:8080/ws

Or run each separately:
```bash
npm run backend    # cd lorris-backend && ./mvnw spring-boot:run  → :8080
npm run frontend   # cd lorris-frontend && npm run dev           → :5173
```

**Point the frontend at your backend:** set `VITE_API_URL_1` in `lorris-frontend/.env` (defaults to `http://localhost:8080`).

### Play by yourself
Create a game, then open the code in 5 more incognito/private tabs with different names. The game starts automatically when the 6th player joins.

### Automated tests
```bash
bash test-game.sh              # scripts a full game flow against the API
bash complete-game-test.sh     # plays through multiple rounds
node test-e2e.mjs              # end-to-end checks
```

---

## Deployment

- **Frontend** — static build served by **Vercel** (`lorris-frontend/vercel.json` rewrites all routes to `index.html` for client-side routing).
- **Backend** — containerized via `lorris-backend/Dockerfile` (Temurin `21-jdk`), published to a **GCR** registry, and deployed to **Kubernetes** with the manifests in `k8s/` (`deployment.yaml`, `service.yaml`, `ingress.yaml`, `managed-certificate.yaml`). The Kubernetes deployment declares `replicas: 2`.

> **Note on the current state store:** `GameService` holds games **in JVM memory**, so game state is per-instance. This is fine for a single instance, but it means games are lost if the backend restarts and — with more than one replica — a client must always reach the instance that created its game. If you scale out, move game state to a shared store (e.g. Redis/Postgres) or use sticky routing. (Planned enhancement.)

---

## Game Rules Summary

- 6 players, 2 teams (A = seats 1,3,5; B = 2,4,6), 52-card deck (48 dealt — 8 per player).
- **Bidding:** 4–8 tricks or pass; must beat the current high bid; everyone passing re-deals; high bidder is declarer.
- **Trump:** declarer picks a suit; trump cards beat all non-trump cards.
- **Playing:** follow lead suit if you can; Joker beats everything; lead suit beats off-suit; highest rank wins the trick; winner leads the next trick.
- **Scoring:** make your contract → score your bid (8 tricks = 16); miss it → lose **2×** the bid; drain the opponent's score; **first to 32 wins**.

---

## Docs

- [`IMPROVEMENTS_COMPLETE.md`](./IMPROVEMENTS_COMPLETE.md) — UI/UX overhaul log
- [`PLAYABILITY_REPORT.md`](./PLAYABILITY_REPORT.md) — playability test results
- [`UX_AUDIT_REPORT.md`](./UX_AUDIT_REPORT.md) — UX/UI audit & fixes
- [`DEMO_INSTRUCTIONS.md`](./DEMO_INSTRUCTIONS.md) — live demo walkthrough & feature checklist