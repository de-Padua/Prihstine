const bodyValidation = require("../../middlewares/newUserRequestBodyValidation");

describe("should validate every element on the body", () => {
  it("should recive an undefined,which mean it is a valid body",  () => {
    const body = {
      email: "test@example.com",
      password: "password123",
      phone: "1234567890",
      firstName: "John",
      lastName: "Doe",
    };

    const model = [
      "email",
      "password",
      "phone",
      "firstName",
      "lastName",
    ];

    const result = bodyValidation(body, model);

    expect(result).toBeUndefined();
  });
  it("should fail at body phone",  () => {
    const body = {
      email: "test@example.com",
      password: "password123",
      posts: ["post1", "post2"],
      phone: "1234567890",
      firstName: "John"
    };

    const model = [
      "email",
      "password",
      "posts",
      "phone",
      "firstName",
      "lastName",
    ];

    const result = bodyValidation(body, model);

    expect(result).toBe("invalid request, lastName field is missing");
  });
});
