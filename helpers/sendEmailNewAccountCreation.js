require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const ejs  = require("ejs")


const emailHandler = async (mainMessage,postUrl,secundaryTitle,buttonText) => {
  const emailPath = path.join(__dirname, "../views/email.ejs");
  const template = await ejs.renderFile(emailPath,{mainMessage:mainMessage,postUrl:postUrl,secundaryTitle:secundaryTitle,buttonText:buttonText})
  return template
}


const sendMail = async (data) => {

   
  const email = await emailHandler(data.mainTitle,data.url,data.secundaryTitle,data.buttonText)

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports

    auth: {
      user: process.env.EMAIL_DEV,
      pass: process.env.EMAIL_PASSWORD_DEV,
    },
  });
 
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Trace team " ${process.env.EMAIL}`, // sender address
      to: data.emailToSend[0], // list of receivers
      subject: data.emailTitle, // Subject line
      text:data.mainTitle , // plain text body
      html: email, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

  main().catch(console.error);
};

module.exports = sendMail;
