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
const express_1 = require("express");
const Profile_1 = require("../models/Profile");
const User_1 = require("../models/User");
const md5 = require('md5');
const router = (0, express_1.Router)();
let sessionUser = {};
let cookieKey = "sid";
//let userObjs: {[key: string]: any} = {};
const isLoggedIn = (req, res, next) => {
    // likely didn't install cookie parser
    if (!req.cookies) {
        return res.sendStatus(401);
    }
    let sid = req.cookies[cookieKey];
    // no sid for cookie key
    if (!sid) {
        return res.sendStatus(401);
    }
    let username = sessionUser[sid];
    // no username mapped to sid
    if (username) {
        req.body.username = username;
        next(); //next line in app.js
    }
    else {
        return res.sendStatus(401);
    }
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username = req.body.username;
    let password = req.body.password;
    console.log(username, password);
    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }
    // 1. First check if username if already in DB
    const userExist = yield Profile_1.Profile.findOne({ username: username });
    if (userExist !== null) {
        let msg = { username: username, result: 'success' };
        res.send(msg);
        return;
    }
    let salt = username + new Date().getTime();
    let hash = md5(salt + password); // TODO: Change this to use md5 to create a hash
    //userObjs[username] =  {username: username, salt: salt, hash: hash} // TODO: Change this to store object with username, salt, hash
    // Add documents to MongoDB
    // 1. create user document with hash and salt
    const newUser = new User_1.User({ username: username, salt: salt, hash: hash });
    yield newUser.save();
    // 2. create user profile
    const userNum = yield Profile_1.Profile.countDocuments({});
    const newProfile = new Profile_1.Profile({
        //id: userNum,
        username: username,
        name: "",
        email: "www@rice.edu",
        phone: "123-123-1234",
        birthday: Date.now().toString(),
        zipCode: "77005",
        avatar: "https://api.lorem.space/image/face?w=150&h=150&hash=" + userNum,
        friends: [],
        headline: "Actively being loser"
    });
    yield newProfile.save();
    let msg = { username: username, result: 'success' };
    res.send(msg);
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username = req.body.username;
    let password = req.body.password;
    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }
    //let user = userObjs[username];
    const user = yield User_1.User.findOne({ username: username });
    if (!user) {
        return res.sendStatus(401);
    }
    // TODO: create hash using md5, user salt and request password, check if hash matches user hash
    let hash = md5((user === null || user === void 0 ? void 0 : user.salt) + password);
    if (hash === (user === null || user === void 0 ? void 0 : user.hash)) {
        // TODO: create session id, use sessionUser to map sid to user username 
        let sid = md5(username); // CHANGE THIS! 
        sessionUser[sid] = username;
        // Adding cookie for session id
        res.cookie(cookieKey, sid, { maxAge: 3600 * 1000, httpOnly: true });
        let msg = { username: username, result: 'success' };
        res.send(msg);
    }
    else {
        res.sendStatus(401);
    }
});
const logout = (req, res) => {
    // cookie already checked in isLogin
    let sid = req.cookies[cookieKey];
    delete sessionUser[sid];
    res.sendStatus(200);
};
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username = req.body.username;
    let newPassword = req.body.password;
    let salt = username + new Date().getTime();
    let hash = md5(salt + newPassword);
    const user = yield User_1.User.findOneAndUpdate({ username: username }, { salt: salt, hash: hash }, { new: true });
    const msg = { username: username, result: 'success' };
    console.log(user);
    res.send(msg);
});
router.post('/login', login);
router.post('/register', register);
router.use('/', isLoggedIn);
router.put('/logout', logout);
router.put('/password', changePassword);
exports.default = router;
