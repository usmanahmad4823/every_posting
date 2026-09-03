import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name = 'Anonymous Creator', email, subject = 'General Inquiry', message, type = 'contact' } = body as {
      name?: string;
      email: string;
      subject?: string;
      message: string;
      type?: 'contact' | 'support' | 'feedback';
    };

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!message || message.trim().length < 5) {
      return NextResponse.json({ error: 'Please enter a message of at least 5 characters.' }, { status: 400 });
    }

    const createdAt = new Date().toISOString();
    const submissionData = {
      name,
      email,
      subject,
      message,
      type,
      created_at: createdAt,
    };

    // 1. Save to Supabase Database (if configured)
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('contact_messages').insert([submissionData]);
        if (error) {
          console.warn('[Contact API] Supabase save warning (table contact_messages may need creation):', error.message);
        }
      } catch (dbErr) {
        console.warn('[Contact API] DB error:', dbErr);
      }
    }

    // 2. Dispatch Instant Webhook Notification (e.g. Discord, Telegram, or custom webhook)
    const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🚨 **New ${type.toUpperCase()} Submission on EveryPosting!**\n**From:** ${name} (${email})\n**Subject:** ${subject}\n**Message:**\n${message}`,
            embeds: [
              {
                title: `New ${type.toUpperCase()} Inquiry`,
                color: 0xff529a,
                fields: [
                  { name: 'Name', value: name, inline: true },
                  { name: 'Email', value: email, inline: true },
                  { name: 'Subject', value: subject, inline: false },
                  { name: 'Message', value: message, inline: false },
                ],
                timestamp: createdAt,
              },
            ],
          }),
        });
      } catch (webhookErr) {
        console.warn('[Contact API] Webhook alert warning:', webhookErr);
      }
    }

    // 3. Dispatch Resend Email API Notification (if RESEND_API_KEY is configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || 'usmanahmad4t12@gmail.com';
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'EveryPosting Alerts <onboarding@resend.dev>',
            to: [adminEmail],
            subject: `[EveryPosting ${type.toUpperCase()}] ${subject} from ${name}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; background-color: #f5f5f7; border-radius: 12px;">
                <h2 style="color: #ff529a;">New ${type.toUpperCase()} Message</h2>
                <p><strong>From:</strong> ${name} (&lt;a href="mailto:${email}"&gt;${email}&lt;/a&gt;)</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e4e4e7;">
                  ${message.replace(/\n/g, '<br/>')}
                </div>
                <p style="font-size: 11px; color: #71717a; margin-top: 20px;">Submitted at ${createdAt} via EveryPosting</p>
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        console.warn('[Contact API] Resend email warning:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received and our team will get back to you shortly.',
    });
  } catch (err: any) {
    console.error('API /api/contact error:', err);
    return NextResponse.json({ error: err.message || 'Failed to submit message.' }, { status: 500 });
  }
}
