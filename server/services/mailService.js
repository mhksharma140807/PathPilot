const nodemailer = require("nodemailer");

const createTransporter = () => {
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.EMAIL_PORT || "587", 10);
  const secure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendOtpEmail = async (toEmail, otp) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️ SMTP Credentials missing in environment variables. Email notification skipped.");
      return { success: false, reason: "SMTP credentials not configured" };
    }

    const transporter = createTransporter();

    const fromAddress =
      process.env.EMAIL_FROM ||
      `"PathPilot Platform" <${process.env.EMAIL_USER}>`;

    const mailOptions = {
      from: fromAddress,
      to: toEmail,
      subject: "PathPilot — Password Reset Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }
            .container { max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 36px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { text-align: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 24px; }
            .logo-icon { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; background-color: #2563eb; color: #ffffff; font-size: 22px; font-weight: 800; border-radius: 14px; margin-bottom: 12px; }
            .brand-name { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; tracking: -0.5px; }
            .title { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; }
            .text { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
            .otp-box { background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
            .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #2563eb; font-family: 'Courier New', Courier, monospace; margin: 0; }
            .timer-note { font-size: 12px; font-weight: 600; color: #2563eb; margin-top: 8px; }
            .warning-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; font-size: 12px; color: #64748b; margin-top: 24px; line-height: 1.5; }
            .footer { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-icon">P</div>
              <h1 class="brand-name">PathPilot</h1>
            </div>
            <h2 class="title">Password Reset Code</h2>
            <p class="text">You requested to reset your password for your PathPilot account. Enter the 6-digit verification code below to proceed with resetting your password:</p>

            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <div class="timer-note">⏱️ Valid for 10 minutes</div>
            </div>

            <div class="warning-box">
              <strong>🔒 Security Note:</strong> If you did not request a password reset, please ignore this email. Your password will remain unchanged and your account remains secure.
            </div>

            <div class="footer">
              © ${new Date().getFullYear()} PathPilot Ecosystem. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset OTP email sent successfully. MessageId:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send OTP email via Nodemailer:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOtpEmail,
};
