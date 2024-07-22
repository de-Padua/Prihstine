const prisma = require("../db/db")
const bodyValidation = require("../helpers/bodyValidation")
const getUserSession = require("../queries/post/getUserSession")
const createPostQuerie = require("../queries/post/createPost")

const postController = {

  getPost: async (req, res) => {
  },
  createPost: async (req, res) => {
    const userToken = req.cookies["sid"]
    const post = req.body

    const validKeys = ["userId",
      "postTitle",
      "postDescription",
      "postValue",
      "address",
      "state",
      "cep",
      "sizeInSquareMeters",
      "isClosed",
      "pictures"]


    const validateBody =  bodyValidation(post,validKeys)

    if(!validateBody){
      return res.status(403).end()
    }

    const isSessionActive = await getUserSession(userToken)

    if (!isSessionActive) {
      return res.status(403).end()
    }

    const newPost = await createPostQuerie(isSessionActive.userId, post)

    if (!newPost) {
      return req.status(400).end()
    }

    res.status(200).json({ data: "Post was created" }).end()


  },
  deletePost: async (req, res) => { },
  editPost: async (req, res) => { },



}

module.exports = postController