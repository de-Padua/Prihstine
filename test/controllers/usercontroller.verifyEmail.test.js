
const userController = require("../../controllers/user_controller");
const _db = require("../../db/db");
const sendMail = require("../../helpers/sendEmailNewAccountCreation");
;

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

jest.mock("../../helpers/createUserAndEmailValidationTransaction");
jest.mock("../../helpers/sendEmailNewAccountCreation");
jest.mock("../../helpers/checkUserSession");
jest.mock("../../helpers/getNonSensitiveFileds");


describe("test user controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("it should verify email based on token ,verifyEmail route", async () => {
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

    sendMail.mockResolvedValue("Mail sent successfully");

    _db.userValidation.findFirst.mockResolvedValue(
      mockValueUserValidationDataFindFirst
    );

    const updatedUser = await _db.user.update.mockResolvedValue(
      mockValueUserValidationDataUpdated
    );

    await userController.verifyEmail(req, res);

    expect(_db.userValidation.findFirst).toHaveBeenCalledWith({
      where: {
        userId: req.params.userId,
      },
      include: {
        user: true,
      },
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
    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.end).toHaveBeenCalled();
  });
});
