const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
app.use(cors());

// 👉 Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created uploads folder:", uploadsDir);
}

// 👉 Serve your index.html and related files
app.use(express.static(path.join(__dirname)));

// ⚡ Setup multer to store uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// Route to handle report submission with image
app.post("/send-report", upload.single("image"), async (req, res) => {
  const { founder, place, time, description } = req.body;
  const imageFile = req.file ? req.file.path : null;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kenpascualjacob@gmail.com", // replace with your Gmail
      pass: "jyus zwiw ucwn jhgc",       // your App Password
    },
  });

  let mailOptions = {
    from: "kenpascualjacob@gmail.com",
    to: [
      "macazo.386667@novaliches.sti.edu.ph",
      "melendez.387472@novaliches.sti.edu.ph",
      "acuna.385093@novaliches.sti.edu.ph"
    ],
    subject: "New Lost and Found Report",
    text: `
      Founder: ${founder}
      Place: ${place}
      Time: ${time}
      Description: ${description}
    `,
    attachments: imageFile ? [{ path: imageFile }] : []
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Report sent successfully" });
  } catch (error) {
    console.error("Mail error:", error);
    res.json({ success: false, message: error.toString() });
  }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
