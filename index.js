/**
 * Title: Uptime Monitoring Application
 * Description: A RestFul API to monitor up or down time of user defined links
 */

// Dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environments");
const data = require("./lib/data");

// app object or module scaffolding
const app = {};

// handle Request and Response
app.handleReqRes = handleReqRes;

// testing file system
// @ts-check
// data.delete("test", "demoFile", (err) => {
//   console.log("Error: ", err);
// });

// create Server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);

  server.listen(environment.port, () => {
    console.log(`Server running on port ${environment.port}`);
  });
};

// Start the server
app.createServer();
