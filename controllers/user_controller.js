const headerValidation = require("../helpers/headerValitation");
const logger = require("../helpers/logger");

const userController = {
  createNewUser: async (req, res) => {
    try {
      
      const validation = headerValidation(req.headers);
      if (validation.sucess === false) {
        logger({ req, validation }, { failedAt: "user creation" });
        res.status(parseInt(validation.status)).end();
      } else {
        logger({ req, validation });
        res.status(parseInt(validation.status)).json({ data: "test" }).end();
      }
    } catch (error) {
      logger({}, { error: error });
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = userController;
