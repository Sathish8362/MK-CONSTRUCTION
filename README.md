# 🏗️ MK CONSTRUCTION - Full-Stack Dual Website Platform

[![Framework: Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React: 19](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase-emerald?logo=supabase)](https://supabase.com/)
[![Deployment: Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
[![Theme: Light](https://img.shields.io/badge/Theme-Pure%20Light-amber)](https://github.com/)

A modern, high-performance web platform built for **MK Construction** in **Thirubuvanam, Tamil Nadu** (Estd. 2000). The system provides **two websites that share a single backend and database**:

1. **🌐 CUSTOMER WEBSITE (Public):**
   - High-conversion responsive design featuring completed projects gallery, before/after renovation slider, service offerings, client testimonials, interactive quote calculator, and DPDP-compliant lead capture.
2. **🔐 OWNER WEBSITE (Private Admin Panel):**
   - Dedicated dashboard for Sathish (Owner) to review and manage incoming customer quote enquiries, update lead statuses, add private notes, export CSV records, add projects, and upload photos with client-side WebP compression.

---

## 🏢 Company Profile

- **Company Name:** MK CONSTRUCTION
- **Headquarters:** 38/4, Kalaigar Nagar, Thirubuvanam, Tamil Nadu - 612103
- **Established:** 2000 (26+ Years of Industry Leadership)
- **Services:** New Turnkey Homes, Commercial Buildings, Renovation, Interior Design
- **Owner Mobile / WhatsApp (Receives Leads):** `+919150786656`
- **Owner Email:** `sathishsathish979139@gmail.com`
- **Working Hours:** Monday to Saturday, 9:00 AM – 6:00 PM

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Pure Light Theme.
- **Backend:** Next.js Route Handlers (`/api/*`), Modular Service Layer (`src/backend/`), Supabase PostgreSQL with Row Level Security (RLS) & Storage, Persistent File-backed fallback store (`.data/store.json`).
- **Separation:** Strict directory organization partitioning `src/frontend/` (UI components & client clients) and `src/backend/` (data-store, services, notifications, image compression, auth).
- **Hosting:** Vercel (Automatic subdomain routing for `admin.yourcompany.com` and `yourcompany.com`).

---

## 📁 Repository Structure

```
├── src/
│   ├── backend/                # 🔙 Server services, persistence, auth, notifications
│   │   ├── db/                 # Database access (data-store.ts, mock-data.ts)
│   │   ├── services/           # Notifications (WhatsApp/SMS/Email), image compression, auth
│   │   └── supabase/           # Server and service-role Supabase clients
│   ├── frontend/               # 🎨 Client components & UI
│   │   ├── components/customer # 18 public customer components (Hero, Navbar, QuoteForm, etc.)
│   │   ├── components/admin    # Owner admin components (AdminLayout, etc.)
│   │   └── supabase/           # Browser Supabase client
│   ├── app/                    # ⚡ Next.js App Router (Pages, Admin routes, API routes)
│   ├── types/                  # 📐 Shared TypeScript contracts
│   ├── lib/                    # 🔗 Compatibility re-export bridge
│   └── components/             # 🔗 Compatibility re-export bridge
├── supabase/
│   └── schema.sql              # Complete PostgreSQL schema, seed data & RLS policies
├── .env.example                # Environment variable template
├── vercel.json                 # Vercel deployment configuration
├── ARCHITECTURE.md             # Detailed architecture breakdown
└── DEPLOYMENT.md               # Step-by-step production setup guide
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/mk-construction.git
cd mk-construction
npm install
```

### 2. Configure Environment
Copy the example configuration:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

Visit:
- **Public Customer Site:** [http://localhost:3000](http://localhost:3000)
- **Owner Admin Panel:** [http://localhost:3000/admin?bypass=true](http://localhost:3000/admin?bypass=true)

---

## ☁️ Deploy to GitHub & Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "feat: MK Construction full-stack dual website platform"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/mk-construction.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new) and log in.
2. Select your `mk-construction` repository and click **Import**.
3. Under **Environment Variables**, add the values from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OWNER_MOBILE` (`+919150786656`)
   - `OWNER_WHATSAPP_NUMBER` (`+919150786656`)
   - `OWNER_EMAIL` (`sathishsathish979139@gmail.com`)
   - `NEXT_PUBLIC_SITE_URL` (`https://yourcompany.com`)
4. Click **Deploy**.

### Step 3: Configure Dual Domains
In the Vercel Dashboard under **Settings -> Domains**:
- Add `yourcompany.com` (Public Customer Website)
- Add `admin.yourcompany.com` (Owner Admin Website)

The included [middleware.ts](file:///c:/Final%20Construction/src/middleware.ts) will automatically route visitors on `admin.yourcompany.com` straight into the Owner Admin Portal!

---

## 🗄️ Supabase Database Setup

1. Create a project at [supabase.com](https://supabase.com) (Mumbai `ap-south-1` recommended).
2. Open **SQL Editor** in Supabase and paste the contents of [`supabase/schema.sql`](file:///c:/Final%20Construction/supabase/schema.sql).
3. Click **Run**. All tables, storage buckets, RLS policies, and sample data will be created automatically.

---

## 📄 Documentation Links
- [Detailed Deployment Guide](file:///c:/Final%20Construction/DEPLOYMENT.md)
- [Architecture & Modular Separation](file:///c:/Final%20Construction/ARCHITECTURE.md)
