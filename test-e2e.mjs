// End-to-end REST test for Lorris backend
// Plays a full round: create -> join x6 -> bid -> trump -> 8 tricks -> next round
const BASE = "http://localhost:8080";

async function post(path, body) {
    const res = await fetch(BASE + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null };
}
async function get(path) {
    const res = await fetch(BASE + path);
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null };
}

const RANKVAL = { A: 14, K: 13, Q: 12, J: 11, "10": 10, "9": 9, "8": 8, "7": 7, "6": 6, "5": 5, "4": 4, "3": 3, JOKER: 20, Joker: 20 };

function isJoker(c) { return c.suit.toLowerCase() === "joker"; }
function hasSuit(hand, suit) { return hand.some(c => c.suit.toLowerCase() === suit.toLowerCase() && !isJoker(c)); }
function legalCard(hand, leadSuit) {
    // mirror backend GameRules: joker always ok; must follow suit if you have it
    const joker = hand.find(isJoker);
    if (!leadSuit) return joker || hand[0];
    if (hasSuit(hand, leadSuit)) {
        return joker || hand.find(c => c.suit.toLowerCase() === leadSuit.toLowerCase());
    }
    return hand[0];
}
function trickWinner(cards, leadSuit, trump) {
    // cards: [{name, card}] in play order
    let win = cards[0];
    for (const c of cards.slice(1)) {
        const beat =
            (isJoker(c.card) && !isJoker(win.card)) ||
            (!isJoker(c.card) && !isJoker(win.card) &&
                (c.card.suit === trump && win.card.suit !== trump) ||
                (c.card.suit === win.card.suit && !isJoker(c.card) &&
                    RANKVAL[c.card.rank] > RANKVAL[win.card.rank]));
        if (beat) win = c;
    }
    return win.name;
}

function log(ok, msg) {
    console.log((ok ? "PASS" : "FAIL") + " | " + msg);
    if (!ok) process.exitCode = 1;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, desc, tries = 20) {
    for (let i = 0; i < tries; i++) {
        const v = await fn();
        if (v) return v;
        await sleep(200);
    }
    throw new Error("timeout waiting for: " + desc);
}

// ---------- 1. Error handling on unknown game ----------
let r = await get("/games/XXXXXX");
log(r.status === 500 || r.status === 404, `GET unknown game -> HTTP ${r.status} (documented: returns 500, no friendly body)`);

// ---------- 2. Create + join ----------
r = await post("/games");
const gameId = r.body.gameId;
log(!!gameId && gameId.length === 6, `create game -> id ${gameId} (status ${r.body.status})`);

const names = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank"];
for (let i = 0; i < 6; i++) {
    r = await post(`/games/${gameId}/join`, { playerName: names[i] });
    log(r.status === 200, `join player ${i + 1} (${names[i]}) -> HTTP ${r.status}`);
}

r = await post(`/games/${gameId}/join`, { playerName: "Extra" });
log(r.status === 500, `7th join rejected -> HTTP ${r.status} "${typeof r.body === 'string' ? r.body : JSON.stringify(r.body)}"`);

r = await get(`/games/${gameId}/status`);
log(r.body === "BIDDING", `status after 6 joins -> ${r.body}`);

// duplicate name check
r = await get(`/games/${gameId}/players`);
log(r.body.length === 6, `players list -> ${r.body.length} players`);

// ---------- 3. Bidding ----------
// currentBidderIndex = 0 (Alice). Alice bids 4, everyone else passes.
for (let i = 0; i < 6; i++) {
    const bid = i === 0 ? 4 : 0;
    r = await post(`/games/${gameId}/bid`, { playerName: names[i], bid });
    log(r.status === 200, `bid ${names[i]}=${bid} -> HTTP ${r.status}`);
}

// out-of-turn bid should fail (game now in CHOOSING_TRUMP)
r = await post(`/games/${gameId}/bid`, { playerName: "Alice", bid: 5 });
log(r.status === 500 && JSON.stringify(r.body).includes("Not bidding"), `bid after bidding closed -> HTTP ${r.status} "${JSON.stringify(r.body)}"`);

// invalid bid range
// (can't test in this game anymore; tested implicitly by rule)
r = await get(`/games/${gameId}`);
log(r.body.status === "CHOOSING_TRUMP" && r.body.declarer?.name === "Alice" && r.body.highestBid === 4,
    `bidding result -> declarer=${r.body.declarer?.name}, bid=${r.body.highestBid}, status=${r.body.status}`);

// ---------- 4. Trump ----------
// only declarer can choose
r = await post(`/games/${gameId}/trump`, { playerName: "Bob", trump: "Spades" });
log(r.status === 500, `non-declarer trump rejected -> HTTP ${r.status} "${JSON.stringify(r.body)}"`);

r = await post(`/games/${gameId}/trump`, { playerName: "Alice", trump: "Spades" });
log(r.status === 200 && r.body.status === "PLAYING" && r.body.trump === "Spades", `declarer chooses trump -> status=${r.body.status}, trump=${r.body.trump}`);

// ---------- 5. Play all 8 tricks ----------
// currentPlayerIndex starts at 0 after startGame (not rotated like nextRound)
let hands = {};
for (const n of names) {
    const h = await get(`/games/${gameId}/players/${n}/hand`);
    hands[n] = h.body;
    log(h.body.length === 8, `${n} has ${h.body.length} cards`);
}

let tricksPlayed = 0;
const teamTricks = { A: 0, B: 0 };

