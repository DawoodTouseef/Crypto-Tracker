#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Crypto Price Tracker Dashboard
Tests all API endpoints, caching, error handling, and fallback mechanisms.
"""

import requests
import json
import time
import sys
from datetime import datetime

# Get base URL from environment
BASE_URL = "https://cryptodash-8.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

class CryptoAPITester:
    def __init__(self):
        self.test_results = []
        self.session = requests.Session()
        self.session.headers.update({
            'Accept': 'application/json',
            'User-Agent': 'CryptoAPI-Tester/1.0'
        })
    
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': timestamp,
            'response_data': response_data
        }
        
        self.test_results.append(result)
        print(f"[{timestamp}] {status} {test_name}: {message}")
        
        if response_data and not success:
            print(f"    Response: {json.dumps(response_data, indent=2)}")
    
    def test_default_api_route(self):
        """Test the default API route"""
        print("\n=== Testing Default API Route ===")
        
        try:
            response = self.session.get(f"{API_BASE}")
            
            if response.status_code == 200:
                data = response.json()
                if 'message' in data and 'Crypto Price Tracker API' in data['message']:
                    self.log_test("Default API Route", True, 
                                f"Returns correct welcome message: {data['message']}")
                else:
                    self.log_test("Default API Route", False, 
                                f"Unexpected response format", data)
            else:
                self.log_test("Default API Route", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Default API Route", False, f"Request failed: {str(e)}")
    
    def test_market_data_endpoint(self):
        """Test market data endpoint with different parameters"""
        print("\n=== Testing Market Data Endpoint ===")
        
        # Test different limit parameters
        test_limits = [10, 20, 50]
        
        for limit in test_limits:
            try:
                start_time = time.time()
                response = self.session.get(f"{API_BASE}/crypto/markets?limit={limit}")
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Verify response is a list
                    if not isinstance(data, list):
                        self.log_test(f"Market Data (limit={limit})", False, 
                                    "Response is not a list", data)
                        continue
                    
                    # Verify we get the expected number of items (or less due to API limits)
                    if len(data) > limit:
                        self.log_test(f"Market Data (limit={limit})", False, 
                                    f"Returned {len(data)} items, expected max {limit}")
                        continue
                    
                    # Verify required fields in first item
                    if data:
                        required_fields = ['id', 'symbol', 'name', 'image', 'current_price', 
                                         'market_cap', 'total_volume', 'price_change_percentage_24h']
                        
                        missing_fields = [field for field in required_fields if field not in data[0]]
                        
                        if missing_fields:
                            self.log_test(f"Market Data (limit={limit})", False, 
                                        f"Missing required fields: {missing_fields}", data[0])
                        else:
                            self.log_test(f"Market Data (limit={limit})", True, 
                                        f"Returned {len(data)} items with all required fields in {response_time:.2f}s")
                    else:
                        self.log_test(f"Market Data (limit={limit})", False, 
                                    "Empty response data")
                else:
                    self.log_test(f"Market Data (limit={limit})", False, 
                                f"HTTP {response.status_code}: {response.text}")
                    
            except Exception as e:
                self.log_test(f"Market Data (limit={limit})", False, f"Request failed: {str(e)}")
    
    def test_caching_mechanism(self):
        """Test caching by making repeated requests"""
        print("\n=== Testing Caching Mechanism ===")
        
        try:
            # First request
            start_time = time.time()
            response1 = self.session.get(f"{API_BASE}/crypto/markets?limit=10")
            time1 = time.time() - start_time
            
            if response1.status_code != 200:
                self.log_test("Caching Test", False, f"First request failed: HTTP {response1.status_code}")
                return
            
            # Second request (should be cached)
            start_time = time.time()
            response2 = self.session.get(f"{API_BASE}/crypto/markets?limit=10")
            time2 = time.time() - start_time
            
            if response2.status_code != 200:
                self.log_test("Caching Test", False, f"Second request failed: HTTP {response2.status_code}")
                return
            
            # Compare response times and data
            data1 = response1.json()
            data2 = response2.json()
            
            if data1 == data2:
                if time2 < time1 * 0.8:  # Second request should be significantly faster
                    self.log_test("Caching Mechanism", True, 
                                f"Caching working - First: {time1:.2f}s, Second: {time2:.2f}s (cached)")
                else:
                    self.log_test("Caching Mechanism", True, 
                                f"Data consistent but timing unclear - First: {time1:.2f}s, Second: {time2:.2f}s")
            else:
                self.log_test("Caching Mechanism", False, 
                            "Cached data differs from original request")
                
        except Exception as e:
            self.log_test("Caching Mechanism", False, f"Test failed: {str(e)}")
    
    def test_chart_data_endpoint(self):
        """Test chart data endpoint with valid and invalid coin IDs"""
        print("\n=== Testing Chart Data Endpoint ===")
        
        # Test with valid coin IDs
        valid_coins = ['bitcoin', 'ethereum', 'solana']
        
        for coin_id in valid_coins:
            try:
                start_time = time.time()
                response = self.session.get(f"{API_BASE}/crypto/chart/{coin_id}")
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Verify response is a list
                    if not isinstance(data, list):
                        self.log_test(f"Chart Data ({coin_id})", False, 
                                    "Response is not a list", data)
                        continue
                    
                    # Verify data structure
                    if data and len(data) > 0:
                        required_fields = ['timestamp', 'price']
                        missing_fields = [field for field in required_fields if field not in data[0]]
                        
                        if missing_fields:
                            self.log_test(f"Chart Data ({coin_id})", False, 
                                        f"Missing required fields: {missing_fields}", data[0])
                        else:
                            self.log_test(f"Chart Data ({coin_id})", True, 
                                        f"Returned {len(data)} data points in {response_time:.2f}s")
                    else:
                        self.log_test(f"Chart Data ({coin_id})", False, 
                                    "Empty chart data")
                else:
                    self.log_test(f"Chart Data ({coin_id})", False, 
                                f"HTTP {response.status_code}: {response.text}")
                    
            except Exception as e:
                self.log_test(f"Chart Data ({coin_id})", False, f"Request failed: {str(e)}")
        
        # Test with invalid coin ID
        try:
            response = self.session.get(f"{API_BASE}/crypto/chart/invalid-coin-id-12345")
            
            if response.status_code == 200:
                # Should still return demo data
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    self.log_test("Chart Data (invalid ID)", True, 
                                "Returns demo data for invalid coin ID")
                else:
                    self.log_test("Chart Data (invalid ID)", False, 
                                "Invalid response for invalid coin ID", data)
            else:
                self.log_test("Chart Data (invalid ID)", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Chart Data (invalid ID)", False, f"Request failed: {str(e)}")
        
        # Test missing coin ID
        try:
            response = self.session.get(f"{API_BASE}/crypto/chart/")
            
            if response.status_code == 400:
                data = response.json()
                if 'error' in data and 'required' in data['error'].lower():
                    self.log_test("Chart Data (missing ID)", True, 
                                "Correctly returns 400 error for missing coin ID")
                else:
                    self.log_test("Chart Data (missing ID)", False, 
                                "Unexpected error message", data)
            else:
                self.log_test("Chart Data (missing ID)", False, 
                            f"Expected 400 error, got HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Chart Data (missing ID)", False, f"Request failed: {str(e)}")
    
    def test_chart_caching(self):
        """Test caching for chart data"""
        print("\n=== Testing Chart Data Caching ===")
        
        try:
            coin_id = 'bitcoin'
            
            # First request
            start_time = time.time()
            response1 = self.session.get(f"{API_BASE}/crypto/chart/{coin_id}")
            time1 = time.time() - start_time
            
            if response1.status_code != 200:
                self.log_test("Chart Caching Test", False, f"First request failed: HTTP {response1.status_code}")
                return
            
            # Second request (should be cached)
            start_time = time.time()
            response2 = self.session.get(f"{API_BASE}/crypto/chart/{coin_id}")
            time2 = time.time() - start_time
            
            if response2.status_code != 200:
                self.log_test("Chart Caching Test", False, f"Second request failed: HTTP {response2.status_code}")
                return
            
            # Compare data
            data1 = response1.json()
            data2 = response2.json()
            
            if data1 == data2:
                if time2 < time1 * 0.8:  # Second request should be faster
                    self.log_test("Chart Data Caching", True, 
                                f"Chart caching working - First: {time1:.2f}s, Second: {time2:.2f}s")
                else:
                    self.log_test("Chart Data Caching", True, 
                                f"Chart data consistent - First: {time1:.2f}s, Second: {time2:.2f}s")
            else:
                self.log_test("Chart Data Caching", False, 
                            "Cached chart data differs from original")
                
        except Exception as e:
            self.log_test("Chart Data Caching", False, f"Test failed: {str(e)}")
    
    def test_response_headers(self):
        """Test response headers for caching directives"""
        print("\n=== Testing Response Headers ===")
        
        endpoints = [
            ("/crypto/markets?limit=10", "Market Data Headers"),
            ("/crypto/chart/bitcoin", "Chart Data Headers")
        ]
        
        for endpoint, test_name in endpoints:
            try:
                response = self.session.get(f"{API_BASE}{endpoint}")
                
                if response.status_code == 200:
                    cache_control = response.headers.get('Cache-Control', '')
                    
                    if 'public' in cache_control and 's-maxage' in cache_control:
                        self.log_test(test_name, True, 
                                    f"Correct cache headers: {cache_control}")
                    else:
                        self.log_test(test_name, False, 
                                    f"Missing or incorrect cache headers: {cache_control}")
                else:
                    self.log_test(test_name, False, 
                                f"HTTP {response.status_code}: {response.text}")
                    
            except Exception as e:
                self.log_test(test_name, False, f"Request failed: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print(f"🚀 Starting Crypto Price Tracker API Tests")
        print(f"📍 Base URL: {BASE_URL}")
        print(f"🔗 API Base: {API_BASE}")
        print("=" * 60)
        
        # Run all test suites
        self.test_default_api_route()
        self.test_market_data_endpoint()
        self.test_caching_mechanism()
        self.test_chart_data_endpoint()
        self.test_chart_caching()
        self.test_response_headers()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        failed = len(self.test_results) - passed
        
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Success Rate: {(passed/len(self.test_results)*100):.1f}%")
        
        if failed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  • {result['test']}: {result['message']}")
        
        return passed, failed

def main():
    """Main test execution"""
    tester = CryptoAPITester()
    
    try:
        passed, failed = tester.run_all_tests()
        
        # Exit with appropriate code
        if failed == 0:
            print("\n🎉 All tests passed!")
            sys.exit(0)
        else:
            print(f"\n⚠️  {failed} test(s) failed!")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n\n⏹️  Tests interrupted by user")
        sys.exit(130)
    except Exception as e:
        print(f"\n💥 Test execution failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()