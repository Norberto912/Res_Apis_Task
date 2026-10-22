"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = () => {
    return {
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    };
};
exports.transporter = nodemailer_1.default.createTransport(config());
/* transport.sendMail({
  from: "Private Person <from@example.com>",
  to: "A Test User <to@example.com>",
  subject: "Hello from Mailtrap",
  text: "This is a test e-mail message."
}, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log("Message sent: %s", info.messageId);
}); */ 
//# sourceMappingURL=nodemailer.js.map