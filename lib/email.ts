import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return transporter;
}

export async function sendOtpEmail(to: string, otp: string, name?: string) {
  const transport = getTransporter();
  
  await transport.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'House of Geeks - OTP Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f0427c;">House of Geeks</h2>
        <p>Hello ${name || 'there'},</p>
        <p>Your verification code is:</p>
        <h1 style="color: #f0427c; letter-spacing: 2px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 12px;">© House of Geeks IIIT Ranchi</p>
      </div>
    `,
  });
}
