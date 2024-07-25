const prisma = require("../../db/db")


const createPost = async (userId, postData) => {

  const newPost = await prisma.post.create({
    data: {
      postTitle: postData.postTitle,
      postDescrition: postData.postDescrition,
      postValue: postData.postValue, // Example value, adjust as needed
      address: postData.address,
      state: postData.state,
      cep: postData.cep,
      sizeInSquareMeters: postData.sizeInSquareMeters, // Example size, adjust as needed
      userId: userId, // Replace with an existing user's ID
      pictures: {
        create: [
        ]
      }
    }
  });

  return newPost


}


module.exports = createPost