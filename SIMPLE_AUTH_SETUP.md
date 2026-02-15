# Simple Account Creation Setup

To make account creation simple without email verification:

## Disable Email Confirmation in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings**
3. Under **Email Auth**, find "Enable email confirmations"
4. **Toggle OFF** the "Enable email confirmations" setting
5. Click **Save**

This allows users to:
- Sign up with just email, password, and name
- Login immediately after creating an account
- Start messaging without email verification

## Current Setup
- Users enter: Name, Email, Password
- After signup, they can login immediately
- Once logged in, they get full messaging access

No security checks, no email verification - just simple account creation and instant messaging!
