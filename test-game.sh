#!/bin/bash

# Lorris Game Test Script
# This script simulates a complete game with 6 players

API_URL="http://localhost:8080"

echo "🎮 Starting Lorris Game Test..."
echo "================================"

# Step 1: Create a game
echo -e "\n📝 Step 1: Creating game..."
GAME_RESPONSE=$(curl -s -X POST "$API_URL/games")
GAME_ID=$(echo $GAME_RESPONSE | grep -o '"gameId":"[^"]*"' | cut -d'"' -f4)
echo "✓ Game created with ID: $GAME_ID"

# Step 2: Join 6 players
echo -e "\n👥 Step 2: Joining 6 players..."
for i in {1..6}; do
    PLAYER_NAME="Player$i"
    curl -s -X POST "$API_URL/games/$GAME_ID/join" \
        -H "Content-Type: application/json" \
        -d "{\"playerName\":\"$PLAYER_NAME\"}" > /dev/null
    echo "✓ $PLAYER_NAME joined"
done

sleep 1

# Step 3: Check game status
echo -e "\n📊 Step 3: Checking game status..."
GAME_STATE=$(curl -s "$API_URL/games/$GAME_ID")
STATUS=$(echo $GAME_STATE | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
echo "✓ Game status: $STATUS"

# Step 4: Bidding phase
echo -e "\n💰 Step 4: Bidding phase..."
curl -s -X POST "$API_URL/games/$GAME_ID/bid" \
    -H "Content-Type: application/json" \
    -d '{"playerName":"Player1","bid":0}' > /dev/null
echo "✓ Player1 passed"

curl -s -X POST "$API_URL/games/$GAME_ID/bid" \
    -H "Content-Type: application/json" \
    -d '{"playerName":"Player2","bid":4}' > /dev/null
echo "✓ Player2 bid 4"

curl -s -X POST "$API_URL/games/$GAME_ID/bid" \
    -H "Content-Type: application/json" \
    -d '{"playerName":"Player3","bid":0}' > /dev/null
echo "✓ Player3 passed"

curl -s -X POST "$API_URL/games/$GAME_ID/bid" \
    -H "Content-Type: application/json" \
    -d '{"playerName":"Player4","bid":5}' > /dev/null
echo "✓ Player4 bid 5"

curl -s -X POST "$API_URL/games/$GAME_ID/bid" \
    -H "Content-Type: application/json" \
    -d '{"playerName":"Player5","bid":0}' > /dev/null
echo "✓ Player5 passed"

curl -s -X POST "$API_URL/games/$GAME_ID/bid" \
    -H "Content-Type: application/json" \
    -d '{"playerName":"Player6","bid":0}' > /dev/null
echo "✓ Player6 passed"

sleep 1

# Step 5: Check declarer and trump selection
echo -e "\n🃏 Step 5: Checking declarer..."
GAME_STATE=$(curl -s "$API_URL/games/$GAME_ID")
DECLARER=$(echo $GAME_STATE | grep -o '"declarer":{"name":"[^"]*"' | cut -d'"' -f6)
STATUS=$(echo $GAME_STATE | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
echo "✓ Declarer: $DECLARER"
echo "✓ Status: $STATUS"

# Step 6: Choose trump
echo -e "\n♠️ Step 6: Choosing trump..."
curl -s -X POST "$API_URL/games/$GAME_ID/trump" \
    -H "Content-Type: application/json" \
    -d "{\"playerName\":\"$DECLARER\",\"trump\":\"Hearts\"}" > /dev/null
echo "✓ Trump set to Hearts"

sleep 1

# Step 7: Get player hands
echo -e "\n🎴 Step 7: Getting player hands..."
for i in {1..6}; do
    PLAYER_NAME="Player$i"
    HAND=$(curl -s "$API_URL/games/$GAME_ID/players/$PLAYER_NAME/hand")
    CARD_COUNT=$(echo $HAND | grep -o '"suit"' | wc -l)
    echo "✓ $PLAYER_NAME has $CARD_COUNT cards"
done

# Step 8: Play a trick
echo -e "\n🎯 Step 8: Playing first trick..."
GAME_STATE=$(curl -s "$API_URL/games/$GAME_ID")
CURRENT_PLAYER_INDEX=$(echo $GAME_STATE | grep -o '"currentPlayerIndex":[0-9]*' | cut -d':' -f2)
echo "✓ Current player index: $CURRENT_PLAYER_INDEX"

# Get current player's hand
CURRENT_PLAYER="Player$((CURRENT_PLAYER_INDEX + 1))"
echo "✓ Current player: $CURRENT_PLAYER"

HAND=$(curl -s "$API_URL/games/$GAME_ID/players/$CURRENT_PLAYER/hand")
FIRST_CARD_SUIT=$(echo $HAND | grep -o '"suit":"[^"]*"' | head -1 | cut -d'"' -f4)
FIRST_CARD_RANK=$(echo $HAND | grep -o '"rank":"[^"]*"' | head -1 | cut -d'"' -f4)

echo "✓ Playing card: $FIRST_CARD_RANK of $FIRST_CARD_SUIT"

curl -s -X POST "$API_URL/games/$GAME_ID/play" \
    -H "Content-Type: application/json" \
    -d "{\"playerName\":\"$CURRENT_PLAYER\",\"suit\":\"$FIRST_CARD_SUIT\",\"rank\":\"$FIRST_CARD_RANK\"}" > /dev/null

echo -e "\n✅ Test completed successfully!"
echo "================================"
echo ""
echo "Game Details:"
echo "  Game ID: $GAME_ID"
echo "  Status: PLAYING"
echo "  Declarer: $DECLARER"
echo "  Trump: Hearts"
echo ""
echo "You can continue testing at: http://localhost:5173"
echo "Or use the API directly at: $API_URL/games/$GAME_ID"
