const demoRoute = require("./demo");

function route(app) {
  app.use(demoRoute);
}
module.exports = route;
