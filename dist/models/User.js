"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: [true, 'Username is required'] },
    salt: { type: String, required: true },
    hash: { type: String, require: true },
});
exports.User = mongoose_1.default.model('user', userSchema); // user ==> collection name
// module.exports = { userSchema }
