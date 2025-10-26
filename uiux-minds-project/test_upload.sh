#!/bin/bash

# Mind Reasoner API Upload and Test Script
# This script uploads profiles for Luke Wroblewski and Julie Zhou,
# creates snapshots, and tests the minds with simulations

set -e  # Exit on error

# API Configuration
API_KEY="[add_your_api_key_here]"
BASE_URL="https://app.mindreasoner.com/api/public/v1"

# Mind IDs from creation
LUKE_MIND_ID="b817f2f2-ad41-4be1-a7d8-55107b522ece"
LUKE_DIGITAL_TWIN_ID="77910e97-ede5-4a1e-adde-011bf2da1a29"

JULIE_MIND_ID="b610a536-7961-455e-bfa1-8f2bb794aa8e"
JULIE_DIGITAL_TWIN_ID="d22e4c8d-7a29-45e1-9998-d68cf74294a9"

# File paths
LUKE_VTT="./data/luke_wroblewski_profile.vtt"
JULIE_VTT="./data/julie_zhou_profile.vtt"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Mind Reasoner Upload and Test Script ===${NC}\n"

# Function to get signed upload URL
get_upload_url() {
    local mind_id=$1
    echo -e "${YELLOW}Getting signed upload URL for mind: $mind_id${NC}"

    response=$(curl -s -X GET \
        "${BASE_URL}/minds/${mind_id}/signed-url" \
        -H "Authorization: Bearer ${API_KEY}")

    echo "$response"
}

# Function to upload file to signed URL
upload_file() {
    local signed_url=$1
    local file_path=$2

    echo -e "${YELLOW}Uploading file: $file_path${NC}"

    curl -X PUT "$signed_url" \
        -H "Content-Type: text/vtt" \
        --data-binary "@$file_path" \
        -w "\nHTTP Status: %{http_code}\n"
}

# Function to create snapshot
create_snapshot() {
    local mind_id=$1
    local digital_twin_id=$2
    local artifact_id=$3

    echo -e "${YELLOW}Creating snapshot for mind: $mind_id${NC}"

    response=$(curl -s -X POST \
        "${BASE_URL}/minds/${mind_id}/snapshots" \
        -H "Authorization: Bearer ${API_KEY}" \
        -F "digitalTwinId=${digital_twin_id}" \
        -F "artifactId=${artifact_id}")

    echo "$response"
}

# Function to check snapshot status
check_status() {
    local mind_id=$1
    local snapshot_id=$2

    response=$(curl -s -X GET \
        "${BASE_URL}/minds/${mind_id}/snapshots/${snapshot_id}/status" \
        -H "Authorization: Bearer ${API_KEY}")

    echo "$response"
}

# Function to wait for snapshot completion
wait_for_snapshot() {
    local mind_id=$1
    local snapshot_id=$2
    local max_attempts=60
    local attempt=0

    echo -e "${YELLOW}Waiting for snapshot to complete...${NC}"

    while [ $attempt -lt $max_attempts ]; do
        status_response=$(check_status "$mind_id" "$snapshot_id")
        status=$(echo "$status_response" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

        echo -e "Attempt $((attempt + 1))/$max_attempts - Status: $status"

        if [ "$status" = "completed" ]; then
            echo -e "${GREEN}✓ Snapshot completed!${NC}"
            return 0
        elif [ "$status" = "failed" ]; then
            echo -e "${RED}✗ Snapshot failed!${NC}"
            echo "$status_response"
            return 1
        fi

        sleep 10
        attempt=$((attempt + 1))
    done

    echo -e "${RED}✗ Timeout waiting for snapshot${NC}"
    return 1
}

# Function to run simulation
run_simulation() {
    local mind_id=$1
    local mind_name=$2
    local scenario=$3

    echo -e "${YELLOW}Running simulation for: $mind_name${NC}"
    echo -e "${BLUE}Scenario: $scenario${NC}\n"

    response=$(curl -s -X POST \
        "${BASE_URL}/simulate" \
        -H "Authorization: Bearer ${API_KEY}" \
        -H "Content-Type: application/json" \
        -d "{
            \"mindId\": \"${mind_id}\",
            \"selectedSimulationModel\": \"mind-reasoner-pro\",
            \"scenario\": {
                \"message\": \"${scenario}\"
            }
        }")

    echo "$response" | jq '.'
}

# ============================================
# LUKE WROBLEWSKI UPLOAD
# ============================================
echo -e "\n${GREEN}=== Processing Luke Wroblewski ===${NC}\n"

# Get signed URL for Luke
luke_upload_data=$(get_upload_url "$LUKE_MIND_ID")
echo "$luke_upload_data" | jq '.'

