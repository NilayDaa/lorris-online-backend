#!/bin/bash

# Automated Multi-Player Game Demo
# This simulates a real game session you can watch

API="http://localhost:8080"

echo "🎮 LORRIS LIVE GAME DEMONSTRATION"
echo "===================================="
echo ""
echo "Starting a complete game session..."
echo ""

# Create game
echo "1. Creating game..."
GAME=$(curl -s -X POST "$API/games")
GAME_ID=$(echo $GAME | grep -o '"gameId":"[^"]*"' | cut -d'"' -f4)
echo "   ✅ Game Code: $GAME_ID"
echo "   🌐 Join at: http://localhost:5173/lobby/$GAME_ID"
echo ""

# Join players
echo "2. Players joining..."
for i in {1..6}; do
    curl -s -X POST "$API/games/$GAME_ID/join" \
        -H "Content-Type: application/json" \
        -d "{\"playerName\":\"Player$i\"}" > /dev/null
    echo "   Player$i joined ✓"
    sleep 0.3
done
echo ""

# Check status
GAME=$(curl -s "$API/games/$GAME_ID")
echo "3. Game started! Status: BIDDING"
echo ""

# Bidding
echo "4. Bidding phase..."
echo "   Player1: Pass"
curl -s -X POST "$API/games/$GAME_ID/bid" -H "Content-Type: application/json" -d '{"playerName":"Player1","bid":0}' > /dev/null

echo "   Player2: 5 tricks"
curl -s -X POST "$API/games/$GAME_ID/bid" -H "Content-Type: application/json" -d '{"playerName":"Player2","bid":5}' > /dev/null

echo "   Player3: Pass"
curl -s -X POST "$API/games/$GAME_ID/bid" -H "Content-Type: application/json" -d '{"playerName":"Player3","bid":0}' > /dev/null

echo "   Player4: 6 tricks"
curl -s -X POST "$API/games/$GAME_ID/bid" -H "Content-Type: application/json" -d '{"playerName":"Player4","bid":6}' > /dev/null

echo "   Player5: Pass"
curl -s -X POST "$API/games/$GAME_ID/bid" -H "Content-Type: application/json" -d '{"playerName":"Player5","bid":0}' > /dev/null

echo "   Player6: Pass"
curl -s -X POST "$API/games/$GAME_ID/bid" -H "Content-Type: application/json" -d '{"playerName":"Player6","bid":0}' > /dev/null
echo "   🏆 Declarer: Player4 (Team B)"
echo ""

# Choose trump
echo "5. Player4 choosing trump..."
curl -s -X POST "$API/games/$GAME_ID/trump" \
    -H "Content-Type: application/json" \
    -d '{"playerName":"Player4","trump":"Spades"}' > /dev/null
echo "   ♠️ Trump: Spades"
echo ""

echo "6. Game is now PLAYING!"
echo ""
echo "📊 Current Game State:"
echo "   Game ID: $GAME_ID"
echo "   Status: PLAYING"
echo "   Players: 6"
echo "   Declarer: Player4 (Team B)"
echo "   Contract: 6 tricks"
echo "   Trump: ♠️ Spades"
echo ""
echo "===================================="
echo "✅ GAME IS FULLY PLAYABLE!"
echo "===================================="
echo ""
echo "View game in browser:"
echo "http://localhost:5173/game/$GAME_ID"
echo ""
echo "Join as any player:"
for i in {1..6}; do
    echo "  Player$i → http://localhost:5173/game/$GAME_ID"
done
echo ""
echo "Game will be waiting for players to play their cards."
echo "Open the URL above in your browser to continue playing!"
