const oldData = require('../alterna_area51.json');
const CustomerModel = require('../models/CustomerModel');
const DocketModel = require('../models/DocketModel');
const { CounterModel } = require('../models/CounterModel');
const { QuoteModel, RatesModel } = require('../models/QuoteModel');
const ShipmentModel = require('../models/ShipmentModel');
const UserModel = require('../models/UserModel');

const loadData = () => {
  const tables = oldData.filter((item) => {
    return item.type == 'table';
  });
  const dockets = tables.filter((table) => {
    return table.name == 'Production';
  })[0];
  const forms = tables.filter((table) => {
    return table.name == 'Forms';
  })[0];

  dockets.data.map(async (data) => {
    try {
      await DocketModel.create({
        docketNumber: data.DocketNumber,
        quoteNumber: data?.QuoteNumber,
        customer: {
          name: data?.Customer,
          customerID: data?.Customer,
        },
        customerPO: data?.CustomerPoNo,
        productionPerson: data?.ProductionPerson,
        jobName: data?.JobName || 'old job',
        soldFor: data?.FinalPrice,
        finishing:
          data?.Finishing?.split(' ').map((finish) => ({
            value: finish || ' ',
            label: finish || ' ',
          })) || [],
        status:
          data?.CloseDate == '0000-00-00 00:00:00'
            ? [{ value: 'Old', label: 'Old' }]
            : [
                { value: 'Closed', label: 'Closed' },
                { value: 'Old', label: 'Old' },
              ],
        specialInstructions: data?.SpecialInstructions,
        requoteMemo: data?.RequoteMemo,
        creationDate: new Date(data?.Date),
        numOfUnits: data?.Quantity,
        closeDate: data?.CloseDate == '0000-00-00 00:00:00' ? null : new Date(data?.CloseDate),
        bill: data?.Checkbox ? true : false,
      });
    } catch (error) {
      console.log(error.errors);
    }
  });
};

module.exports = loadData;
