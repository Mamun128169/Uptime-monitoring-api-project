/**
 * Title: Routes
 * Description: Application Routes
 */

// Dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");

// routes object or module scaffolding
const routes = {
  sample: sampleHandler,
  user: userHandler,
};

module.exports = routes;
