require("dotenv").config();
const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");
const bcrypt = require("bcryptjs");
const _db = require(".././db/db");

// Function to handle email template rendering
const emailHandler = async (action, data) => {
  let emailPath;
  if (action === "notification/confirmAccount") {
    emailPath = path.join(__dirname, "../views/notifications/confirmAccount.ejs");
  } else if (action === "notification/newPost") {
    emailPath = path.join(__dirname, "../views/notifications/postPublish.ejs");
  }
  else if (action === "notification/verifySucess") {
    emailPath = path.join(__dirname, "../views/notifications/verifySucess.ejs");
  }
  else if (action === "notification/recoveryPassword") {
    emailPath = path.join(__dirname, "../views/notifications/recoveryPassword.ejs");
  }

  const template = await ejs.renderFile(emailPath, {url:data.url});
  return template;
};

// Function to send email with error simulation
const sendMail = async (action, data) => {
  const email = await emailHandler(action, data);

  const transporter = nodemailer.createTransport({
    //etheral for dev
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_DEV,
      pass: process.env.EMAIL_PASSWORD_DEV,
    },
  });

  // Simulate an error for testing purposes
  if (process.env.SIMULATE_EMAIL_ERROR === "true") {
    throw new Error("Simulated email sending error");
  }

  const info = await transporter.sendMail({
    from: `"Atlantic TM" <${process.env.EMAIL_DEV}>`,
    to: data.emailToSend[0],
    subject: data.subject,
    html: email,
  });

  return info;
};

module.exports = sendMail;
