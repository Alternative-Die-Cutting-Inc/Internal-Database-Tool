const customerServices = require('../../services/customerServices');
const assert = require('assert');

describe('Testing Customer Services', () => {
  let newCustomer = null;
  let customer = null;
  it('.create(customer)\t\t|\tCreate a Customer', async function () {
    customer = {
      name: 'Alt Die Cut Inc',
      contacts: [
        {
          type: 'phone',
          label: 'Office',
          info: '905-555-5555',
        },
        {
          type: 'email',
          label: 'Office',
          info: 'test@email.com',
        },
        {
          type: 'fax',
          label: 'Office',
          info: '905-555-5555',
        },
      ],
      address: {
        line1: '123 Test Street',
        line2: '',
        city: 'Toronto',
        province: 'Ontario',
        postalCode: 'M1M1M1',
        notes: 'This is a test address',
      },
      type: 'Customer',
    };
    newCustomer = await customerServices.create(customer);

    assert.equal(newCustomer.name, 'Alt Die Cut Inc');
    assert.equal(newCustomer.contacts.length, 3);
    assert.equal(newCustomer.contacts[0].type, 'phone');
    assert.equal(newCustomer.contacts[0].label, 'Office');
    assert.equal(newCustomer.contacts[0].info, '905-555-5555');
    assert.equal(newCustomer.contacts[1].type, 'email');
    assert.equal(newCustomer.contacts[1].label, 'Office');
    assert.equal(newCustomer.contacts[1].info, 'test@email.com');
    assert.equal(newCustomer.contacts[2].type, 'fax');
    assert.equal(newCustomer.contacts[2].label, 'Office');
    assert.equal(newCustomer.contacts[2].info, '905-555-5555');
    assert.equal(newCustomer.address.line1, '123 Test Street');
    assert.equal(newCustomer.address.line2, '');
    assert.equal(newCustomer.address.city, 'Toronto');
    assert.equal(newCustomer.address.province, 'Ontario');
    assert.equal(newCustomer.address.postalCode, 'M1M1M1');
    assert.equal(newCustomer.address.notes, 'This is a test address');
    assert.equal(newCustomer.type, 'customer');
  });

  it('.create(customer)\t\t|\tCreate multiple Customers', async function () {
    customer.name = 'Alt Die Cut Inc 2';
    await customerServices.create(customer);
    customer.name = 'Alt Die Cut Inc 3';
    await customerServices.create(customer);
    customer.name = 'Alt Die Cut Inc 4';
    await customerServices.create(customer);
  });

  it('create(customer)\t\t|\tCreate a Customer (DUPLICATE_NAME)', async function () {
    await assert.rejects(customerServices.create(customer), {
      name: 'Error',
      message: 'UNABLE_TO_CREATE_CUSTOMER',
    });
  });

  it('.get()\t\t\t|\tGet all Customers', async function () {
    const existingCustomers = await customerServices.get();
    assert.notEqual(existingCustomers.length, 0);
    assert.equal(existingCustomers.length, 4);
  });

  it('.get(id)\t\t\t|\tGet a Customer', async function () {
    const existingCustomer = await customerServices.get(newCustomer.id);
    assert.notEqual(existingCustomer, null);
  });

  it('.get(id)\t\t\t|\tGet a Customer (INVALID ID)', async function () {
    await assert.rejects(customerServices.get('123'), {
      name: 'Error',
      message: 'UNABLE_TO_GET_CUSTOMER',
    });
  });

  it('.get(id)\t\t\t|\tGet a Customer (NONEXISTENT ID)', async function () {
    await assert.rejects(customerServices.get('64bfe2a0601e3756e7a96a82'), {
      name: 'Error',
      message: 'CUSTOMER_NOT_FOUND',
    });
  });

  it('.getNames()\t\t|\tGet all Customer names', async function () {
    const existingCustomerNames = await customerServices.getNames();
    assert.notEqual(existingCustomerNames.length, 0);
    assert.equal(existingCustomerNames.length, 4);
    assert.equal(existingCustomerNames[0].label, 'Alt Die Cut Inc');
  });

  it('.update(id, fields)\t|\tUpdate a Customer', async function () {
    customer.contacts[1].info = 'test@test.com';
    const updatedCustomer = await customerServices.update(newCustomer.id, {
      name: 'Alt Die Cut Inc 1',
      contacts: customer.contacts,
    });
    assert.equal(updatedCustomer.name, 'Alt Die Cut Inc 1');
    assert.equal(updatedCustomer.contacts.length, 3);
    assert.equal(updatedCustomer.contacts[1].info, 'test@test.com');
  });

  it('.update(id, fields)\t|\tAdd a contact', async function () {
    customer.contacts.push({
      type: 'phone',
      label: 'Home',
      info: '905-555-5555',
    });
    const updatedCustomer = await customerServices.update(newCustomer.id, {
      name: 'Alt Die Cut Inc 1',
      contacts: customer.contacts,
    });
    assert.equal(updatedCustomer.name, 'Alt Die Cut Inc 1');
    assert.equal(updatedCustomer.contacts.length, 4);
    assert.equal(updatedCustomer.contacts[3].info, '905-555-5555');
  });

  it('.update(id, fields)\t|\tUpdate a Customer (INVALID ID)', async function () {
    await assert.rejects(
      customerServices.update('', {
        name: 'Alt Die Cut Inc 1',
        contacts: customer.contacts,
      }),
      {
        name: 'Error',
        message: 'UNABLE_TO_UPDATE_CUSTOMER',
      },
    );
  });

  it('.update(id, fields)\t|\tUpdate a Customer (NONEXISTENT ID)', async function () {
    await assert.rejects(customerServices.update('64bfe2a0601e3756e7a96a82', {}), {
      name: 'Error',
      message: 'CUSTOMER_NOT_FOUND',
    });
  });

  it('.update(id, fields)\t|\tUpdate a Customer (DUPLICATE NAME)', async function () {
    await assert.rejects(
      customerServices.update(newCustomer.id, {
        name: 'Alt Die Cut Inc 2',
        contacts: customer.contacts,
      }),
      {
        name: 'Error',
        message: 'UNABLE_TO_UPDATE_CUSTOMER',
      },
    );
  });

  it('.delete(id)\t\t\t|\tDelete a Customer', async function () {
    const deletedCustomer = await customerServices.delete(newCustomer.id);
    assert.equal(deletedCustomer.name, 'Alt Die Cut Inc 1');
  });

  it('.delete(id)\t\t\t|\tDelete a Customer (INVALID ID)', async function () {
    await assert.rejects(customerServices.delete(''), {
      name: 'Error',
      message: 'UNABLE_TO_DELETE_CUSTOMER',
    });
  });

  it('.delete(id)\t\t\t|\tDelete a Customer (NONEXISTENT ID)', async function () {
    await assert.rejects(customerServices.delete('64bfe2a0601e3756e7a96a82'), {
      name: 'Error',
      message: 'CUSTOMER_NOT_FOUND',
    });
  });
});
