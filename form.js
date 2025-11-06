import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASS = process.env.ADMIN_PASS;

app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).send("Semua form harus diisi.");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: ADMIN_EMAIL,
      pass: ADMIN_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: ADMIN_EMAIL,
      subject: `Pesan baru dari ${name}`,
      text: `Kamu mendapatkan pesan baru dari website Mengrita :\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    await transporter.sendMail({
      from: ADMIN_EMAIL,
      to: email,
      subject: "Terima kasih sudah menghubungi kami!",
      text: `Halo ${name},\n\nKami telah menerima pesanmu:\n"${message}"\n\nKami akan membalas secepatnya!\n\nSalam,\nDengan hormat, Wiryateja Pamungkas`,
    });

    res.status(200).send("Emails sent successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to send emails.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
