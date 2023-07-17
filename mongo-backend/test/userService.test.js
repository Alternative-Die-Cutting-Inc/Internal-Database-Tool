const userServices = require("../services/userServices");
const assert = require("assert");
const bcrypt = require("bcrypt");

describe("Testing User Services", () => {
  it(".validatePassword()\t|\tValidate password", async function () {
    const password = "Password1!";
    const invalid = await userServices.validatePassword(password);
    assert.strictEqual(invalid, 0);
  });

  it(".validatePassword()\t|\tValidate password (invalid password)", async function () {
    const password = "password";
    const invalid = await userServices.validatePassword(password);
    assert.notStrictEqual(invalid, 0);
  });

  let newUser = null;

  it(".create()\t\t\t|\tCreate a User", async function () {
    newUser = await userServices.create(
      "dev@alternativeDC.com",
      "Password1!",
      "dev",
      "John",
      "Doe"
    );
  });

  it(".create()\t\t\t|\tAccurate creation", async function () {
    assert.strictEqual(newUser.email, "dev@alternativeDC.com");
    assert.strictEqual(newUser.firstName, "John");
    assert.strictEqual(newUser.lastName, "Doe");
    assert.strictEqual(newUser.username, "dev");
    assert(bcrypt.compare(newUser.hashedPassword, "Password1!"));
  });

  it(".create()\t\t\t|\tDuplicate Email", async function () {
    await assert.rejects(
      userServices.create("dev@alternativeDC.com", "Password1!", "dev"),
      Error,
      "Email already exists"
    );
  });
});
