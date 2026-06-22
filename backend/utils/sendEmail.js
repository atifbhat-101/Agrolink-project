import nodemailer from 'nodemailer';

const SMTP_TIMEOUT_MS = Number(process.env.SMTP_TIMEOUT_MS || 10000);
const BREVO_API_TIMEOUT_MS = Number(process.env.BREVO_API_TIMEOUT_MS || 10000);
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const getEnv = (key) => process.env[key]?.trim();

const hasSmtpConfig = () =>
  Boolean(getEnv('SMTP_HOST') && getEnv('SMTP_USER') && getEnv('SMTP_PASS'));

const hasBrevoConfig = () => Boolean(getEnv('BREVO_API_KEY'));

const parseSender = (value) => {
  const fallbackEmail = getEnv('SMTP_USER');
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
  const sender = parseSender(getEnv('SMTP_FROM'));
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
  const smtpHost = getEnv('SMTP_HOST');
  const smtpUser = getEnv('SMTP_USER');
  const smtpPass = getEnv('SMTP_PASS');
  const smtpPort = getEnv('SMTP_PORT') || '587';

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error('SMTP configuration is missing');
  }

  const port = parseInt(smtpPort, 10);

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port,
    secure: port === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    requireTLS: port === 587 || port === 2525,
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
  });

  await transporter.sendMail({
    from: getEnv('SMTP_FROM') || `"AgroLink Platform" <${smtpUser}>`,
    to: email,
    subject,
    text,
    html,
  });
};

const sendEmail = async ({ email, subject, text, html }) => {
  const requestedProvider = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  const primaryProvider = requestedProvider || (hasSmtpConfig() ? 'smtp' : 'brevo');
  const providers = primaryProvider === 'brevo' ? ['brevo', 'smtp'] : ['smtp', 'brevo'];
  const errors = [];

  for (const provider of providers) {
    if (provider === 'smtp' && !hasSmtpConfig()) continue;
    if (provider === 'brevo' && !hasBrevoConfig()) continue;

    try {
      console.info(`Sending email to ${email} via ${provider.toUpperCase()}`);

      if (provider === 'smtp') {
        await sendWithSmtp({ email, subject, text, html });
      } else {
        await sendWithBrevoApi({ email, subject, text, html });
      }

      return;
    } catch (error) {
      errors.push(`${provider.toUpperCase()}: ${error.message}`);
      console.warn(`Email provider ${provider.toUpperCase()} failed: ${error.message}`);
    }
  }

  throw new Error(errors.length ? errors.join('; ') : 'No email provider is configured');
};

export default sendEmail;
