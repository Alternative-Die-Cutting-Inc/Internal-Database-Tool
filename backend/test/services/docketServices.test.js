/**
 * @fileoverview Docket services tests
 * Global Docket objet
 * @typedef {import("../../models/DocketModel").Docket} Docket
 */

const docketServices = require('../../services/docketServices');
const assert = require('assert');

describe('Testing Docket Services', () => {
  it('.initCounter()\t\t|\tInitialize Counter', async function () {
    await docketServices.initCounter();
  });

  let newDocket = null;
  it('.create()\t\t\t|\tCreate a Docket', async function () {
    newDocket = await docketServices.create({
      customer: { name: 'Alt Die Cut Inc', customerID: '12345' },
      jobName: 'Test 0',
    });
  });

  it('.create()\t\t\t|\tAccurate Creation', async function () {
    newDocket = await docketServices.create({
      customer: { name: 'Alt Die Cut Inc', customerID: '12345' },
      jobName: 'Test 1',
    });
    assert.equal(newDocket.customer.name, 'Alt Die Cut Inc');
    assert.equal(newDocket.jobName, 'Test 1');
    assert.equal(newDocket.docketNumber, 45002);
  });

  it('.create()\t\t\t|\tCreate multiple Dockets', async function () {
    await docketServices.create({
      customer: { name: 'Alt Die Cut Inc', customerID: '12345' },
      jobName: 'Test 2',
    });
    await docketServices.create({
      customer: { name: 'Alt Die Cut Inc', customerID: '12345' },
      jobName: 'Test 3',
    });
    await docketServices.create({
      customer: { name: 'Alt Die Cut Inc', customerID: '12345' },
      jobName: 'Test 4',
    });
    await docketServices.create({
      customer: { name: 'Alt Die Cut Inc', customerID: '12345' },
      jobName: 'Test 5',
    });
    await docketServices.create({
      customer: { name: 'Alt Die Cut Inc', customerID: '12345' },
      jobName: 'Test 6',
    });
  });

  it('.create()\t\t\t|\tCreate a Docket (INVALID DATA)', async function () {
    await assert.rejects(docketServices.create({}), {
      name: 'Error',
      message: 'UNABLE_TO_CREATE_DOCKET',
    });
  });

  it('.get(id)\t\t\t|\tGet a Docket', async function () {
    const existingDocket = await docketServices.get(newDocket.id);
    assert.notEqual(existingDocket, null);
  });

  it('.get(id)\t\t\t|\tGet a Docket (NO ID)', async function () {
    await assert.rejects(docketServices.get('     '), {
      name: 'Error',
      message: 'UNABLE_TO_GET_DOCKET',
    });
  });

  it('.get(id)\t\t\t|\tGet a Docket (INVALID ID)', async function () {
    await assert.rejects(docketServices.get('64c2b3c7bef0f80ed01636d4'), {
      name: 'Error',
      message: 'DOCKET_NOT_FOUND',
    });
  });

  it('.getFromNum(number)\t|\tGet Docket from docket number', async function () {
    const existingDocket = await docketServices.getFromNum(newDocket.docketNumber);
    assert.notEqual(existingDocket, null);
  });

  it('.getFromNum(number)\t|\tGet Docket from docket number (INVALID NUMBER)', async function () {
    await assert.rejects(docketServices.getFromNum('00000'), {
      name: 'Error',
      message: 'DOCKET_NOT_FOUND',
    });
  });

  it('.get()\t\t\t|\tGet all Dockets', async function () {
    const existingDockets = await docketServices.get();
    assert.notEqual(existingDockets.length, 0);
    assert.equal(existingDockets.length, 7);
  });

  it('.update(id, fields)\t|\tUpdate Docket info', async function () {
    const updatedDocket = await docketServices.update(newDocket.id, {
      customer: { name: 'Alternative Die Cut Inc', customerID: '12345' },
      jobName: 'Test 7',
      customerPO: 123456,
    });
    assert.equal(updatedDocket.customer.name, 'Alternative Die Cut Inc');
    assert.equal(updatedDocket.jobName, 'Test 7');
    assert.equal(updatedDocket.customerPO, 123456);
  });

  it('.update(id, fields)\t|\tAdd forms', async function () {
    let forms = [
      {
        name: 'Form 1',
        quantity: 123,
        quantityShipped: 123,
      },
      {
        name: 'Form 2',
        quantity: 246,
        quantityShipped: 123,
      },
      {
        name: 'Form 3',
        quantity: 369,
        quantityShipped: 123,
      },
    ];
    const updatedDocket = await docketServices.update(newDocket.id, {
      forms,
    });
    assert.equal(updatedDocket.forms.length, 3);
    updatedDocket.forms.forEach((form, index) => {
      assert.equal(form.name, `Form ${index + 1}`);
      assert.equal(form.quantity, 123 * (index + 1));
      assert.equal(form.quantityShipped, 123);
    });
  });

  it('.update(id, fields)\t|\tUpdate Docket info (NO ID)', async function () {
    await assert.rejects(docketServices.update('', {}), {
      name: 'Error',
      message: 'UNABLE_TO_UPDATE_DOCKET',
    });
  });

  it('.update(id, fields)\t|\tUpdate Docket info (INVALID ID)', async function () {
    await assert.rejects(docketServices.update('64c2b3c7bef0f80ed01636d4', {}), {
      name: 'Error',
      message: 'DOCKET_NOT_FOUND',
    });
  });

  it('.delete(id)\t\t|\tDelete a Docket', async function () {
    const deletedDocket = await docketServices.delete(newDocket.id);
    assert.notEqual(deletedDocket, null);
  });

  it('.delete(id)\t\t|\tCheck deleted Docket', async function () {
    await assert.rejects(docketServices.delete(newDocket.id), {
      name: 'Error',
      message: 'DOCKET_NOT_FOUND',
    });
  });

  it('.delete(id)\t\t|\tCheck deleted Docket (NO ID)', async function () {
    await assert.rejects(docketServices.delete(''), {
      name: 'Error',
      message: 'UNABLE_TO_DELETE_DOCKET',
    });
  });
});
