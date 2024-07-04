const app = require("express")
const route = app.Router()
const UserController = require("../controllers/user_controller")
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
route.post("/user",jsonParser, UserController.createNewUser)
route.get("/user",jsonParser, UserController.getUsers)

module.exports = route