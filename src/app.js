const express = require("express");
const cors = require("cors");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

module.exports = function createApp(host, port, showXhr) {
    function outputMessage(request) {
        const { type, message } = request;
        let color;
        let icon = "";
        switch (type) {
            case "log":
                color = chalk.white;
                break;
            case "warn":
                color = chalk.yellow;
                icon = "⚠️  ";
                break;
            case "error":
                color = chalk.red;
                icon = "🚫  ";
                break;
            case "info":
                color = chalk.blueBright;
                icon = "ℹ️  ";
                break;
            default:
                color = chalk;
        }
        console.log(color(
            icon + message.join(",")
        ));
    }

    const app = express();
    app.use(cors());

    app.post("/writeConsoleMessage", (req, res) => {
        const buffer = [];
        req
            .on("data", chunk => buffer.push(chunk))
            .on("end", () => {
                const payload = JSON.parse(Buffer.concat(buffer).toString());
                payload.forEach(outputMessage);
            });
        res.send("OK");
    });

    app.get("/demo", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../demo/index.html"));
    });

    let scriptContents;
    app.get("/console-hook.js", (req, res) => {
        if (!scriptContents) {
            scriptContents = `
                var scriptLocation = ${JSON.stringify({ host, port })};
                var showXhr = ${showXhr};
                ${fs.readFileSync(
                    path.resolve(__dirname, "../dist/console-hook.js")
                ).toString()}
            `;
        }

        res.send(scriptContents);
    });

    app.listen(port, host, () => {
        console.log(`ConsoleToTerminal is running on ${chalk.green(`${host}:${port}`)}`);
    });

    return app;
}
