const docketServices = require("../services/docketServices");
const assert = require("assert");

describe("Testing Docket Services", () => {
  let newDocket = null;
  it(".create()\t|\tCreate a Docket", async function () {
    newDocket = await docketServices.create({
      customerName: "Alt Die Cut Inc",
      jobName: "Test 0",
    });
  });

  it(".create()\t|\tAccurate Creation", async function () {
    newDocket = await docketServices.create({
      customerName: "Alt Die Cut Inc",
      jobName: "Test 1",
    });
    assert.equal(newDocket.customerName, "Alt Die Cut Inc");
    assert.equal(newDocket.jobName, "Test 1");
    assert.equal(newDocket.docketNumber, 2);
  });

  it(".create()\t|\tCreate multiple Dockets", async function () {
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

  it(".get(id)\t|\tGet a Docket", async function () {
    const existingDocket = await docketServices.get(newDocket.id);
    assert.notEqual(existingDocket, null);
  });

  it(".get()\t|\tGet all Dockets", async function () {
    const existingDockets = await docketServices.get();
    assert.notEqual(existingDockets.length, 0);
    assert.equal(existingDockets.length, 7);
  });
});
