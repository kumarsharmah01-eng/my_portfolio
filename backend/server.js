const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const env = require("dotenv").config();

const app = express();

/* ================================
   MIDDLEWARE
================================ */

app.use(cors());
app.use(express.json());

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
                    submitStats {
                        acSubmissionNum {
                            difficulty
                            count
                        }
                    }
                }
            }
        `;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query,

        variables: {
          username: process.env.LEETCODE_USERNAME,
        },
      }),
    });

    const data = await response.json();

    const stats = data?.data?.matchedUser?.submitStats?.acSubmissionNum;

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: "LeetCode user not found",
      });
    }

    const totalSolved = stats.find((item) => item.difficulty === "All");

    const easySolved = stats.find((item) => item.difficulty === "Easy");

    const mediumSolved = stats.find((item) => item.difficulty === "Medium");

    const hardSolved = stats.find((item) => item.difficulty === "Hard");

    res.json({
      success: true,

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
    });
  }
});

/* ================================
   CONTACT API
================================ */

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    /* VALIDATION */

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    /* EMAIL TRANSPORT */

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    /* SEND EMAIL */

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: process.env.EMAIL_USER,

      replyTo: email,

      subject: `Portfolio: ${subject}`,

      html: `
                <div style="
                    font-family: Arial;
                    padding: 20px;
                ">

                    <h2>
                        New Portfolio Message
                    </h2>

                    <p>
                        <strong>Name:</strong>
                        ${name}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${email}
                    </p>

                    <p>
                        <strong>Subject:</strong>
                        ${subject}
                    </p>

                    <hr>

                    <p>
                        ${message}
                    </p>

                </div>
            `,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Email Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

/* ================================
   SERVER
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
