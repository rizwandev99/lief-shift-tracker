# 🚀 Vercel Deployment & Auth0 Setup Guide

This guide will help you properly configure your Lief Shift Tracker application on Vercel with Auth0 authentication.

## 📋 Prerequisites

Before deploying to Vercel, ensure you have:

- A GitHub repository with your code
- A Vercel account (free tier available)
- An Auth0 account (free tier available)
- A Supabase account with database set up

---

## 🔐 Auth0 Setup (Required for Login to Work)

### Step 1: Create an Auth0 Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **Applications**
3. Click **Create Application**
4. Choose **Regular Web Application**
5. Name it: `Lief Shift Tracker`
6. Click **Create**

### Step 2: Configure Auth0 Settings

1. Go to your application **Settings** tab
2. Under **Application URIs**, set:

   - **Allowed Callback URLs**:
     ```
     https://your-vercel-deployment.vercel.app/api/auth/callback
     http://localhost:3000/api/auth/callback
     ```
   - **Allowed Logout URLs**:
     ```
     https://your-vercel-deployment.vercel.app
     http://localhost:3000
     ```
   - **Allowed Web Origins**:
     ```
     https://your-vercel-deployment.vercel.app
     http://localhost:3000
     ```

3. Save the settings

### Step 3: Get Your Auth0 Credentials

From the **Settings** tab, copy:

- **Domain** (e.g., `your-tenant.auth0.com`)
- **Client ID**
- **Client Secret**

### Step 4: Generate AUTH0_SECRET

Run this command in your terminal:

```bash
openssl rand -hex 32
```

Or on Windows PowerShell:

```powershell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Copy the generated string - you'll need it for Vercel.

---

## 🌐 Vercel Environment Variables

### Step 1: Import Your Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Select your GitHub repository
4. Click **Import**

### Step 2: Configure Environment Variables

Before clicking **Deploy**, add these environment variables:

#### **Auth0 Variables** (Required - Login won't work without these)

```
AUTH0_SECRET=<your-generated-secret-from-step-4-above>
AUTH0_DOMAIN=<your-auth0-domain>
AUTH0_CLIENT_ID=<your-auth0-client-id>
AUTH0_CLIENT_SECRET=<your-auth0-client-secret>
APP_BASE_URL=https://your-vercel-deployment.vercel.app
```

#### **Database Variables** (Optional - for full functionality)

```
DATABASE_URL=<your-supabase-connection-string>
DIRECT_URL=<your-supabase-direct-connection-string>
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

### Step 3: Deploy

1. Click **Deploy**
2. Wait for the deployment to complete
3. You'll get a URL like: `https://lief-shift-tracker-xxx.vercel.app`

---

## ✅ Verifying Your Deployment

### Test Login Flow

1. Go to `https://your-vercel-deployment.vercel.app`
2. Click **Sign In** button
3. You should be redirected to Auth0 login page
4. Log in with your Auth0 account
5. You should be redirected back to your app

### Common Issues & Fixes

#### ❌ Issue: "404 - This page could not be found" on `/auth/login`

**Cause**: Auth0 environment variables not set in Vercel

**Fix**:

1. Go to Vercel Project Settings
2. Go to **Environment Variables**
3. Add all Auth0 variables from the table above
4. Redeploy by going to **Deployments** → Click latest → **Redeploy**

#### ❌ Issue: Redirect to wrong URL after login

**Cause**: `APP_BASE_URL` doesn't match your Vercel deployment URL

**Fix**:

1. Update `APP_BASE_URL` in Vercel to match your exact deployment URL
2. Update `Allowed Callback URLs` in Auth0 to match the Vercel URL
3. Redeploy

#### ❌ Issue: "Invalid client" error on login

**Cause**: `AUTH0_CLIENT_ID` or `AUTH0_CLIENT_SECRET` is incorrect

**Fix**:

1. Double-check credentials in Auth0 Dashboard
2. Update in Vercel Environment Variables
3. Redeploy

#### ❌ Issue: CORS errors in console

**Cause**: Auth0 domain not in `Allowed Web Origins`

**Fix**:

1. Go to Auth0 Dashboard → Your Application → Settings
2. Add your Vercel URL to `Allowed Web Origins`
3. Redeploy (or clear browser cache)

---

## 🔄 Redeploying After Changes

After making code changes:

1. Push to GitHub:

   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```

2. Vercel automatically redeploys on push

Or manually redeploy:

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Deployments**
4. Click the latest deployment
5. Click **Redeploy**

---

## 🧪 Testing the Full App Flow

### For Care Workers:

1. Log in with Auth0
2. Click "Clock In" on the worker dashboard
3. Allow location permission when prompted
4. Verify shift appears in history

### For Managers:

1. Log in with Auth0
2. Access `/manager` to see analytics dashboard
3. Verify you can see staff data and charts

---

## 📱 Testing on Mobile

Since geolocation is required for clock-in:

1. Use your Vercel URL on your phone
2. Make sure to allow location permission
3. Test clock-in from different locations

---

## 🚨 Security Checklist

- [ ] `AUTH0_SECRET` is generated with `openssl rand -hex 32` (not hardcoded)
- [ ] `AUTH0_CLIENT_SECRET` is kept secret (never commit to git)
- [ ] `DATABASE_URL` is kept secret (never commit to git)
- [ ] All Auth0 URLs are HTTPS
- [ ] No environment variables exposed in build logs
- [ ] `.env.local` is in `.gitignore`

---

## 📞 Support

If you're still having issues:

1. Check Vercel Logs:

   - Go to **Deployments** → Click deployment → **Logs**
   - Look for error messages

2. Check Auth0 Logs:

   - Go to Auth0 Dashboard → **Logs** (top-right)
   - See last login attempts and errors

3. Clear Cache:
   - Ctrl+Shift+Delete (Windows/Linux)
   - Cmd+Shift+Delete (Mac)
   - Clear browser cache and retry

---

**Your app should now be working with Auth0 on Vercel! 🎉**
