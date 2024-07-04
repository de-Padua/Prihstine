const fsP = require("fs/promises");
const fs = require("node:fs");
const path = require("path");

const logger = async (...actions) => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  const folderName = "./logs";

  const objectToLog = {
    date: new Date().toISOString(),
    data:actions[0] || []
  };

  try {
    //check if directory exists
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }

    await fsP.appendFile(
      path.join("./", "logs", formattedDate.toString() + ".log"),
      `${JSON.stringify(objectToLog)}\n`
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = logger;
