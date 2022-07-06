const model = require('../models/VCSignup');
const Vaccine = require('../models/Vaccine');
const Injector = require('../models/Injector');
const VCCenter = require('../models/VCCenter');
const logger = require('../log/winston');
const Redis = require('redis');

const resdisClient = Redis.createClient();
const DEFAULT_EXPIRATION = 3600;

class VCSignupController {
  async create(req, res, next) {
    try {
      if (
        req.body?.listVaccine == null ||
        req.body?.listVaccine.length == 0 ||
        req.body?.injectorId == null ||
        req.body?.vcCenterId == null
      ) {
        res.send({ status: 400, message: 'Vaccine is not null!' });
        return;
      } else {
        const inj = await Injector.findById(req.body?.injectorId);
        const center = await VCCenter.findById(req.body?.vcCenterId);

        if (inj == null || center == null) {
          res.send({ status: 404, message: 'Resource not found!' });
          return;
        }

        let listVaccine = [];
        let totalPrice = 0;
        for (let i = 0; i < req.body?.listVaccine.length; i++) {
          const vac = await Vaccine.findById(
            req.body?.listVaccine[i].vaccineId,
          );

          if (vac != null) {
            listVaccine.push({
              ...vac,
              vaccineId: vac._id,
              injectedDate: req.body?.listVaccine[i].injectedDate,
            });
            totalPrice += vac.price;
          }
        }
        let result = await model.create({
          ...req.body,
          listVaccine: listVaccine,
        });
        res.send({ result, totalPrice });
      }
    } catch (error) {
      res.send({
        status: 500,
        message: { err: error },
      });
    }
  }
}

module.exports = new VCSignupController();
