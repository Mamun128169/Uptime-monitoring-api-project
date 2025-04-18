/**
 * Title: Environments Variable
 * Description: environments variable handlers
 */

// environments object or module scaffolding
const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "dkfkldfjsdkfsjldfkjs",
  maxChecks: 5,
};

environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "sdhsldfsdkfsldkf",
  maxChecks: 5,
};

// determine which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
