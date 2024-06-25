
const controller = require("../controllers/user_controller");

const MockReq = {};
const MockRes = {
  json: jest.fn(),
  status: jest.fn(() => MockRes),
};
describe('Test getUserData route', () => {
  test('Should return user data', async () => {
    await controller.getUserData(MockReq, MockRes); 
    expect(MockRes.json).toHaveBeenCalledWith({ data: "" });  // <<< this will fail
    expect(MockRes.status).not.toHaveBeenCalled();
  });
});