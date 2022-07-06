const model = require('../models/Injector');
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
      const result = await model.find({ code: req.params?.code });
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
