const prisma = require("../db/db");
const checkUserSession = require("../queries/user/checkUserSession");
const createPostQuerie = require("../queries/post/createPost");
const updatePost = require("../queries/post/updatePost");
const getPost = require("../queries/post/getPostById");


const postController = {
  getPost: async (req, res) => {
    try {

      const postId = req.params["postId"];
      const post = await getPost(postId);

      if (!post) {
        res.status(404).json({ data: "post not found" });
      }

      console.log(post);
      return res.status(200).json({ data: post });
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
  getPosts: async (req, res) => {
    const minValue = Number(req.query.min) || undefined;
    const maxValue = Number(req.query.max) || undefined;
    const state = req.query.state ? req.query.state.toUpperCase() : undefined
    const place = req.query.place ? req.query.place.toLowerCase() : undefined

    try {
      const currentPage = req.params["page"];
      const total = await prisma.post.count();
      const pages = Math.ceil(total / 10);

      const posts = await prisma.post.findMany({
        take: 10,
        skip: Number(currentPage) * 10,

        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          address: true,
        },
        where: {
          postValue: {
            gte: minValue,
            lte: maxValue,
          },
          AND: {
            address: {
              uf: {
                equals: state,
              },
              localidade:{
                equals:place
              }
            },

          },
        },
      });

       console.log(req.query)
      res.status(200).json({
        data: {
          currentPage: currentPage,
          pageContent: posts,
        },
        pages: pages,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
};

module.exports = postController;
