#!/usr/bin/env python3
"""
Mind Reasoner Upload Script
Uploads VTT files and creates snapshots for UI/UX designer minds
"""

import requests
import json
import time
import sys
from pathlib import Path

# Configuration
API_KEY = "mr_b_W7yTJ2LjIeKnIGV-Qwb_EgBrMc5PXkj5qiv3bGvok8nKJuiIvly35vy_0Q2jqn9iyYK5Wec6lJgzbwQ315Yg"
BASE_URL = "https://app.mindreasoner.com/api/public/v1"

# Mind IDs
LUKE_MIND_ID = "b817f2f2-ad41-4be1-a7d8-55107b522ece"
LUKE_DIGITAL_TWIN_ID = "77910e97-ede5-4a1e-adde-011bf2da1a29"

JULIE_MIND_ID = "b610a536-7961-455e-bfa1-8f2bb794aa8e"
JULIE_DIGITAL_TWIN_ID = "d22e4c8d-7a29-45e1-9998-d68cf74294a9"

# File paths
LUKE_VTT = Path("data/luke_wroblewski_profile.vtt")
JULIE_VTT = Path("data/julie_zhou_profile.vtt")

class Colors:
    GREEN = '\033[0;32m'
    BLUE = '\033[0;34m'
    YELLOW = '\033[1;33m'
    RED = '\033[0;31m'
    NC = '\033[0m'  # No Color

def print_colored(message, color):
    print(f"{color}{message}{Colors.NC}")

def get_signed_url(mind_id):
    """Get a signed URL for file upload"""
    print_colored(f"\n📝 Getting signed upload URL for mind: {mind_id}", Colors.YELLOW)

    response = requests.get(
        f"{BASE_URL}/minds/{mind_id}/signed-url",
        headers={"Authorization": f"Bearer {API_KEY}"}
    )

    if response.status_code == 200:
        data = response.json()
        print_colored(f"✓ Got signed URL", Colors.GREEN)
        print(f"   Artifact ID: {data['artifactId']}")
        return data
    else:
        print_colored(f"✗ Error getting signed URL: {response.status_code}", Colors.RED)
        print(response.text)
        return None

def upload_file_simple(signed_url, file_path):
    """Upload file using requests library - simple approach"""
    print_colored(f"\n📤 Uploading file: {file_path}", Colors.YELLOW)

    try:
        with open(file_path, 'rb') as f:
            file_content = f.read()

        # Include Content-Type header as expected by the signed URL
        response = requests.put(
            signed_url,
            data=file_content,
            headers={'Content-Type': 'text/vtt'}
        )

        if response.status_code == 200:
            print_colored(f"✓ File uploaded successfully!", Colors.GREEN)
            return True
        else:
            print_colored(f"✗ Upload failed: {response.status_code}", Colors.RED)
            print(response.text[:500])
            return False

    except Exception as e:
        print_colored(f"✗ Upload error: {str(e)}", Colors.RED)
        return False

def create_snapshot(mind_id, digital_twin_id, artifact_id):
    """Create a snapshot from uploaded data"""
    print_colored(f"\n📸 Creating snapshot for mind: {mind_id}", Colors.YELLOW)

    # Use form data as per API docs
    files = {
        'digitalTwinId': (None, digital_twin_id),
        'artifactId': (None, artifact_id)
    }

    response = requests.post(
        f"{BASE_URL}/minds/{mind_id}/snapshots",
        headers={"Authorization": f"Bearer {API_KEY}"},
        files=files
    )

    if response.status_code == 200:
        data = response.json()
        print_colored(f"✓ Snapshot creation started!", Colors.GREEN)
        print(f"   Snapshot ID: {data.get('mindAssessmentId')}")
        return data
    else:
        print_colored(f"✗ Error creating snapshot: {response.status_code}", Colors.RED)
        print(response.text)
        return None

def check_snapshot_status(mind_id, snapshot_id):
    """Check the status of a snapshot"""
    response = requests.get(
        f"{BASE_URL}/minds/{mind_id}/snapshots/{snapshot_id}/status",
        headers={"Authorization": f"Bearer {API_KEY}"}
    )

    if response.status_code == 200:
        return response.json()
    else:
        print_colored(f"✗ Error checking status: {response.status_code}", Colors.RED)
        return None

def wait_for_snapshot(mind_id, snapshot_id, max_attempts=60):
    """Wait for snapshot to complete"""
    print_colored(f"\n⏳ Waiting for snapshot to complete...", Colors.YELLOW)

    for attempt in range(max_attempts):
        status_data = check_snapshot_status(mind_id, snapshot_id)

        if status_data:
            status = status_data.get('status')
            print(f"   Attempt {attempt + 1}/{max_attempts} - Status: {status}")

            if status == 'completed':
                print_colored(f"✓ Snapshot completed!", Colors.GREEN)
                return True
            elif status == 'failed':
                print_colored(f"✗ Snapshot failed!", Colors.RED)
                print(json.dumps(status_data, indent=2))
                return False

        time.sleep(10)

    print_colored(f"✗ Timeout waiting for snapshot", Colors.RED)
    return False

