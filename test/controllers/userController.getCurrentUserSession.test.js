const userController = require("../../controllers/user_controller");
const getNonSensitiveFields = require("../../helpers/getNonSensitiveFileds");
const _db = require("../../db/db");
const checkUserSession = require("../../queries/user/checkUserSession");
const getUserById = require("../../queries/user/getUserById");

jest.mock("../../db/db", () => ({
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

jest.mock("../../queries/user/checkUserSession");
jest.mock("../../queries/user/getUserById");
jest.mock("../../helpers/getNonSensitiveFileds");


describe("should test getCurrentUserSession", () =>{

  it("should get current user session based on token SID ,getCurrentUserSession route  ", async () => {
    const req = {
      headers: {
        "content-type": "application/json",
        "content-length": 1000,
      },
      cookies: {
        sid: "sid-cookie",
      },
    };

    const fieldsToAvoid = ["email", "password"];

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };

    const dbSessionResponse = {
      userId: "user-id",
      sessionId: "session-id",
    };

    const getByIdResponse = {
      id: "52d96a74-d043-481c-9b2f-0661bf0c5cb5",
      email: "elaine2@email.com",
      firstName: "Elaine",
      lastName: "de padua",
      phone: 87282151,
      posts: [],
      password: "sasdasd",
    };

    const getNonSensitiveFieldsResponse = {
      id: "52d96a74-d043-481c-9b2f-0661bf0c5cb5",
      firstName: "Elaine",
      lastName: "de padua",
      phone: 87282151,
      posts: [],
    };

    getUserById.mockResolvedValue(getByIdResponse);
    checkUserSession.mockResolvedValue(dbSessionResponse);
    getNonSensitiveFields.mockReturnValue(getNonSensitiveFieldsResponse);

    await userController.getCurrentUserSession(req, res);

    expect(checkUserSession).toHaveBeenCalledWith(req.cookies.sid);
    expect(getUserById).toHaveBeenCalledWith(dbSessionResponse.userId);
    expect(getNonSensitiveFields).toHaveBeenCalledWith(
      fieldsToAvoid,
      getByIdResponse
    );
  });
})