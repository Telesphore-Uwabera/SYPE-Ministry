import nodemailer from "nodemailer";

type MailerConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

function getMailerConfig(): MailerConfig | null {
  const host = (process.env.SMTP_HOST || "").trim();
  const port = Number(process.env.SMTP_PORT || "");
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASSWORD || process.env.SMTP_PASS || "").trim();
  const from = (process.env.SMTP_FROM || user || "").trim();

  if (!host || !port || !user || !pass || !from) return null;

  const secure = String(process.env.SMTP_SECURE || "").trim().toLowerCase() === "true" || port === 465;

  return { host, port, secure, user, pass, from };
}

let cachedTransporter: nodemailer.Transporter | null = null;
let cachedKey = "";

function getTransporter(): nodemailer.Transporter {
  const cfg = getMailerConfig();
  if (!cfg) {
    throw new Error(
      "SMTP is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM."
    );
  }

  const key = `${cfg.host}:${cfg.port}:${cfg.secure}:${cfg.user}:${cfg.from}`;
  if (cachedTransporter && cachedKey === key) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
  });
  cachedKey = key;

  return cachedTransporter;
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<{ messageId: string }> {
  const transporter = getTransporter();
  const cfg = getMailerConfig();
  if (!cfg) throw new Error("SMTP is not configured.");

  const info = await transporter.sendMail({
    from: cfg.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
  });

  return { messageId: String(info.messageId || "") };
}

