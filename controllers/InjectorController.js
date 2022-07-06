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
  async hasCustomerCreate(req, res, next) {
    const code = req.body?.code;
    const relationship = req.body?.relationship;

    if (relationship == null || relationship == '') {
      res.send({
        status: 400,
        message: 'relationship is require!',
      });
      return;
    }

    if (relationship == 'BANTHAN') {
      if (code == null || code == '') {
        try {
          const hasCode = await Customer.findOne({
            $or: [{ code: req.body?.phone }, { phone: req.body?.phone }],
          });
          if (hasCode == null) {
            const cusCreate = await Customer.create({
              ...req.body,
              code: req.body?.phone,
            });

            const startTime = new Date();
            logger.info(`Create Injector - Start Time: ${startTime}`);

            const inj = await model.create({
              ...req.body,
              customerId: cusCreate._id,
            });

            const endTime = new Date();
            logger.info(`Create Injector - End Time: ${endTime}`);
            logger.info(
              `Create Injector - Time Binding: ${
                endTime.getTime() - startTime.getTime()
              }ms`,
            );

            try {
              await resdisClient.connect();
            } catch (redErr) {
              console.log(redErr);
            }
            const startTimeRedis = new Date();
            logger.info(
              `Create or Update Injector redis - Start Time: ${startTimeRedis}`,
            );
            await resdisClient.setEx(
              `injector/customer/code?code=${cusCreate.code}&relationship=${relationship}`,
              DEFAULT_EXPIRATION,
              JSON.stringify(inj),
            );
            const endTimeRedis = new Date();
            logger.info(
              `Create or Update Injector redis - End Time: ${endTimeRedis}`,
            );
            logger.info(
              `Create or Update Injector redis - Time Binding: ${
                endTimeRedis.getTime() - startTimeRedis.getTime()
              }ms`,
            );
            await resdisClient.disconnect();

            res.send(inj);
          } else {
            res.send({
              status: 409,
              message: 'Phone Conflict!',
            });
            return;
          }
        } catch (error) {}
      } else {
        try {
          let cus = await Customer.findOne({
            code: code,
          });

          if (cus == null) {
            res.send({
              status: 404,
              message: 'Customer not found!',
            });
            return;
          }

          const updateCus = await Customer.findOneAndUpdate(
            { _id: cus._id },
            { ...req.body, identity: cus.identity },
          );

          cus = await Customer.findOne({
            _id: cus._id,
          });

          const hasInj = await model.findOne({
            relationship: relationship,
            dateOfBirth: req.body?.dateOfBirth,
            customerId: cus._id,
          });

          var result;
          if (hasInj == null) {
            const startTime = new Date();
            logger.info(`Create Injector - Start Time: ${startTime}`);

            result = await model.create({ ...req.body, customerId: cus._id });

            const endTime = new Date();
            logger.info(`Create Injector - End Time: ${endTime}`);
            logger.info(
              `Create Injector - Time Binding: ${
                endTime.getTime() - startTime.getTime()
              }ms`,
            );
          } else {
            const startTime = new Date();
            logger.info(`Update Injector - Start Time: ${startTime}`);

            result = await model.findOneAndUpdate(
              { _id: hasInj._id },
              { ...req.body, customerId: cus._id },
            );

            const endTime = new Date();
            logger.info(`Update Injector - End Time: ${endTime}`);
            logger.info(
              `Update Injector - Time Binding: ${
                endTime.getTime() - startTime.getTime()
              }ms`,
            );

            result = await model.findOne({ _id: hasInj._id });
          }

          try {
            await resdisClient.connect();
          } catch (redErr) {
            console.log(redErr);
          }
          const startTimeRedis = new Date();
          logger.info(
            `Create or Update Injector redis - Start Time: ${startTimeRedis}`,
          );
          await resdisClient.setEx(
            `injector/customer/code?code=${code}&relationship=${relationship}`,
            DEFAULT_EXPIRATION,
            JSON.stringify(result),
          );
          const endTimeRedis = new Date();
          logger.info(
            `Create or Update Injector redis - End Time: ${endTimeRedis}`,
          );
          logger.info(
            `Create or Update Injector redis - Time Binding: ${
              endTimeRedis.getTime() - startTimeRedis.getTime()
            }ms`,
          );
          await resdisClient.disconnect();
          res.send(result);
        } catch (error) {
          try {
            await resdisClient.disconnect();
          } catch (err) {}
          logger.error(`ERROR! `, error);
          res.send({
            status: 500,
            message: { err: error },
          });
        }
      }
    } else {
      if (code == null || code == '') {
        res.send({
          status: 400,
          message: 'code is require!',
        });
        return;
      }
      try {
        const cus = await Customer.findOne({ code: code });
        if (cus == null) {
          res.send({
            status: 404,
            message: 'Customer not found!',
          });
          return;
        }
        const hasInj = await model.findOne({
          relationship: relationship,
          dateOfBirth: req.body?.dateOfBirth,
          customerId: cus._id,
        });

        var result;
        if (hasInj == null) {
          const startTime = new Date();
          logger.info(`Create Injector - Start Time: ${startTime}`);

          result = await model.create({ ...req.body, customerId: cus._id });

          const endTime = new Date();
          logger.info(`Create Injector - End Time: ${endTime}`);
          logger.info(
            `Create Injector - Time Binding: ${
              endTime.getTime() - startTime.getTime()
            }ms`,
          );
        } else {
          const startTime = new Date();
          logger.info(`Update Injector - Start Time: ${startTime}`);

          result = await model.findOneAndUpdate(
            { _id: hasInj._id },
            { ...req.body, customerId: cus._id },
          );

          const endTime = new Date();
          logger.info(`Update Injector - End Time: ${endTime}`);
          logger.info(
            `Update Injector - Time Binding: ${
              endTime.getTime() - startTime.getTime()
            }ms`,
          );

          result = await model.findOne({ _id: hasInj._id });
        }
        try {
          await resdisClient.connect();
        } catch (redErr) {
          console.log(redErr);
        }
        const startTimeRedis = new Date();
        logger.info(
          `Create or Update Injector redis - Start Time: ${startTimeRedis}`,
        );
        await resdisClient.setEx(
          `injector/customer/code?code=${code}&relationship=${relationship}`,
          DEFAULT_EXPIRATION,
          JSON.stringify(result),
        );
        const endTimeRedis = new Date();
        logger.info(
          `Create or Update Injector redis - End Time: ${endTimeRedis}`,
        );
        logger.info(
          `Create or Update Injector redis - Time Binding: ${
            endTimeRedis.getTime() - startTimeRedis.getTime()
          }ms`,
        );
        await resdisClient.disconnect();
        res.send(result);
      } catch (error) {
        try {
          await resdisClient.disconnect();
        } catch (err) {}
        logger.error(`ERROR! `, error);
        res.send({
          status: 500,
          message: { err: error },
        });
      }
    }
  }
}

module.exports = new InjectorController();
