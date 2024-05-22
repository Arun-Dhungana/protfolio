import express, { Application, Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import cors from "cors";
import prisma from "./utility/prismaClient";
import nodemailer from "nodemailer";
import { checkConnection } from "./utility/checkconnetion";
const app: Application = express();
config();
app.use(cors({ origin: "https://arundhungana-mu.vercel.app/" }));
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello");
});

app.post("/guestbook", async (req: Request, res: Response) => {
  try {
    const { name, message } = req.body;

    await prisma.message.create({ data: { name: name, message: message } });
    res.status(200).json({ success: "REgistered in guestbook" });
  } catch (err: any) {
    res
      .status(400)
      .json({ message: `Error posting guest message:${err.message}` });
  }
});
app.get("/guestbook", async (req: Request, res: Response) => {
  try {
    const data = await prisma.message.findMany();
    res.status(200).json(data);
  } catch (err: any) {
    res
      .status(400)
      .json({ message: `Error fetching guest message:${err.message}` });
  }
});

app.post("/mail", async (req: Request, res: Response) => {
  const {
    name,
    email,
    message,
    phonenumber,
  }: { name: string; email: string; message: string; phonenumber: number } =
    req.body;
  console.log(req.body);
  try {
    // Create a SMTP transporter
    const transporter = nodemailer.createTransport({
      // Configure your SMTP settings here
      // Example:
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.PASSWORD,
      },
    });

    // Send mail with defined transport object
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_ADDRESS,
      subject: "Through website contact link",
      text: `Name: ${name}\nMessage: ${message}\n Phonenumber:${phonenumber}`,
    });
    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "Through website contact link",
      text: "Thanks for trying to connect.I will contact you soon.",
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(400).json({ message: error.message });
});

const PORT: number = 4000;
const listener = app.listen(PORT, () => {
  const address = listener.address();
  if (address && typeof address !== "string") {
    console.log(
      `Server is starting at http://${address.address}:${address.port}`
    );
  } else {
    console.log(`Server is starting at http://localhost:${PORT}`);
  }
  console.log("Press ctrl+c to exit");
  checkConnection();
});
