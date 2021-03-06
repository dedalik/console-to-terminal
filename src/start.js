const app = require("./app");
const chalk = require("chalk");

const rePort = /^\d+$/;
const reHostPort = /^([a-zA-Z0-9.-_]+)\:(\d+)$/;

let host = "localhost";
let port = 8765;
let showXhr = process.argv[3] === "--xhr";
let customHostPort = process.argv[2];

if (process.argv[2] === "--xhr") {
    showXhr = true;
    customHostPort = false;
}
if (customHostPort) {
    if (customHostPort.match(rePort)) {
        port = parseInt(customHostPort);
    } else if (parsed = customHostPort.match(reHostPort)) {
        host = parsed[1];
        port = parsed[2];
    } else {
        console.error(chalk.red(`
Argument Error: "${customHostPort}" couldn't be matched as <port> or <host>:<port>!
Usage examples: "yarn start", "yarn start 1234", "yarn start hostname:1234"
`));
        process.exit(1);
    }
}

const server = new app(host, port, showXhr);
