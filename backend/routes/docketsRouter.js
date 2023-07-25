/**
 * @fileoverview docket router
 * @baseURL /dockets
 * Global Docket objet
 * @typedef {import("../models/DocketModel").Docket} Docket
 */
const express = require('express');
const docketServices = require('../services/docketServices');

const router = express.Router();

/**
 * @description get all dockets
 * @route GET /dockets
 * @returns {[Docket] | Docket} docket objects
 */
router.get('/', async (req, res, next) => {
  try {
    const allDockets = await docketServices.get();
    res.status(200).send({ dockets: allDockets });
  } catch (error) {
    next(error);
  }
});

/**
 * @description get docket by id
 * @route GET /dockets/:id
 * @returns {Docket} docket object
 */
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const responseDocket = await docketServices.get(id);
    res.status(200).send({ docket: responseDocket });
  } catch (error) {
    next(error);
  }
});

/**
 * @description create docket
 * @route POST /dockets
 * @returns {Docket} docket object
 */
router.post('/', async (req, res, next) => {
  try {
    const newDocket = req.body.docket;
    const responseDocket = await docketServices.create(newDocket);
    res.status(201).send(responseDocket);
  } catch (error) {
    next(error);
  }
});

/**
 * @description edit docket
 * @route PUT /dockets/:id
 * @returns {Docket} edited docket object
 */
router.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const editFields = req.body.fields;
    const responseDocket = await docketServices.update(id, editFields);
    res.status(200).send(responseDocket);
  } catch (error) {
    next(error);
  }
});

/**
 * @description delete docket
 * @route DELETE /dockets/:id
 * @returns {Docket} deleted docket object
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const responseDocket = await docketServices.delete(id);
    res.status(200).send(responseDocket);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
