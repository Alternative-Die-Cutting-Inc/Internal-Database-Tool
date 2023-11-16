/**
 * @fileoverview customer router
 * @baseURL /customers
 * Global Customer objet
 * @typedef {import("../models/CustomerModel").Customer} Customer
 */

const express = require('express');
const customerServices = require('../services/customerServices');
const emailServices = require('../services/emailServices');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @description get all customers
 * @route GET /customers
 * @returns {[Customer]} customer objects
 */
router.get('/', async (req, res, next) => {
  try {
    const allCustomers = await customerServices.get();
    res.status(200).send({ customers: allCustomers });
  } catch (error) {
    next(error);
  }
});

/**
 * @description get all customer names
 * @route GET /customers/names
 * @returns {[String]} customer names
 */
router.get('/names', async (req, res, next) => {
  try {
    const allCustomers = await customerServices.getNames();
    res.status(200).send({ customers: allCustomers });
  } catch (error) {
    next(error);
  }
});

/**
 * @description get one customer by id
 * @route GET /customers/:id
 * @returns {Customer} customer objects
 */
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const responseCustomer = await customerServices.get(id);
    res.status(200).send({ customer: responseCustomer });
  } catch (error) {
    next(error);
  }
});

/**
 * @description get all customer names
 * @route POST /customers
 * @returns {Customer} customer objects
 */
router.post('/', async (req, res, next) => {
  try {
    const newCustomer = req.body.customer;
    const responseCustomers = await customerServices.create(newCustomer);
    res.status(201).send({ customers: responseCustomers });
  } catch (error) {
    next(error);
  }
});

/**
 * @description edit customer
 * @route PUT /customers/:id
 * @returns {Customer} edited customer object
 */
router.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const fields = req.body.fields;
    const responseCustomer = await customerServices.update(id, fields);
    res.status(200).send(responseCustomer);
  } catch (error) {
    next(error);
  }
});

/**
 * @description delete customer
 * @route DELETE /customers/:id
 * @returns {Customer} deleted customer object
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const newCustomerList = await customerServices.delete(id);
    res.status(200).send({ customers: newCustomerList });
  } catch (error) {
    next(error);
  }
});

router.post('/email', upload.single('pdfFile'), async (req, res, next) => {
  const file = req.file;
  const emails = req.body.emails.split(',');
  const subject = req.body.subject;
  const body = req.body.body;
  try {
    if (!file) {
      throw new Error('NO_FILE');
    }
    if (!emails || emails.length === 0) {
      throw new Error('NO_EMAILS');
    }
    const response = await emailServices.sendRawEmail(
      body,
      ' ',
      subject,
      [{ content: file, type: 'non-static', contentDisposition: 'attachment' }],
      emails,
      'developer@alternativedc.com',
    );
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
