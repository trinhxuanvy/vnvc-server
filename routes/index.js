const category = require('./category');
const vaccine = require('./vaccine');
const injector = require('./injector');
const customer = require('./customer');
const vccenter = require('./vccenter');
const vcsignup = require('./vcsignup');

function route(app) {
  app.use(vaccine);
  app.use(category);
  app.use(injector);
  app.use(customer);
  app.use(vccenter);
  app.use(vcsignup);
}

module.exports = route;
