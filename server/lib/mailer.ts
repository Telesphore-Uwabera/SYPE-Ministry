import nodemailer from "nodemailer";

type MailerConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

type Sender = { name?: string; email: string };

function parseFrom(value: string): Sender | null {
  const v = String(value || "").trim();
  if (!v) return null;
  const m = v.match(/^(.*)<([^>]+)>$/);
  if (m) {
    const name = m[1]?.trim().replace(/^"|"$/g, "");
    const email = m[2]?.trim();
    if (!email) return null;
    return { name: name || undefined, email };
  }
  // If it's just an email address
  return { email: v };
}

function getBrevoApiKey(): string | null {
  const k = (process.env.BREVO_API_KEY || "").trim();
  return k ? k : null;
}

function summarizeSmtpError(err: any, cfg: MailerConfig) {
  const code = String(err?.code || "");
  const message = String(err?.message || "SMTP send failed");
  const responseCode = typeof err?.responseCode === "number" ? err.responseCode : undefined;

  // Common on hosted environments where SMTP ports are blocked.
  const isNetworkIssue =
    code === "ETIMEDOUT" ||
    code === "ECONNREFUSED" ||
    code === "EHOSTUNREACH" ||
    code === "ENETUNREACH" ||
    code === "ECONNRESET";

  // Render free tier blocks outbound SMTP ports 25/465/587 (as of late 2025).
  const mayBeRenderBlocked = isNetworkIssue && (cfg.port === 25 || cfg.port === 465 || cfg.port === 587);

  const hints: string[] = [];
  if (mayBeRenderBlocked) {
    hints.push(
      `Your hosting provider may be blocking outbound SMTP on port ${cfg.port}. If you're deploying on Render Free, outbound SMTP ports 25/465/587 are blocked. Use a paid instance or an email provider that supports port 2525 (or use an email API over HTTPS).`
    );
  }

  return {
    code: code || undefined,
    responseCode,
    message: `${message}${hints.length ? `\n\n${hints.join("\n")}` : ""}`,
  };
}

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
    // Avoid hanging forever on blocked SMTP ports.
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
  });
  cachedKey = key;

  return cachedTransporter;
}

async function sendViaBrevo(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<{ messageId: string }> {
  const apiKey = getBrevoApiKey();
  if (!apiKey) throw new Error("BREVO_API_KEY is not configured.");

  const fromRaw = (process.env.SMTP_FROM || process.env.EMAIL_FROM || process.env.MAIL_FROM || "").trim();
  const sender = parseFrom(fromRaw);
  if (!sender?.email) {
    throw new Error('Sender is not configured. Please set SMTP_FROM like: "SYPE Ministry <sypeministry@gmail.com>".');
  }

  const replyToSender = options.replyTo ? parseFrom(options.replyTo) : null;

  const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: {
        email: sender.email,
        name: sender.name,
      },
      to: [
        {
          email: options.to,
        },
      ],
      replyTo: replyToSender ? { email: replyToSender.email, name: replyToSender.name } : undefined,
      subject: options.subject,
      htmlContent: options.html,
      textContent: options.text,
    }),
  });

  const data: any = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = String(data?.message || data?.error || `Brevo send failed (HTTP ${resp.status})`);
    const code = data?.code ? ` [${String(data.code)}]` : "";
    throw new Error(`${msg}${code}`.trim());
  }

  return { messageId: String(data?.messageId || data?.id || "") };
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<{ messageId: string }> {
  // If BREVO_API_KEY is present, prefer Brevo HTTPS API (works on Render Free).
  if (getBrevoApiKey()) {
    return await sendViaBrevo(options);
  }

  const transporter = getTransporter();
  const cfg = getMailerConfig();
  if (!cfg) throw new Error("SMTP is not configured.");

  let info: nodemailer.SentMessageInfo;
  try {
    info = await transporter.sendMail({
      from: cfg.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });
  } catch (err: any) {
    const summarized = summarizeSmtpError(err, cfg);
    // Preserve useful debugging context without leaking secrets.
    const withCode = summarized.code ? ` [${summarized.code}]` : "";
    const withResp = summarized.responseCode ? ` (SMTP ${summarized.responseCode})` : "";
    throw new Error(`${summarized.message}${withCode}${withResp}`.trim());
  }

  return { messageId: String(info.messageId || "") };
}

