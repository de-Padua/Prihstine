const app = require("express");
const route = app.Router();
const UserController = require("../controllers/user_controller");
const newUserRequestBodyValidation = require("../middlewares/newUserRequestBodyValidation");
const changePasswordValidation = require("../middlewares/changePasswordValidation");
const deleteAccountValidation = require("../middlewares/deleteAccountValidation");

route.post("/user", newUserRequestBodyValidation, UserController.createNewUser);

route.post(
  "/user/:userId/change-password/:token", changePasswordValidation,
  UserController.changeUserPassword
);

route.get("/user/:userId", UserController.getUser);

route.get(
  "/user/:userId/validate-session/:token",
  UserController.validateRecoveryPasswordSession
);

route.get("/user/session/validate", UserController.getCurrentUser);

route.post("/user/:userId/verify-email/:tokenId", UserController.verifyEmail);

route.get(
  "/user/:userId/recovery-password",
  UserController.createOrUpdatePasswordRecoverySession
);
route.post("/user/auth/login", UserController.login);

route.delete("/user/:userId/delete", deleteAccountValidation
  , UserController.deleteAccount);

module.exports = route;
