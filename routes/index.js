const category = require('./category');
const vaccine = require('./vaccine');
const injector = require('./injector');
const customer = require('./customer');
const vccenter = require('./vccenter');

function route(app) {
  app.use(vaccine);
  app.use(category);
  app.use(injector);
  app.use(customer);
  app.use(vccenter);
}

module.exports = route;
