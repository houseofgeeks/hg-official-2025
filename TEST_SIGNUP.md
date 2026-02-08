# Signup Troubleshooting Guide

## What I Changed

1. **Removed all delays** - Redirects immediately after account creation
2. **Added detailed console logging** - Every step logs to browser console
3. **Simplified error handling** - Clearer error messages

## How to Test

### Step 1: Open Browser Console
1. Press `F12` to open Developer Tools
2. Click on "Console" tab
3. Keep it open while testing

### Step 2: Test Signup
1. Go to http://localhost:3000/auth/signup
2. Fill in details and send OTP
3. Enter OTP and click "Create Account"
4. **Watch the console** - you should see:
   - "Starting signup process..."
   - "Verifying OTP..."
   - "OTP verification response: {success: true}"
   - "Creating Firebase Auth user..."
   - "User created: [user-id]"
   - "Creating Firestore document..."
   - "Firestore document created successfully"
   - "Redirecting to donate page..."

### Step 3: Check for Errors

**If you see an error like:**
```
FirebaseError: Missing or insufficient permissions
```

**Then you need to update Firestore Rules:**

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: "houseofgeeks-cdaee"
3. Click "Firestore Database" → "Rules" tab
4. Replace with this:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to create their own document during signup
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
    }
    
    // Other collections
    match /donations/{donationId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

5. Click "Publish"

### Step 4: If Still Stuck

**Check Console for:**
- Where exactly does the log stop?
- Is there a red error message?
- Copy the EXACT error message and send it to me

### Step 5: Test Login (Should work now)
1. Go to http://localhost:3000/auth/login
2. Use the email/password you just created
3. Should redirect immediately after successful login

## Common Issues

### Issue 1: "Creating Account..." never changes
**Cause:** JavaScript error preventing execution
**Solution:** Check console for red error messages

### Issue 2: Permission denied error
**Cause:** Firestore rules not set correctly
**Solution:** Update Firestore rules as shown above

### Issue 3: Email already in use
**Cause:** Account already created
**Solution:** Use login instead, or use a different email

## What Should Happen

✅ Button shows "Creating Account..."
✅ Console logs show all steps completing
✅ **Page immediately redirects to /donate**
✅ You're logged in on donate page

The redirect is now **INSTANT** - no 2 second delay!