luke_signed_url=$(echo "$luke_upload_data" | jq -r '.signedUrl')
luke_artifact_id=$(echo "$luke_upload_data" | jq -r '.artifactId')

echo -e "\n${BLUE}Artifact ID: $luke_artifact_id${NC}\n"

# Upload Luke's file
upload_file "$luke_signed_url" "$LUKE_VTT"

# Create snapshot for Luke
luke_snapshot_response=$(create_snapshot "$LUKE_MIND_ID" "$LUKE_DIGITAL_TWIN_ID" "$luke_artifact_id")
echo "$luke_snapshot_response" | jq '.'

luke_snapshot_id=$(echo "$luke_snapshot_response" | jq -r '.mindAssessmentId')
echo -e "\n${BLUE}Luke Snapshot ID: $luke_snapshot_id${NC}\n"

# Wait for Luke's snapshot
wait_for_snapshot "$LUKE_MIND_ID" "$luke_snapshot_id"

# ============================================
# JULIE ZHOU UPLOAD
# ============================================
echo -e "\n${GREEN}=== Processing Julie Zhou ===${NC}\n"

# Get signed URL for Julie
julie_upload_data=$(get_upload_url "$JULIE_MIND_ID")
echo "$julie_upload_data" | jq '.'

julie_signed_url=$(echo "$julie_upload_data" | jq -r '.signedUrl')
julie_artifact_id=$(echo "$julie_upload_data" | jq -r '.artifactId')

echo -e "\n${BLUE}Artifact ID: $julie_artifact_id${NC}\n"

# Upload Julie's file
upload_file "$julie_signed_url" "$JULIE_VTT"

# Create snapshot for Julie
julie_snapshot_response=$(create_snapshot "$JULIE_MIND_ID" "$JULIE_DIGITAL_TWIN_ID" "$julie_artifact_id")
echo "$julie_snapshot_response" | jq '.'

julie_snapshot_id=$(echo "$julie_snapshot_response" | jq -r '.mindAssessmentId')
echo -e "\n${BLUE}Julie Snapshot ID: $julie_snapshot_id${NC}\n"

# Wait for Julie's snapshot
wait_for_snapshot "$JULIE_MIND_ID" "$julie_snapshot_id"

# ============================================
# RUN TEST SIMULATIONS
# ============================================
echo -e "\n${GREEN}=== Running Test Simulations ===${NC}\n"

# Test Luke with mobile-first scenario
echo -e "\n${BLUE}--- Test 1: Luke Wroblewski - Mobile-First Design ---${NC}\n"
run_simulation "$LUKE_MIND_ID" "Luke Wroblewski" \
    "We're designing a banking app for elderly users with limited tech experience. What's your mobile-first approach?"

sleep 5

# Test Luke with metrics scenario
echo -e "\n${BLUE}--- Test 2: Luke Wroblewski - Metrics Strategy ---${NC}\n"
run_simulation "$LUKE_MIND_ID" "Luke Wroblewski" \
    "Our product team is overwhelmed with data. What metrics should we focus on for a new e-commerce checkout flow?"

sleep 5

# Test Julie with team scaling
echo -e "\n${BLUE}--- Test 3: Julie Zhou - Design Team Scaling ---${NC}\n"
run_simulation "$JULIE_MIND_ID" "Julie Zhou" \
    "We're a startup that just raised Series B. Our design team needs to grow from 5 to 20 people. How do we scale effectively?"

sleep 5

# Test Julie with design systems
echo -e "\n${BLUE}--- Test 4: Julie Zhou - Design Systems ---${NC}\n"
run_simulation "$JULIE_MIND_ID" "Julie Zhou" \
    "Our product has inconsistent UI across 10 different features. Should we invest in a design system now or wait?"

echo -e "\n${GREEN}=== All Tests Complete! ===${NC}\n"

# Save results
echo -e "${BLUE}Saving mind IDs to results file...${NC}"
cat > ./minds/test_results.json << EOF
{
  "luke_wroblewski": {
    "mindId": "${LUKE_MIND_ID}",
    "digitalTwinId": "${LUKE_DIGITAL_TWIN_ID}",
    "snapshotId": "${luke_snapshot_id}",
    "artifactId": "${luke_artifact_id}",
    "status": "ready"
  },
  "julie_zhou": {
    "mindId": "${JULIE_MIND_ID}",
    "digitalTwinId": "${JULIE_DIGITAL_TWIN_ID}",
    "snapshotId": "${julie_snapshot_id}",
    "artifactId": "${julie_artifact_id}",
    "status": "ready"
  },
  "test_date": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

echo -e "${GREEN}✓ Results saved to ./minds/test_results.json${NC}"
echo -e "\n${GREEN}=== Script Completed Successfully! ===${NC}\n"
