import { DonationModel } from "../models/core";
import { sendMail } from "./mailer";
import { connectMongo } from "./mongoose";
import { syncYouTubeAndNotify } from "./youtubeSync";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function runReminders() {
  try {
    await connectMongo();

    // Sync YouTube videos and notify
    await syncYouTubeAndNotify().catch(err => console.error("[Reminders] YouTube sync failed:", err));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find donations where payment is due today or was due and still unpaid
    // We only want to send the reminder ONCE on the deadline day (or if it's nearing)
    // For simplicity, let's find all unpaid/installment donations where the deadline is today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const donations = await DonationModel.find({
      paymentStatus: { $in: ["unpaid", "installment"] },
      paymentDeadline: {
        $gte: today,
        $lt: tomorrow,
      },
    }).exec();

    if (donations.length === 0) return;

    console.log(`[Reminders] Found ${donations.length} donations with deadlines today.`);

    const siteName = (process.env.SITE_NAME || "SYPE Ministry").trim();
    const adminEmail = (process.env.ADMIN_NOTIFY_EMAIL || "sypeministry@gmail.com").trim();

    for (const donation of donations) {
      const donorEmail = String(donation.donorEmail || "").trim();
      const donorName = String(donation.donorName || "Donor");
      const amount = Number(donation.amount || 0);
      const paid = Number(donation.amountPaid || 0);
      const remaining = Math.max(0, amount - paid);
      const currency = String(donation.currency || "RWF");

      if (!donorEmail) continue;

      const subject = `Payment Reminder: Donation Deadline Today - ${siteName}`;

      const donorHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #2c5282; color: white; padding: 24px; text-align: center;">
            <h2 style="margin: 0;">Payment Reminder</h2>
          </div>
          <div style="padding: 32px; background-color: white;">
            <p>Dear <strong>${escapeHtml(donorName)}</strong>,</p>
            <p>This is a friendly reminder that today is the deadline for your donation commitment to <strong>${escapeHtml(siteName)}</strong>.</p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Donation Summary:</strong></p>
              <p style="margin: 4px 0;">Total Promised: ${amount.toLocaleString()} ${currency}</p>
              <p style="margin: 4px 0;">Amount Received: ${paid.toLocaleString()} ${currency}</p>
              <p style="margin: 8px 0; font-size: 18px; color: #c53030;"><strong>Remaining Balance: ${remaining.toLocaleString()} ${currency}</strong></p>
            </div>

            <p>Your support is vital to our mission of equipping young professionals for evangelism. We pray that God continues to bless you as you partner with us in His work.</p>
            
            <p style="font-style: italic; color: #4a5568; margin-top: 24px;">
              "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7
            </p>

            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #718096; text-align: center;">
              Thank you for your generosity.<br>
              <strong>${escapeHtml(siteName)}</strong>
            </div>
          </div>
        </div>
      `;

      const adminHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="color: #c53030;">Donation Deadline Reached</h2>
          <p>Today is the payment deadline for a donation commitment:</p>
          <ul>
            <li><strong>Donor:</strong> ${escapeHtml(donorName)} (${escapeHtml(donorEmail)})</li>
            <li><strong>Total Committed:</strong> ${amount.toLocaleString()} ${currency}</li>
            <li><strong>Already Paid:</strong> ${paid.toLocaleString()} ${currency}</li>
            <li><strong>Remaining:</strong> ${remaining.toLocaleString()} ${currency}</li>
            <li><strong>Status:</strong> ${donation.paymentStatus}</li>
          </ul>
          <p>A reminder email has already been sent to the donor.</p>
        </div>
      `;

      // Send to donor
      await sendMail({
        to: donorEmail,
        subject,
        html: donorHtml,
        text: `Payment Reminder: Your donation of ${remaining.toLocaleString()} ${currency} is due today at ${siteName}.`,
      }).catch(err => console.error(`Failed to send reminder to ${donorEmail}:`, err));

      // Send to admin
      await sendMail({
        to: adminEmail,
        subject: `[ADMIN] Deadline Reached: ${donorName} - ${remaining.toLocaleString()} ${currency}`,
        html: adminHtml,
        text: `Deadline reached for ${donorName}. Remaining: ${remaining.toLocaleString()} ${currency}.`,
      }).catch(err => console.error(`Failed to send reminder to admin:`, err));

      console.log(`[Reminders] Sent reminder for donation ${donation._id} to ${donorEmail}`);
    }
  } catch (err) {
    console.error("[Reminders] Error in reminder scheduler:", err);
  }
}
