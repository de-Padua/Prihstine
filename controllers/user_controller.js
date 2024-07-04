const headerValidation = require("../helpers/headerValitation");
const logger = require("../helpers/logger");
const _db = require("../db/db");
const bodyValidation = require("../helpers/bodyValidation");

const userController = {
  createNewUser: async (req, res) => {
    try {
      const validation = headerValidation(req.headers);
      if (!validation.success) {
        logger({ level: "info", error: validation.type });
        return res.status(parseInt(validation.status)).end();
      }
      const bodyValidationErrors = bodyValidation(req.body, [
        "email",
        "password",
        "posts",
        "phone",
        "firstName",
        "lastName"
      ]);

      if (bodyValidationErrors) {
        logger({ level: "info", error: bodyValidationErrors });
        return res.status(400).json(bodyValidationErrors).end();
      }

      const emailExists = await _db.user.findUnique({
        where: { email: req.body.email },
      });

      if (emailExists) {
        logger({ level: "info", error: "email already exists" });
        return res.status(409).end();
      }

      const newUser = await _db.user.create({
        data: {
          email: req.body.email,
          password: req.body.password,
          posts: req.body.posts,
          phone: req.body.phone,
          firstName: req.body.firstName,
          lastName:req.body.lastName
        },
      });

      logger({ level: "info", message: "New user created successfully" });
      return res.status(201).json(newUser).end();
      
    } catch (error) {
      logger({ error: error });
      return res.status(500).json({ error: "Internal server error" }).end();
    }
  },

  getUsers: async (req, res) => {
    const users = await _db.user.findMany();
    res.json(users)
  },
};

module.exports = userController;
