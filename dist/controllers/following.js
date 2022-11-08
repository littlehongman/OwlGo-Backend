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
exports.deleteFriend = exports.addFriend = exports.getFriends = void 0;
const Profile_1 = require("../models/Profile");
const getFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username = "";
    // If specify id => return all posts of the user
    if (req.params.id) {
        username = req.params.user;
    }
    else {
        username = req.body.username;
    }
    const user = yield Profile_1.Profile.findOne({ username: username });
    // const friendsId = user?.friends;
    // const agg = [
    //     {
    //         '$match': {
    //         'id': {
    //             '$in': friendsId,
    //         }
    //         }
    //     }, {
    //         '$project': {
    //         'username': 1, 
    //         '_id': 0
    //         }
    //     }
    //     ];
    // const friends = await Profile.aggregate(agg);
    const msg = { username: username, following: user === null || user === void 0 ? void 0 : user.friends };
    res.send(msg);
});
exports.getFriends = getFriends;
const addFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newFriend = req.params.user;
    const username = req.body.username;
    const newFriends = yield Profile_1.Profile.findOneAndUpdate({ username: username }, { $push: { friends: newFriend } }, { new: true });
    const msg = { username: username, following: newFriends === null || newFriends === void 0 ? void 0 : newFriends.friends };
    res.send(msg);
});
exports.addFriend = addFriend;
const deleteFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteFriend = req.params.user;
    const username = req.body.username;
    const updateFriends = yield Profile_1.Profile.findOneAndUpdate({ username: username }, { $pull: { friends: deleteFriend } }, { new: true });
    const msg = { username: username, following: updateFriends === null || updateFriends === void 0 ? void 0 : updateFriends.friends };
    res.send(msg);
});
exports.deleteFriend = deleteFriend;
