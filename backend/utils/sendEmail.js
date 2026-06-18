import nodemailer from 'nodemailer';

const sendEmail = async ({ email, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"AgroLink Platform" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    text,
    html,
  });
};

export default sendEmail;
