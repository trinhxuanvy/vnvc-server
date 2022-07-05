fs = require('fs');
const model = require('../models/Vaccine');
const Category = require('../models/Category');
const logger = require('../log/winston');
const Redis = require('redis');


const resdisClient = Redis.createClient()


const DEFAULT_EXPIRATION = 3600;

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
      const type = req.query?.type;
      const categoryId =  req.query?.categoryId;
      await resdisClient.connect();
      const startTimeRedis = new Date();
      logger.info(`Get Vaccine by filter redis - Start Time: ${startTimeRedis}`);
      let result =  await resdisClient.get(`vaccines?type=${type}?categoryId=${categoryId}`)
      const endTimeRedis = new Date();
      logger.info(`Get Vaccine by filter redis - End Time: ${endTimeRedis}`);
      logger.info(
        `Get Vaccine by filter redis - Time Binding: ${
          endTimeRedis.getTime() - startTimeRedis.getTime()
        }ms`,
      );
      if (result) {
        await resdisClient.disconnect();
        const response = JSON.parse(result);
        return res.send({total: response.length, entities: response})
      }
      else
      {
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
          await resdisClient.setEx(`vaccines?type=${type}?categoryId=${categoryId}`, DEFAULT_EXPIRATION, JSON.stringify(result));
          await resdisClient.disconnect();
          res.send({ total: result.length, entities: result });
      }
    } catch (error) {
      await resdisClient.disconnect();
      console.log(error)
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
        }ms`
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
