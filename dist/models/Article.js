"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    cid: { type: Number, required: true },
    author: {
        username: { type: String, required: true },
        avatar: { type: String, required: true }
    },
    text: { type: String, required: true },
    timestamp: { type: Number, required: true },
});
const articleSchema = new mongoose_1.default.Schema({
    pid: { type: Number, required: true },
    author: {
        username: { type: String, required: true },
        avatar: { type: String, required: true }
    },
    text: { type: String, required: true },
    img: { type: String, default: "" },
    timestamp: { type: Number, required: true },
    comments: [commentSchema]
});
exports.Article = mongoose_1.default.model('article', articleSchema); // user ==> collection name
// module.exports = { userSchema }
