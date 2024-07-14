const bcrypt = require("bcryptjs");
const userController = require("./../controllers/user_controller");
const _db = require("../db/db");
const createUserAndEmailValidationTransaction = require(".././helpers/createUserAndEmailValidationTransaction");


jest.mock('../helpers/createUserAndEmailValidationTransaction');
userController.createUserAndEmailValidationTransaction = jest.fn();

jest.mock("../db/db", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

describe("create a new user", () => {
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
        xxxx: undefined, // Missing field phone
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
});
