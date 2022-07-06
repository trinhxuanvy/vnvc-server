const category = require('./category');
const vaccine = require('./vaccine');
const injector = require('./injector');
const customer = require('./customer');

function route(app) {
  app.use(vaccine);
  app.use(category);
  app.use(injector);
  app.use(customer);
}

module.exports = route;
