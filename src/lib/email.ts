import nodemailer from "nodemailer";

export async function sendTwoFactorCodeEmail(to: string, code: string) {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPassword) {
    console.log("Email settings are missing. 2FA code:", code);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPassword.replace(/\s/g, ""),
      },
    });

    await transporter.sendMail({
      from: `"Book Management System" <${emailUser}>`,
      to,
      subject: "Your 2FA Login Code",
      text: `Your Book Management System login code is: ${code}. This code expires in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Book Management System</h2>
          <p>Your login verification code is:</p>
          <h1 style="letter-spacing: 4px;">${code}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    console.log("2FA email sent successfully to:", to);
  } catch (error) {
    console.log("Email sending failed. Use terminal 2FA code instead.");
    console.log(error);
  }
}