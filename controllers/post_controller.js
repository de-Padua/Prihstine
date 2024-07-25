const prisma = require("../db/db");
const bodyValidation = require("../middlewares/newUserRequestBodyValidation");
const checkUserSession = require("../queries/user/checkUserSession");
const createPostQuerie = require("../queries/post/createPost");
const updatePost = require("../queries/post/updatePost");
const getPost = require("../queries/post/getPostById");
const getNonSensitiveFields = require("../helpers/getNonSensitiveFileds");

const postController = {
  getPost: async (req, res) => {
    try {
      const sensitiveUserFields = ["email", "password"];

      const postId = req.params["postId"];
      const post = await getPost(postId);

      if (!post) {
        res.status(404).json({ data: "post not found" });
      }

      const nonSensitiveFields = getNonSensitiveFields(
        sensitiveUserFields,
        post.user
      );

      const postNonSensitiveData = { ...post, user: nonSensitiveFields };

      return res.status(200).json({ data: postNonSensitiveData });
    } catch (ex) {
      res.status(503).json(ex);
    }
  },
  createPost: async (req, res) => {
    const userToken = req.cookies["sid"];
    const post = req.body;

    const isSessionActive = await checkUserSession(userToken);

    if (!isSessionActive) {
      return res.status(403).end();
    }

    const newPost = await createPostQuerie(isSessionActive.userId, post);

    if (!newPost) {
      return req.status(400).end();
    }

    res.status(200).json({ data: "Post was created" }).end();
  },
  deletePost: async (req, res) => {
    try {
      const userToken = req.cookies["sid"];
      const postData = req.body;
      const postId = req.params["postId"];

      const userSession = await checkUserSession(userToken);

      if (!userSession) {
        return res.status(403).json({ error: "User session is not active." });
      }

      const existingPost = await prisma.post.findFirst({
        where: {
          postId: postId,
        },
      });

      if (!existingPost || existingPost.userId !== userSession.userId) {
        return res
          .status(403)
          .json({ error: "You do not have permission to delete this post." });
      }
      const deletedPost = await prisma.post.delete({
        where: {
          postId: postId,
        },
      });

      return res.status(200).json(deletedPost).end();
    } catch (error) {
      console.error("Error deleteing post:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  },

  editPost: async (req, res) => {
    try {
      const userToken = req.cookies["sid"];
      const postData = req.body;
      const postId = req.params["postId"];

      const userSession = await checkUserSession(userToken);

      if (!userSession) {
        return res.status(403).json({ error: "User session is not active." });
      }

      const existingPost = await prisma.post.findFirst({
        where: {
          postId: postId,
        },
      });

      if (!existingPost || existingPost.userId !== userSession.userId) {
        return res
          .status(403)
          .json({ error: "You do not have permission to edit this post." });
      }

      const updatedPost = await updatePost(postId, postData);

      if (!updatedPost) {
        return res.status(404).json({ error: "Post not found." });
      }

      return res.status(200).json({ message: "Post updated successfully." });
    } catch (error) {
      console.error("Error updating post:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  },
};

module.exports = postController;
