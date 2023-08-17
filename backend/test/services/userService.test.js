const userServices = require('../../services/userServices');
const assert = require('assert');
const bcrypt = require('bcrypt');
const UserModel = require('../../models/UserModel');

describe('Testing User Services', () => {
  it('.validateUser()\t|\tValidate password', async function () {
    const password = 'Password1!';
    const invalid = await userServices.validateUser('username', password);
    assert.strictEqual(invalid, 0);
  });

  it('.validateUser()\t|\tValidate password (invalid password)', async function () {
    const password = 'password';
    await assert.rejects(userServices.validateUser('username', password), {
      name: 'Error',
      message: 'INVALID_PASSWORD',
    });
  });

  it('.validateUser()\t|\tValidate username', async function () {
    const password = 'Password1!';
    const invalid = await userServices.validateUser('anyUserName', password);
    assert.strictEqual(invalid, 0);
  });

  it('.validateUser()\t|\tValidate username (duplicate username)', async function () {
    await UserModel.create({
      email: 'test@123.com',
      hashedPassword: 'Password!2',
      username: 'username',
    });
    const password = 'Password!2';
    await assert.rejects(userServices.validateUser('username', password), {
      name: 'Error',
      message: 'DUPLICATE_USERNAME',
    });
  });

  let newUser = null;

  it('.create()\t\t\t|\tCreate a User', async function () {
    newUser = await userServices.create({
      username: 'dev',
      password: 'Password1!',
      email: 'dev@alternativeDC.com',
      firstName: 'John',
      lastName: 'Doe',
    });
  });

  it('.create()\t\t\t|\tAccurate creation', async function () {
    assert.strictEqual(newUser.email, 'dev@alternativeDC.com');
    assert.strictEqual(newUser.firstName, 'John');
    assert.strictEqual(newUser.lastName, 'Doe');
    assert.strictEqual(newUser.username, 'dev');
    assert(bcrypt.compare(newUser.hashedPassword, 'Password1!'));
  });

  it('.create()\t\t\t|\tDuplicate Email', async function () {
    await assert.rejects(
      userServices.create({
        email: 'dev@alternativeDC.com',
        password: 'Password1!',
        username: 'dev',
      }),
      Error,
      'Email already exists',
    );
  });
});
