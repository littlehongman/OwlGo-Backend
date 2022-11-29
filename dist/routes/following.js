"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const following_1 = require("../controllers/following");
const router = (0, express_1.Router)();
router.get('/following/:user?', following_1.getFollowing);
router.put('/following/:user', following_1.addFollowing);
router.delete('/following/:user', following_1.deleteFollowing);
router.get('/friends', following_1.getFriends);
router.put('/friends/:user', following_1.addFriend);
router.delete('/friends/:user', following_1.deleteFriend);
exports.default = router;
