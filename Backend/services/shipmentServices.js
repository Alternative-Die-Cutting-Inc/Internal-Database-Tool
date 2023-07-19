/**
 * @fileoverview Shipment services
 * Global Shipment objet
 * @typedef {import("../models/ShipmentModel").Shipment} Shipment
 */

const ShipmentModel = require("../models/ShipmentModel");

const shipmentServices = {
  /**
   * @description Get all shipments or get shipment by id
   * @param {String} id
   * @returns {[Shipment] | Shipment}
   */
  async get(id) {
    let responseShipment = null;
    if (id) {
      responseShipment = ShipmentModel.findById(id).then(
        (shipment) => shipment,
        (error) => {
          throw error;
        }
      );
    } else {
      responseShipment = ShipmentModel.find({}).then(
        (shipments) => shipments,
        (error) => {
          throw error;
        }
      );
    }
    return responseShipment;
  },

  /**
   * @description Create shipment
   * @param {Shipment} shipment the object containing shipment fields
   * @returns {Shipment}
   */
  async create(shipment) {
    let responseShipment = null;
    responseShipment = ShipmentModel.create(shipment).then(
      (shipment) => shipment,
      (error) => {
        throw error;
      }
    );
    return responseShipment;
  },

  /**
   * @description Update shipment
   * @param {String} id shipment number | _id
   * @param {Object} fields fields to update
   * @returns {Shipment} updated shipment
   */
  async update(id, fields) {
    let responseShipment = null;
    responseShipment = ShipmentModel.findOneAndUpdate({ _id: id }, fields, {
      new: true,
    }).then(
      (shipment) => shipment,
      (error) => {
        throw error;
      }
    );
    return responseShipment;
  },

  /**
   * @description Delete shipment
   * @param {String} id shipment number | _id
   * @returns {Shipment}
   */
  async delete(id) {
    let responseShipment = null;
    responseShipment = ShipmentModel.findOneAndDelete({ _id: id }).then(
      (shipment) => shipment,
      (error) => {
        throw error;
      }
    );
    return responseShipment;
  },
};

module.exports = shipmentServices;
