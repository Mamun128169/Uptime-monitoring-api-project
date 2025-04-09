/**
 * Title: Sample Handler
 * Description: sample handler function
 */

// handler object or module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  // console.log("sample req props", requestProperties);
  callback(200, {
    message: "This is the sample route page",
  });
};

module.exports = handler;
