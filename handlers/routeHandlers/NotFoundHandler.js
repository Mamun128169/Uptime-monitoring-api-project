/**
 * Title: NotFound Handler
 * Description: not found handler function
 */

// handler object or module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  console.log("notFound  req props", requestProperties);
  callback(404, {
    message: "Your requested URL was not found!",
  });
};

module.exports = handler;
