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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mustache_express_1 = __importDefault(require("mustache-express"));
const app = (0, express_1.default)();
app.set("views", `${__dirname}/views`);
app.set("view engine", "mustache");
app.engine("mustache", (0, mustache_express_1.default)());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const username = req.query.username;
    console.log({ username });
    if (typeof username !== "string" || !username) {
        return res.status(400).send("Username not specified");
    }
    try {
        const url = new URL(`http://20.201.112.54:8001/api/users/find/${username}`);
        const response = yield fetch(url).then((data) => data.json());
        console.log({ response });
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        res.setHeader("content-type", "image/svg+xml; charset=utf-8");
        res.setHeader("cache-control", "no-cache, max-age=0");
        res.render("index", {
            finishedDays: response.days_participated || 0,
            daysFinishedPercentage: response.days_participated
                ? (response.days_participated || 0) * 250
                : 0,
            name: response.name || "",
            totalLikes: ((_a = response.statistics) === null || _a === void 0 ? void 0 : _a.total_likes) || 0,
            totalViews: ((_b = response.statistics) === null || _b === void 0 ? void 0 : _b.total_views) || 0,
            totalReplies: ((_c = response.statistics) === null || _c === void 0 ? void 0 : _c.total_replies) || 0,
            maxStreak: ((_d = response.statistics) === null || _d === void 0 ? void 0 : _d.max_streak) || 0,
        });
    }
    catch (error) {
        console.log({ error });
        res.status(500).send("Internal Server Error");
    }
}));
const port = process.env.NODE_ENV || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
