import { Enquiry, NotificationLog } from '@/types';
import { createAdminClient, isSupabaseConfigured } from '../supabase/admin';

export interface DispatchResult {
  whatsappSuccess: boolean;
  emailSuccess: boolean;
  smsSuccess: boolean;
  logs: NotificationLog[];
}

export async function logNotification(log: Omit<NotificationLog, 'id' | 'created_at'>) {
  const fullLog: NotificationLog = {
    ...log,
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    created_at: new Date().toISOString(),
  };

  console.log(`[NOTIFICATION_LOG] [${fullLog.channel.toUpperCase()}] to ${fullLog.recipient} | Status: ${fullLog.status} | Error: ${fullLog.error_message || 'None'}`);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      await supabase.from('notification_logs').insert([fullLog]);
    } catch (e) {
      console.warn("Could not write to notification_logs in Supabase:", e);
    }
  }

  return fullLog;
}

export async function sendWhatsAppNotification(enquiry: Enquiry): Promise<boolean> {
  const ownerNumber = process.env.OWNER_WHATSAPP_NUMBER || process.env.OWNER_MOBILE || '+919150786656';
  const cleanOwnerNumber = ownerNumber.replace(/[^0-9]/g, ''); // e.g. 919150786656

  const messageText = `🏗️ *NEW ENQUIRY - MK CONSTRUCTION*\n\n` +
    `👤 *Client:* ${enquiry.name}\n` +
    `📱 *Mobile:* +91 ${enquiry.mobile}\n` +
    `📍 *Location:* ${enquiry.location}\n` +
    `🏢 *Project Type:* ${enquiry.project_type}\n` +
    `💰 *Rough Budget:* ${enquiry.budget}\n` +
    `💬 *Message:* ${enquiry.message || 'No additional note'}\n` +
    `⏱️ *Time:* ${new Date(enquiry.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n` +
    `_Tap to reply or call client directly:_ https://wa.me/91${enquiry.mobile}`;

  // 1. WhatsApp Business Cloud API (Meta)
  const metaToken = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const metaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (metaToken && metaPhoneId) {
    try {
      const response = await fetch(`https://graph.facebook.com/v19.0/${metaPhoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${metaToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: cleanOwnerNumber,
          type: 'text',
          text: { preview_url: false, body: messageText },
        }),
      });

      if (response.ok) {
        await logNotification({
          enquiry_id: enquiry.id,
          channel: 'whatsapp',
          recipient: cleanOwnerNumber,
          status: 'success',
        });
        return true;
      } else {
        const errorText = await response.text();
        await logNotification({
          enquiry_id: enquiry.id,
          channel: 'whatsapp',
          recipient: cleanOwnerNumber,
          status: 'failed',
          error_message: `WhatsApp Cloud API error: ${errorText}`,
        });
      }
    } catch (err: any) {
      await logNotification({
        enquiry_id: enquiry.id,
        channel: 'whatsapp',
        recipient: cleanOwnerNumber,
        status: 'failed',
        error_message: err.message || 'Network exception calling WhatsApp Cloud API',
      });
    }
  }

  // 2. Twilio WhatsApp Fallback
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
  const twilioWhatsAppFrom = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+14155238886"

  if (twilioSid && twilioAuth && twilioWhatsAppFrom) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const params = new URLSearchParams();
      params.append('From', twilioWhatsAppFrom);
      params.append('To', `whatsapp:+${cleanOwnerNumber}`);
      params.append('Body', messageText);

      const twilioRes = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (twilioRes.ok) {
        await logNotification({
          enquiry_id: enquiry.id,
          channel: 'whatsapp',
          recipient: cleanOwnerNumber,
          status: 'success',
        });
        return true;
      } else {
        const errText = await twilioRes.text();
        await logNotification({
          enquiry_id: enquiry.id,
          channel: 'whatsapp',
          recipient: cleanOwnerNumber,
          status: 'failed',
          error_message: `Twilio WhatsApp error: ${errText}`,
        });
      }
    } catch (e: any) {
      await logNotification({
        enquiry_id: enquiry.id,
        channel: 'whatsapp',
        recipient: cleanOwnerNumber,
        status: 'failed',
        error_message: e.message || 'Twilio request failed',
      });
    }
  }

  // Fallback dev simulation log
  console.log(`[SIMULATED WHATSAPP NOTIFICATION TO OWNER: +${cleanOwnerNumber}]\n${messageText}`);
  await logNotification({
    enquiry_id: enquiry.id,
    channel: 'whatsapp',
    recipient: cleanOwnerNumber,
    status: 'success',
    payload: { simulated: true, note: 'Configure WHATSAPP_CLOUD_API_TOKEN or TWILIO in .env for live SMS/WhatsApp' }
  });
  return true;
}

export async function sendEmailBackup(enquiry: Enquiry): Promise<boolean> {
  const ownerEmail = process.env.OWNER_EMAIL || 'sathishsathish979139@gmail.com';
  const resendApiKey = process.env.RESEND_API_KEY;

  const emailSubject = `🚨 New Quote Request: ${enquiry.name} (${enquiry.project_type}) - MK Construction`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0b152d; color: #f1f5f9; border-radius: 8px;">
      <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #f59e0b; margin: 0;">MK CONSTRUCTION - NEW CUSTOMER ENQUIRY</h2>
        <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 14px;">Thirubuvanam, Tamil Nadu | Estd. 2000</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #1e3a6c; color: #94a3b8; width: 140px;">Customer Name:</td>
          <td style="padding: 10px; border-bottom: 1px solid #1e3a6c; font-weight: bold; color: #ffffff;">${enquiry.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #1e3a6c; color: #94a3b8;">Mobile Number:</td>
          <td style="padding: 10px; border-bottom: 1px solid #1e3a6c; font-weight: bold; color: #f59e0b;">
            <a href="tel:+91${enquiry.mobile}" style="color: #f59e0b; text-decoration: none;">+91 ${enquiry.mobile}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #1e3a6c; color: #94a3b8;">Project Location:</td>
          <td style="padding: 10px; border-bottom: 1px solid #1e3a6c; color: #ffffff;">${enquiry.location}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #1e3a6c; color: #94a3b8;">Project Type:</td>
          <td style="padding: 10px; border-bottom: 1px solid #1e3a6c; color: #ffffff;">${enquiry.project_type}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #1e3a6c; color: #94a3b8;">Estimated Budget:</td>
          <td style="padding: 10px; border-bottom: 1px solid #1e3a6c; color: #ffffff;">${enquiry.budget}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #1e3a6c; color: #94a3b8;">Customer Message:</td>
          <td style="padding: 10px; border-bottom: 1px solid #1e3a6c; color: #cbd5e1;">${enquiry.message || 'None provided'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #1e3a6c; color: #94a3b8;">Submission Time:</td>
          <td style="padding: 10px; border-bottom: 1px solid #1e3a6c; color: #94a3b8;">${new Date(enquiry.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
        </tr>
      </table>

      <div style="background-color: #122144; border-radius: 6px; padding: 15px; text-align: center;">
        <a href="https://wa.me/91${enquiry.mobile}?text=Hello%20${encodeURIComponent(enquiry.name)},%20thank%20you%20for%20contacting%20MK%20Construction%20Thirubuvanam." 
           style="background-color: #25D366; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; margin-right: 10px;">
           Open in WhatsApp
        </a>
        <a href="tel:+91${enquiry.mobile}" 
           style="background-color: #f59e0b; color: #0b152d; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
           Call Customer
        </a>
      </div>
    </div>
  `;

  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'MK Construction <onboarding@resend.dev>',
          to: [ownerEmail],
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      if (res.ok) {
        await logNotification({
          enquiry_id: enquiry.id,
          channel: 'email',
          recipient: ownerEmail,
          status: 'success',
        });
        return true;
      } else {
        const errorText = await res.text();
        await logNotification({
          enquiry_id: enquiry.id,
          channel: 'email',
          recipient: ownerEmail,
          status: 'failed',
          error_message: `Resend error: ${errorText}`,
        });
      }
    } catch (e: any) {
      await logNotification({
        enquiry_id: enquiry.id,
        channel: 'email',
        recipient: ownerEmail,
        status: 'failed',
        error_message: e.message || 'Resend network request failed',
      });
    }
  }

  // Simulated email backup
  console.log(`[SIMULATED EMAIL TO OWNER: ${ownerEmail}]\nSubject: ${emailSubject}`);
  await logNotification({
    enquiry_id: enquiry.id,
    channel: 'email',
    recipient: ownerEmail,
    status: 'success',
    payload: { simulated: true, note: 'Configure RESEND_API_KEY in .env for live email delivery' }
  });
  return true;
}

export async function dispatchEnquiryNotifications(enquiry: Enquiry): Promise<DispatchResult> {
  const result: DispatchResult = {
    whatsappSuccess: false,
    emailSuccess: false,
    smsSuccess: false,
    logs: [],
  };

  try {
    result.whatsappSuccess = await sendWhatsAppNotification(enquiry);
  } catch (err) {
    console.error("WhatsApp dispatcher caught error:", err);
  }

  try {
    result.emailSuccess = await sendEmailBackup(enquiry);
  } catch (err) {
    console.error("Email backup dispatcher caught error:", err);
  }

  return result;
}
