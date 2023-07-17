const quoteServices = require("../services/quoteServices");
const assert = require("assert");

describe("Testing Quote Services", () => {
  it(".initCounter()\t\t|\tInitialize Counter", async function () {
    await quoteServices.initCounter();
  });

  let newQuote = null;
  it(".create()\t\t\t|\tCreate a Quote", async function () {
    newQuote = await quoteServices.create({
      customerName: "Alt Die Cut Inc",
      jobName: "Test 0",
    });
  });

  it(".create()\t\t\t|\tAccurate Creation", async function () {
    newQuote = await quoteServices.create({
      customerName: "Alt Die Cut Inc",
      jobName: "Test 1",
    });
    assert.equal(newQuote.customerName, "Alt Die Cut Inc");
    assert.equal(newQuote.jobName, "Test 1");
    assert.equal(newQuote.quoteNumber, 185002);
  });

  it(".create()\t\t\t|\tCreate multiple Quotes", async function () {
    await quoteServices.create({
      customerName: "Alt Die Cut Inc",
      jobName: "Test 2",
    });
    await quoteServices.create({
      customerName: "Alt Die Cut Inc",
      jobName: "Test 3",
    });
    await quoteServices.create({
      customerName: "Alt Die Cut Inc",
      jobName: "Test 4",
    });
    await quoteServices.create({
      customerName: "Alt Die Cut Inc",
      jobName: "Test 5",
    });
    await quoteServices.create({
      customerName: "Alt Die Cut Inc",
      jobName: "Test 6",
    });
  });

  it(".get(id)\t\t\t|\tGet a Quote", async function () {
    const existingQuote = await quoteServices.get(newQuote.id);
    assert.notEqual(existingQuote, null);
  });

  it(".get()\t\t\t|\tGet all Quotes", async function () {
    const existingQuotes = await quoteServices.get();
    assert.notEqual(existingQuotes.length, 0);
    assert.equal(existingQuotes.length, 7);
  });

  it(".update(id, fields)\t|\tUpdate Quote info", async function () {
    const updatedQuote = await quoteServices.update(newQuote.id, {
      customerName: "Alternative Die Cut Inc",
      jobName: "Test 7",
      description: "this is a test description",
    });
    assert.equal(updatedQuote.customerName, "Alternative Die Cut Inc");
    assert.equal(updatedQuote.jobName, "Test 7");
    assert.equal(updatedQuote.description, "this is a test description");
  });
  it(".update(id, fields)\t|\tAdd jobs", async function () {
    let quoteJobs = [
      {
        units: 10000,
        dieHours: 123,
        perSheet: 32,
        clientNotes: "This is a test note 1",
      },
      {
        units: 11000,
        dieHours: 246,
        perSheet: 16,
        clientNotes: "This is a test note 2",
      },
      {
        units: 12000,
        dieHours: 369,
        perSheet: 8,
        clientNotes: "This is a test note 3",
      },
    ];
    const updatedQuote = await quoteServices.update(newQuote.id, {
      quoteJobs,
    });
    assert.equal(updatedQuote.quoteJobs.length, 3);
    updatedQuote.quoteJobs.forEach((quoteJob, index) => {
      assert.equal(quoteJob.clientNotes, `This is a test note ${index + 1}`);
      assert.equal(quoteJob.dieHours, 123 * (index + 1));
      assert.equal(quoteJob.units, 10000 + 1000 * index);
      assert.equal(quoteJob.perSheet, 32 / Math.pow(2, index));
    });
  });

  it(".delete(id)\t\t|\tDelete a Quote", async function () {
    const deletedQuote = await quoteServices.delete(newQuote.id);
    assert.notEqual(deletedQuote, null);
  });
  it(".delete(id)\t\t|\tCheck deleted Quote", async function () {
    const deletedQuote = await quoteServices.delete(newQuote.id);
    assert.equal(deletedQuote, null);
  });
});
