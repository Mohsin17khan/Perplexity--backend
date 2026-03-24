// import nodemailer from 'nodemailer'
import * as Brevo from '@getbrevo/brevo';
import dotenv from "dotenv";

dotenv.config();



const client = new Brevo.TransactionalEmailsApi();
client.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
);


export async function sendEmail({ to, subject, html }) {
    try {
        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = html;
        sendSmtpEmail.sender = {
            name: "Perplexity",
            email: process.env.BREVO_SENDER_EMAIL
        };
        sendSmtpEmail.to = [{ email: to }];
        const result = await client.sendTransacEmail(sendSmtpEmail);
        console.log("✅ Email sent:", result.messageId);
    } catch (err) {
        console.error("❌ Email failed:", err.message);
    }
}

// transporter is web server ko SMTP server s connect build kar ta hai communicate karta hai for SMTP server email 
// bhj sake

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.GOOGLE_USER,
//     pass: process.env.GOOGLE_APP_PASSWORD,
//   },
// });



// export async function sendEmail({ to, subject, html, text }){
//     const mailOptions = {
//       from: process.env.GOOGLE_USER, // sender address
//       to, // list of receivers
//       subject, // Subject line
//       html, // html body
//       text // plain text body
//     }


//     const details = await transporter.sendMail(mailOptions);
//     console.log("Email sent:", details)
// }