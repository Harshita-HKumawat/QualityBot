#!/usr/bin/env python3
"""
Test script for QualityBot JWT Authentication
Run this after starting the backend server
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_backend_health():
    """Test if backend is running"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Backend Health Check: {response.status_code}")
        print(f"   Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Backend Health Check Failed: {e}")
        return False

def test_signup():
    """Test user signup"""
    try:
        signup_data = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "testpass123",
            "role": "student"
        }
        
        response = requests.post(f"{BASE_URL}/signup", json=signup_data)
        print(f"✅ Signup Test: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   User ID: {data['id']}")
            print(f"   Token: {data['token'][:20]}...")
            return data['token']
        else:
            print(f"   Error: {response.json()}")
            return None
            
    except Exception as e:
        print(f"❌ Signup Test Failed: {e}")
        return None

def test_login():
    """Test user login"""
    try:
        login_data = {
            "email": "test@example.com",
            "password": "testpass123"
        }
        
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        print(f"✅ Login Test: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   User ID: {data['id']}")
            print(f"   Token: {data['token'][:20]}...")
            return data['token']
        else:
            print(f"   Error: {response.json()}")
            return None
            
    except Exception as e:
        print(f"❌ Login Test Failed: {e}")
        return None

def test_token_verification(token):
    """Test token verification"""
    if not token:
        print("❌ No token to verify")
        return False
        
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/verify-token", headers=headers)
        print(f"✅ Token Verification: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Verified User: {data['name']} ({data['email']})")
            return True
        else:
            print(f"   Error: {response.json()}")
            return False
            
    except Exception as e:
        print(f"❌ Token Verification Failed: {e}")
        return False

def main():
    print("🚀 Testing QualityBot JWT Authentication\n")
    
    # Test backend health
    if not test_backend_health():
        print("\n❌ Backend is not running. Please start the backend server first.")
        return
    
    print("\n" + "="*50)
    
    # Test signup
    token = test_signup()
    
    print("\n" + "="*50)
    
    # Test login
    login_token = test_login()
    
    print("\n" + "="*50)
    
    # Test token verification
    if token:
        test_token_verification(token)
    elif login_token:
        test_token_verification(login_token)
    
    print("\n" + "="*50)
    print("✨ Authentication tests completed!")

if __name__ == "__main__":
    main()
