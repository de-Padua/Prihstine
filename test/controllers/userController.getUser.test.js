const userController = require("../../controllers/user_controller");
const getNonSensitiveFields = require("../../helpers/getNonSensitiveFileds");
const _db = require("../../db/db");

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

jest.mock("../../helpers/getNonSensitiveFileds");



describe("should test getUserRoute", () =>{

  it("should get the user specified on the userId param,getUser route", async () => {
    const req = {
      headers: {
        "content-type": "application/json",
        "content-length": 1000,
      },
      params: {
        userId: "52d96a74-d043-481c-9b2f-0661bf0c5cb5",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };
  

    const sensitiveUserFields = ["email", "password"];

    const findUniqueMockResponse = {
      id: "52d96a74-d043-481c-9b2f-0661bf0c5cb5",
      firstName: "Elaine",
      lastName: "de padua",
      phone: 87282151,
      posts: [],
      password: "somehashedpassword",
    };
    const getNonSensitiveFieldsResponse = {
      id: "52d96a74-d043-481c-9b2f-0661bf0c5cb5",
      firstName: "Elaine",
      lastName: "de padua",
      phone: 87282151,
      posts: [],
      
    };

    _db.user.findUnique.mockResolvedValue(findUniqueMockResponse);
   getNonSensitiveFields.mockReturnValue(getNonSensitiveFieldsResponse);

    await userController.getUser(req, res);

    expect(_db.user.findUnique).toHaveBeenCalledWith({
      where: { id: req.params.userId },
      include: {
        posts: true,
      },
    });
    expect(getNonSensitiveFields).toHaveBeenCalledWith(sensitiveUserFields,findUniqueMockResponse);
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(getNonSensitiveFieldsResponse)
    
   

  });
})