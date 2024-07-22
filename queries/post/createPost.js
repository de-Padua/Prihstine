const prisma = require("../../db/db")


const createPost = async (userId, postData) => {

  const newPost = await prisma.post.update({});

  return newPost


}


module.exports = createPost