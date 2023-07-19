const shipmentServices = require("../../services/shipmentServices");
const assert = require("assert");

describe("Testing Shipment Services", () => {
  let newShipment = null;
  it(".create()\t\t\t|\tCreate a Shipment", async function () {
    newShipment = await shipmentServices.create({
      docketNumber: 14000,
      quoteNumber: 185000,
      jobName: "Test 1",
      customerName: "Alt Die Cut Inc",
      customerPO: "PO 12345",
      additionalNotes: "This is a test note",
      label1: "This is a test label 1",
      label2: "This is a test label 2",
      shipmentForms: [
        {
          formName: "Form 1",
          numberOfSkids: 10,
          formNotes: "This is a test form note 1",
          packageType: "cartons",
          packageQuantity: 100,
          perCartonQuantity: 10,
          partialCartonQuantity: 2,
        },
        {
          formName: "Form 2",
          numberOfSkids: 20,
          formNotes: "This is a test form note 2",
          packageType: "sheets",
          packageQuantity: 200,
        },
        {
          formName: "Form 3",
          numberOfSkids: 30,
          formNotes: "This is a test form note 3",
          packageType: "pieces",
          packageQuantity: 300,
        },
      ],
    });
  });

  it(".create()\t\t\t|\tAccurate Creation", async function () {
    newShipment = await shipmentServices.create({
      docketNumber: 14000,
      quoteNumber: 185000,
      jobName: "Test 1",
      customerName: "Alt Die Cut Inc",
      customerPO: "PO 12345",
      additionalNotes: "This is a test note",
      label1: "This is a test label 1",
      label2: "This is a test label 2",
      shipmentForms: [
        {
          formName: "Form 1",
          numberOfSkids: 10,
          formNotes: "This is a test form note 1",
          packageType: "cartons",
          packageQuantity: 100,
          perCartonQuantity: 10,
          partialCartonQuantity: 2,
        },
        {
          formName: "Form 2",
          numberOfSkids: 20,
          formNotes: "This is a test form note 2",
          packageType: "sheets",
          packageQuantity: 200,
        },
        {
          formName: "Form 3",
          numberOfSkids: 30,
          formNotes: "This is a test form note 3",
          packageType: "pieces",
          packageQuantity: 300,
        },
      ],
    });
    assert.equal(newShipment.docketNumber, 14000);
    assert.equal(newShipment.quoteNumber, 185000);
    assert.equal(newShipment.jobName, "Test 1");
    assert.equal(newShipment.customerName, "Alt Die Cut Inc");
    assert.equal(newShipment.customerPO, "PO 12345");
    assert.equal(newShipment.additionalNotes, "This is a test note");
    assert.equal(newShipment.shipmentForms.length, 3);
    assert.equal(newShipment.shipmentForms[0].formName, "Form 1");
    assert.equal(newShipment.shipmentForms[0].numberOfSkids, 10);
    assert.equal(
      newShipment.shipmentForms[0].formNotes,
      "This is a test form note 1"
    );
    assert.equal(newShipment.shipmentForms[0].packageType, "cartons");
    assert.equal(newShipment.shipmentForms[0].packageQuantity, 100);
    assert.equal(newShipment.shipmentForms[0].perCartonQuantity, 10);
    assert.equal(newShipment.shipmentForms[0].partialCartonQuantity, 2);
    assert.equal(newShipment.shipmentForms[1].formName, "Form 2");
    assert.equal(newShipment.shipmentForms[1].numberOfSkids, 20);
    assert.equal(
      newShipment.shipmentForms[1].formNotes,
      "This is a test form note 2"
    );
    assert.equal(newShipment.shipmentForms[1].packageType, "sheets");
    assert.equal(newShipment.shipmentForms[1].packageQuantity, 200);
    assert.equal(newShipment.shipmentForms[2].formName, "Form 3");
    assert.equal(newShipment.shipmentForms[2].numberOfSkids, 30);
    assert.equal(
      newShipment.shipmentForms[2].formNotes,
      "This is a test form note 3"
    );
    assert.equal(newShipment.shipmentForms[2].packageType, "pieces");
    assert.equal(newShipment.shipmentForms[2].packageQuantity, 300);
  });

  it(".create()\t\t\t|\tCreate multiple Shipments", async function () {
    await shipmentServices.create({
      docketNumber: 14000,
      quoteNumber: 185000,
      jobName: "Test 1",
      customerName: "Alt Die Cut Inc",
      customerPO: "PO 12345",
      additionalNotes: "This is a test note",
      label1: "This is a test label 1",
      label2: "This is a test label 2",
      shipmentForms: [
        {
          formName: "Form 1",
          numberOfSkids: 10,
          formNotes: "This is a test form note 1",
          packageType: "cartons",
          packageQuantity: 100,
          perCartonQuantity: 10,
          partialCartonQuantity: 2,
        },
        {
          formName: "Form 2",
          numberOfSkids: 20,
          formNotes: "This is a test form note 2",
          packageType: "sheets",
          packageQuantity: 200,
        },
        {
          formName: "Form 3",
          numberOfSkids: 30,
          formNotes: "This is a test form note 3",
          packageType: "pieces",
          packageQuantity: 300,
        },
      ],
    });
    await shipmentServices.create({
      docketNumber: 14000,
      quoteNumber: 185000,
      jobName: "Test 2",
      customerName: "Alt Die Cut Inc",
      customerPO: "PO 12345",
      additionalNotes: "This is a test note",
      label1: "This is a test label 1",
      label2: "This is a test label 2",
      shipmentForms: [
        {
          formName: "Form 1",
          numberOfSkids: 10,
          formNotes: "This is a test form note 1",
          packageType: "cartons",
          packageQuantity: 100,
          perCartonQuantity: 10,
          partialCartonQuantity: 2,
        },
        {
          formName: "Form 2",
          numberOfSkids: 20,
          formNotes: "This is a test form note 2",
          packageType: "sheets",
          packageQuantity: 200,
        },
        {
          formName: "Form 3",
          numberOfSkids: 30,
          formNotes: "This is a test form note 3",
          packageType: "pieces",
          packageQuantity: 300,
        },
      ],
    });
    await shipmentServices.create({
      docketNumber: 14000,
      quoteNumber: 185000,
      jobName: "Test 3",
      customerName: "Alt Die Cut Inc",
      customerPO: "PO 12345",
      additionalNotes: "This is a test note",
      label1: "This is a test label 1",
      label2: "This is a test label 2",
      shipmentForms: [
        {
          formName: "Form 1",
          numberOfSkids: 10,
          formNotes: "This is a test form note 1",
          packageType: "cartons",
          packageQuantity: 100,
          perCartonQuantity: 10,
          partialCartonQuantity: 2,
        },
        {
          formName: "Form 2",
          numberOfSkids: 20,
          formNotes: "This is a test form note 2",
          packageType: "sheets",
          packageQuantity: 200,
        },
        {
          formName: "Form 3",
          numberOfSkids: 30,
          formNotes: "This is a test form note 3",
          packageType: "pieces",
          packageQuantity: 300,
        },
      ],
    });
  });

  it(".get(id)\t\t\t|\tGet a Shipment", async function () {
    const existingShipment = await shipmentServices.get(newShipment.id);
    assert.notEqual(existingShipment, null);
    assert.equal(existingShipment.docketNumber, 14000);
    assert.equal(existingShipment.quoteNumber, 185000);
    assert.equal(existingShipment.jobName, "Test 1");
    assert.equal(existingShipment.customerName, "Alt Die Cut Inc");
    assert.equal(existingShipment.customerPO, "PO 12345");
    assert.equal(existingShipment.additionalNotes, "This is a test note");
    assert.equal(existingShipment.shipmentForms.length, 3);
    assert.equal(existingShipment.shipmentForms[0].formName, "Form 1");
    assert.equal(existingShipment.shipmentForms[0].numberOfSkids, 10);
    assert.equal(
      existingShipment.shipmentForms[0].formNotes,
      "This is a test form note 1"
    );
    assert.equal(existingShipment.shipmentForms[0].packageType, "cartons");
    assert.equal(existingShipment.shipmentForms[0].packageQuantity, 100);
    assert.equal(existingShipment.shipmentForms[0].perCartonQuantity, 10);
    assert.equal(existingShipment.shipmentForms[0].partialCartonQuantity, 2);
    assert.equal(existingShipment.shipmentForms[1].formName, "Form 2");
    assert.equal(existingShipment.shipmentForms[1].numberOfSkids, 20);
    assert.equal(
      existingShipment.shipmentForms[1].formNotes,
      "This is a test form note 2"
    );
    assert.equal(existingShipment.shipmentForms[1].packageType, "sheets");
    assert.equal(existingShipment.shipmentForms[1].packageQuantity, 200);
    assert.equal(existingShipment.shipmentForms[2].formName, "Form 3");
    assert.equal(existingShipment.shipmentForms[2].numberOfSkids, 30);
    assert.equal(
      existingShipment.shipmentForms[2].formNotes,
      "This is a test form note 3"
    );
    assert.equal(existingShipment.shipmentForms[2].packageType, "pieces");
    assert.equal(existingShipment.shipmentForms[2].packageQuantity, 300);
  });

  it(".get()\t\t\t|\tGet all Shipments", async function () {
    const existingShipments = await shipmentServices.get();
    assert.notEqual(existingShipments.length, 0);
    assert.equal(existingShipments.length, 5);
  });

  it(".update(id, fields)\t|\tUpdate Shipment info", async function () {
    const updatedShipment = await shipmentServices.update(newShipment.id, {
      customerName: "Alternative Die Cut Inc",
      jobName: "Test 7",
      additionalNotes: "this is a test description",
    });
    assert.equal(updatedShipment.customerName, "Alternative Die Cut Inc");
    assert.equal(updatedShipment.jobName, "Test 7");
    assert.equal(updatedShipment.additionalNotes, "this is a test description");
  });
  it(".update(id, fields)\t|\tAdd shipmentForms", async function () {
    let shipmentForms = [
      {
        formName: "Form 2",
        numberOfSkids: 20,
        formNotes: "This is a test form note 2",
        packageType: "sheets",
        packageQuantity: 200,
      },
      {
        formName: "Form 3",
        numberOfSkids: 30,
        formNotes: "This is a test form note 3",
        packageType: "pieces",
        packageQuantity: 300,
      },
    ];
    const updatedShipment = await shipmentServices.update(newShipment.id, {
      shipmentForms: shipmentForms,
    });
    assert.equal(updatedShipment.shipmentForms.length, 2);
    updatedShipment.shipmentForms.forEach((shipmentForm, index) => {
      assert.equal(shipmentForm.formName, `Form ${index + 2}`);
      assert.equal(shipmentForm.numberOfSkids, 10 * (index + 2));
      assert.equal(shipmentForm.packageQuantity, 100 * (index + 2));
      assert.equal(
        shipmentForm.formNotes,
        `This is a test form note ${index + 2}`
      );
    });
  });

  it(".delete(id)\t\t|\tDelete a Shipment", async function () {
    const deletedShipment = await shipmentServices.delete(newShipment.id);
    assert.notEqual(deletedShipment, null);
  });
  it(".delete(id)\t\t|\tCheck deleted Shipment", async function () {
    const deletedShipment = await shipmentServices.delete(newShipment.id);
    assert.equal(deletedShipment, null);
  });
});
