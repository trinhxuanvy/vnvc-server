const model = require('../models/Injector');
const Customer = require('../models/Customer');
const logger = require('../log/winston');

class InjectorController {
  async simpleCreate(req, res, next) {
    try {
      const result = await model.create(req.body);
      res.send(result);
    } catch (error) {
      res.send({
        status: 500,
        message: { err: error },
      });
    }
  }
  async getByCode(req, res, next) {
    try {
      const code = req.query?.code;
      const relationship = req.query?.relationship;

      if (
        code == null ||
        code == '' ||
        relationship == null ||
        relationship == ''
      ) {
        res.send({
          status: 200,
          message: 'code & relationship is require!',
        });
        return;
      }

      const cus = await Customer.find({
        code: code,
        relationship: relationship,
      });
      if (cus == null || cus.length == 0) {
        res.send({
          status: 200,
          message: 'Entity not found!',
        });

        return;
      }

      const cusFind = cus[0];

      const result = await model.find({ customerId: cusFind._id });
      if (result == null || result.length == 0) {
        res.send({
          status: 404,
          message: 'Entity not found!',
        });

        return;
      } else {
        res.send(result[0]);

        return;
      }
    } catch (error) {
      console.log(error);
      res.send({
        status: 500,
        message: { err: error },
      });
    }
  }
  async getByCustomerId(req, res, next) {
    try {
      const result = await model.find({ customerId: req.params?.id });
      if (result == null || result.length == 0) {
        res.send({
          status: 200,
          message: 'Entity not found!',
        });
      } else {
        res.send(result[0]);
      }
    } catch (error) {
      console.log(error);
      res.send({
        status: 500,
        message: { err: error },
      });
    }
  }
}

module.exports = new InjectorController();
