fs = require('fs');
const model = require('../models/Vaccine');
const Category = require('../models/Category');
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
  async getBySellType(req, res, next) {
    try {
      const startTime = new Date();
      logger.info(`Get Vaccine by filter - Start Time: ${startTime}`);
      const hasType = !(
        req.query?.type != 'Package' && req.query?.type != 'Retail'
      );
      const hasCategory =
        req.query?.categoryId != '' && req.query?.categoryId != null;

      const listCategory = (
        await Category.find({
          $or: [
            { parentId: req.query?.categoryId },
            { _id: req.query?.categoryId },
          ],
        })
      ).map((x) => x._id);
      const search = req.query?.search || '';
      const result = hasType
        ? hasCategory
          ? await model
              .find({
                sellType: req.query?.type,
                vaccineName: { $regex: '.*' + search + '.*' },
              })
              .where('categoryId')
              .in(listCategory)
          : await model.find({
              sellType: req.query?.type,
              vaccineName: { $regex: '.*' + search + '.*' },
            })
        : hasCategory
        ? await model
            .find({ vaccineName: { $regex: '.*' + search + '.*' } })
            .where('categoryId')
            .in(listCategory)
        : await model.find({ vaccineName: { $regex: '.*' + search + '.*' } });

      const endTime = new Date();
      logger.info(`Get Vaccine by filter - End Time: ${endTime}`);
      logger.info(
        `Get Vaccine by filter - Time Binding: ${
          endTime.getTime() - startTime.getTime()
        }ms`,
      );
      res.send({ total: result.length, entities: result });
    } catch (error) {
      res.send({
        status: 500,
        message: { err: error },
      });
    }
  }
  async getByById(req, res, next) {
    try {
      const startTime = new Date();
      logger.info(`Get Vaccine by Id - Start Time: ${startTime}`);
      const result = await model.findById(req.params.id);
      res.send(result);
      logger.info(`Get Vaccine by Id - End Time: ${endTime}`);
      logger.info(
        `Get Vaccine by Id - Time Binding: ${
          endTime.getTime() - startTime.getTime()
        }ms`,
      );
    } catch (error) {
      res.send({
        status: 500,
        message: { err: error },
      });
    }
  }
}

module.exports = new VaccineController();
