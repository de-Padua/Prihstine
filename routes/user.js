const app = require("express");
const route = app.Router();
const UserController = require("../controllers/user_controller");

//create user
route.post("/user", UserController.createNewUser);
route.post(
  "/user/:userId/change-password/:token",
  UserController.changeUserPassword
);
//get user based on id
route.get("/user/:userId", UserController.getUser);

//validates recovery password session
route.get(
  "/user/:userId/validate-session/:token",
  UserController.validateRecoveryPasswordSession
);

//validates user session based on cookie
route.get("/user/session/validate", UserController.getCurrentUserSession);

//validates user email
route.get("/user/:userId/verify-email/:tokenId", UserController.verifyEmail);

//create session for password recovery
route.get(
  "/user/:userId/recovery-password",
  UserController.createOrUpdatePasswordRecoverySession
);

//change user password


module.exports = route;
