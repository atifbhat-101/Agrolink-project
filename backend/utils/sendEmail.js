import nodemailer from 'nodemailer';

const SMTP_TIMEOUT_MS = 15000;

const sendEmail = async ({ email, subject, text, html }) => {
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
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"AgroLink Platform" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    text,
    html,
  });
};

export default sendEmail;
