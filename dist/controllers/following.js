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
exports.deleteFriend = exports.addFriend = exports.getFriends = exports.deleteFollowing = exports.addFollowing = exports.getFollowing = void 0;
const Profile_1 = require("../models/Profile");
const getFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username = "";
    // If specify id => return all posts of the user
    if (req.params.id) {
        username = req.params.user;
    }
    else {
        username = req.body.username;
    }
    const user = yield Profile_1.Profile.findOne({ username: username });
    const msg = { username: username, following: user === null || user === void 0 ? void 0 : user.friends };
    res.send(msg);
});
exports.getFollowing = getFollowing;
const addFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newFriend = req.params.user;
    const username = req.body.username;
    const newFriends = yield Profile_1.Profile.findOneAndUpdate({ username: username }, { $push: { friends: newFriend } }, { new: true });
    const msg = { username: username, following: newFriends === null || newFriends === void 0 ? void 0 : newFriends.friends };
    res.send(msg);
});
exports.addFollowing = addFollowing;
const deleteFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteFriend = req.params.user;
    const username = req.body.username;
    const updateFriends = yield Profile_1.Profile.findOneAndUpdate({ username: username }, { $pull: { friends: deleteFriend } }, { new: true });
    const msg = { username: username, following: updateFriends === null || updateFriends === void 0 ? void 0 : updateFriends.friends };
    res.send(msg);
});
exports.deleteFollowing = deleteFollowing;
const getFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const result = yield getFriendData(username);
    const msg = { username: username, friends: result.friends };
    res.status(200).send(msg);
});
exports.getFriends = getFriends;
const addFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const newUser = req.params.user;
    // 1. first check if newUser exists
    const userExist = yield Profile_1.Profile.findOne({ username: newUser });
    if (userExist === null) {
        res.sendStatus(404); // resources cannot find
        return;
    }
    // 2. check if newUser == current user
    if (username === newUser) {
        res.sendStatus(403); // forbidden
        return;
    }
    // 3. check if newUser already a friend
    const duplicateUser = yield Profile_1.Profile.findOne({ username: username, friends: newUser });
    if (duplicateUser !== null) {
        console.log(123);
        res.sendStatus(409); // conflict
        return;
    }
    yield Profile_1.Profile.findOneAndUpdate({ username: username }, { $push: { friends: newUser } }, { new: true });
    const result = yield getFriendData(username);
    const msg = { username: username, friends: result.friends };
    res.status(200).send(msg);
});
exports.addFriend = addFriend;
const deleteFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const deleteUser = req.params.user;
    yield Profile_1.Profile.findOneAndUpdate({ username: username }, { $pull: { friends: deleteUser } }, { new: true });
    const result = yield getFriendData(username);
    const msg = { username: username, friends: result.friends };
    res.status(200).send(msg);
});
exports.deleteFriend = deleteFriend;
const getFriendData = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const agg = [
        {
            '$match': {
                'username': username
            }
        }, {
            '$project': {
                'friends': 1
            }
        }, {
            '$lookup': {
                'from': 'profiles',
                'localField': 'friends',
                'foreignField': 'username',
                'as': 'friends',
                'pipeline': [
                    {
                        '$project': {
                            '_id': 0,
                            'username': 1,
                            'headline': 1,
                            'avatar': 1
                        }
                    }
                ]
            }
        }
    ];
    const result = yield Profile_1.Profile.aggregate(agg);
    return result[0];
});
