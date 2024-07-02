const fsP = require("fs/promises");
const fs = require("node:fs");
const path = require("path");

const logger = async ({ req, validation }, ...args) => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  const folderName = "./logs";

  const objectToLog = {
    header: req.headers,
    validation: validation,
    date: new Date().toISOString(),
    info:args[0]
    
  };

  
  console.log(objectToLog);

  try {
    //check if directory exists
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }

    await fsP.appendFile(
      path.join("./", "logs", formattedDate.toString() + ".txt"),
      `${JSON.stringify(objectToLog)}\n`
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = logger;
