const model = require('../models/Customer');
const logger = require('../log/winston');

class CustomerController {
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
      const result = await model.find({ code: req.params?.code });
      if (result == null || result.length == 0) {
        res.send({
          status: 404,
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
  async getById(req, res, next) {
    try {
      const result = await model.find({ code: req.params?.id });
      if (result == null || result.length == 0) {
        res.send({
          status: 404,
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

module.exports = new CustomerController();
