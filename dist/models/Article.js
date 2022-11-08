"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const articleSchema = new mongoose_1.default.Schema({
    pid: { type: Number, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    img: { type: String, default: "" },
    timestamp: { type: String, required: true },
    comments: []
});
exports.Article = mongoose_1.default.model('article', articleSchema); // user ==> collection name
// module.exports = { userSchema }
