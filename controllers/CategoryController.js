const model = require('../models/Category');
const logger = require('../log/winston');

class CategoryController {
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
  async getCategories(req, res, next) {
    try {
      const categories = await model.find();
      const result = [];

      categories.forEach((item) => {
        if (!item.parentId) {
          result.push({
            _id: item._id,
            categoryName: item.categoryName,
            childrens: [],
          });
        }
      });

      result.forEach((r, i, o) => {
        categories.forEach((c) => {
          if (c.parentId && r._id == c.parentId) {
            o[i].childrens?.push({
              _id: c._id,
              categoryName: c.categoryName,
            });
          }
        });
      });

      res.send(result);
    } catch (error) {
      console.log(error);
      res.send({
        status: 500,
        message: { err: error },
      });
    }
  }
}

module.exports = new CategoryController();
