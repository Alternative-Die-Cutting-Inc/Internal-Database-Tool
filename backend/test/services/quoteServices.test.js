const quoteServices = require('../../services/quoteServices');
const assert = require('assert');

describe('Testing Quote Services', () => {
  it('.initCounter()\t\t|\tInitialize Counter', async function () {
    await quoteServices.initCounter();
  });

  let newQuote = null;
  it('.create()\t\t\t|\tCreate a Quote', async function () {
    newQuote = await quoteServices.create({
      customer: { name: 'Alt Die Cut Inc', customerID: '123123' },
      jobName: 'Test 0',
    });
  });

  it('.create()\t\t\t|\tAccurate Creation', async function () {
    newQuote = await quoteServices.create({
      customer: { name: 'Alt Die Cut Inc', customerID: '123123' },
      jobName: 'Test 1',
    });
    assert.equal(newQuote.customer.name, 'Alt Die Cut Inc');
    assert.equal(newQuote.jobName, 'Test 1');
    assert.equal(newQuote.quoteNumber, 185002);
  });

  it('.create()\t\t\t|\tCreate multiple Quotes', async function () {
    await quoteServices.create({
      customer: { name: 'Alt Die Cut Inc', customerID: '123123' },
      jobName: 'Test 2',
    });
    await quoteServices.create({
      customer: { name: 'Alt Die Cut Inc', customerID: '123123' },
      jobName: 'Test 3',
    });
    await quoteServices.create({
      customer: { name: 'Alt Die Cut Inc', customerID: '123123' },
      jobName: 'Test 4',
    });
    await quoteServices.create({
      customer: { name: 'Alt Die Cut Inc', customerID: '123123' },
      jobName: 'Test 5',
    });
    await quoteServices.create({
      customer: { name: 'Alt Die Cut Inc', customerID: '123123' },
      jobName: 'Test 6',
    });
  });

  it('.get(id)\t\t\t|\tGet a Quote', async function () {
    const existingQuote = await quoteServices.get(newQuote.id);
    assert.notEqual(existingQuote, null);
  });

  it('.get(id)\t\t\t|\tGet a Quote (nonexistent ID)', async function () {
    await assert.rejects(quoteServices.get('64ac92df39cfc4b83dba7d62'), {
      name: 'Error',
      message: 'QUOTE_NOT_FOUND',
    });
  });

  it('.get(id)\t\t\t|\tGet a Quote (invalid ID)', async function () {
    await assert.rejects(quoteServices.get(' '), {
      name: 'Error',
      message: 'UNABLE_TO_GET_QUOTE',
    });
  });

  it('.get()\t\t\t|\tGet all Quotes', async function () {
    const existingQuotes = await quoteServices.get();
    assert.notEqual(existingQuotes.length, 0);
    assert.equal(existingQuotes.length, 7);
  });

  it('.update(id, fields)\t|\tUpdate Quote info', async function () {
    const updatedQuote = await quoteServices.update(newQuote.id, {
      customer: { name: 'Alternative Die Cut Inc', customerID: '123123' },
      jobName: 'Test 7',
      description: 'this is a test description',
    });
    assert.equal(updatedQuote.customer.name, 'Alternative Die Cut Inc');
    assert.equal(updatedQuote.jobName, 'Test 7');
    assert.equal(updatedQuote.description, 'this is a test description');
  });
  it('.update(id, fields)\t|\tAdd jobs', async function () {
    let quoteJobs = [
      {
        units: 10000,
        dieHours: 123,
        perSheet: 32,
        clientNotes: 'This is a test note 1',
      },
      {
        units: 11000,
        dieHours: 246,
        perSheet: 16,
        clientNotes: 'This is a test note 2',
      },
      {
        units: 12000,
        dieHours: 369,
        perSheet: 8,
        clientNotes: 'This is a test note 3',
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

  it('.delete(id)\t\t|\tDelete a Quote', async function () {
    const deletedQuote = await quoteServices.delete(newQuote.id);
    assert.notEqual(deletedQuote, null);
  });
  it('.delete(id)\t\t|\tCheck deleted Quote', async function () {
    const deletedQuote = await quoteServices.delete(newQuote.id);
    assert.equal(deletedQuote, null);
  });

  it('.getRates()\t\t\t|\tGet rates (no rates)', async function () {
    await assert.rejects(quoteServices.getRates(), {
      name: 'Error',
      message: 'RATES_NOT_FOUND',
    });
  });

  it('.initRates()\t\t\t|\tInitialize rates', async function () {
    const rates = await quoteServices.initRates();
    assert.equal(rates, true);
  });

  it('.getRates()\t\t\t|\tGet all Quotes', async function () {
    const rates = await quoteServices.getRates();
    assert.equal(rates.global, 1);
  });

  it('.initRates()\t\t\t|\tInitialize rates', async function () {
    const rates = await quoteServices.initRates();
    assert.equal(rates, false);
  });
});
