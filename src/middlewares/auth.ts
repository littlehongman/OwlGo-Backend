import express, { Router, Request, Response, NextFunction } from 'express';
import { Profile } from '../models/Profile';
import { User } from '../models/User';

const md5 = require('md5');
const router = Router();

let sessionUser: {[key: string]: string} = {};
let cookieKey = "sid";

//let userObjs: {[key: string]: any} = {};

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
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
        return res.sendStatus(401)
    }
}


const register = async(req: Request, res: Response) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(username, password);

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    let salt = username + new Date().getTime();
    let hash = md5(salt + password) // TODO: Change this to use md5 to create a hash
    
    //userObjs[username] =  {username: username, salt: salt, hash: hash} // TODO: Change this to store object with username, salt, hash

    // Add documents to MongoDB
    // 1. create user document with hash and salt
    const newUser = new User({ username: username, salt: salt, hash: hash });
    await newUser.save();

    // 2. create user profile
    const userNum: number = await Profile.countDocuments({});

    const newProfile = new Profile({
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
    })
    await newProfile.save();

    let msg = {username: username, result: 'success'};
    res.send(msg);
}

const login = async(req: Request, res: Response) => {
    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    //let user = userObjs[username];
    const user = await User.findOne({ username: username });


    if (!user) {
        return res.sendStatus(401)
    }

    // TODO: create hash using md5, user salt and request password, check if hash matches user hash
    let hash = md5(user?.salt + password);

    if (hash === user?.hash) {
        // TODO: create session id, use sessionUser to map sid to user username 
        let sid = md5(username) // CHANGE THIS! 
        sessionUser[sid] = username;

	    // Adding cookie for session id
        res.cookie(cookieKey, sid, { maxAge: 3600 * 1000, httpOnly: true });
        let msg = {username: username, result: 'success'};
        res.send(msg);
    }
    else {
        res.sendStatus(401);
    }
}

const logout = (req: Request, res: Response) => {
    // cookie already checked in isLogin
    let sid = req.cookies[cookieKey];
    delete sessionUser[sid]; 

    res.send("OK");
}

const changePassword = async(req: Request, res: Response) => {
    let username = req.body.username;
    let newPassword = req.body.password;

    let salt = username + new Date().getTime();
    let hash = md5(salt + newPassword)

    const user = await User.findOneAndUpdate({ username: username }, { salt: salt, hash: hash}, { new: true });
    const msg = { username: username, result: 'success'}


    console.log(user);
    res.send(msg);
}


router.post('/login', login);
router.post('/register', register);

router.use('/', isLoggedIn);
router.put('/logout', logout);
router.put('/password', changePassword);

export default router


