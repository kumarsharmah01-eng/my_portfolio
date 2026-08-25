const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

/* ================================
   MIDDLEWARE
================================ */

app.use(cors());
app.use(express.json());

/* ================================
   GMAIL TRANSPORTER
================================ */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Port 465 ke liye true
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
/* ================================
   CHECK GMAIL CONNECTION
================================ */

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Gmail connection failed:");
    console.error(error);
  } else {
    console.log("✅ Gmail server is ready");
  }
});

/* ================================
   HOME ROUTE
================================ */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Harsh Portfolio API is running 🚀",
  });
});

/* ================================
   LEETCODE STATS API
================================ */

app.get("/api/leetcode/stats", async (req, res) => {
  try {
    const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    const response = await fetch("https://leetcode.com/graphql/", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
      },

      body: JSON.stringify({
        query,

        variables: {
          username: process.env.LEETCODE_USERNAME,
        },
      }),
    });
    console.log("LEETCODE USERNAME:", process.env.LEETCODE_USERNAME);
    const data = await response.json();

    console.log("LeetCode response:", JSON.stringify(data, null, 2));

    /* Check GraphQL errors */

    if (data.errors) {
      console.error("LeetCode GraphQL Error:", data.errors);

      return res.status(500).json({
        success: false,
        message: "LeetCode API error",
        errors: data.errors,
      });
    }

    const user = data?.data?.matchedUser;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "LeetCode user not found",
      });
    }

    const stats = user.submitStats?.acSubmissionNum || [];

    const totalSolved = stats.find((item) => item.difficulty === "All");

    const easySolved = stats.find((item) => item.difficulty === "Easy");

    const mediumSolved = stats.find((item) => item.difficulty === "Medium");

    const hardSolved = stats.find((item) => item.difficulty === "Hard");

    res.json({
      success: true,
      username: user.username,
      solved: totalSolved?.count || 0,
      easy: easySolved?.count || 0,
      medium: mediumSolved?.count || 0,
      hard: hardSolved?.count || 0,
    });
  } catch (error) {
    console.error("LeetCode Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch LeetCode stats",
      error: error.message,
    });
  }
});

/* ================================
   CONTACT API
================================ */

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log("📩 Contact request received");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Please fill all fields.",
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,

      subject: `Portfolio Contact from ${name}`,

      text: `
Name: ${name}

Email: ${email}

Message:
${message}
      `,

      replyTo: email,
    };

    console.log("📤 Sending email...");

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);

    res.status(200).json({
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("❌ Email error:");
    console.error(error);

    res.status(500).json({
      message: "Failed to send message.",
      error: error.message,
    });
  }
});

/* ================================
   SERVER
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
