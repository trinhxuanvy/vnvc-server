const model = require('../models/Category');
const logger = require('../log/winston');

class VaccineController {
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
}

module.exports = new VaccineController();
