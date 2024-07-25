var bcrypt = require("bcryptjs");
const sendMail = require("../helpers/sendEmailNewAccountCreation");
const prisma = require(".././db/db");

const createUserAndEmailValidationTransaction = async (userData) => {


  
  const hash = bcrypt.hashSync(userData.password, 4);
  const expiresAt = new Date(Date.now() + 3600000);

  
  try {
    const data =  await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hash,
          posts: { connect: userData.posts },
          phone: userData.phone,
          firstName: userData.firstName,
          lastName: userData.lastName,
          Session: {
            create: {
              expiresAt: expiresAt,
            },
          },
          userValidation: {
            create: {
              expiresAt: expiresAt,
            },
          },
        },
        include: {
          Session: true,
          userValidation: true,
        },
      });

      console.log(user)
      const emailToken = user.userValidation.token;
      const userId = user.id;
  
      const verificationUrl = `https://${process.env.DEV_HOST}/user/${userId}/verify-email/${emailToken}`;
   
      console.log(verificationUrl)
      try {
         await sendMail("notification/newPost", {   
          emailToSend: [user.email],
          url: verificationUrl,
          subject:"Email verification"
        });      
      } catch (emailError) {
        console.error("Failed to send validation email:", emailError);
        throw new Error("Email sending failed");
      }
      return user;
    });
    return data
  } catch (err) {
    throw new Error(err)
  }
};

module.exports = createUserAndEmailValidationTransaction;

/*

 */
