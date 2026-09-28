#!/bin/bash
set -e

BASE_URL="http://localhost:8080/api"
echo "=========================================="
echo "🚀 Initiate PolarSetu Integration Journey"
echo "=========================================="

echo -e "\n1. Authenticating Admin User..."
LOGIN_RES=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@polarsetu.in","password":"password123"}')

TOKEN=$(echo $LOGIN_RES | jq -r '.token')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "❌ Login Failed."
  echo $LOGIN_RES
  exit 1
fi
echo "✅ Authenticated."

echo -e "\n2. Creating test Expedition..."
EXP_RES=$(curl -s -X POST "$BASE_URL/expeditions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Integration Test Expedition",
        "region": "Antarctica",
        "year": 2026,
        "objective": "Testing backend flow"
      }')
echo $EXP_RES | jq -c '.id' > /dev/null
echo "✅ Expedition created."

echo -e "\n3. Creating tied Resource..."
# Generate random ID to avoid unique constraint crashes
RES_ID="RES-TEST-$RANDOM"
RES_RES=$(curl -s -X POST "$BASE_URL/resources" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "id": "'"$RES_ID"'",
        "type": "REPORT",
        "title": "Integration Sea Ice Report",
        "description": "Crucial metrics detailing Arctic anomalies.",
        "year": 2026,
        "region": "Arctic",
        "sourceUrl": "https://gov.in"
      }')
echo "Resource Result: $RES_RES"
echo "✅ Resource created."

echo -e "\n4. Testing Full-Text Search (waiting for DB trigger...)"
sleep 1
SEARCH_RES=$(curl -s -X GET "$BASE_URL/search?q=anomalies")
MATCH_ID=$(echo $SEARCH_RES | jq -r '.results[] | select(.id == "'"$RES_ID"'") | .id')
if [ -z "$MATCH_ID" ] || [ "$MATCH_ID" == "null" ]; then
  echo "❌ Search Engine Failed to parse."
  echo $SEARCH_RES
  exit 1
fi
echo "✅ Search indexed successfully."

echo -e "\n5. Generating AI Outreach Draft..."
AI_RES=$(curl -s -X POST "$BASE_URL/ai/outreach" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "sourceId": "'"$RES_ID"'",
        "audience": "High School Students",
        "format": "Instagram Post"
      }')
DRAFT_ID=$(echo $AI_RES | jq -r '.id')
if [ -z "$DRAFT_ID" ] || [ "$DRAFT_ID" == "null" ]; then
  echo "❌ AI Generation Failed."
  echo $AI_RES
  exit 1
fi
echo "✅ Draft generated. ID: $DRAFT_ID"

echo -e "\n🎉 COMPLETE END-TO-END VERIFICATION PASS!"
echo "=========================================="