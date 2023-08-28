/**
 * @fileoverview Shipment services
 * Global Shipment objet
 * @typedef {import("../models/ShipmentModel").Shipment} Shipment
 */

const ShipmentModel = require('../models/ShipmentModel');

const shipmentServices = {
  /**
   * @description Get all shipments or get shipment by id
   * @param {String} id
   * @returns {[Shipment] | Shipment}
   */
  async get(id) {
    if (id) {
      return ShipmentModel.findById(id).then(
        (shipment) => {
          if (!shipment) throw new Error('SHIPMENT_NOT_FOUND');
          return shipment;
        },
        (error) => {
          throw new Error('UNABLE_TO_GET_SHIPMENT', { cause: error });
        },
      );
    } else {
      return ShipmentModel.find({}).then(
        (shipments) => shipments,
        (error) => {
          throw new Error('UNABLE_TO_GET_SHIPMENTS', { cause: error });
        },
      );
    }
  },

  /**
   * @description Create shipment
   * @param {Shipment} shipment the object containing shipment fields
   * @returns {Shipment}
   */
  async create(shipment) {
    return ShipmentModel.create(shipment).then(
      (shipment) => shipment,
      (error) => {
        throw new Error('UNABLE_TO_CREATE_SHIPMENT', { cause: error });
      },
    );
  },

  /**
   * @description Update shipment
   * @param {String} id shipment number | _id
   * @param {Object} fields fields to update
   * @returns {Shipment} updated shipment
   */
  async update(id, fields) {
    return ShipmentModel.findByIdAndUpdate({ _id: id }, fields, {
      new: true,
    }).then(
      (shipment) => {
        if (!shipment) throw new Error('SHIPMENT_NOT_FOUND');
        return shipment;
      },
      (error) => {
        throw new Error('UNABLE_TO_UPDATE_SHIPMENT', { cause: error });
      },
    );
  },

  /**
   * @description Delete shipment
   * @param {String} id shipment number | _id
   * @returns {Shipment}
   */
  async delete(id) {
    return ShipmentModel.findByIdAndDelete({ _id: id }).then(
      (shipment) => {
        if (!shipment) throw new Error('SHIPMENT_NOT_FOUND');
        return shipment;
      },
      (error) => {
        throw new Error('UNABLE_TO_DELETE_SHIPMENT', { cause: error });
      },
    );
  },
};

module.exports = shipmentServices;
