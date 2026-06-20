import nodemailer from 'nodemailer';

const SMTP_TIMEOUT_MS = Number(process.env.SMTP_TIMEOUT_MS || 10000);
const BREVO_API_TIMEOUT_MS = Number(process.env.BREVO_API_TIMEOUT_MS || 10000);
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const parseSender = (value) => {
  const fallbackEmail = process.env.SMTP_USER;
  const fallbackName = 'AgroLink Platform';

  if (!value) {
    return { name: fallbackName, email: fallbackEmail };
  }

  const match = value.match(/^(.*)<(.+)>$/);
  if (!match) {
    return { name: fallbackName, email: value.replaceAll('"', '').trim() };
  }

  return {
    name: match[1].replaceAll('"', '').trim() || fallbackName,
    email: match[2].trim(),
  };
};

const sendWithBrevoApi = async ({ email, subject, text, html }) => {
  const sender = parseSender(process.env.SMTP_FROM);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BREVO_API_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(BREVO_API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender,
        to: [{ email }],
        subject,
        htmlContent: html,
        textContent: text,
      }),
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Brevo API timed out after ${BREVO_API_TIMEOUT_MS / 1000}s`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Brevo API failed (${response.status}): ${details}`);
  }
};

const sendWithSmtp = async ({ email, subject, text, html }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP configuration is missing');
  }

  const port = parseInt(process.env.SMTP_PORT || '587', 10);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
    requireTLS: port === 587 || port === 2525,
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"AgroLink Platform" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    text,
    html,
  });
};

const sendEmail = async ({ email, subject, text, html }) => {
  let brevoApiError = null;

  if (process.env.BREVO_API_KEY) {
    try {
      await sendWithBrevoApi({ email, subject, text, html });
      return;
    } catch (error) {
      brevoApiError = error;

      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw error;
      }

      console.warn(`Brevo API failed, falling back to SMTP: ${error.message}`);
    }
  }

  try {
    await sendWithSmtp({ email, subject, text, html });
  } catch (smtpError) {
    if (brevoApiError) {
      throw new Error(`Brevo API failed: ${brevoApiError.message}; SMTP fallback failed: ${smtpError.message}`);
    }

    throw smtpError;
  }
};

export default sendEmail;
