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
  return { email: v };
}

// ─── Key detection ────────────────────────────────────────────────────────────
// Brevo has two key types:
//   xkeysib-... → REST API key  (use api.brevo.com/v3/smtp/email)
//   xsmtpsib-... → SMTP relay key (use smtp-relay.brevo.com:587)
// We auto-detect which one is set and route accordingly.

function getBrevoApiKey(): string | null {
  const k = (process.env.BREVO_API_KEY || "").trim();
  if (!k) return null;
  // Only treat as REST API key if it starts with xkeysib-
  return k.startsWith("xkeysib-") ? k : null;
}

function getBrevoSmtpKey(): string | null {
  // Explicit BREVO_SMTP_KEY takes precedence
  const explicit = (process.env.BREVO_SMTP_KEY || "").trim();
  if (explicit) return explicit;
  // Fall back to BREVO_API_KEY if it's an SMTP relay key
  const k = (process.env.BREVO_API_KEY || "").trim();
  if (k && k.startsWith("xsmtpsib-")) return k;
  return null;
}

// ─── SMTP error helpers ───────────────────────────────────────────────────────
function summarizeSmtpError(err: any, cfg: MailerConfig) {
  const code = String(err?.code || "");
  const message = String(err?.message || "SMTP send failed");
  const responseCode = typeof err?.responseCode === "number" ? err.responseCode : undefined;

  const isNetworkIssue =
    code === "ETIMEDOUT" ||
    code === "ECONNREFUSED" ||
    code === "EHOSTUNREACH" ||
    code === "ENETUNREACH" ||
    code === "ECONNRESET";

  // Render free tier blocks outbound SMTP ports 25/465/587 (as of late 2025).
  const mayBeRenderBlocked =
    isNetworkIssue && (cfg.port === 25 || cfg.port === 465 || cfg.port === 587);

  const hints: string[] = [];
  if (mayBeRenderBlocked) {
    hints.push(
      `Your hosting provider may be blocking outbound SMTP on port ${cfg.port}. ` +
        `If you're deploying on Render Free, outbound SMTP ports 25/465/587 are blocked. ` +
        `Use a paid Render instance or switch to the Brevo REST API (xkeysib- key).`
    );
  }

  return {
    code: code || undefined,
    responseCode,
    message: `${message}${hints.length ? `\n\n${hints.join("\n")}` : ""}`,
  };
}

// ─── Gmail / custom SMTP ──────────────────────────────────────────────────────
function getMailerConfig(): MailerConfig | null {
  const host = (process.env.SMTP_HOST || "").trim();
  const port = Number(process.env.SMTP_PORT || "");
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASSWORD || process.env.SMTP_PASS || "").trim();
  const from = (process.env.SMTP_FROM || user || "").trim();

  if (!host || !port || !user || !pass || !from) return null;

  // Don't use smtp.gmail.com here if a Brevo SMTP key is available —
  // Render blocks port 465/587 to gmail.com on free tier anyway.
  const secure =
    String(process.env.SMTP_SECURE || "").trim().toLowerCase() === "true" || port === 465;

  return { host, port, secure, user, pass, from };
}

// ─── Transporter caches ───────────────────────────────────────────────────────
let cachedTransporter: nodemailer.Transporter | null = null;
let cachedKey = "";

function getTransporter(cfg: MailerConfig): nodemailer.Transporter {
  const key = `${cfg.host}:${cfg.port}:${cfg.secure}:${cfg.user}:${cfg.from}`;
  if (cachedTransporter && cachedKey === key) return cachedTransporter;
  cachedTransporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
  });
  cachedKey = key;
  return cachedTransporter;
}

let cachedBrevoSmtpTransporter: nodemailer.Transporter | null = null;
let cachedBrevoSmtpKey = "";

function getBrevoSmtpTransporter(smtpKey: string, from: string): nodemailer.Transporter {
  const cacheKey = `${smtpKey}:${from}`;
  if (cachedBrevoSmtpTransporter && cachedBrevoSmtpKey === cacheKey) {
    return cachedBrevoSmtpTransporter;
  }
  // Brevo SMTP relay credentials:
  //   host: smtp-relay.brevo.com
  //   port: 587 (STARTTLS)
  //   user: your Brevo login email
  //   pass: the xsmtpsib-... key
  const brevoUser = (process.env.BREVO_SMTP_USER || process.env.SMTP_USER || "").trim();
  cachedBrevoSmtpTransporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // STARTTLS
    auth: { user: brevoUser, pass: smtpKey },
    connectionTimeout: 20_000,
    greetingTimeout: 20_000,
    socketTimeout: 30_000,
  });
  cachedBrevoSmtpKey = cacheKey;
  return cachedBrevoSmtpTransporter;
}

// ─── Brevo REST API sender ────────────────────────────────────────────────────
async function sendViaBrevoApi(options: MailOptions): Promise<{ messageId: string }> {
  const apiKey = getBrevoApiKey();
  if (!apiKey) throw new Error("Brevo REST API key (xkeysib-...) is not configured.");

  const fromRaw = (process.env.SMTP_FROM || process.env.EMAIL_FROM || process.env.MAIL_FROM || "").trim();
  const sender = parseFrom(fromRaw);
  if (!sender?.email) {
    throw new Error(
      'Sender is not configured. Please set SMTP_FROM like: "SYPE Ministry <sypeministry@gmail.com>".'
    );
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
      sender: { email: sender.email, name: sender.name },
      to: [{ email: options.to }],
      replyTo: replyToSender
        ? { email: replyToSender.email, name: replyToSender.name }
        : undefined,
      subject: options.subject,
      htmlContent: options.html,
      textContent: options.text,
      headers: {
        ...(options.headers || {}),
        ...(options.importance === "high"
          ? { "X-Priority": "1", "X-MSMail-Priority": "High", Importance: "high" }
          : {}),
      },
    }),
  });

  const data: any = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = String(data?.message || data?.error || `Brevo API send failed (HTTP ${resp.status})`);
    const code = data?.code ? ` [${String(data.code)}]` : "";
    throw new Error(`${msg}${code}`.trim());
  }

  return { messageId: String(data?.messageId || data?.id || "") };
}

