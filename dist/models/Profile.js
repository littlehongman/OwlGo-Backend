"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const profileSchema = new mongoose_1.default.Schema({
    //id: {type: Number, required: true},
    username: { type: String, required: [true, 'Username is required'] },
    name: { type: String, default: "" },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    birthday: { type: String, required: true },
    zipCode: { type: String },
    avatar: { type: String, default: "" },
    friends: [],
    headline: { type: String, default: "" }
});
exports.Profile = mongoose_1.default.model('profile', profileSchema); // user ==> collection name
// module.exports = { userSchema }
