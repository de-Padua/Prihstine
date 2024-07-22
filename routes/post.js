const app = require("express")
const postController = require("../controllers/post_controller")
const route = app.Router()


route.post("/post",postController.createPost)
route.patch("/post",postController.editPost)






module.exports = route