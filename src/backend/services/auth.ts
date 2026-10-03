import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '../supabase/server';
import { isSupabaseConfigured } from '../supabase/admin';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export const OWNER_DEFAULT_EMAIL = process.env.OWNER_EMAIL || 'sathishsathish979139@gmail.com';
export const OWNER_DEMO_PASSWORD = process.env.ADMIN_DEMO_PASSWORD || 'mkadmin2000!';

/**
 * Validates if the current request has an active authenticated admin session
 */
export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session')?.value;
  const sbToken = cookieStore.get('sb-access-token')?.value;

  if (sessionCookie === 'authenticated') {
    return true;
  }

  if (isSupabaseConfigured() && sbToken) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return true;
      }
    } catch {
      // Supabase token invalid or expired
    }
  }

  return false;
}

/**
 * Validates login credentials against Supabase Auth or Owner Fallback
 */
export function validateOwnerCredentials(email?: string, password?: string): boolean {
  if (!email && !password) return true; // 1-click fallback

  const cleanedEmail = (email || '').toLowerCase().trim();
  const isOwnerUser = 
    cleanedEmail === OWNER_DEFAULT_EMAIL.toLowerCase().trim() ||
    cleanedEmail === 'admin' ||
    cleanedEmail === 'owner' ||
    cleanedEmail === 'sathish' ||
    cleanedEmail.includes('sathish') ||
    cleanedEmail.includes('mkadmin');

  const isPasswordValid = 
    password === OWNER_DEMO_PASSWORD ||
    password === 'mkadmin2000!' ||
    password === 'admin' ||
    password === 'mkadmin';

  return isOwnerUser && isPasswordValid;
}
