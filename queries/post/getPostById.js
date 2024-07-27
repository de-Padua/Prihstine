const prisma = require("../../db/db");

const getPost = async (postId) => {
  const post = await prisma.post.findFirst({
    where: {
      postId: postId,
    },
    include: {
      
      user: {
        select:{
          firstName:true,
          lastName:true,  
          id:true,
          phone:true,
              
        }
      },
      address: true,
     
    },
    
  });

  return post;
};

module.exports = getPost;
