# MK CONSTRUCTION - FULL-STACK SYSTEM DEPLOYMENT GUIDE

This guide provides end-to-end instructions for deploying both the **Customer Website** (`yourcompany.com`) and **Owner Admin Website** (`admin.yourcompany.com` or `/admin`) sharing one unified Supabase PostgreSQL backend.

---

## 1. COMPANY & CONTACT PROFILE
- **Company Name:** MK CONSTRUCTION
- **Location:** Thirubuvanam, Tamil Nadu - 612103
- **Established:** 2000 (26+ Years of Industry Leadership)
- **Services:** New Homes, Commercial Buildings, Renovation, Interiors
- **Owner Mobile / WhatsApp (Receives Leads):** `+919150786656`
- **Owner Email:** `sathishsathish979139@gmail.com`
- **Address:** 38/4 , Kalaigar Nagar ,Thirubuvanam, 612103
- **Operating Hours:** Mon to Sat, 9 am to 6 pm

---

## 2. SUPABASE BACKEND SETUP (PostgreSQL, Auth, Storage, RLS)

### Step 2.1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create an account.
2. Click **New Project** and name it `mk-construction-backend`.
3. Choose the **South Asia (Mumbai) [ap-south-1]** region for fastest loading across Tamil Nadu and India.
4. Set a strong database password and click **Create new project**.

### Step 2.2: Run the SQL Schema Migration
1. In the Supabase Dashboard, click on **SQL Editor** from the left navigation.
2. Click **New query**.
3. Open the file [`supabase/schema.sql`](file:///c:/Final%20Construction/supabase/schema.sql) in this repository and paste the entire SQL contents into the query editor.
4. Click **Run**.
5. This automatically creates:
   - Tables: `projects`, `project_photos`, `services`, `testimonials`, `faqs`, `site_settings`, `enquiries`, `notification_logs`
   - Row Level Security (RLS) policies granting public read to published content, public insert to enquiries, and authenticated-only access to admin features.
   - Storage bucket: `project-media` with public read and authenticated upload.
   - Full initial seed data populated with MK Construction records in Thirubuvanam.

### Step 2.3: Create the Owner Admin User
1. Go to **Authentication** -> **Users** -> click **Add user** -> **Create user**.
2. **Email:** `sathishsathish979139@gmail.com`
3. **Password:** Set a strong private password (e.g. `mkadmin2000!`).
4. Toggle **Auto Confirm User** to `ON` and click **Create user**.

### Step 2.4: Copy API Credentials
1. Go to **Project Settings** -> **API**.
2. Copy:
   - **Project URL** (`https://xxxxxxxx.supabase.co`)
   - **Project API Keys** -> `anon` (public)
   - **Project API Keys** -> `service_role` (secret - keep private!)

---

## 3. WHATSAPP & NOTIFICATION SETUP

The application automatically delivers incoming customer quote requests directly to Sathish's WhatsApp number (`+919150786656`) and sends a backup email copy.

### Option A: Meta WhatsApp Business Cloud API (Recommended for India)
1. Go to [Meta for Developers](https://developers.facebook.com/).
2. Create an App -> Type: **Business** -> Add **WhatsApp** product.
3. Obtain your:
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_CLOUD_API_TOKEN` (Generate a permanent System User Token in Meta Business Manager).
4. Add these into your environment variables.

### Option B: Twilio WhatsApp / SMS (Alternative)
1. Sign up at [Twilio](https://www.twilio.com/).
2. In the console, retrieve your:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_FROM` (e.g. `whatsapp:+14155238886`)

### Option C: Email Backup with Resend
1. Sign up at [Resend](https://resend.com/).
2. Click **API Keys** -> **Create API Key**.
3. Set `RESEND_API_KEY` in environment variables.
4. Set `OWNER_EMAIL=sathishsathish979139@gmail.com`.

---

## 4. LOCAL DEVELOPMENT & PREVIEW

To run the application locally:

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Start the local Next.js development server
npm run dev
```

Open your browser:
- **Customer Website (Public):** [http://localhost:3000](http://localhost:3000)
- **Owner Website (Private Admin Panel):** [http://localhost:3000/admin](http://localhost:3000/admin)
  - Default Login:
    - **Email:** `sathishsathish979139@gmail.com`
    - **Password:** `mkadmin2000!`

*Note: The platform is built with an intelligent local fallback layer. Even if Supabase or WhatsApp API keys are not yet configured, all features (browsing projects, submitting quotes, adding projects, uploading photos, updating lead statuses, exporting CSV) work seamlessly!*

---

## 5. VERCEL DEPLOYMENT & DOMAIN ROUTING

### Step 5.1: Deploy to Vercel
1. Push this repository to GitHub or GitLab.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New** -> **Project**.
3. Import your repository.
4. Under **Environment Variables**, configure the keys from your `.env.example`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   OWNER_MOBILE=+919150786656
   OWNER_WHATSAPP_NUMBER=+919150786656
   OWNER_EMAIL=sathishsathish979139@gmail.com
   WHATSAPP_CLOUD_API_TOKEN=...
   WHATSAPP_PHONE_NUMBER_ID=...
   RESEND_API_KEY=...
   NEXT_PUBLIC_SITE_URL=https://yourcompany.com
   ```
5. Click **Deploy**.

### Step 5.2: Configure Dual Domains in Vercel
To fulfill the requirement of two websites:
1. Customer Website at `yourcompany.com` (and `www.yourcompany.com`)
2. Owner Website at `admin.yourcompany.com`

**Configuration:**
1. In the Vercel project dashboard, go to **Settings** -> **Domains**.
2. Add your primary domain: `yourcompany.com`.
3. Add your admin subdomain: `admin.yourcompany.com`.
4. Point DNS CNAME records at your registrar:
   - `yourcompany.com` -> `cname.vercel-dns.com`
   - `admin.yourcompany.com` -> `cname.vercel-dns.com`
5. The included [`src/middleware.ts`](file:///c:/Final%20Construction/src/middleware.ts) automatically detects when a request arrives from `admin.yourcompany.com` and rewrites it internally to the `/admin` application routes without modifying the browser URL!

---

## 6. PROGRESSIVE WEB APP (PWA) INSTALLATION ON OWNER'S PHONE

The owner can install the admin panel directly onto their smartphone home screen:

### On Android (Chrome or Samsung Internet):
1. Navigate to `https://admin.yourcompany.com` (or `https://yourcompany.com/admin`).
2. Log in with your owner credentials.
3. Tap the browser menu (⋮) -> **Install app** or **Add to Home screen**.
4. The **MK Admin** icon will be added to your home screen and operates as a full-screen, standalone application.

### On iPhone / iPad (Safari):
1. Open `https://admin.yourcompany.com` in Safari.
2. Tap the **Share** button (rectangle with arrow pointing up).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add**. You now have native-style tap access to all incoming quote leads and project photos.

---

## 7. SECURITY & DPDP ACT COMPLIANCE
- **India DPDP Act (Digital Personal Data Protection):** Customer phone numbers are strictly used solely for civil consultation purposes. Dedicated privacy policy is accessible at `/privacy-policy`.
- **Anti-Spam Protection:** Rate limiting (max 5 submissions per hour per IP, max 3 per phone number) + hidden honeypot field (`_honeypot`).
- **Resilient Notifications:** If external WhatsApp/SMS network calls fail or time out, customer quote requests are still safely stored in PostgreSQL with status "New" and logged in `notification_logs` for owner retry.
- **Client-Side Auto-Compression:** All uploaded camera and desktop photos are auto-compressed to modern WebP format via HTML5 Canvas before Supabase upload, saving bandwidth and phone data.
