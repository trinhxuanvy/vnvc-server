const model = require('../models/Injector');
const Customer = require('../models/Customer');
const logger = require('../log/winston');
const Redis = require('redis');

const resdisClient = Redis.createClient();
const DEFAULT_EXPIRATION = 3600;

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
          status: 400,
          message: 'code & relationship is require!',
        });
        return;
      }

      await resdisClient.connect();
      const startTimeRedis = new Date();
      logger.info(
        `Get Injector by code & relationship redis - Start Time: ${startTimeRedis}`,
      );
      let redisResult = await resdisClient.get(
        `injector/customer/code?code=${code}&relationship=${relationship}`,
      );
      const endTimeRedis = new Date();
      logger.info(
        `Get Injector by code & relationship redis - End Time: ${endTimeRedis}`,
      );
      logger.info(
        `Get Injector by code & relationship redis - Time Binding: ${
          endTimeRedis.getTime() - startTimeRedis.getTime()
        }ms`,
      );
      if (redisResult) {
        await resdisClient.disconnect();
        const response = JSON.parse(redisResult);
        return res.send(response);
      } else {
        const startTime = new Date();
        logger.info(
          `Get Injector by code & relationship - Start Time: ${startTime}`,
        );

        const cus = await Customer.find({
          code: code,
        });

        if (cus == null || cus.length == 0) {
          logger.error(
            `Get Injector by code & relationship: Entity not found!`,
          );
          res.send({
            status: 404,
            message: 'Entity not found!',
          });

          return;
        }

        const cusFind = cus[0];

        const result = await model.find({
          customerId: cusFind._id,
          relationship: relationship,
        });

        const endTime = new Date();
        logger.info(
          `Get Injector by code & relationship - End Time: ${endTime}`,
        );
        logger.info(
          `Get Injector by code & relationship - Time Binding: ${
            endTime.getTime() - startTime.getTime()
          }ms`,
        );

        if (result == null || result.length == 0) {
          logger.error(
            `Get Injector by code & relationship: Entity not found!`,
          );
          res.send({
            status: 404,
            message: 'Entity not found!',
          });

          return;
        } else {
          await resdisClient.setEx(
            `injector/customer/code?code=${code}&relationship=${relationship}`,
            DEFAULT_EXPIRATION,
            JSON.stringify(result),
          );
          await resdisClient.disconnect();
          res.send(result[0]);

          return;
        }
      }
    } catch (error) {
      try {
        await resdisClient.disconnect();
      } catch (error) {}
      console.log(1);

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
