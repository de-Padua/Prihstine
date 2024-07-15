const logger = require("../helpers/logger");
const _db = require("../db/db");
const bodyValidation = require("../helpers/bodyValidation");
const checkUserSession = require("../helpers/checkUserSession");
const getUserById = require("../helpers/getUserById");
const getNonSensitiveFields = require("../helpers/getNonSensitiveFileds");
const sendMail = require("../helpers/sendEmailNewAccountCreation");
const createUserAndEmailValidationTransaction = require(".././helpers/createUserAndEmailValidationTransaction");

const userController = {
  createNewUser: async (req, res) => {
    try {
      const jsonBody = req.body;

      const bodyValidationErrors = bodyValidation(jsonBody, [
        "email",
        "password",
        "phone",
        "firstName",
        "lastName",
      ]);

      if (bodyValidationErrors) {
        logger({ level: "info", error: bodyValidationErrors });
        return res.status(400).json(logger.error).end();
      }

      const emailExists = await _db.user.findUnique({
        where: { email: jsonBody.email },
      });

      if (emailExists) {
        logger({ level: "info", error: "email already exists" });
        return res.status(409).end();
      }

      try {
        const user = await createUserAndEmailValidationTransaction(jsonBody);
        const token = user.Session.sessionId;
 
        return res
          .status(201)
          .cookie("sid", token, {
            maxAge: 900000,
            httpOnly: true,
          })
          .end();
      } catch (error) {
        console.error("Failed to create user or send email:", error);
        return res.status(500).json({ error: error.message }).end();
      }
    } catch (error) {
      logger({ error: error });
      return res.status(502).json(error).end();
    }
  },

  getUser: async (req, res) => {
    try {
      const { userId } = req.params;

      logger({ data: "request to get user field" });

      const targetUser = await _db.user.findUnique({
        where: { id: userId },
        include: {
          posts: true,
        },
      });

      if (!targetUser) {
        logger({ data: "user not found" });
        res.status(404);
      }

      const sensitiveUserFields = ["email", "password"];
      const nonSensitiveUserData = getNonSensitiveFields(
        sensitiveUserFields,
        targetUser
      );

      logger({ data: "filtered user field to non-sensitive data" });
      res.json(nonSensitiveUserData).status(200);

      logger({ data: "responded succesfuly" });
    } catch (error) {
      res.json(error).status(500);
      logger({ data: error.name });
    }
  },
  getCurrentUserSession: async (req, res) => {
    const token = req.cookies["sid"];

    if (!token) {
      logger({ data: "invalid user token, session invalid" });
      return res.status(404).json({ data: "invalid data" });
    }

    const session = await checkUserSession(token);

    if (!session) {
      logger({ data: "invalid session" });
      return res
        .status(401)
        .json({ data: "invalid user session, login again" });
    }

    const userData = await getUserById(session.userId);

    const fieldsToAvoid = ["email", "password"];
    const validatedFields = getNonSensitiveFields(fieldsToAvoid, userData);

    if (!userData) {
      logger({ data: "user doesn't exist" });
      return res.status(401).json({ data: "user doesn't exist" });
    }

    res.status(206).json({ data: validatedFields });
  },
  verifyEmail: async (req, res) => {
    try {
      const { userId, tokenId } = req.params;

      const emailToValidate = await _db.userValidation.findFirst({
        where: {
          userId: userId,
        },
        include:{
          user:true
        }
      });

      if (!emailToValidate || emailToValidate.user.isVerified === true) {
        return res.status(404).json("no request peding");
      }
      if (tokenId !== emailToValidate.token) {
        await prisma.userValidation.delete({
          where: {
            token: tokenId,
          },
        });
        return res.status(400).json("token is expired");
      }

      const verifyUserEmail = await _db.user.update({
        where: {
          id: userId,
        },
        data: {
          isVerified: true,
        },
      });

      console.log(verifyUserEmail)
     await sendMail("notification/verifySucess", {
        emailToSend: [verifyUserEmail.email],       
        url: undefined,
         subject: "Account Verification Successful",
      });

      res.json(verifyUserEmail);
    } catch (err) {
      if (err) {
        res.json(err).status(500);
      }
    }
  },
};

module.exports = userController;
