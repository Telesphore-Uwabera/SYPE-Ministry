import nodemailer from "nodemailer";

type MailerConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

// ─── Default credentials fallback ─────────────────────────────────────────────
const DEFAULT_BREVO_API_KEY = "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";
const DEFAULT_BREVO_SMTP_USER = "b1b890001@smtp-brevo.com";
const DEFAULT_SMTP_HOST = "smtp.gmail.com";
const DEFAULT_SMTP_PORT = 465;
const DEFAULT_SMTP_USER = "sypeministry@gmail.com";
const DEFAULT_SMTP_PASS = "qyhvmfzehsdyfwot";
const DEFAULT_SMTP_FROM = "SYPE Ministry <noreply@sypeministry.org>";

// ─── Shared Teletech API env-var helper ───────────────────────────────────────
// On the shared teletech-api host all Ministry vars are prefixed MINISTRY_
// (e.g. MINISTRY_BREVO_API_KEY). For local dev / standalone deploy the plain
// name still works. This helper tries the prefixed name first.
function ministryEnv(...keys: string[]): string {
  for (const key of keys) {
    const prefixed = (process.env[`MINISTRY_${key}`] || "").trim();
    if (prefixed) return prefixed;
    const plain = (process.env[key] || "").trim();
    if (plain) return plain;
  }
  return "";
}

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
  const k = ministryEnv("BREVO_API_KEY") || DEFAULT_BREVO_API_KEY;
  if (!k) return null;
  // Only treat as REST API key if it starts with xkeysib-
  return k.startsWith("xkeysib-") ? k : null;
}

function getBrevoSmtpKey(): string | null {
  // Explicit BREVO_SMTP_KEY takes precedence
  const explicit = ministryEnv("BREVO_SMTP_KEY");
  if (explicit) return explicit;
  // Fall back to BREVO_API_KEY if it's an SMTP relay key
  const k = ministryEnv("BREVO_API_KEY");
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
  const host = ministryEnv("SMTP_HOST") || DEFAULT_SMTP_HOST;
  const port = Number(ministryEnv("SMTP_PORT") || DEFAULT_SMTP_PORT);
  const user = ministryEnv("SMTP_USER") || DEFAULT_SMTP_USER;
  const pass = ministryEnv("SMTP_PASSWORD", "SMTP_PASS") || DEFAULT_SMTP_PASS;
  const from = ministryEnv("SMTP_FROM") || DEFAULT_SMTP_FROM || user;

  if (!host || !port || !user || !pass || !from) return null;

  const secure =
    (ministryEnv("SMTP_SECURE") || "").toLowerCase() === "true" || port === 465;

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
  const brevoUser = ministryEnv("BREVO_SMTP_USER", "SMTP_USER") || DEFAULT_BREVO_SMTP_USER;
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

  const fromRaw = ministryEnv("SMTP_FROM", "EMAIL_FROM", "MAIL_FROM") || DEFAULT_SMTP_FROM;
  const sender = parseFrom(fromRaw);
  if (!sender?.email) {
    throw new Error(
      'Sender is not configured. Please set SMTP_FROM like: "SYPE Ministry <noreply@sypeministry.org>".'
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
      ...(options.attachments && options.attachments.length > 0
        ? {
            attachment: options.attachments.map((a) => ({
              name: a.filename,
              content: a.content.toString("base64"),
            })),
          }
        : {}),
      ...(options.importance === "high"
        ? {
            headers: {
              ...(options.headers || {}),
              "X-Priority": "1",
              "X-MSMail-Priority": "High",
              Importance: "high",
            },
          }
        : options.headers && Object.keys(options.headers).length > 0
          ? { headers: options.headers }
          : {}),
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

  const fromRaw = ministryEnv("SMTP_FROM", "EMAIL_FROM") || DEFAULT_SMTP_FROM;
  if (!fromRaw) {
    throw new Error(
      'Sender is not configured. Please set SMTP_FROM like: "SYPE Ministry <noreply@sypeministry.org>".'
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
      ...(options.attachments && options.attachments.length > 0
        ? { attachments: options.attachments.map((a) => ({ filename: a.filename, content: a.content, contentType: a.contentType })) }
        : {}),
    });
    return { messageId: String(info.messageId || "") };
  } catch (err: any) {
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
export type MailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

type MailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  importance?: "high" | "normal" | "low";
  headers?: Record<string, string>;
  attachments?: MailAttachment[];
};

/** Returns safe (no secrets) diagnostics about which transport will be used. */
export function getMailerDiagnostics(): Record<string, string> {
  const apiKey = getBrevoApiKey();
  const smtpKey = getBrevoSmtpKey();
  const cfg = getMailerConfig();
  const fromRaw = ministryEnv("SMTP_FROM") || DEFAULT_SMTP_FROM;
  const smtpUser = ministryEnv("BREVO_SMTP_USER", "SMTP_USER") || DEFAULT_BREVO_SMTP_USER;

  if (apiKey) {
    return {
      transport: "Brevo REST API (with Gmail SMTP fallback)",
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
  let brevoErr: Error | null = null;

  // Priority 1: Brevo REST API (xkeysib- key) — works over HTTPS port 443
  const brevoKey = getBrevoApiKey();
  if (brevoKey) {
    try {
      return await sendViaBrevoApi(options);
    } catch (err: any) {
      brevoErr = err;
      console.warn(`[mailer] Brevo REST API send failed: ${err?.message || err}. Trying SMTP fallback...`);
    }
  }

  // Priority 2: Brevo SMTP relay (xsmtpsib- key)
  const brevoSmtpKey = getBrevoSmtpKey();
  if (brevoSmtpKey) {
    try {
      return await sendViaBrevoSmtp(options);
    } catch (err: any) {
      console.warn(`[mailer] Brevo SMTP relay failed: ${err?.message || err}. Trying Gmail SMTP fallback...`);
    }
  }

  // Priority 3: Gmail / Custom SMTP fallback
  const cfg = getMailerConfig();
  if (cfg) {
    try {
      const transporter = getTransporter(cfg);
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
        ...(options.attachments && options.attachments.length > 0
          ? { attachments: options.attachments.map((a) => ({ filename: a.filename, content: a.content, contentType: a.contentType })) }
          : {}),
      });
      return { messageId: String(info.messageId || "") };
    } catch (smtpErr: any) {
      const summarized = summarizeSmtpError(smtpErr, cfg);
      const withCode = summarized.code ? ` [${summarized.code}]` : "";
      const withResp = summarized.responseCode ? ` (SMTP ${summarized.responseCode})` : "";
      const combinedMsg = brevoErr
        ? `Brevo API failed (${brevoErr.message}) and SMTP fallback failed (${summarized.message}${withCode}${withResp})`
        : `${summarized.message}${withCode}${withResp}`;
      throw new Error(combinedMsg.trim());
    }
  }

  if (brevoErr) throw brevoErr;

  throw new Error(
    "No email transport configured. Set BREVO_API_KEY (xkeysib-...) for Brevo API, " +
      "or BREVO_API_KEY (xsmtpsib-...) for Brevo SMTP relay, " +
      "or SMTP_HOST/PORT/USER/PASSWORD for custom SMTP."
  );
}
