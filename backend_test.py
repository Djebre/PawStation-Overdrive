#!/usr/bin/env python3
import requests
import sys
from datetime import datetime
import json

class SpaceGrooveAPITester:
    def __init__(self, base_url="https://space-groove-drift.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_base}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            result = {
                'test': name,
                'success': success,
                'status_code': response.status_code,
                'expected_status': expected_status,
                'response': response.text[:500]
            }
            self.test_results.append(result)

            return success, response.json() if success else {}

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            result = {
                'test': name,
                'success': False,
                'error': str(e)
            }
            self.test_results.append(result)
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            result = {
                'test': name,
                'success': False,
                'error': str(e)
            }
            self.test_results.append(result)
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_submit_score(self):
        """Test score submission"""
        test_data = {
            "name": f"TestPlayer_{datetime.now().strftime('%H%M%S')}",
            "score": 1250,
            "game_type": "groove-orbit-runner"
        }
        success, response = self.run_test(
            "Submit Score",
            "POST",
            "score",
            200,
            data=test_data
        )
        return success, response

    def test_get_leaderboard_all(self):
        """Test leaderboard without filter"""
        return self.run_test("Get All Leaderboard", "GET", "leaderboard", 200)

    def test_get_leaderboard_filtered(self):
        """Test leaderboard with game filter"""
        return self.run_test(
            "Get Filtered Leaderboard", 
            "GET", 
            "leaderboard", 
            200, 
            params={"game_type": "groove-orbit-runner"}
        )

    def test_invalid_score_submission(self):
        """Test invalid score submission"""
        invalid_data = {
            "name": "",  # Empty name should fail
            "score": "invalid",  # Invalid score type
            "game_type": "groove-orbit-runner"
        }
        return self.run_test(
            "Invalid Score Submission",
            "POST",
            "score",
            422,  # Validation error expected
            data=invalid_data
        )

def main():
    print("🚀 Starting Space Groove Arcade API Tests")
    print("=" * 50)
    
    tester = SpaceGrooveAPITester()
    
    # Test API root
    tester.test_api_root()
    
    # Test score submission
    score_success, score_response = tester.test_submit_score()
    
    # Test leaderboard endpoints
    tester.test_get_leaderboard_all()
    tester.test_get_leaderboard_filtered()
    
    # Test validation
    tester.test_invalid_score_submission()
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"📊 Test Summary:")
    print(f"   Tests run: {tester.tests_run}")
    print(f"   Tests passed: {tester.tests_passed}")
    print(f"   Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'summary': {
                'tests_run': tester.tests_run,
                'tests_passed': tester.tests_passed,
                'success_rate': (tester.tests_passed/tester.tests_run)*100
            },
            'detailed_results': tester.test_results
        }, f, indent=2)
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())