def run_simulation(mind_id, mind_name, scenario):
    """Run a simulation"""
    print_colored(f"\n🧠 Running simulation for: {mind_name}", Colors.BLUE)
    print(f"   Scenario: {scenario}\n")

    payload = {
        "mindId": mind_id,
        "selectedSimulationModel": "mind-reasoner-pro",
        "scenario": {
            "message": scenario
        }
    }

    response = requests.post(
        f"{BASE_URL}/simulate",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json=payload
    )

    if response.status_code == 200:
        result = response.json()
        print_colored(f"✓ Simulation complete!", Colors.GREEN)
        print("\n" + "="*80)
        print(json.dumps(result, indent=2))
        print("="*80 + "\n")
        return result
    else:
        print_colored(f"✗ Simulation failed: {response.status_code}", Colors.RED)
        print(response.text)
        return None

def main():
    print_colored("\n" + "="*80, Colors.BLUE)
    print_colored("   Mind Reasoner Upload and Test Script", Colors.BLUE)
    print_colored("="*80 + "\n", Colors.BLUE)

    results = {}

    # Process Luke Wroblewski
    print_colored("\n" + "="*80, Colors.GREEN)
    print_colored("   Processing: Luke Wroblewski - Mobile-First UX Expert", Colors.GREEN)
    print_colored("="*80, Colors.GREEN)

    luke_upload_data = get_signed_url(LUKE_MIND_ID)
    if luke_upload_data:
        if upload_file_simple(luke_upload_data['signedUrl'], LUKE_VTT):
            snapshot_data = create_snapshot(
                LUKE_MIND_ID,
                LUKE_DIGITAL_TWIN_ID,
                luke_upload_data['artifactId']
            )

            if snapshot_data:
                luke_snapshot_id = snapshot_data.get('mindAssessmentId')
                if wait_for_snapshot(LUKE_MIND_ID, luke_snapshot_id):
                    results['luke'] = {
                        'mindId': LUKE_MIND_ID,
                        'snapshotId': luke_snapshot_id,
                        'status': 'ready'
                    }

    # Process Julie Zhou
    print_colored("\n" + "="*80, Colors.GREEN)
    print_colored("   Processing: Julie Zhou - Product Design Leader", Colors.GREEN)
    print_colored("="*80, Colors.GREEN)

    julie_upload_data = get_signed_url(JULIE_MIND_ID)
    if julie_upload_data:
        if upload_file_simple(julie_upload_data['signedUrl'], JULIE_VTT):
            snapshot_data = create_snapshot(
                JULIE_MIND_ID,
                JULIE_DIGITAL_TWIN_ID,
                julie_upload_data['artifactId']
            )

            if snapshot_data:
                julie_snapshot_id = snapshot_data.get('mindAssessmentId')
                if wait_for_snapshot(JULIE_MIND_ID, julie_snapshot_id):
                    results['julie'] = {
                        'mindId': JULIE_MIND_ID,
                        'snapshotId': julie_snapshot_id,
                        'status': 'ready'
                    }

    # Run test simulations
    if results:
        print_colored("\n" + "="*80, Colors.BLUE)
        print_colored("   Running Test Simulations", Colors.BLUE)
        print_colored("="*80 + "\n", Colors.BLUE)

        # Test Luke
        if 'luke' in results:
            run_simulation(
                LUKE_MIND_ID,
                "Luke Wroblewski",
                "We're designing a banking app for elderly users with limited tech experience. What's your mobile-first approach?"
            )

            time.sleep(3)

            run_simulation(
                LUKE_MIND_ID,
                "Luke Wroblewski",
                "Our product team is overwhelmed with data. What metrics should we focus on for a new e-commerce checkout flow?"
            )

        # Test Julie
        if 'julie' in results:
            time.sleep(3)

            run_simulation(
                JULIE_MIND_ID,
                "Julie Zhou",
                "We're a startup that just raised Series B. Our design team needs to grow from 5 to 20 people. How do we scale effectively?"
            )

            time.sleep(3)

            run_simulation(
                JULIE_MIND_ID,
                "Julie Zhou",
                "Our product has inconsistent UI across 10 different features. Should we invest in a design system now or wait?"
            )

        # Save results
        with open('minds/test_results.json', 'w') as f:
            json.dump(results, f, indent=2)

        print_colored("\n✓ Results saved to minds/test_results.json", Colors.GREEN)

    print_colored("\n" + "="*80, Colors.GREEN)
    print_colored("   Script Completed!", Colors.GREEN)
    print_colored("="*80 + "\n", Colors.GREEN)

if __name__ == "__main__":
    main()
