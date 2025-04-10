/**
 * Title: User Handler
 * Description: Handler for user related routes
 */

// Dependencies
const lib = require("./../../lib/data");
const { hash, parseJson } = require("./../../helpers/utilities");

// handler object or module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.includes(requestProperties.method)) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

// _user object or _user scaffolding
handler._users = {};

handler._users.get = (requestProperties, callback) => {
  // console.log(requestProperties);
  const { queryStringObject: query } = requestProperties;

  // validate phone
  let phone =
    typeof query.phone === "string" && query.phone.trim().length === 11
      ? query.phone
      : false;

  if (phone) {
    // read user from users folder by phone
    lib.read("users", phone, (err, u) => {
      if (!err) {
        const user = { ...parseJson(u) };
        delete user.password;
        callback(200, user);
      } else {
        callback(404, {
          error: "Requested user was not found!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Invalid user request or invalid user query!",
    });
  }
};

handler._users.post = (requestProperties, callback) => {
  // validate the user's properties
  let { firstName, lastName, phone, password, tosAgreement } =
    requestProperties.body;

  // validate firstName
  firstName =
    typeof firstName === "string" && firstName.trim().length > 0
      ? firstName
      : false;

  // validate lastName
  lastName =
    typeof lastName === "string" && lastName.trim().length > 0
      ? lastName
      : false;

  // validate phone
  phone =
    typeof phone === "string" && phone.trim().length === 11 ? phone : false;

  // validate password
  password =
    typeof password === "string" && password.trim().length > 0
      ? password
      : false;

  // validate tosAgreement
  tosAgreement = typeof tosAgreement === "boolean" ? tosAgreement : false;

  // console.log(firstName, lastName, password, phone, tosAgreement);

  if (firstName && lastName && phone && password && tosAgreement) {
    // make sure that the user doesn't already exists
    lib.read("users", phone, (err) => {
      if (err) {
        const userObj = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        // store the user to Db
        lib.create("users", phone, userObj, (err) => {
          if (!err) {
            callback(201, {
              message: "User was created successfully!",
            });
          } else {
            callback(500, { error: "Could not create user!" });
          }
        });
      } else {
        callback(500, {
          error: "There was a problem in the server side!",
        });
      }
    });
  } else {
    callback(400, {
      error: "InValid user request!",
    });
  }
};

handler._users.put = (requestProperties, callback) => {};

handler._users.delete = (requestProperties, callback) => {};

module.exports = handler;
