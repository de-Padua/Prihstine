require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

const emailHandler = async (
  action,
  mainTitle,
  emailTitle,
  url,
  secundaryTitle,
  buttonText
) => {
  if (action === "newUser") {
    const emailPath = path.join(__dirname, "../views/newAccountVerify.ejs");
    const template = await ejs.renderFile(emailPath, {
      mainTitle: mainTitle,
      url: url,
      emailTitle:emailTitle,
      buttonText:"Verify my account",
      secundaryTitle: secundaryTitle,
      buttonText: buttonText,
    });
    return template;
  }
  else if (action === "email verified") {
    const emailPath = path.join(__dirname, "../views/newAccountVerifed.ejs");
    const template = await ejs.renderFile(emailPath, {
      mainTitle: mainTitle,
      url: url,
      emailTitle:emailTitle,
      buttonText:"Go to site",
      secundaryTitle: secundaryTitle,
      buttonText: buttonText,
    });
    return template;
  }
};

const sendMail = async (action, data) => {
  const email = await emailHandler(action,
    data.mainTitle,
    data.emailTitle,
    data.url,
    data.secundaryTitle,
    data.buttonText
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.email",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Trace team " ${process.env.EMAIL}`, // sender address
      to: data.emailToSend[0], // list of receivers
      subject: data.emailTitle, // Subject line
      text: data.mainTitle, // plain text body
      html: email, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

  main().catch(console.error);
};

module.exports = sendMail;