// ─── Brevo SMTP relay sender ──────────────────────────────────────────────────
async function sendViaBrevoSmtp(options: MailOptions): Promise<{ messageId: string }> {
  const smtpKey = getBrevoSmtpKey();
  if (!smtpKey) throw new Error("Brevo SMTP key (xsmtpsib-...) is not configured.");

  const fromRaw = (process.env.SMTP_FROM || process.env.EMAIL_FROM || "").trim();
  if (!fromRaw) {
    throw new Error(
      'Sender is not configured. Please set SMTP_FROM like: "SYPE Ministry <sypeministry@gmail.com>".'
    );
  }

  const transporter = getBrevoSmtpTransporter(smtpKey, fromRaw);

  try {
    const info = await transporter.sendMail({
      from: fromRaw,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      priority: options.importance === "high" ? "high" : "normal",
      headers: {
        ...(options.headers || {}),
        ...(options.importance === "high"
          ? { "X-Priority": "1", "X-MSMail-Priority": "High", Importance: "high" }
          : {}),
      },
    });
    return { messageId: String(info.messageId || "") };
  } catch (err: any) {
    // If Brevo SMTP fails due to auth, give a clear message
    const msg = String(err?.message || "Brevo SMTP relay send failed");
    const responseCode = err?.responseCode;
    if (responseCode === 535 || msg.includes("535") || msg.toLowerCase().includes("auth")) {
      throw new Error(
        `Brevo SMTP authentication failed. Make sure BREVO_SMTP_USER is your Brevo login email ` +
          `and BREVO_API_KEY is a valid xsmtpsib-... SMTP key. Error: ${msg}`
      );
    }
    throw new Error(msg);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────
type MailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  importance?: "high" | "normal" | "low";
  headers?: Record<string, string>;
};

/** Returns safe (no secrets) diagnostics about which transport will be used. */
export function getMailerDiagnostics(): Record<string, string> {
  const apiKey = getBrevoApiKey();
  const smtpKey = getBrevoSmtpKey();
  const cfg = getMailerConfig();
  const fromRaw = (process.env.SMTP_FROM || "").trim();
  const smtpUser = (process.env.BREVO_SMTP_USER || process.env.SMTP_USER || "").trim();

  if (apiKey) {
    return {
      transport: "Brevo REST API",
      from: fromRaw,
      keyPrefix: apiKey.slice(0, 12) + "...",
      status: "configured",
    };
  }
  if (smtpKey) {
    return {
      transport: "Brevo SMTP relay (smtp-relay.brevo.com:587)",
      from: fromRaw,
      user: smtpUser,
      keyPrefix: smtpKey.slice(0, 12) + "...",
      status: smtpUser ? "configured" : "missing BREVO_SMTP_USER",
    };
  }
  if (cfg) {
    return {
      transport: `Custom SMTP (${cfg.host}:${cfg.port})`,
      from: fromRaw,
      user: cfg.user,
      status: "configured",
    };
  }
  return {
    transport: "none",
    status: "NOT CONFIGURED — set BREVO_API_KEY or BREVO_SMTP_USER+BREVO_API_KEY",
  };
}

export async function sendMail(options: MailOptions): Promise<{ messageId: string }> {
  // Priority 1: Brevo REST API (xkeysib- key) — works on Render Free, no SMTP port issues
  if (getBrevoApiKey()) {
    return await sendViaBrevoApi(options);
  }

  // Priority 2: Brevo SMTP relay (xsmtpsib- key) — uses smtp-relay.brevo.com:587
  if (getBrevoSmtpKey()) {
    return await sendViaBrevoSmtp(options);
  }

  // Priority 3: Custom SMTP (Gmail or any other)
  const cfg = getMailerConfig();
  if (!cfg) {
    throw new Error(
      "No email transport configured. Set BREVO_API_KEY (xkeysib-...) for Brevo API, " +
        "or BREVO_API_KEY (xsmtpsib-...) for Brevo SMTP relay, " +
        "or SMTP_HOST/PORT/USER/PASSWORD for custom SMTP."
    );
  }

  const transporter = getTransporter(cfg);
  try {
    const info = await transporter.sendMail({
      from: cfg.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      priority: options.importance === "high" ? "high" : "normal",
      headers: {
        ...(options.headers || {}),
        ...(options.importance === "high"
          ? { "X-Priority": "1", "X-MSMail-Priority": "High", Importance: "high" }
          : {}),
      },
    });
    return { messageId: String(info.messageId || "") };
  } catch (err: any) {
    const summarized = summarizeSmtpError(err, cfg);
    const withCode = summarized.code ? ` [${summarized.code}]` : "";
    const withResp = summarized.responseCode ? ` (SMTP ${summarized.responseCode})` : "";
    throw new Error(`${summarized.message}${withCode}${withResp}`.trim());
  }
}
