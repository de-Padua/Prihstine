const app = require("express")
const route = app.Router()
const userController = require("../controllers/user_controller")



route.get("/user",userController.getUserData)






module.exports = route