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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvatar = exports.unlinkGoogle = exports.getAccount = exports.getProfile = exports.getDateOfBirth = exports.updateAvatar = exports.getUserAvatar = exports.updateZipcode = exports.getUserZipcode = exports.updatePhone = exports.updateEmail = exports.getUserEmail = exports.updateHeadline = exports.getUserHeadline = void 0;
const Article_1 = require("../models/Article");
const Profile_1 = require("../models/Profile");
const User_1 = require("../models/User");
const uploadCloudinary_1 = require("../utils/uploadCloudinary");
const getUserHeadline = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let username = "";
    if (req.params.username) {
        username = req.params.username;
    }
    else {
        username = req.body.username;
    }
    const user = yield Profile_1.Profile.findOne({ username: username });
    const msg = { username: username, headline: user === null || user === void 0 ? void 0 : user.headline };
    res.send(msg);
});
exports.getUserHeadline = getUserHeadline;
const updateHeadline = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newHeadline = req.body.headline;
    const updatedUser = yield Profile_1.Profile.findOneAndUpdate({ username: req.body.username }, { headline: newHeadline }, { new: true });
    res.send({ username: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.username, headline: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.headline });
});
exports.updateHeadline = updateHeadline;
const getUserEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username = "";
    if (req.params.user) {
        username = req.params.user;
    }
    else {
        username = req.body.username;
    }
    const user = yield Profile_1.Profile.findOne({ username: username });
    const msg = { username: username, email: user === null || user === void 0 ? void 0 : user.email };
    res.send(msg);
});
exports.getUserEmail = getUserEmail;
const updateEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const newEmail = req.body.email;
    const user = yield Profile_1.Profile.findOneAndUpdate({ username: username }, { email: newEmail }, { new: true });
    const msg = { username: username, email: user === null || user === void 0 ? void 0 : user.email };
    res.send(msg);
});
exports.updateEmail = updateEmail;
const updatePhone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const newPhone = req.body.phone;
    const user = yield Profile_1.Profile.findOneAndUpdate({ username: username }, { phone: newPhone }, { new: true });
    const msg = { username: username, phone: user === null || user === void 0 ? void 0 : user.phone };
    res.send(msg);
});
exports.updatePhone = updatePhone;
const getUserZipcode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username = "";
    if (req.params.user) {
        username = req.params.user;
    }
    else {
        username = req.body.username;
    }
    const user = yield Profile_1.Profile.findOne({ username: username });
    const msg = { username: username, zipcode: user === null || user === void 0 ? void 0 : user.zipCode };
    res.send(msg);
});
exports.getUserZipcode = getUserZipcode;
const updateZipcode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const newZipcode = req.body.zipcode;
    const user = yield Profile_1.Profile.findOneAndUpdate({ username: username }, { zipCode: newZipcode }, { new: true });
    const msg = { username: username, zipcode: user === null || user === void 0 ? void 0 : user.zipCode };
    res.send(msg);
});
exports.updateZipcode = updateZipcode;
const getUserAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username = "";
    if (req.params.user) {
        username = req.params.user;
    }
    else {
        username = req.body.username;
    }
    const user = yield Profile_1.Profile.findOne({ username: username });
    const msg = { username: username, avatar: user === null || user === void 0 ? void 0 : user.avatar };
    res.send(msg);
});
exports.getUserAvatar = getUserAvatar;
const updateAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const imageURL = yield (0, uploadCloudinary_1.uploadImage)(req);
    const user = yield Profile_1.Profile.findOneAndUpdate({ username: username }, { avatar: imageURL }, { new: true });
    // need to update all avatar from articles
    yield Article_1.Article.updateMany({ 'author.username': username }, { 'author.avatar': imageURL });
    const msg = { username: username, avatar: user === null || user === void 0 ? void 0 : user.avatar };
    res.send(msg);
});
exports.updateAvatar = updateAvatar;
const getDateOfBirth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username = "";
    if (req.params.user) {
        username = req.params.user;
    }
    else {
        username = req.body.username;
    }
    const user = yield Profile_1.Profile.findOne({ username: username });
    const msg = { username: username, dob: user === null || user === void 0 ? void 0 : user.birthday };
    res.send(msg);
});
exports.getDateOfBirth = getDateOfBirth;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const user = yield Profile_1.Profile.findOne({ 'username': username });
    const msg = { username: username, profile: user };
    res.status(200).send(msg);
});
exports.getProfile = getProfile;
const getAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const account = {};
    const user = yield User_1.User.findOne({ 'username': username });
    if (user['salt'] !== undefined) {
        account.local = true; // this stands for ordinary registered user
    }
    else {
        account.local = false;
    }
    if (user['googleId'] !== undefined) {
        account.googleId = true;
    }
    else {
        account.googleId = false;
    }
    //console.log(account);
    const msg = { username: username, account: account };
    res.status(200).send(msg);
});
exports.getAccount = getAccount;
const unlinkGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    yield User_1.User.findOneAndUpdate({ username: username }, { $unset: { googleId: 1 } });
    res.sendStatus(200);
});
exports.unlinkGoogle = unlinkGoogle;
// Help function for create new Post
const getAvatar = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Profile_1.Profile.findOne({ username: username }, { avatar: 1 });
    if (user !== null)
        return user.avatar;
    return "";
});
exports.getAvatar = getAvatar;
