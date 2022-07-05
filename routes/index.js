const category = require('./category');
const vaccine = require('./vaccine');
const injector = require('./injector');

function route(app) {
  app.use(vaccine);
  app.use(category);
  app.use(injector);
}

module.exports = route;
