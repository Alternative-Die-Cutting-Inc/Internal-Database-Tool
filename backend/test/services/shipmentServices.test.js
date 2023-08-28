const shipmentServices = require('../../services/shipmentServices');
const assert = require('assert');

describe('Testing Shipment Services', () => {
  let newShipment = null;
  it('.create()\t\t\t|\tCreate a Shipment', async function () {
    newShipment = await shipmentServices.create({
      docketNumber: 14000,
      quoteNumber: 185000,
      jobName: 'Test 1',
      customer: { name: 'Alt Die Cut Inc', customerID: '324234b34b234234' },
      customerPO: 'PO 12345',
      additionalNotes: 'This is a test note',
      label1: 'This is a test label 1',
      label2: 'This is a test label 2',
      forms: [
        {
          name: 'Form 1',
          skids: 10,
          notes: 'This is a test form note 1',
          type: 'cartons',
          quantity: 100,
          cartonQuantity: 10,
          partialCartonQuantity: 2,
        },
        {
          name: 'Form 2',
          skids: 20,
          notes: 'This is a test form note 2',
          type: 'sheets',
          quantity: 200,
        },
        {
          name: 'Form 3',
          skids: 30,
          notes: 'This is a test form note 3',
          type: 'pieces',
          quantity: 300,
        },
      ],
      labelDate: new Date(),
    });
  });

  it('.create()\t\t\t|\tAccurate Creation', async function () {
    newShipment = await shipmentServices.create({
      docketNumber: 14000,
      customer: { name: 'Alt Die Cut Inc', customerID: '324234b34b234234' },
      additionalNotes: 'This is a test note',
      label1: 'This is a test label 1',
      label2: 'This is a test label 2',
      forms: [
        {
          name: 'Form 1',
          skids: 10,
          notes: 'This is a test form note 1',
          type: 'cartons',
          quantity: 100,
          cartonQuantity: 10,
          partialCartonQuantity: 2,
        },
        {
          name: 'Form 2',
          skids: 20,
          notes: 'This is a test form note 2',
          type: 'sheets',
          quantity: 200,
        },
        {
          name: 'Form 3',
          skids: 30,
          notes: 'This is a test form note 3',
          type: 'pieces',
          quantity: 300,
        },
      ],
      labelDate: new Date(),
    });
    assert.equal(newShipment.docketNumber, 14000);
    assert.equal(newShipment.customer.name, 'Alt Die Cut Inc');
    assert.equal(newShipment.additionalNotes, 'This is a test note');
    assert.equal(newShipment.forms.length, 3);
    assert.equal(newShipment.forms[0].name, 'Form 1');
    assert.equal(newShipment.forms[0].skids, 10);
    assert.equal(newShipment.forms[0].notes, 'This is a test form note 1');
    assert.equal(newShipment.forms[0].type, 'cartons');
    assert.equal(newShipment.forms[0].quantity, 100);
    assert.equal(newShipment.forms[0].cartonQuantity, 10);
    assert.equal(newShipment.forms[0].partialCartonQuantity, 2);
    assert.equal(newShipment.forms[1].name, 'Form 2');
    assert.equal(newShipment.forms[1].skids, 20);
    assert.equal(newShipment.forms[1].notes, 'This is a test form note 2');
    assert.equal(newShipment.forms[1].type, 'sheets');
    assert.equal(newShipment.forms[1].quantity, 200);
    assert.equal(newShipment.forms[2].name, 'Form 3');
    assert.equal(newShipment.forms[2].skids, 30);
    assert.equal(newShipment.forms[2].notes, 'This is a test form note 3');
    assert.equal(newShipment.forms[2].type, 'pieces');
    assert.equal(newShipment.forms[2].quantity, 300);
  });

  it('.create()\t\t\t|\tCreate multiple Shipments', async function () {
    await shipmentServices.create({
      docketNumber: 14000,
      quoteNumber: 185000,
      jobName: 'Test 1',
      customer: { name: 'Alt Die Cut Inc', customerID: '324234b34b234234' },
      customerPO: 'PO 12345',
      additionalNotes: 'This is a test note',
      label1: 'This is a test label 1',
      label2: 'This is a test label 2',
      forms: [
        {
          name: 'Form 1',
          skids: 10,
          notes: 'This is a test form note 1',
          type: 'cartons',
          quantity: 100,
          cartonQuantity: 10,
          partialCartonQuantity: 2,
        },
        {
          name: 'Form 2',
          skids: 20,
          notes: 'This is a test form note 2',
          type: 'sheets',
          quantity: 200,
        },
        {
          name: 'Form 3',
          skids: 30,
          notes: 'This is a test form note 3',
          type: 'pieces',
          quantity: 300,
        },
      ],
      labelDate: new Date(),
    });
    await shipmentServices.create({
      docketNumber: 14000,
      quoteNumber: 185000,
      jobName: 'Test 2',
      customer: { name: 'Alt Die Cut Inc', customerID: '324234b34b234234' },
      customerPO: 'PO 12345',
      additionalNotes: 'This is a test note',
      label1: 'This is a test label 1',
      label2: 'This is a test label 2',
      forms: [
        {
          name: 'Form 1',
          skids: 10,
          notes: 'This is a test form note 1',
          type: 'cartons',
          quantity: 100,
          cartonQuantity: 10,
          partialCartonQuantity: 2,
        },
        {
          name: 'Form 2',
          skids: 20,
          notes: 'This is a test form note 2',
          type: 'sheets',
          quantity: 200,
        },
        {
          name: 'Form 3',
          skids: 30,
          notes: 'This is a test form note 3',
          type: 'pieces',
          quantity: 300,
        },
      ],
      labelDate: new Date(),
    });
    await shipmentServices.create({
      docketNumber: 14000,
      quoteNumber: 185000,
      jobName: 'Test 3',
      customer: { name: 'Alt Die Cut Inc', customerID: '324234b34b234234' },
      customerPO: 'PO 12345',
      additionalNotes: 'This is a test note',
      label1: 'This is a test label 1',
      label2: 'This is a test label 2',
      forms: [
        {
          name: 'Form 1',
          skids: 10,
          notes: 'This is a test form note 1',
          type: 'cartons',
          quantity: 100,
          cartonQuantity: 10,
          partialCartonQuantity: 2,
        },
        {
          name: 'Form 2',
          skids: 20,
          notes: 'This is a test form note 2',
          type: 'sheets',
          quantity: 200,
        },
        {
          name: 'Form 3',
          skids: 30,
          notes: 'This is a test form note 3',
          type: 'pieces',
          quantity: 300,
        },
      ],
      labelDate: new Date(),
    });
  });

  it('.get(id)\t\t\t|\tGet a Shipment', async function () {
    const existingShipment = await shipmentServices.get(newShipment.id);
    assert.notEqual(existingShipment, null);
    assert.equal(existingShipment.docketNumber, 14000);
    assert.equal(existingShipment.customer.name, 'Alt Die Cut Inc');
    assert.equal(existingShipment.additionalNotes, 'This is a test note');
    assert.equal(existingShipment.forms.length, 3);
    assert.equal(existingShipment.forms[0].name, 'Form 1');
    assert.equal(existingShipment.forms[0].skids, 10);
    assert.equal(existingShipment.forms[0].notes, 'This is a test form note 1');
    assert.equal(existingShipment.forms[0].type, 'cartons');
    assert.equal(existingShipment.forms[0].quantity, 100);
    assert.equal(existingShipment.forms[0].cartonQuantity, 10);
    assert.equal(existingShipment.forms[0].partialCartonQuantity, 2);
    assert.equal(existingShipment.forms[1].name, 'Form 2');
    assert.equal(existingShipment.forms[1].skids, 20);
    assert.equal(existingShipment.forms[1].notes, 'This is a test form note 2');
    assert.equal(existingShipment.forms[1].type, 'sheets');
    assert.equal(existingShipment.forms[1].quantity, 200);
    assert.equal(existingShipment.forms[2].name, 'Form 3');
    assert.equal(existingShipment.forms[2].skids, 30);
    assert.equal(existingShipment.forms[2].notes, 'This is a test form note 3');
    assert.equal(existingShipment.forms[2].type, 'pieces');
    assert.equal(existingShipment.forms[2].quantity, 300);
  });

  it('.get()\t\t\t|\tGet all Shipments', async function () {
    const existingShipments = await shipmentServices.get();
    assert.notEqual(existingShipments.length, 0);
    assert.equal(existingShipments.length, 5);
  });

  it('.update(id, fields)\t|\tUpdate Shipment info', async function () {
    const updatedShipment = await shipmentServices.update(newShipment.id, {
      customer: { name: 'Alternative Die Cut Inc' },
      jobName: 'Test 7',
      additionalNotes: 'this is a test description',
    });
    assert.equal(updatedShipment.customer.name, 'Alternative Die Cut Inc');
    assert.equal(updatedShipment.additionalNotes, 'this is a test description');
  });

  it('.update(id, fields)\t|\tAdd forms', async function () {
    let forms = [
      {
        name: 'Form 2',
        skids: 20,
        notes: 'This is a test form note 2',
        type: 'sheets',
        quantity: 200,
      },
      {
        name: 'Form 3',
        skids: 30,
        notes: 'This is a test form note 3',
        type: 'pieces',
        quantity: 300,
      },
    ];
    const updatedShipment = await shipmentServices.update(newShipment.id, {
      forms: forms,
    });
    assert.equal(updatedShipment.forms.length, 2);
    updatedShipment.forms.forEach((shipmentForm, index) => {
      assert.equal(shipmentForm.name, `Form ${index + 2}`);
      assert.equal(shipmentForm.skids, 10 * (index + 2));
      assert.equal(shipmentForm.quantity, 100 * (index + 2));
      assert.equal(shipmentForm.notes, `This is a test form note ${index + 2}`);
    });
  });

  it('.delete(id)\t\t|\tDelete a Shipment', async function () {
    const deletedShipment = await shipmentServices.delete(newShipment.id);
    assert.notEqual(deletedShipment, null);
  });

  it('.delete(id)\t\t|\tCheck deleted Shipment (SHIPMENT_NOT_FOUND)', async function () {
    await assert.rejects(shipmentServices.delete(newShipment.id), {
      name: 'Error',
      message: 'SHIPMENT_NOT_FOUND',
    });
  });

  it('.delete(id)\t\t|\tCheck deleted Shipment (UNABLE_TO_DELETE_SHIPMENT)', async function () {
    await assert.rejects(shipmentServices.delete('    '), {
      name: 'Error',
      message: 'UNABLE_TO_DELETE_SHIPMENT',
    });
  });

  it('.get(id)\t\t\t|\tGet a Shipment (SHIPMENT_NOT_FOUND)', async function () {
    await assert.rejects(shipmentServices.get(newShipment.id), {
      name: 'Error',
      message: 'SHIPMENT_NOT_FOUND',
    });
  });

  it('.get(id)\t\t\t|\tGet a Shipment (UNABLE_TO_GET_SHIPMENT)', async function () {
    await assert.rejects(shipmentServices.get('    '), {
      name: 'Error',
      message: 'UNABLE_TO_GET_SHIPMENT',
    });
  });

  it('.update(id, fields)\t|\tUpdate Shipment info (SHIPMENT_NOT_FOUND)', async function () {
    await assert.rejects(shipmentServices.update(newShipment.id), {
      name: 'Error',
      message: 'SHIPMENT_NOT_FOUND',
    });
  });

  it('.update(id, fields)\t|\tUpdate Shipment info (UNABLE_TO_UPDATE_SHIPMENT)', async function () {
    await assert.rejects(shipmentServices.update('   '), {
      name: 'Error',
      message: 'UNABLE_TO_UPDATE_SHIPMENT',
    });
  });

  it('.create()\t\t\t|\tCreate a shipment (UNABLE_TO_CREATE_SHIPMENT)', async function () {
    await assert.rejects(shipmentServices.create(newShipment.id), {
      name: 'Error',
      message: 'UNABLE_TO_CREATE_SHIPMENT',
    });
  });
});
