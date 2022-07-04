const model = require('../models/Vaccine');
const Category = require('../models/Category');

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
      const result = await model.findById(req.params.id);
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
