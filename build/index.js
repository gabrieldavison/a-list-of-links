"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var https_1 = __importDefault(require("https"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var app = express_1.default();
var PORT = 8000;
app.get("/", function (req, res) { return res.send("get root"); });
app.get("/update", function (req, res) {
    var properURL = "https://api.pinboard.in/v1/posts/all?format=json&tag=shareList&auth_token=" + process.env.PINBOARD_TOKEN;
    var testURL = "https://api.pinboard.in/v1/posts/recent?format=json&auth_token=" + process.env.PINBOARD_TOKEN;
    https_1.default
        .get(testURL, function (resp) {
        var body = "";
        // A chunk of data has been received.
        resp.on("data", function (chunk) {
            body += chunk;
            process.stdout.write(chunk);
            // console.log("chunk");
        });
        // The whole response has been received. Print out the result.
        resp.on("end", function () {
            console.log("end", body);
            try {
                var jsonData = JSON.parse(body);
                console.log(jsonData);
                var filePath = path_1.default.join(__dirname, "data", "data.json");
                fs_1.default.writeFile(filePath, jsonData, function (err) {
                    if (err) {
                        return res.send(err);
                    }
                    res.send("success");
                });
            }
            catch (e) {
                console.log("Error parsing JSON!");
                console.log(body);
            }
        });
    })
        .on("error", function (err) {
        res.send("Error: " + err.message);
    });
});
app.listen(PORT, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at http://localhost:" + PORT);
});
