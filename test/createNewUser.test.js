const bcrypt = require("bcryptjs");
const userController = require("./../controllers/user_controller");
const _db = require("../db/db");
const headerValidation = require("./../helpers/headerValitation");
jest.mock("../db/db", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("./../helpers/headerValitation");

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

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };

    headerValidation.mockReturnValue({
      status: 200,
      success: true,
      type: undefined,
    });

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

    expect(headerValidation).toHaveBeenCalledWith(req.headers);
    expect(_db.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(_db.user.create).toHaveBeenCalledWith({
      data: {
        email: "test@example.com",
        password: expect.any(String),
        phone: "1234567890",
        firstName: "John",
        lastName: "Doe",
        posts: undefined,
        Session: { create: {} },
      },
      include: {
        Session: true,
      },
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.cookie).toHaveBeenCalledWith("sid", "mocksessionid", {
      maxAge: 900000,
      httpOnly: true,
    });
    expect(res.end).toHaveBeenCalled();
  });
  it("should return 406 status code for unsupported content type", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "password123",
        phone: "1234567890",
        firstName: "John",
        lastName: "Doe",
      },
      headers: { "content-type": "text/plain" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };

    headerValidation.mockReturnValue({
      status: 406,
      success: false,
      type: "content-type unsupported",
    });

    await userController.createNewUser(req, res);

    expect(headerValidation).toHaveBeenCalledWith(req.headers);
    expect(res.status).toHaveBeenCalledWith(406);
    expect(res.end).toHaveBeenCalled();
    expect(_db.user.findUnique).not.toHaveBeenCalled();
    expect(_db.user.create).not.toHaveBeenCalled();
  });
  it("should return 413 status code for content length too long", async () => {
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
        "content-length": 6000,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };

    headerValidation.mockReturnValue({
      status: 413,
      success: false,
      type: "content-length too long",
    });

    await userController.createNewUser(req, res);

    expect(headerValidation).toHaveBeenCalledWith(req.headers);
    expect(res.status).toHaveBeenCalledWith(413);
    expect(res.end).toHaveBeenCalled();
    expect(_db.user.findUnique).not.toHaveBeenCalled();
    expect(_db.user.create).not.toHaveBeenCalled();
  });
});
