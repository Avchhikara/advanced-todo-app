const routingFunctions = require("./functions");

module.exports = (app) => {
  app.get("/", routingFunctions.homePage);
};
