/**
 * Title: Utilities functions
 * Description: utilities functions for application
 */

// Dependencies
const crypto = require("crypto");
const environments = require("./../helpers/environments");

// utilities object or module scaffolding
const utilities = {};

utilities.parseJson = (jsonString) => {
  let outPut;

  try {
    outPut = JSON.parse(jsonString);
  } catch {
    outPut = {};
  }

  return outPut;
};

// function to hash string
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", environments.secretKey)
      .update(str)
      .digest("hex");

    return hash;
  }
  return false;
};

module.exports = utilities;
