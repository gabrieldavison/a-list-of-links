"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var https_1 = __importDefault(require("https"));
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var mustache_1 = __importDefault(require("mustache"));
dotenv_1.default.config();
var publicBookmarkTag = process.env.PUBLIC_TAG;
var dataPath = path_1.default.join(__dirname, "../", "data", "data.json");
var templatePath = path_1.default.join(__dirname, "../", "templates", "index.html");
var app = express_1.default();
app.use("/static", express_1.default.static(path_1.default.join(__dirname, "../", "public")));
var PORT = process.env.PORT;
updateData();
app.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    function getNext() {
        if (offset + 10 >= linkData.length) {
            return null;
        }
        else {
            return page + 1;
        }
    }
    function getPrev() {
        if (page === 0) {
            return null;
        }
        else {
            return page - 1;
        }
    }
    var jsonData, linkData, template, page, offset, view;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs_1.promises.readFile(dataPath, "utf8")];
            case 1:
                jsonData = _a.sent();
                return [4 /*yield*/, JSON.parse(jsonData)];
            case 2:
                linkData = _a.sent();
                return [4 /*yield*/, fs_1.promises.readFile(templatePath, "utf8")];
            case 3:
                template = _a.sent();
                page = req.query.page ? Number(req.query.page) : 1;
                offset = page * 10 - 10;
                view = {
                    links: linkData.slice(offset, offset + 10),
                    next: function () { return getNext(); },
                    prev: function () { return getPrev(); },
                };
                res.send(mustache_1.default.render(template, view));
                return [2 /*return*/];
        }
    });
}); });
app.get("/update", updateData);
app.listen(PORT, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at http://localhost:" + PORT);
});
function updateData() {
    var reqURL = "https://api.pinboard.in/v1/posts/all?format=json&tag=" + publicBookmarkTag + "&auth_token=" + process.env.PINBOARD_TOKEN;
    https_1.default
        .get(reqURL, function (resp) {
        var body = "";
        resp.on("data", function (chunk) {
            body += chunk;
        });
        resp.on("end", function () {
            try {
                fs_1.promises.writeFile(dataPath, body);
            }
            catch (e) {
                console.log(e);
            }
        });
    });
}
