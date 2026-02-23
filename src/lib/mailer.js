import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Your App Name" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
}
