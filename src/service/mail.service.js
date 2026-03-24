import nodemailer from 'nodemailer'
import dotenv from "dotenv";
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// transporter is web server ko SMTP server s connect build kar ta hai communicate karta hai for SMTP server email 
// bhj sake
 const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type:'OAuth2',
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify()
.then(()=>{
    console.log("Email transporter is ready to send emails")
})
.catch((err)=>{
    console.log("Email transporter verification failder:",err)
})



export async function sendEmail({ to, subject, html }) {
    try {
        const data = await resend.emails.send({
            from: 'Perplexity <onboarding@resend.dev>', // ← use this until you verify a domain
            to,
            subject,
            html,
        });
        console.log("✅ Email sent:", data);
    } catch (err) {
        console.error("❌ Email failed:", err.message);
    }
}