import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    let email = '';
    let password = '';

    try {
      const body = await req.json();
      email = body.email || '';
      password = body.password || '';
    } catch {
      // Allow empty body for quick bypass
    }

    const defaultEmail = process.env.OWNER_EMAIL || 'sathishsathish979139@gmail.com';
    const demoPassword = process.env.ADMIN_DEMO_PASSWORD || 'mkadmin2000!';

    // 1. If Supabase is connected and valid credentials provided, authenticate via Supabase Auth
    if (isSupabaseConfigured() && email && password && password !== demoPassword) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data?.user) {
          const isHttps = req.nextUrl.protocol === 'https:' || req.headers.get('x-forwarded-proto') === 'https';
          const res = NextResponse.json({ success: true, user: data.user });
          res.cookies.set('admin_session', 'authenticated', {
            httpOnly: false, // accessible to both client and server for guaranteed sync
            secure: isHttps,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });
          return res;
        }
      } catch (sbErr) {
        console.warn('Supabase auth attempt failed, checking fallback credentials:', sbErr);
      }
    }

    // 2. Owner credentials matching (supports owner email, username, or demo password)
    const cleanedEmail = email.toLowerCase().trim();
    const isOwnerUser = 
      !email || // 1-click login without email provided
      cleanedEmail === defaultEmail.toLowerCase().trim() ||
      cleanedEmail === 'admin' ||
      cleanedEmail === 'owner' ||
      cleanedEmail === 'sathish' ||
      cleanedEmail.includes('sathish') ||
      cleanedEmail.includes('mkadmin');

    const isPasswordValid = 
      !password || // 1-click login without password provided
      password === demoPassword ||
      password === 'mkadmin2000!' ||
      password === 'admin' ||
      password === 'mkadmin';

    if (isOwnerUser && isPasswordValid) {
      const isHttps = req.nextUrl.protocol === 'https:' || req.headers.get('x-forwarded-proto') === 'https';
      const res = NextResponse.json({
        success: true,
        user: { id: 'owner-admin', email: defaultEmail, name: 'Sathish (Owner)' },
        note: 'Authenticated as Owner',
      });

      res.cookies.set('admin_session', 'authenticated', {
        httpOnly: false, // allow client-side and server-side verification
        secure: isHttps,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return res;
    }

    return NextResponse.json(
      { error: "Invalid email or password. Use owner email sathishsathish979139@gmail.com and password mkadmin2000!." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Login failed" }, { status: 500 });
  }
}
