const net = require("net");
const port = process.env.PORT ? process.env.PORT - 100 : 3000;
const os = require("os");
const path = require("path");
const loadJsonFile = require("load-json-file");
const del = require("del");

process.env.ELECTRON_START_URL = `http://localhost:${port}`;
process.env.NODE_ENV = "development";
process.env.ELECTRON_IS_DEV = 1;

const client = new net.Socket();

// Hack for electron-devtools-installer, (https://github.com/MarshallOfSound/electron-devtools-installer/issues/122)
const deleteProgramContents = async () => {
  let platform = os.platform();
  let homedir = os.homedir();
  let packageInfo = await loadJsonFile("package.json");
  let appName = packageInfo.productName;

  if (platform === "win32") {
    let pathApp = path.resolve(homedir, "AppData", "Roaming", appName);
    const deletedPaths = await del(pathApp, { force: true });
    console.log(`Deleted app folder: ${deletedPaths}`);
  }
};

let startedElectron = false;
const tryConnection = () =>
  client.connect({ port: port }, () => {
    client.end();
    if (!startedElectron) {
      console.log("starting electron");
      startedElectron = true;
      const exec = require("child_process").exec;
      exec("npm run electron:dev");
    }
  });

(async () => {
  await deleteProgramContents();
})();
tryConnection();

client.on("error", error => {
  setTimeout(tryConnection, 1000);
});
