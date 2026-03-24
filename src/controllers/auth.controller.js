import userModel from "../models/user.model.js";
import JWT from "jsonwebtoken";
import { sendEmail } from "../service/mail.service.js";

export async function register(req, res) {
  const { username, email, password } = req.body;

  const isUserExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserExist) {
    return res.status(400).json({
      message: "User already register",
      success: false,
      err: "user already exists",
    });
  }

  const user = await userModel.create({
    username,
    email,
    password,
  });

  const token = JWT.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "7d" },
  );


  try {
    await sendEmail({
      to: email,
      subject: "Welcome to perplexity",
      html: `
    <!DOCTYPE html>
    <html>
    <body style="background:#0C0C0C;font-family:'DM Sans',sans-serif;padding:40px 20px;margin:0;">
      <div style="max-width:480px;margin:0 auto;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:20px;padding:40px 32px;text-align:center;">
        
        <div style="font-size:48px; margin-bottom:20px;">✉️</div>
        
        <h1 style="font-size:22px;font-weight:800;color:#f4f4f5;margin-bottom:8px;">
          Verify your email
        </h1>
        
        <p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.7;margin-bottom:28px;">
          Hi <strong style="color:#f4f4f5;">${username}</strong>, thank you for registering at 
          <strong style="color:#14b8a6;">Perplexity</strong>.<br/>
          Click the button below to verify your email address.
        </p>

        <a href="https://perplexity-backend-1-rcvm.onrender.com/api/auth/verify-email?token=${token}"
          style="display:inline-block;padding:14px 32px;border-radius:12px;background:linear-gradient(135deg,#14b8a6,#3b82f6);color:#fff;font-weight:700;font-size:14px;text-decoration:none;letter-spacing:0.05em;">
          Verify Email →
        </a>

        <p style="font-size:12px;color:rgba(255,255,255,0.25);margin-top:28px;line-height:1.6;">
          If you did not create an account, please ignore this email.<br/>
          This link expires in 7 days.
        </p>

        <p style="font-size:12px;color:rgba(255,255,255,0.3);margin-top:16px;">
          — The Perplexity Team 
        </p>
        <small style="color:gray;font-size:10px;">@mohsin-khan</small>
      </div>
    </body>
    </html>
    `,
    });
    
  } catch (error) {
     console.log("Email failed:", error.message);
  }
  


  res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None"
});

  res.status(200).json({
    message: "User created successfully.",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function login(req, res) {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

   const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid Credentials",
      success: false,
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your email before loged in",
      success: false,
      err: "Email not verified..",
    });
  }

  const token = JWT.sign(
    { id: user._id, username: user.username },
    process.env.TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None"
});
  res.status(200).json({
    message: "User login successfully.",
    user: {
      id:user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function getme(req, res) {
  const userId = req.user.id;
  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "user not found",
      success: false,
    });
  }

  res.status(201).json({
    message: "User details fetch successfully",
    success: true,
    user,
  });
}

export async function verifyEmail(req, res) {
  const { token } = req.query;
  let decode;
   try {
  decode = JWT.verify(token, process.env.TOKEN_SECRET);
} catch (err) {
  return res.status(400).json({
    message: "Invalid token",
  });
}

  try {
    const user = await userModel.findOne({ username: decode.username });
    if (!user) {
      return res.status(400).json({
        message: "Invalid Token",
        success: false,
        err: "user not found",
      });
    }

    user.verified = true;
    await user.save();
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verified</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      min-height: 100vh;
      background: #0C0C0C;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'DM Sans', sans-serif;
      padding: 24px;
      background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    .blob1 {
      position: fixed; top: -80px; left: -80px;
      width: 350px; height: 350px; border-radius: 50%;
      background: rgba(20,184,166,0.12);
      filter: blur(80px); pointer-events: none;
    }
    .blob2 {
      position: fixed; bottom: -60px; right: -60px;
      width: 300px; height: 300px; border-radius: 50%;
      background: rgba(59,130,246,0.10);
      filter: blur(80px); pointer-events: none;
    }

    .card {
      position: relative;
      z-index: 1;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 24px;
      padding: 48px 40px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow: 0 0 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
      backdrop-filter: blur(20px);
      animation: fadeUp 0.5s ease both;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .icon-wrap {
      width: 72px; height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(20,184,166,0.2), rgba(59,130,246,0.2));
      border: 1px solid rgba(20,184,166,0.3);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px;
      font-size: 32px;
      animation: popIn 0.4s 0.2s ease both;
    }

    @keyframes popIn {
      from { transform: scale(0.6); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }

    .eyebrow {
      font-family: 'Syne', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #14b8a6;
      margin-bottom: 10px;
    }

    h1 {
      font-family: 'Syne', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: #f4f4f5;
      line-height: 1.2;
      margin-bottom: 12px;
    }

    p {
      font-size: 14px;
      color: rgba(255,255,255,0.4);
      line-height: 1.7;
      margin-bottom: 32px;
    }

    .btn {
      display: inline-block;
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      background: linear-gradient(135deg, #14b8a6, #3b82f6);
      color: #fff;
      font-family: 'Syne', sans-serif;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-decoration: none;
      box-shadow: 0 4px 20px rgba(20,184,166,0.25);
      transition: opacity 0.2s, transform 0.15s;
    }
    .btn:hover { opacity: 0.88; transform: translateY(-2px); }
    .btn:active { transform: translateY(0); }

    @media (max-width: 480px) {
      .card { padding: 36px 24px; }
      h1 { font-size: 22px; }
    }
  </style>
</head>
<body>
  <div class="blob1"></div>
  <div class="blob2"></div>

  <div class="card">
    <div class="icon-wrap">✅</div>
    <p class="eyebrow">Success</p>
    <h1>Email Verified!</h1>
    <p>Your email has been verified successfully.<br/>You can now sign in to your account.</p>
    <a href="https://perplexity-ai-frontend-cugn.vercel.app/login" class="btn">Go to Login →</a>
  </div>
</body>
</html>
`;

    res.send(html);
  } catch (err) {
    return res.status(400).json({
      message: "Invalid or expired token",
      success: false,
      err: err.message,
    });
  }
}



export async function logout(req, res) {
  res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "None"
});

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
}