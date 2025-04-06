/**
 * Title: Routes
 * Description: Application Routes
 */

// Dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");

// routes object or module scaffolding
const routes = {
  sample: sampleHandler,
};

module.exports = routes;
