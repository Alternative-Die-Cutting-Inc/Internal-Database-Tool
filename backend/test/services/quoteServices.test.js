const CustomerModel = require('../../models/CustomerModel');
const { RatesModel } = require('../../models/QuoteModel');
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

  it('.create()\t\t\t|\tCreate a Quote (invalid quote)', async function () {
    await assert.rejects(
      quoteServices.create({
        jobName: 'Test 0',
      }),
      {
        name: 'Error',
        message: 'UNABLE_TO_CREATE_QUOTE',
      },
    );
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

  it('.update(id, fields)\t|\tUpdate Quote info (nonexistent quote)', async function () {
    await assert.rejects(
      quoteServices.update('64ac92df39cfc4b83dba7d62', {
        customer: { name: 'Alternative Die Cut Inc', customerID: '123123' },
        jobName: 'Test 7',
        description: 'this is a test description',
      }),
      {
        name: 'Error',
        message: 'QUOTE_NOT_FOUND',
      },
    );
  });

  it('.update(id, fields)\t|\tUpdate Quote info (invalid quote)', async function () {
    await assert.rejects(
      quoteServices.update('testing', {
        customer: { name: 'Alternative Die Cut Inc', customerID: '123123' },
        jobName: 'Test 7',
        description: 'this is a test description',
      }),
      {
        name: 'Error',
        message: 'UNABLE_TO_UPDATE_QUOTE',
      },
    );
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

  it('.addJob()\t\t\t|\tAdd a Quote Job', async function () {
    const customer = await CustomerModel.create({
      name: 'Alt Die Cut Inc',
      type: 'customer',
    });
    newQuote = await quoteServices.create({
      customer: { name: 'Alt Die Cut Inc', customerID: customer._id },
      jobName: 'Test 8',
    });
    newQuote = await quoteServices.addJob(newQuote._id, {
      units: 1000,
      perSheet: 32,
      dieHours: 123,
      clientNotes: 'This is a test note',
    });
    assert.equal(newQuote.quoteJobs[0].clientNotes, 'This is a test note');
    assert.equal(newQuote.quoteJobs[0].dieHours, 123);
    assert.equal(newQuote.quoteJobs[0].units, 1000);
    assert.equal(newQuote.quoteJobs[0].perSheet, 32);
  });

  it('.addJob()\t\t\t|\tAdd a Quote Job (QUOTE_NOT_FOUND)', async function () {
    await assert.rejects(
      quoteServices.addJob('newQuote._id', {
        units: 1000,
        perSheet: 32,
        dieHours: 123,
        clientNotes: 'This is a test note',
      }),
      {
        name: 'Error',
        message: 'QUOTE_NOT_FOUND',
      },
    );
  });

  it('.addJob()\t\t\t|\tAdd a Quote Job (UNABLE_TO_UPDATE_QUOTE)', async function () {
    await assert.rejects(
      quoteServices.addJob(' ', {
        units: 1000,
        perSheet: 32,
        dieHours: 123,
        clientNotes: 'This is a test note',
      }),
      {
        name: 'Error',
        message: 'UNABLE_TO_GET_QUOTE',
      },
    );
  });

  it('.updateJob()\t\t|\tUpdate a Quote Job', async function () {
    const updatedQuote = await quoteServices.updateJob(newQuote._id, newQuote.quoteJobs[0]._id, {
      units: 2000,
      perSheet: 64,
      dieHours: 456,
      clientNotes: 'This is a test note',
    });
    assert.equal(updatedQuote.quoteJobs[0].clientNotes, 'This is a test note');
    assert.equal(updatedQuote.quoteJobs[0].dieHours, 456);
    assert.equal(updatedQuote.quoteJobs[0].units, 2000);
    assert.equal(updatedQuote.quoteJobs[0].perSheet, 64);
  });

  it('.updateJob()\t\t|\tUpdate a Quote Job (QUOTE_NOT_FOUND)', async function () {
    await assert.rejects(
      quoteServices.updateJob('newQuote._id', newQuote.quoteJobs[0]._id, {
        units: 2000,
        perSheet: 64,
        dieHours: 456,
        clientNotes: 'This is a test note',
      }),
      {
        name: 'Error',
        message: 'QUOTE_NOT_FOUND',
      },
    );
  });

  it('.updateJob()\t\t|\tUpdate a Quote Job (UNABLE_TO_GET_QUOTE)', async function () {
    await assert.rejects(
      quoteServices.updateJob(' ', newQuote.quoteJobs[0]._id, {
        units: 2000,
        perSheet: 64,
        dieHours: 456,
        clientNotes: 'This is a test note',
      }),
      {
        name: 'Error',
        message: 'UNABLE_TO_GET_QUOTE',
      },
    );
  });

  it('.updateJob()\t\t|\tUpdate a Quote Job (JOB_NOT_FOUND)', async function () {
    await assert.rejects(
      quoteServices.updateJob(newQuote._id, 'newQuote.quoteJobs[0]._id', {
        units: 2000,
        perSheet: 64,
        dieHours: 456,
        clientNotes: 'This is a test note',
      }),
      {
        name: 'Error',
        message: 'JOB_NOT_FOUND',
      },
    );
  });

  it('.delete(id)\t\t|\tDelete a Quote', async function () {
    const deletedQuote = await quoteServices.delete(newQuote.id);
    assert.notEqual(deletedQuote, null);
  });

  it('.delete(id)\t\t|\tDelete a Quote (deleted quote)', async function () {
    await assert.rejects(quoteServices.delete(newQuote.id), {
      name: 'Error',
      message: 'QUOTE_NOT_FOUND',
    });
  });

  it('.getFromNum()\t\t\t|\tGet Quote from number', async function () {
    newQuote = await quoteServices.create({
      customer: { name: 'Alt Die Cut Inc', customerID: '123123' },
      jobName: 'Test 8',
    });
    const quote = await quoteServices.getFromNum(newQuote.quoteNumber);
    assert.equal(quote.quoteNumber, newQuote.quoteNumber);
  });

  it('.getFromNum()\t\t\t|\tGet quote from number (nonexistent number)', async function () {
    await assert.rejects(quoteServices.getFromNum(1234565), {
      name: 'Error',
      message: 'QUOTE_NOT_FOUND',
    });
  });

  it('.updateRates(rates)\t\t|\tUpdate rates', async function () {
    const rates = await quoteServices.updateRates({
      global: 2,
    });
    assert.equal(rates.global, 2);
  });

  it('.updateRates(rates)\t\t|\tUpdate rates', async function () {
    await RatesModel.collection.drop();
    await assert.rejects(
      quoteServices.updateRates({
        global: 2,
      }),
      {
        name: 'Error',
        message: 'RATES_NOT_FOUND',
      },
    );
  });
});
