"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const prismaClient_1 = __importDefault(require("./utility/prismaClient"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const checkconnetion_1 = require("./utility/checkconnetion");
const app = (0, express_1.default)();
(0, dotenv_1.config)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Hello");
}));
app.post("/guestbook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, message } = req.body;
        yield prismaClient_1.default.message.create({ data: { name: name, message: message } });
        res.status(200).json({ success: "REgistered in guestbook" });
    }
    catch (err) {
        res
            .status(400)
            .json({ message: `Error posting guest message:${err.message}` });
    }
}));
app.get("/guestbook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prismaClient_1.default.message.findMany();
        res.status(200).json(data);
    }
    catch (err) {
        res
            .status(400)
            .json({ message: `Error fetching guest message:${err.message}` });
    }
}));
app.post("/mail", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, message, phonenumber, } = req.body;
    console.log(req.body);
    try {
        // Create a SMTP transporter
        const transporter = nodemailer_1.default.createTransport({
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
        yield transporter.sendMail({
            from: email,
            to: process.env.EMAIL_ADDRESS,
            subject: "Through website contact link",
            text: `Name: ${name}\nMessage: ${message}\n Phonenumber:${phonenumber}`,
        });
        yield transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: "Through website contact link",
            text: "Thanks for trying to connect.I will contact you soon.",
        });
        res.status(200).json({ message: "Email sent successfully!" });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Failed to send email." });
    }
}));
// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error);
    res.status(400).json({ message: error.message });
});
const PORT = 4000;
const listener = app.listen(PORT, () => {
    const address = listener.address();
    if (address && typeof address !== "string") {
        console.log(`Server is starting at http://${address.address}:${address.port}`);
    }
    else {
        console.log(`Server is starting at http://localhost:${PORT}`);
    }
    console.log("Press ctrl+c to exit");
    (0, checkconnetion_1.checkConnection)();
});
