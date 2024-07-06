const headerValidation = require("../helpers/headerValitation");
const logger = require("../helpers/logger");
const _db = require("../db/db");
const bodyValidation = require("../helpers/bodyValidation");
var bcrypt = require("bcryptjs");

const userController = {
  createNewUser: async (req, res) => {
    try {
      const jsonBody = req.body;

      const validation = headerValidation(req.headers);
      if (!validation.success) {
        logger({ level: "info", error: validation.type });
        return res.status(parseInt(validation.status)).end();
      }
      const bodyValidationErrors = bodyValidation(jsonBody, [
        "email",
        "password",
        "posts",
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
        return res.status(409).json(emailExists).end();
      }

      const hash = bcrypt.hashSync(jsonBody.password, 4);

      const newUser = await _db.user.create({
        data: {
          email: jsonBody.email,
          password: hash,
          posts: jsonBody.posts,
          phone: jsonBody.phone,
          firstName: jsonBody.firstName,
          lastName: jsonBody.lastName,
          Session: {
            create: {},
          },
        },
        include:{
          Session:true
        }
      });
      

      res.cookie("sid", newUser.Session.sessionId, {
        maxAge: 900000,
        httpOnly: true,
      });

      logger({ level: "info", message: "New user created successfully" });

      return res.status(201).json(logger.message).end();

    } catch (error) {
      logger({ error: error });


      return res.status(500).json({ error }).end();
    }
  },

  getUser: async (req, res) => {
    const users = await _db.user.findMany()
    res.json(users);
  },
};

module.exports = userController;
