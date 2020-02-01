const os = require("os");
const path = require("path");

let platform = os.platform();
let homedir = os.homedir();
const loadJsonFile = require("load-json-file");

console.log(`${platform} ${homedir}`);

(async () => {
  let packageInfo = await loadJsonFile("package.json");
  let appName = packageInfo.productName;
  let filePath = path.resolve(homedir, ".config", appName);
  console.log(filePath);
})();
