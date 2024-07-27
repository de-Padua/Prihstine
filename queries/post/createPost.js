const prisma = require("../../db/db");
const ULID = require("ulid");

const createPost = async (userId, postData) => {



  const sortableUlidId = ULID.ulid();
  const newPost = await prisma.post.create({
    data: {
      ULID: sortableUlidId,
      postTitle: postData.postTitle,
      postDescription: postData.postDescription,
      postValue: postData.postValue,
      sizeInSquareMeters: postData.sizeInSquareMeters,
      isClosed: postData.isClosed,
      userId: userId,
      address: {
        create: {
          cep: postData.address.cep,
          logradouro: postData.address.logradouro,
          complemento: postData.address.complemento,
          unidade: postData.address.unidade,
          bairro: postData.address.bairro,
          localidade: postData.address.localidade,
          uf: postData.address.uf,
          ibge: postData.address.ibge,
          ddd: postData.address.ddd,
        },
      },
      pictures: {
        create: [
          // Add picture data here if needed
        ],
      },
    },
  });

  return newPost;

  return newPost;
};

module.exports = createPost;
