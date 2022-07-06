const model = require('../models/VCCenter');
const logger = require('../log/winston');
const Redis = require('redis');

const resdisClient = Redis.createClient();
const DEFAULT_EXPIRATION = 3600;

class VCCenterController {
  async getAll(req, res, next) {
    try {
      const result = await model.find();
      res.send({ total: result.length, entities: result });
    } catch (error) {
      res.send({
        status: 500,
        message: { err: error },
      });
    }
  }
}

module.exports = new VCCenterController();
