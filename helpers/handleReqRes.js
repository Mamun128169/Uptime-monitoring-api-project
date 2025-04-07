/**
 * Title: Handle Request and Response
 * Description: handle req and res
 */

// Dependencies
const { URL } = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/NotFoundHandler");

// handler object or module scaffolding
const handler = {};

// handle Request Response
handler.handleReqRes = (req, res) => {
  // request handling
  // get the url and parse it
  const myUrl = new URL(req.url, `http://${req.headers.host}`);
  const path = myUrl.pathname;
  const trimmedPath = path.replace(/^\/|\/$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = Object.fromEntries(myUrl.searchParams);
  const headersObj = req.headers;

  const requestProperties = {
    myUrl,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headersObj,
  };

  // find the chosen route or current route
  const chosenRouteHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;
  // console.log(chosenRoute.toString(), routes);

  // handling request payload or body or data
  const decoder = new StringDecoder("utf-8");
  let realData = "";

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();
    console.log("request stream data", realData);

    // HandleChosen Route
    chosenRouteHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      // return the final response
      res.writeHead(statusCode);
      res.end(payloadString);
    });

    // response handle
    // res.write("coding is doing fun! \n");
    // res.end("Hello Programmers!");
  });
};

module.exports = handler;
