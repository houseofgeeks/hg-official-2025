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

export async function sendPasswordResetLink(to: string, resetUrl: string, name?: string) {
  const transport = getTransporter();
  
  await transport.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'House of Geeks - Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h2 style="color: white; margin: 0;">House of Geeks</h2>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #333;">Hello ${name || 'there'},</p>
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            We received a request to reset your password for your House of Geeks account. 
            Click the button below to reset your password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; background: #f0427c; color: white; padding: 15px 40px; 
                      text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            Or copy and paste this link into your browser:
          </p>
          <p style="font-size: 12px; color: #999; word-break: break-all; background: white; padding: 10px; border-radius: 5px;">
            ${resetUrl}
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            <strong>This link will expire in 1 hour.</strong>
          </p>
          <p style="font-size: 14px; color: #666;">
            If you didn't request a password reset, please ignore this email or contact us if you have concerns.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            © House of Geeks IIIT Ranchi
          </p>
        </div>
      </div>
    `,
  });
}
