/**
 * Title: Token Handler
 * Description: Handler for token routes
 */

// Dependencies
const lib = require("./../../lib/data");
const {
  hash,
  parseJson,
  createRandomString,
} = require("./../../helpers/utilities");

// handler object or module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.includes(requestProperties.method)) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

// _user object or _user scaffolding for CRUD operations
handler._token = {};

// READ
handler._token.get = (requestProperties, callback) => {
  // get and validate token id
  let { id } = requestProperties.queryStringObject;

  id = typeof id === "string" && id.trim().length === 20 ? id : false;
  //   console.log(id);
  if (id) {
    // get the token via id
    lib.read("tokens", id, (err, userToken) => {
      if (!err) {
        callback(200, parseJson(userToken));
      } else {
        callback(400, {
          error: "requested token was not found, please provide a valid one!",
        });
      }
    });
  } else {
    callback(400, {
      error: "Invalid tokenId please provide a valid one!",
    });
  }
};

// CREATE
handler._token.post = (requestProperties, callback) => {
  let { phone, password } = requestProperties.body;
  // validate phone
  phone =
    typeof phone === "string" && phone.trim().length === 11 ? phone : false;

  // validate password
  password =
    typeof password === "string" && password.trim().length > 0
      ? password
      : false;

  if (phone && password) {
    let hashedPassword = hash(password);

    // get user and check if the password match or not
    lib.read("users", phone, (err, userData) => {
      if (!err) {
        if (hashedPassword === parseJson(userData).password) {
          const tokenId = createRandomString(20);
          const expires = Date.now() + 60 * 60 * 1000;
          const tokenObject = {
            id: tokenId,
            phone,
            expires,
          };

          // store the token object to the token folder
          lib.create("tokens", tokenId, tokenObject, (err) => {
            if (!err) {
              callback(201, {
                message: "token successfully generated!",
              });
            } else {
              callback(500, {
                error: "Interval server error, failed to generate token!",
              });
            }
          });
        }
      } else {
        callback(400, {
          error: "Invalid phone number, please provide a valid phone!",
        });
      }
    });
  } else {
    callback(400, {
      error: "invalid phone or password!",
    });
  }
};

// UPDATE
handler._token.put = (requestProperties, callback) => {
  // validate tokenId and extend
  let { id, extend } = requestProperties.body;
  id = typeof id === "string" && id.trim().length === 20 ? id : false;
  extend = typeof extend === "boolean" && extend === true ? true : false;

  if (id && extend) {
    // find token and update expires
    lib.read("tokens", id, (err, userToken) => {
      if (!err) {
        const token = parseJson(userToken);
        if (token.expires > Date.now()) {
          token.expires = Date.now() + 60 * 60 * 1000;

          // update the new expires token
          lib.update("tokens", id, token, (err) => {
            if (!err) {
              callback(200, {
                message: "successfully updated the token expires time!",
              });
            } else {
              callback(500, {
                error: "Internal server error, failed to update the token!",
              });
            }
          });
        } else {
          callback(500, {
            error: "Your token already has expired, please refresh it!",
          });
        }
      } else {
        callback(500, {
          error: "Internal error, error while reading token",
        });
      }
    });
  } else {
    callback(400, {
      error: "invalid request, please provide valid id and extend query!",
    });
  }
};

// DELETE
handler._token.delete = (requestProperties, callback) => {
  // validate queries
  let { id } = requestProperties.queryStringObject;

  id = typeof id === "string" && id.trim().length === 20 ? id : false;

  if (id) {
    // find the token and delete
    lib.delete("tokens", id, (err) => {
      if (!err) {
        callback(200, {
          message: "Token was successfully deleted!",
        });
      } else {
        callback(500, {
          error: "Internal server error, failed to delete token",
        });
      }
    });
  } else {
    callback(400, {
      error: "Invalid tokenId, please provide a valid token Id!",
    });
  }
};

// Token verification function or method
handler._token.verify = (id, phone, callback) => {
  // check token is available or not and expires or not
  lib.read("tokens", id, (err, token) => {
    if (!err && token) {
      const tokenObj = parseJson(token);
      if (tokenObj.expires > Date.now() && phone === tokenObj.phone) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handler;
