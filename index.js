/**
 * Title: Uptime Monitoring Application
 * Description: A RestFul API to monitor up or down time of user defined links
 */

// Dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
// app object or module scaffolding
const app = {};

// configuration
app.config = {
  port: 3000,
};

// handle Request and Response
app.handleReqRes = handleReqRes;

// create Server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);

  server.listen(app.config.port, () => {
    console.log(`Server running on port ${app.config.port}`);
  });
};

// Start the server
app.createServer();
