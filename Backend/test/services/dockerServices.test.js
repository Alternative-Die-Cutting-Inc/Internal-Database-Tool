const docketServices = require("../../services/docketServices");
const assert = require("assert");

describe("Testing Docket Services", () => {
  it(".initCounter()\t\t|\tInitialize Counter", async function () {
    await docketServices.initCounter();
  });

  let newDocket = null;
  it(".create()\t\t\t|\tCreate a Docket", async function () {
    newDocket = await docketServices.create({
      customerName: "Alt Die Cut Inc",
      jobName: "Test 0",
    });
  });

  it(".create()\t\t\t|\tAccurate Creation", async function () {
    newDocket = await docketServices.create({
      customerName: "Alt Die Cut Inc",
      jobName: "Test 1",
    });
    assert.equal(newDocket.customerName, "Alt Die Cut Inc");
    assert.equal(newDocket.jobName, "Test 1");
    assert.equal(newDocket.docketNumber, 45002);
  });

  it(".create()\t\t\t|\tCreate multiple Dockets", async function () {
    await docketServices.create({
      customerName: "Alt Die Cut Inc",
      jobName: "Test 2",
    });
    await docketServices.create({
      customerName: "Alt Die Cut Inc",
      jobName: "Test 3",
    });
    await docketServices.create({
      customerName: "Alt Die Cut Inc",
      jobName: "Test 4",
    });
    await docketServices.create({
      customerName: "Alt Die Cut Inc",
      jobName: "Test 5",
    });
    await docketServices.create({
      customerName: "Alt Die Cut Inc",
      jobName: "Test 6",
    });
  });

  it(".get(id)\t\t\t|\tGet a Docket", async function () {
    const existingDocket = await docketServices.get(newDocket.id);
    assert.notEqual(existingDocket, null);
  });

  it(".get()\t\t\t|\tGet all Dockets", async function () {
    const existingDockets = await docketServices.get();
    assert.notEqual(existingDockets.length, 0);
    assert.equal(existingDockets.length, 7);
  });

  it(".update(id, fields)\t|\tUpdate Docket info", async function () {
    const updatedDocket = await docketServices.update(newDocket.id, {
      customerName: "Alternative Die Cut Inc",
      jobName: "Test 7",
      customerPO: 123456,
    });
    assert.equal(updatedDocket.customerName, "Alternative Die Cut Inc");
    assert.equal(updatedDocket.jobName, "Test 7");
    assert.equal(updatedDocket.customerPO, 123456);
  });
  it(".update(id, fields)\t|\tAdd forms", async function () {
    let forms = [
      {
        formName: "Form 1",
        formQuantity: 123,
        quantityShipped: 123,
      },
      {
        formName: "Form 2",
        formQuantity: 246,
        quantityShipped: 123,
      },
      {
        formName: "Form 3",
        formQuantity: 369,
        quantityShipped: 123,
      },
    ];
    const updatedDocket = await docketServices.update(newDocket.id, {
      forms,
    });
    assert.equal(updatedDocket.forms.length, 3);
    updatedDocket.forms.forEach((form, index) => {
      assert.equal(form.formName, `Form ${index + 1}`);
      assert.equal(form.formQuantity, 123 * (index + 1));
      assert.equal(form.quantityShipped, 123);
    });
  });

  it(".delete(id)\t\t|\tDelete a Docket", async function () {
    const deletedDocket = await docketServices.delete(newDocket.id);
    assert.notEqual(deletedDocket, null);
  });
  it(".delete(id)\t\t|\tCheck deleted Docket", async function () {
    const deletedDocket = await docketServices.delete(newDocket.id);
    assert.equal(deletedDocket, null);
  });
});
