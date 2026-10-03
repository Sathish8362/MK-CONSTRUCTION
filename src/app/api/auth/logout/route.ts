import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/admin';

export async function POST() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      await supabase.auth.signOut();
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set({ name: 'admin_session', value: '', path: '/', maxAge: 0 });
    res.cookies.set({ name: 'sb-access-token', value: '', path: '/', maxAge: 0 });
    res.cookies.set({ name: 'sb-refresh-token', value: '', path: '/', maxAge: 0 });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Logout failed" }, { status: 500 });
  }
}
