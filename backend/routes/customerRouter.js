/**
 * @fileoverview customer router
 * @baseURL /customers
 * Global Customer objet
 * @typedef {import("../models/CustomerModel").Customer} Customer
 */

const express = require('express');
const customerServices = require('../services/customerServices');

const router = express.Router();

/**
 * @description get all customers
 * @route GET /customers
 * @returns {[Customer]} customer objects
 */
router.get('/', async (req, res, next) => {
  try {
    const allCustomers = await customerServices.get();
    res.status(200).send(allCustomers);
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
    const allCustomers = await customerServices.get(id);
    res.status(200).send(allCustomers);
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
    res.status(200).send(allCustomers);
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
    const responseCustomer = await customerServices.create(newCustomer);
    res.status(201).send(responseCustomer);
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
    const responseCustomer = await customerServices.delete(id);
    res.status(200).send(responseCustomer);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
