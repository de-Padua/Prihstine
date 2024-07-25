const prisma = require("../../db/db")

const getPost = async (postId) => {

  const post = await prisma.post.findFirst({
    where: {
      postId: postId
    }, include: {
      user: true
    }
  })


  return post
}



module.exports = getPost