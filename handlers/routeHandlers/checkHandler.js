/**
 * Title: check route Handler
 * Description: Handler for checks route
 */

// Dependencies
const lib = require("./../../lib/data");
const { parseJson, createRandomString } = require("./../../helpers/utilities");
const tokenHandler = require("./tokenHandler");
const environment = require("./../../helpers/environments");

// handler object or module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.includes(requestProperties.method)) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      error: "Invalid request method!",
    });
  }
};

// _check object or _check scaffolding for CRUD operations
handler._check = {};

// READ
handler._check.get = (requestProperties, callback) => {};

// CREATE
handler._check.post = (requestProperties, callback) => {
  // validate user's data
  let { protocol, url, method, successCodes, timeOutSecs } =
    requestProperties.body;

  protocol =
    typeof protocol === "string" && ["http", "https"].includes(protocol)
      ? protocol
      : false;

  url = typeof url === "string" && url.trim().length > 0 ? url : false;

  method =
    typeof method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].includes(method)
      ? method
      : false;

  successCodes =
    typeof successCodes === "object" && Array.isArray(successCodes)
      ? successCodes
      : false;

  timeOutSecs =
    typeof timeOutSecs === "number" && timeOutSecs >= 1 && timeOutSecs <= 5
      ? timeOutSecs
      : false;

  if (protocol && url && method && successCodes && timeOutSecs) {
    let { token } = requestProperties.headersObj;
    token =
      typeof token === "string" && token.trim().length === 20 ? token : false;

    if (token) {
      // find the user by reading the token
      lib.read("tokens", token, (err, tokenObj) => {
        if (!err && tokenObj) {
          const userPhone = parseJson(tokenObj).phone;
          // find user obj and then insert checks array
          lib.read("users", userPhone, (err, user) => {
            if (!err && user) {
              tokenHandler._token.verify(token, userPhone, (isVerified) => {
                if (isVerified) {
                  const userObj = parseJson(user);
                  // validate users check array
                  let userChecks =
                    typeof userObj.checks === "object" &&
                    Array.isArray(userObj.checks)
                      ? userObj.checks
                      : [];

                  if (userChecks.length < environment.maxChecks) {
                    // create check id and add it to the userObj then update the userObj
                    const checkId = createRandomString(20);
                    userChecks.push(checkId);

                    lib.update("users", userPhone, userObj, (err) => {
                      if (!err) {
                        // create checkObj and add to the corresponding check file
                        const checkObj = {
                          checkId,
                          phone: userPhone,
                          protocol,
                          url,
                          method,
                          successCodes,
                          timeOutSecs,
                        };

                        // create check files containing checkObj
                        lib.create("checks", checkId, checkObj, (err) => {
                          if (!err) {
                            callback(200, checkObj);
                          } else {
                            callback(500, {
                              error:
                                "Internal server error while creating the check file!",
                            });
                          }
                        });
                      } else {
                        callback(500, {
                          error:
                            "Error while updating the userObj with checkId",
                        });
                      }
                    });
                  } else {
                    callback(401, {
                      error: "You have already reached the max limits!",
                    });
                  }
                } else {
                  callback(403, {
                    error: "Authentication Problem, token may be expires!",
                  });
                }
              });
            } else {
              callback(404, {
                error: "User not found, invalid phone!",
              });
            }
          });
        } else {
          callback(404, {
            error: "Invalid token, please try with a valid token!",
          });
        }
      });
    } else {
      callback(403, {
        error: "Invalid user token!",
      });
    }
  } else {
    callback(403, {
      error: "There was a problem in your request!",
    });
  }
};

// UPDATE
handler._check.put = (requestProperties, callback) => {};

// DELETE
handler._check.delete = (requestProperties, callback) => {};

module.exports = handler;
