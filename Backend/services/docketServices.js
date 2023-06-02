/**
 * 
 */

const pool = require("../util/dbconfig");

const docketServices = {
  /** Get
   * @returns {Array()}
   */
  async get() {
    const sqlQuery = "SELECT * FROM `customers`";
    const [rows] = await pool.query(sqlQuery);
    return rows;
  },
};

module.exports = docketServices;
