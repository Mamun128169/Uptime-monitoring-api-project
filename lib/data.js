/**
 * Title: Handle file data(storage)
 * Description: handle file system as storage
 */

// Dependencies
const fs = require("fs");
const path = require("path");

// lib object or module scaffolding
const lib = {};

// base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

// write data to file
lib.create = (subDir, file, data, callback) => {
  // open file for writing
  fs.open(
    `${lib.baseDir + subDir}/${file}.json`,
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert data to string
        const stringData = JSON.stringify(data);

        // write data to file and close it
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false);
              } else {
                callback("Error closing the new file!");
              }
            });
          } else {
            callback("Error writing to new file!");
          }
        });
      } else {
        callback("There was an error, file may already exists!");
      }
    }
  );
};

// read data from file
lib.read = (subDir, file, callback) => {
  fs.readFile(`${lib.baseDir + subDir}/${file}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};

// update exiting file
lib.update = (subDir, file, data, callback) => {
  // open file for writing(update)
  fs.open(
    `${lib.baseDir + subDir}/${file}.json`,
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // converts dataObj to string
        const dataString = JSON.stringify(data);

        // truncate exiting data than write the new data
        fs.ftruncate(fileDescriptor, (err) => {
          if (!err) {
            // write data to file and close it
            fs.writeFile(fileDescriptor, dataString, (err) => {
              if (!err) {
                // close the file
                fs.close(fileDescriptor, (err) => {
                  if (err) {
                    callback("Error while closing the file!");
                  } else {
                    callback(false);
                  }
                });
              } else {
                callback("Error while writing the file!");
              }
            });
          } else {
            callback("Error while truncating the file!");
          }
        });
      } else {
        callback("Error while opening the file!");
      }
    }
  );
};

// Delete the file
lib.delete = (subDir, file, callback) => {
  // file unlink
  fs.unlink(`${lib.baseDir + subDir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      console.log("Error while deleting the file!");
    }
  });
};

module.exports = lib;
