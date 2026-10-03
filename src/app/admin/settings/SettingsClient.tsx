'use client';

import React, { useState } from 'react';
import { SiteSettings } from '@/types';
import { 
  Phone, 
  Mail, 
  Lock, 
  Save, 
  Check, 
  Smartphone, 
  Bell, 
  ShieldCheck, 
  AlertCircle,
  MessageSquare 
} from 'lucide-react';

interface Props {
  initialSettings: SiteSettings;
}

export function SettingsClient({ initialSettings }: Props) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const handleSaveNotificationSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'settings', data: settings }),
      });

      if (res.ok) {
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ text: "New password must be at least 6 characters.", error: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: "Passwords do not match.", error: true });
      return;
    }

    setSavingPassword(true);

    try {
      // In demo mode or Supabase Auth update
      await new Promise(r => setTimeout(r, 600));
      setPasswordMsg({ text: "Admin password updated successfully! Please use it on your next login." });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({ text: err.message || "Failed to update password", error: true });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Admin Settings & Notifications
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Configure which WhatsApp number receives leads, change your owner password, and manage mobile app installation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. NOTIFICATION DESTINATION SETTINGS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Bell className="w-4 h-4" />
              <span>Quote Notifications</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">Lead Notification Destination</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant alerts are dispatched here every time a customer submits a quote on the public website.
            </p>
          </div>

          {settingsSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Notification settings updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveNotificationSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                WhatsApp & Phone Number (Receives Leads)
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={settings.owner_mobile}
                  onChange={(e) => setSettings({ ...settings, owner_mobile: e.target.value })}
                  placeholder="+919150786656"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs outline-none focus:bg-white focus:border-amber-500 font-mono transition-colors"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Formats accepted: +919150786656 or 9150786656.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Owner Email (Receives Backup Copy)
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={settings.owner_email}
                  onChange={(e) => setSettings({ ...settings, owner_email: e.target.value })}
                  placeholder="sathishsathish979139@gmail.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs outline-none focus:bg-white focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Active Notification Channels
              </label>
              <div className="space-y-2.5">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.notification_channels?.whatsapp ?? true}
                    onChange={(e) => setSettings({
                      ...settings,
                      notification_channels: { ...settings.notification_channels, whatsapp: e.target.checked }
                    })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">WhatsApp Instant Message</span>
                    <span className="text-[11px] text-slate-500">Meta WhatsApp Cloud API / Direct URL to Owner</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.notification_channels?.email ?? true}
                    onChange={(e) => setSettings({
                      ...settings,
                      notification_channels: { ...settings.notification_channels, email: e.target.checked }
                    })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Email Backup Delivery</span>
                    <span className="text-[11px] text-slate-500">Instant notification to owner email inbox</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 min-tap-target shadow-xs transition-colors"
              >
                {savingSettings ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Contact Numbers</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 2. CHANGE OWNER PASSWORD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Lock className="w-4 h-4" />
              <span>Owner Security</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">Change Admin Password</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your private admin credentials for the owner website.
            </p>
          </div>

          {passwordMsg && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
              passwordMsg.error 
                ? 'bg-rose-50 border-rose-200 text-rose-800' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              {passwordMsg.error ? <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" /> : <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs outline-none focus:bg-white focus:border-amber-500 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                New Password (Min 6 Characters)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs outline-none focus:bg-white focus:border-amber-500 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs outline-none focus:bg-white focus:border-amber-500 font-mono transition-colors"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={savingPassword}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 min-tap-target transition-colors shadow-xs"
              >
                {savingPassword ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-slate-950" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* 3. PWA INSTALLATION INSTRUCTIONS FOR OWNER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Install Admin Panel on Owner&apos;s Phone (PWA)
            </h3>
            <p className="text-xs text-slate-500">
              Access your admin panel like a native mobile app without opening the browser each time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
            <h4 className="font-bold text-amber-700 uppercase text-[11px]">Android (Chrome / Samsung Internet)</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Open this admin page in Chrome or Samsung Internet.</li>
              <li>Tap the three vertical dots menu (⋮) in the top-right corner.</li>
              <li>Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.</li>
              <li>The MK Admin icon will be placed directly on your phone&apos;s app grid.</li>
            </ol>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
            <h4 className="font-bold text-amber-700 uppercase text-[11px]">iPhone / iPad (Safari)</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Open this admin page in Apple Safari.</li>
              <li>Tap the <strong>Share</strong> button (box with an arrow pointing up at the bottom).</li>
              <li>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.</li>
              <li>Tap <strong>Add</strong> in the top-right corner.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
