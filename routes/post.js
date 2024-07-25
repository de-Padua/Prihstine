const app = require("express")
const postController = require("../controllers/post_controller")
const editPostMiddleware = require("../middlewares/editPostValidation")
const newPostValidation = require("../middlewares/newPostValidation")
const route = app.Router()


route.get("/post/:postId",postController.getPost)
route.post("/post",newPostValidation,postController.createPost)
route.patch("/post/:postId",editPostMiddleware,postController.editPost)
route.delete("/post/:postId",postController.deletePost)






module.exports = route