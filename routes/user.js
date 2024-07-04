const app = require("express")
const route = app.Router()
const UserController = require("../controllers/user_controller")
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

route.post("/user", UserController.createNewUser)
route.get("/user", UserController.getUsers)

module.exports = route