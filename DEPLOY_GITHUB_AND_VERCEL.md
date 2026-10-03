# 🚀 STEP-BY-STEP DEPLOYMENT GUIDE: GITHUB & VERCEL

Follow these simple steps to push your project to **GitHub** and deploy live on **Vercel**.

---

## 📋 PRE-FLIGHT CHECKLIST (ALREADY COMPLETED FOR YOU)

- ✅ **Production Build Verified:** Tested with `npm run build` — compiled 100% successfully in 5.8s with 0 errors.
- ✅ **Clean Directory Separation:** All files organized into `src/frontend/` and `src/backend/` documented in `ARCHITECTURE.md`.
- ✅ **Pure Light Theme:** Enforced across all customer pages, admin dashboard, and form controls.
- ✅ **Git & Vercel Files:** `.gitignore`, `.env.example`, and `vercel.json` are fully configured.
- ✅ **Database Schema:** `supabase/schema.sql` is ready for 1-click execution in Supabase.

---

## PART 1: PUSH TO GITHUB

### Step 1.1: Install Git (If not already on your computer)
If typing `git` in PowerShell shows "not recognized":
1. Download and run the official installer: [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. (Or open PowerShell as **Administrator** and run: `winget install --id Git.Git -e --source winget`)
3. Restart your terminal or IDE.

### Step 1.2: Create a New Repository on GitHub
1. Open your browser and log into [https://github.com](https://github.com).
2. Click the **+** icon in the top-right corner and select **New repository**.
3. **Repository name:** `mk-construction`
4. Choose **Public** or **Private** (Private is recommended to protect your owner details).
5. **Do NOT** check "Add a README file" or "Add .gitignore" (we already created custom ones).
6. Click **Create repository**.
7. Copy your repository URL (e.g., `https://github.com/your-username/mk-construction.git`).

### Step 1.3: Initialize and Push Your Code
Open PowerShell in `C:\Final Construction` and run:

```powershell
# 1. Initialize Git repository
git init

# 2. Stage all organized project files
git add .

# 3. Create the initial commit
git commit -m "feat: MK Construction full-stack dual website platform"

# 4. Set the default branch to main
git branch -M main

# 5. Connect to your GitHub repository (replace with your actual GitHub URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/mk-construction.git

# 6. Push all files to GitHub
git push -u origin main
```

---

## PART 2: DEPLOY ON VERCEL

### Step 2.1: Import Your GitHub Repository
1. Visit [https://vercel.com](https://vercel.com) and log in (choose **Continue with GitHub**).
2. On your Vercel dashboard, click **Add New...** -> **Project**.
3. Find your **`mk-construction`** repository in the list and click **Import**.

### Step 2.2: Configure Environment Variables in Vercel
In the project configuration screen, expand **Environment Variables** and add the following keys:

| Variable Name | Recommended Value / Source |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://yourcompany.com` (or your Vercel URL) |
| `OWNER_MOBILE` | `+919150786656` |
| `OWNER_WHATSAPP_NUMBER` | `+919150786656` |
| `OWNER_EMAIL` | `sathishsathish979139@gmail.com` |
| `ADMIN_DEMO_PASSWORD` | `mkadmin2000!` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` (From Supabase Dashboard) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` (From Supabase -> Project Settings -> API) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` (From Supabase -> Project Settings -> API) |

> *Tip: Even if you haven't set up Supabase yet, the website will deploy immediately using the built-in fallback store!*

### Step 2.3: Click Deploy
Click **Deploy**.
Vercel will automatically build the Next.js app in ~1 minute and assign you a live production URL (e.g., `https://mk-construction.vercel.app`).

---

## PART 3: CONNECT YOUR CUSTOM DOMAINS (DUAL WEBSITES)

The user requirement specifies two sites sharing one backend:
1. **Public Customer Site:** `yourcompany.com`
2. **Owner Admin Site:** `admin.yourcompany.com`

### How to configure in Vercel:
1. In your Vercel Project Dashboard, navigate to **Settings** -> **Domains**.
2. Add your primary domain:
   - `yourcompany.com` -> Serves the customer-facing website.
3. Add your owner subdomain:
   - `admin.yourcompany.com` -> The included [`src/middleware.ts`](file:///c:/Final%20Construction/src/middleware.ts) detects the `admin.` subdomain and routes it directly to the Owner Admin Portal!
4. Configure the DNS CNAME records at your domain registrar (GoDaddy, Namecheap, Hostinger, Cloudflare):
   - Type: `CNAME` | Name: `@` or `www` | Value: `cname.vercel-dns.com`
   - Type: `CNAME` | Name: `admin` | Value: `cname.vercel-dns.com`

---

## PART 4: SUPABASE DATABASE MIGRATION

1. Log in to [https://supabase.com](https://supabase.com) and click **New Project** (select region **Mumbai [ap-south-1]**).
2. Click **SQL Editor** in the left sidebar -> click **New query**.
3. Copy all code from [`supabase/schema.sql`](file:///c:/Final%20Construction/supabase/schema.sql) and paste it into the editor.
4. Click **Run**.
5. All database tables, storage buckets, RLS security rules, and Thirubuvanam demo projects are populated instantly!
