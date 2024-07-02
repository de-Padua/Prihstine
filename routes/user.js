const app = require("express")
const route = app.Router()
const UserController = require("../controllers/user_controller")



route.post("/user", UserController.createNewUser)



module.exports = route