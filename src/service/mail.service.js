import nodemailer from 'nodemailer'
import dotenv from "dotenv";

dotenv.config();


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


export async function sendEmail({ to, subject, html, text }){
    const mailOptions = {
      from: process.env.GOOGLE_USER, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
      text // plain text body
    }


    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent:", details)
}