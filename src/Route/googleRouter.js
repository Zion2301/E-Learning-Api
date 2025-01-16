"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleMiddleware_1 = require("../middleware/googleMiddleware");
const express_1 = __importDefault(require("express"));
const googleRoute = express_1.default.Router();
googleRoute.post("/google-signup", googleMiddleware_1.googlesignup);
exports.default = googleRoute;
