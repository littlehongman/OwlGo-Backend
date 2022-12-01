import express, { Router, Request, Response, NextFunction } from 'express';
import { Profile } from '../models/Profile';
import { User } from '../models/User';

import passport from "passport";

const md5 = require('md5');
const router = Router();

let sessionUser: {[key: string]: string} = {};
let cookieKey = "sid";

let googleUser: {[key: string]: string} = {};

//let userObjs: {[key: string]: any} = {};

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    // likely didn't install cookie parser
    if (!req.cookies) {
       return res.sendStatus(401);
    }

 
    let sid = req.cookies[cookieKey];

    // no sid for cookie key
    if (!sid && !req.user) {
        return res.sendStatus(401);
    }

    //console.log(sid);
    if (sid){
        let username = sessionUser[sid];
        
        // console.log(username);
        // no username mapped to sid
        if (username) {
            
            req.body.username = username;
            next(); //next line in app.js
        }
        else {
            res.sendStatus(401)
        }
    }
    
    else if (req.user){
        console.log(req.user);
        //check if third-party login
        const user: any = req.user
    
        req.body.username = user.username;  
        // console.log(req.body);
        next();
        
    }
    else {
        res.sendStatus(401)
    }
   


    
}


const register = async(req: Request, res: Response) => {
    let username = req.body.username;
    let password = req.body.password;
    // console.log(username, password);

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    // 1. First check if username if already in DB
    const userExist = await Profile.findOne({ username: username });
    
    if (userExist !== null){
        let msg = "Username alreay taken";
        res.status(409).send(msg)

        return;
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
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        birthday: req.body.birthday,
        zipCode: req.body.zipCode,
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
        return res.status(404);
    }

    // TODO: create hash using md5, user salt and request password, check if hash matches user hash
    let hash = md5(user?.salt + password);

    if (hash === user?.hash) {
        // TODO: create session id, use sessionUser to map sid to user username 
        let sid = md5(username) // CHANGE THIS! 
        sessionUser[sid] = username;
        console.log(username);
	    // Adding cookie for session id
        res.cookie(cookieKey, sid, { maxAge: 3600 * 1000, httpOnly: true});//, secure: true });
        let msg = { username: username, result: 'success'};
        res.status(200).send(msg);
    }
    else {
        res.status(403).send("Wrong password");
    }
}

const logout = (req: Request, res: Response) => {
    // cookie already checked in isLogin
    let sid = req.cookies[cookieKey];
    console.log(sid);
    delete sessionUser[sid]; 

    res.clearCookie('sid');
    res.clearCookie('express:sess');
    res.clearCookie('express:sess.sig');
    res.clearCookie('connect.sid');
    
    res.sendStatus(200);
}

const changePassword = async(req: Request, res: Response) => {
    let username = req.body.username;
    let newPassword = req.body.password;

    let salt = username + new Date().getTime();
    let hash = md5(salt + newPassword)

    const user = await User.findOneAndUpdate({ username: username }, { salt: salt, hash: hash}, { new: true });
    const msg = { username: username, result: 'success'}


    res.send(msg);
}


router.post('/login', login);
router.post('/register', register);

router.use('/', isLoggedIn);
router.put('/logout', logout);
router.put('/password', changePassword);

export default router


