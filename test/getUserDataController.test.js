

// Assuming you are using Jest for testing

const controller = require("../controllers/user_controller");

// Mocks for req and res objects
const MockReq = {};
const MockRes = {
  json: jest.fn(),
  status: jest.fn(() => MockRes), // Mock status chaining
};

describe('Test getUserData route', () => {
  test('Should return user data', async () => {
    await controller.getUserData(MockReq, MockRes);

    // Check if res.json was called with the expected userData
    expect(MockRes.json).toHaveBeenCalledWith({ data: "ok" });

    // Check that status was not called (indicating no error occurred)
    expect(MockRes.status).not.toHaveBeenCalled();
  });

  // You can add more tests here to cover other scenarios if needed
});