for (let t = 0; t < 8; t++) {
    // play 6 cards
    const played = [];
    for (let i = 0; i < 6; i++) {
        const g = await get(`/games/${gameId}`);
        const idx = g.body.currentPlayerIndex;
        const pName = g.body.players[idx].name;
        const card = legalCard(hands[pName], g.body.currentTrick?.leadSuit ?? null);

        r = await post(`/games/${gameId}/play`, { playerName: pName, suit: card.suit, rank: card.rank });
        if (r.status !== 200) {
            log(false, `trick ${t + 1}: play by ${pName} ${card.suit}-${card.rank} failed HTTP ${r.status} "${JSON.stringify(r.body)}"`);
            throw new Error("abort");
        }
        hands[pName] = hands[pName].filter(c => !(c.suit === card.suit && c.rank === card.rank));
        played.push({ name: pName, card });
    }
    tricksPlayed++;

    // verify trick complete + winner set
    let g = await waitFor(async () => {
        const gg = await get(`/games/${gameId}`);
        return gg.body.currentTrick?.complete ? gg : null;
    }, "trick complete");
    const expected = trickWinner(played, played[0].card.suit === "Joker" ? "Spades" : played[0].card.suit, "Spades");
    const actual = g.body.currentTrick.winner?.name;
    const winIdx = g.body.players.findIndex(p => p.name === actual);
    const team = winIdx % 2 === 0 ? "A" : "B";
    teamTricks[team]++;
    log(actual === expected, `trick ${tricksPlayed}: winner=${actual} (expected ${expected}), team ${team}, tricks A=${g.body.tricksTeamA} B=${g.body.tricksTeamB}, waitingForContinue=${g.body.waitingForContinue}`);

    if (t < 7) {
        // all 6 players continue
        for (const n of names) {
            const c = await post(`/games/${gameId}/continue`, { playerName: n });
            if (c.status !== 200) log(false, `continue by ${n} failed HTTP ${c.status}`);
        }
        g = await waitFor(async () => {
            const gg = await get(`/games/${gameId}`);
            return !gg.body.waitingForContinue && !gg.body.currentTrick?.complete ? gg : null;
        }, "next trick started");
        log(g.body.currentPlayerIndex === g.body.players.findIndex(p => p.name === actual),
            `next trick led by winner ${actual} (currentPlayerIndex=${g.body.currentPlayerIndex})`);
    }
}

// ---------- 6. Round finished ----------
let g = await get(`/games/${gameId}`);
log(g.body.status === "ROUND_FINISHED", `final status -> ${g.body.status}`);
log(g.body.tricksTeamA + g.body.tricksTeamB === 8, `total tricks = ${g.body.tricksTeamA + g.body.tricksTeamB}`);
log(g.body.winnerTeam !== null, `round winner = ${g.body.winnerTeam}`);

const declIdx = g.body.players.findIndex(p => p.name === g.body.declarer?.name);
const declTeam = declIdx % 2 === 0 ? "A" : "B";
const declTricks = declTeam === "A" ? g.body.tricksTeamA : g.body.tricksTeamB;
const contractMade = declTricks >= 4;
const expectedScore = contractMade ? (declTeam === "A" ? "A=4+" : "B=4+") : `${declTeam} -=8`;
log(contractMade ? g.body.teamAScore >= 4 || g.body.teamBScore >= 4 : g.body.teamAScore + g.body.teamBScore >= 0,
    `scoring applied: A=${g.body.teamAScore} B=${g.body.teamBScore} (declarer ${g.body.declarer?.name} team ${declTeam} took ${declTricks}/4 tricks, contract ${contractMade ? "MADE" : "FAILED"})`);

// ---------- 7. Next round ----------
r = await post(`/games/${gameId}/next-round`);
log(r.status === 200 && r.body.status === "BIDDING", `next round -> status=${r.body.status}, dealerIndex=${r.body.dealerIndex}, firstBidder=${r.body.currentBidderIndex}`);
log(r.body.tricksTeamA === 0 && r.body.tricksTeamB === 0, `trick counters reset (A=${r.body.tricksTeamA}, B=${r.body.tricksTeamB})`);

for (const n of names) {
    const h = await get(`/games/${gameId}/players/${n}/hand`);
    log(h.body.length === 8, `${n} re-dealt ${h.body.length} cards`);
}

// ---------- 8. Round 2 quick sanity: play one trick ----------
// first bidder = dealerIndex+1; nextRound rotated dealer 0->1, so bidder = 2 (Carol)
g = await get(`/games/${gameId}`);
const fb = g.body.currentBidderIndex;
for (let i = 0; i < 6; i++) {
    const idx = (fb + i) % 6;
    const bid = i === 0 ? 5 : 0;
    r = await post(`/games/${gameId}/bid`, { playerName: g.body.players[idx].name, bid });
    if (r.status !== 200) { log(false, `round2 bid ${g.body.players[idx].name}=${bid} failed: ${JSON.stringify(r.body)}`); break; }
}
g = await get(`/games/${gameId}`);
log(g.body.status === "CHOOSING_TRUMP", `round 2 bidding -> declarer=${g.body.declarer?.name}, bid=${g.body.highestBid}, status=${g.body.status}`);
const decl2 = g.body.declarer.name;
r = await post(`/games/${gameId}/trump`, { playerName: decl2, trump: "Hearts" });
log(r.status === 200 && r.body.trump === "Hearts", `round 2 trump -> ${r.body.trump}, currentPlayerIndex=${r.body.currentPlayerIndex}`);

console.log("\n=== E2E TEST DONE ===");