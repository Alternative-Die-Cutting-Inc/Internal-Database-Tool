const pool = require("../util/dbconfig");

const shippingServices = {
  /** Get
   * @returns {Array()}
   */
  async get() {
    const sqlQuery = "SELECT * FROM `customers`";
    const rows = await pool.query(sqlQuery);
    return rows;
  },
};

module.exports = shippingServices;
