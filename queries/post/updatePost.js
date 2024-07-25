const prisma = require("../../db/db")


const updatePost = async (postId,postData) => {

  const newPost = await prisma.post.update({
    where: {
      postId: postId
    },
    data: { ...postData }
  })
  
  return newPost


}


module.exports = updatePost