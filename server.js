const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // optional, mainly for local testing

const app = express();
app.use(cors());

// ⚡ setup multer to handle file uploads
const upload = multer({ dest: "uploads/" });

// 👉 API route
app.post("/send-report", upload.single("image"), async (req, res) => {
  const { founder, place, time, description } = req.body;
  const imageFile = req.file ? req.file.path : null;

  // Gmail credentials from environment variables
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  let mailOptions = {
    from: process.env.GMAIL_USER,
    to: [
      "macazo.386667@novaliches.sti.edu.ph", 
      "acuna.385093@novaliches.sti.edu.ph", 
      "melendez.387472@novaliches.sti.edu.ph", 
      "sandiego.393481@novaliches.sti.edu.ph", 
      "kamimura.405642@novaliches.sti.edu.ph", 
      "ramos.386137@novaliches.sti.edu.ph", 
      "ramilo.385674@novaliches.sti.edu.ph", 
      "go.387381@novaliches.sti.edu.ph", 
      "nanquilada.388026@novaliches.sti.edu.ph", 
      "paner.391196@novaliches.sti.edu.ph", 
      "villegas.386021@novaliches.sti.edu.ph",
      "kenpascualjacob@gmail.com"
    ],
    subject: "New Lost and Found Report",
    text: `
      Founder: ${founder}
      Place: ${place}
      Time: ${time}
      Description: ${description}
    `,
    attachments: imageFile ? [{ path: imageFile }] : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Report sent successfully" });
  } catch (error) {
    console.error("Mail error:", error);
    res.json({ success: false, message: error.toString() });
  }
});

// 👉 static files
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
