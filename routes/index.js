const category = require('./category');
const vaccine = require('./vaccine');

function route(app) {
  app.use(vaccine);
  app.use(category);
}

module.exports = route;
