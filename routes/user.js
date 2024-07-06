const app = require("express")
const route = app.Router()
const UserController = require("../controllers/user_controller")

route.post("/user", UserController.createNewUser)
route.get("/user/:userId}", UserController.getUser)
route.get("/user/session}", UserController.getCurrentUserSession)

module.exports = route