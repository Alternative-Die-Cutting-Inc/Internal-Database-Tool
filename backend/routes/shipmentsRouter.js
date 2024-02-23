/**
 * @fileoverview shipments router
 * @baseURL /shipments
 * Global Shipment object
 * @typedef {import("../models/ShipmentModel").Shipment} Shipment
 */
const express = require('express');
const shipmentServices = require('../services/shipmentServices');

const router = express.Router();

/**
 * @description get all shipments
 * @route GET /shipments
 * @returns {[Shipment] | Shipment} shipment objects
 */
router.get('/', async (req, res, next) => {
  try {
    const allShipments = await shipmentServices.get();
    if (allShipments.length === 0) {
      res.status(404).send({ message: 'No shipments found' });
    } else {
      res.status(200).send(allShipments);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @description get shipment by id
 * @route GET /shipments/:id
 * @returns {Shipment} shipment object
 */
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const responseShipment = await shipmentServices.get(id);
    if (!responseShipment) {
      res.status(404).send({ message: 'No shipment found' });
    } else {
      res.status(200).send(responseShipment);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @description get shipments for a docket
 * @route GET /shipments/docket/:docketNumber
 * @returns {[Shipment]} array of shipments
 */
router.get('/docket/:docketNumber', async (req, res, next) => {
  try {
    const docketNumber = req.params.docketNumber;
    const responseShipments = await shipmentServices.getDocketShipments(docketNumber);
    if (!responseShipments) {
      res.status(404).send({ message: 'No shipments found' });
    } else {
      res.status(200).send(responseShipments);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @description create shipment
 * @route POST /shipments
 * @returns {Shipment} shipment object
 */
router.post('/', async (req, res, next) => {
  try {
    const newShipment = req.body.shipment;
    const responseShipment = await shipmentServices.create(newShipment);
    res.status(201).send({ shipment: responseShipment });
  } catch (error) {
    next(error);
  }
});

/**
 * @description edit shipment
 * @route PUT /shipments/:id
 * @returns {Shipment} edited shipment object
 */
router.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const editFields = req.body.fields;
    const shipment = await shipmentServices.update(id, editFields);
    res.status(200).send(shipment);
  } catch (error) {
    next(error);
  }
});

/**
 * @description delete shipment
 * @route DELETE /shipments/:id
 * @returns {Shipment} deleted shipment object
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const responseShipment = await shipmentServices.delete(id);
    if (!responseShipment) {
      res.status(404).send({ message: 'No shipment found' });
    } else {
      res.status(200).send(responseShipment);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
