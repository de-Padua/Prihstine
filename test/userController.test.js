const bcrypt = require("bcryptjs");
const userController = require("../controllers/user_controller");
const _db = require("../db/db");
const createUserAndEmailValidationTransaction = require("../helpers/createUserAndEmailValidationTransaction");
const sendMail = require("../helpers/sendEmailNewAccountCreation");

jest.mock("../helpers/createUserAndEmailValidationTransaction");
userController.createUserAndEmailValidationTransaction = jest.fn();

jest.mock("../db/db", () => ({
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
  userValidation: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock("../helpers/sendEmailNewAccountCreation")

describe("test user controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should create a new user and return 201 status code", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "password123",
        phone: "1234567890",
        firstName: "John",
        lastName: "Doe",
      },
      headers: {
        "content-type": "application/json",
        "content-length": 1000,
      },
    };

    const mockUserData = {
      id: "dd2db1c5-8a37-41b4-873d-09c1785431d8",
      email: "ccde@email.com",
      firstName: "antonio",
      lastName: "de padua",
      phone: 87282151,
      password: "$2a$04$5t8WGSLQtV3dxlK4DIh6EeNyuCO80/a6cE/lxwXgUZitrd01lr/tO",
      isVerified: false,
      Session: {
        userId: "dd2db1c5-8a37-41b4-873d-09c1785431d8",
        sessionId: "8f4ccbb1-f660-4f3a-9336-9c5ded717bd2",
      },
      userValidation: {
        id: "43995683-8ffc-41a6-b0b1-77ef196a6896",
        token: "369eaa96-b702-4313-b158-cb9df217fc07",
        userId: "dd2db1c5-8a37-41b4-873d-09c1785431d8",
        createdAt: "2024-07-14T21:28:42.961Z",
        expiresAt: "2024-07-14T22:28:42.959Z",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };

    _db.user.findUnique.mockResolvedValue(null);

    createUserAndEmailValidationTransaction.mockResolvedValue(mockUserData);

    await userController.createNewUser(req, res);

    expect(_db.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });

    expect(createUserAndEmailValidationTransaction).toHaveBeenCalledWith(
      req.body
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.cookie).toHaveBeenCalledWith("sid", expect.any(String), {
      maxAge: 900000,
      httpOnly: true,
    });
    expect(res.end).toHaveBeenCalled();
  });
  it("should fail at body validation", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
      },
      headers: {
        "content-type": "application/json",
        "content-length": 1000,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };

    _db.user.findUnique.mockResolvedValue(null);
    _db.user.create.mockResolvedValue({
      id: 1,
      email: "test1@example.com",
      password: bcrypt.hashSync("password123", 4),
      phone: "1234567890",
      firstName: "John",
      lastName: "Doe",
      Session: { sessionId: "mocksessionid" },
    });

    await userController.createNewUser(req, res);

    expect(_db.user.findUnique).not.toHaveBeenCalled();
    expect(_db.user.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.cookie).not.toHaveBeenCalled();
    expect(res.end).toHaveBeenCalled();
  });
  it("it should verify email based on token", async () => {
    const req = {
      headers: {
        "content-type": "application/json",
        "content-length": 1000,
      },
      params: {
        userId: "52d96a74-d043-481c-9b2f-0661bf0c5cb5",
        tokenId: "9fbdec9f-1aab-4900-b3f2-e4875176dd51",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };

    const mockValueUserValidationDataFindFirst = {
      id: "9db029ca-73e6-4e6e-a812-4239323662a2",
      token: "9fbdec9f-1aab-4900-b3f2-e4875176dd51",
      userId: "52d96a74-d043-481c-9b2f-0661bf0c5cb5",
      createdAt: "2024-07-16T17:20:07.658Z",
      expiresAt: "2024-07-16T18:20:07.656Z",
      user: {
        id: "52d96a74-d043-481c-9b2f-0661bf0c5cb5",
        email: "elaine2@email.com",
        firstName: "Elaine",
        lastName: "de padua",
        phone: 87282151,
        password:
          "$2a$04$IrH5x39IUsLKzfwgEOvfJO4D683rPuqVZ/iesfqiwTvYhX7fyrFAi",
        isVerified: false,
      },
    };
    const mockValueUserValidationDataUpdated = {
      id: "9db029ca-73e6-4e6e-a812-4239323662a2",
      token: "9fbdec9f-1aab-4900-b3f2-e4875176dd51",
      userId: "52d96a74-d043-481c-9b2f-0661bf0c5cb5",
      createdAt: "2024-07-16T17:20:07.658Z",
      expiresAt: "2024-07-16T18:20:07.656Z",
      user: {
        id: "52d96a74-d043-481c-9b2f-0661bf0c5cb5",
        email: "elaine2@email.com",
        firstName: "Elaine",
        lastName: "de padua",
        phone: 87282151,
        password:
          "$2a$04$IrH5x39IUsLKzfwgEOvfJO4D683rPuqVZ/iesfqiwTvYhX7fyrFAi",
        isVerified: true,
      },
    };

    sendMail.mockResolvedValue("Mail sent successfully")
    
    _db.userValidation.findFirst.mockResolvedValue(
      mockValueUserValidationDataFindFirst
    );

   const updatedUser = await _db.user.update.mockResolvedValue(mockValueUserValidationDataUpdated);

    await userController.verifyEmail(req,res)

    expect(_db.userValidation.findFirst).toHaveBeenCalledWith({
      where:{
        userId:req.params.userId
      },
      include:{
        user:true
      }
    });
    expect(_db.user.update).toHaveBeenCalledWith({
      where: {
        id: req.params.userId,
      },
      data: {
        isVerified: true,
      },
    });

    expect(sendMail).toHaveBeenCalledWith("notification/verifySucess", {
        emailToSend: [updatedUser.email],
        url: undefined,
        subject: "Account Verification Successful",
      });
    expect(res.status).toHaveBeenCalledWith(202)
    expect(res.end).toHaveBeenCalled()
    
  });



});
