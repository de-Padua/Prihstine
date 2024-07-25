const logger = require("../helpers/logger");
const _db = require("../db/db");
const checkUserSession = require("../queries/user/checkUserSession");
const getUserById = require("../queries/user/getUserById");
const getNonSensitiveFields = require("../helpers/getNonSensitiveFileds");
const sendMail = require("../helpers/sendEmailNewAccountCreation");
const createUserAndEmailValidationTransaction = require(".././helpers/createUserAndEmailValidationTransaction");
const prisma = require("../db/db");
const { v4: uuidv4, validate: isUUID } = require("uuid");
const bcrypt = require("bcryptjs");
const updateUserSession = require("../queries/user/updateUserSession");

const userController = {
  createNewUser: async (req, res) => {
    try {
      const jsonBody = req.body;

      const emailExists = await _db.user.findUnique({
        where: { email: jsonBody.email },
      });

      if (emailExists) {
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
        return res.status(500).json({ error: error.message }).end();
      }
    } catch (error) {
      return res.status(502).json(error).end();
    }
  },
  getUser: async (req, res) => {
    try {
      const { userId } = req.params;

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

      res.status(200).json(nonSensitiveUserData);

      logger({ data: "responded succesfuly" });
    } catch (error) {
      res.status(500).json(error);
      logger({ data: error.name });
    }
  },

  getCurrentUser: async (req, res) => {

    const token = req.cookies["sid"];
    console.log(token)
    if (!token) {
      return res.status(404).json({ data: "invalid data" });
    }

    const session = await checkUserSession(token);

    if (session === undefined) {
      return res
        .status(401)
        .json({ data: "invalid user session, login again" });
    }

    const userData = await getUserById(session.userId);
    const fieldsToAvoid = ["email", "password"];
    const validatedFields = getNonSensitiveFields(fieldsToAvoid, userData);

    if (!userData) {
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
        include: {
          user: true,
        },
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

      await sendMail("notification/verifySucess", {
        emailToSend: [verifyUserEmail.email],
        url: undefined,
        subject: "Account Verification Successful",
      });

      res.status(202).end();
    } catch (err) {
      if (err) {
        res.json(err).status(500);
      }
    }
  },
  createOrUpdatePasswordRecoverySession: async (req, res) => {
    const { userId } = req.params;


    try {
      await prisma.$transaction(async (_db) => {
        //check if there's an active session online

        const existingSession = await _db.passwordChangeSession.findFirst({
          where: {
            userId: userId,
          },
        });

        let recoverySession;

        if (existingSession) {
          recoverySession = await _db.passwordChangeSession.update({
            where: {
              userId: userId,
            },
            data: {
              expiresAt,
            },
            include: {
              user: true,
            },
          });
        } else {
          recoverySession = await _db.passwordChangeSession.create({
            data: {
              userId: userId,
              expiresAt,
            },
            include: {
              user: true,
            },
          });
        }

        const verificationUrl = `${process.env.DEV_HOST}/user/${userId}/validate-session/${recoverySession.token}`;

        await sendMail("notification/recoveryPassword", {
          emailToSend: [recoverySession.user.email],
          url: verificationUrl,
          subject: "Password recovery",
        });
      });
      res.status(200).end();
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err, data: req.params });
    }
  },
  validateRecoveryPasswordSession: async (req, res) => {
    const { userId, token } = req.params;

    const now = new Date(Date.now());

    try {
      const isSessionActive = await _db.passwordChangeSession.findFirst({
        where: {
          token: token,
        },
        include: {
          user: true,
        },
      });

      if (!isSessionActive) {
        return res.status(401).end();
      }


      if (isSessionActive.user.id !== userId) {
        return res.status(401).end();
      }


      if (now > isSessionActive.expiresAt) {
        await _db.passwordChangeSession.delete({
          where: {
            token: token,
          },
        });
        return res.status(401);
      }

      return res.status(200).end();
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  changeUserPassword: async (req, res) => {
    const { userId, token } = req.params;

    const requestData = req.body;
    try {
      const data = await _db.passwordChangeSession.findFirst({
        where: {
          token: token,
        },
        include: {
          user: true,
        },
      });
      if (data === null) {
        return res.status(403).json(data);
      }

      const hash = bcrypt.hashSync(requestData.password, 4);

      await _db.user.update({
        where: {
          id: data.user.id,
        },
        data: {
          password: hash,
        },
      });

      await _db.passwordChangeSession.delete({
        where: {
          userId: userId,
        },
      });

      return res.status(200).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json(error).end();
    }
  },
  login: async (req, res) => {
    const loginCredentials = req.body;


    try {
      const user = await _db.user.findFirst({
        where: {
          email: loginCredentials.email,
        },
      });

      if (!user) {
        return res.status(403).json({ data: "Invalid credentials" });
      }
      const loginPassword = loginCredentials.password;

      const comparePasswords = await bcrypt.compare(
        loginPassword,
        user.password
      );

      if (!comparePasswords) {
        return res.status(404).json({ data: "credentials dont match" }).end();
      }

      const newSession = await updateUserSession(user.id)

      if (!newSession) {
        return res
          .status(500)
          .json({ data: "unable to create new session,try again" })
          .end();
      }
      res
        .status(201)
        .cookie("sid", newSession.sessionId, {
          maxAge: 3600000,
          httpOnly: true,
        })
        .end();
    } catch (err) {
      console.log(err);
      res.status(500).json({ data: "internal error" });
    }
  },
  deleteAccount: async (req, res) => {
    const body = req.body;
    const { userId } = req.params;



    try {
      const requestedUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (requestedUser === null) {
        return res.status(404).end();
      }

      const comparePasswords = await bcrypt.compare(
        body.password,
        requestedUser.password
      );

      if (!comparePasswords) {
        return res.status(402).json({ data: "invalid password" });
      }

      const transaction = prisma.$transaction(async (prisma) => {
        const deleteUserValidation = await prisma.userValidation.delete({
          where: {
            userId: requestedUser.id,
          },
        });

        const deleteSession = await prisma.session.delete({
          where: {
            userId: requestedUser.id,
          },
        });


        const deletePosts = await prisma.post.findMany({
          where: {
            userId: requestedUser.id,
          },
        });

        for (const post in deletePosts) {
          await prisma.picture.deleteMany({
            where: {
              postPostId: post.postId,
            },
          });
        }

        const deleteAccount = await prisma.user.delete({
          where: {
            id: requestedUser.id,
          },

        });

        return deleteAccount;
      });

      return res.status(200).json({ data: transaction });
    } catch (err) {
      return res.status(500).json({ data: err });
    }
  },
};

module.exports = userController;

