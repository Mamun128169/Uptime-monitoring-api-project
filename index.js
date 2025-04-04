/**
 * Title: Uptime Monitoring Application
 * Description: A RestFul API to monitor up or down time of user defined links
 */

// Dependencies
const http = require("http");

// app object or module scaffolding
const app = {};

// configuration
app.config = {
  port: 3000,
};

// create Server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);

  server.listen(app.config.port, () => {
    console.log(`Server running on port ${app.config.port}`);
  });
};

// handle Request Response
app.handleReqRes = (req, res) => {
  // response handle
  res.write("coding is doing fun! \n");
  res.end("Hello Programmers!");
};

// Start the server
app.createServer();
