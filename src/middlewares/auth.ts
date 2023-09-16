import express, { Router, Request, Response, NextFunction } from 'express';
import { Profile } from '../models/Profile';
import { User } from '../models/User';

import passport from "passport";
import { BASE_URL, COOKIE_KEY, MODE } from '../utils/secrets';

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

 
    let sessionId = req.cookies[cookieKey];

    // no sid for cookie key
    if (!sessionId) {
        return res.sendStatus(401);
    }


    
    let username = sessionUser[sessionId];

    if (username) {
        req.body.username = username;
        next(); //next line in app.js
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
        avatar: "https://res.cloudinary.com/hy5tq5fzy/image/upload/v1670091793/blank-profile-picture-973460__480_w245yt.webp",
        friends: ['Mack'],
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
        // Generate a session by the server, and store in the map 'sessionUser'
        // sessionUser  Key: sessionId, Value: username
        let sessionId = md5(username) 
        sessionUser[sessionId] = username;
	    
        // Set and store the sessionId using cookie
        if (MODE === "development"){
            res.cookie(cookieKey, sessionId, { maxAge: 3600 * 1000, httpOnly: true});//, secure: true });
        }
        else{
            res.cookie(cookieKey, sessionId, { maxAge: 3600 * 1000, httpOnly: true, secure: true, sameSite: 'none'});//, secure: true });
        }
    
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
    // res.clearCookie('express:sess');
    // res.clearCookie('express:sess.sig');
    // res.clearCookie('connect.sid');
    
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

router.get("/auth/google", (req, res) => {
    const state: string = <string> req.query.state!;
    
    passport.authenticate("google", { // strategy: google
      scope: ["email", "profile"],
      state: state,
      session: false
    })(req, res);
});
  
  
router.get("/auth/google/redirect", passport.authenticate("google" , {failureRedirect: BASE_URL }), (req, res) => {
// const session: any = req.session;
// const user: any = session.passport;
    const googleUser: any = req.user
    console.log(googleUser);


    if (req.query.state === 'login'){
        let sessionId = md5(googleUser.username) // CHANGE THIS! 
        sessionUser[sessionId] = googleUser.username;

        if (MODE === "development"){
            res.cookie(cookieKey, sessionId, { maxAge: 3600 * 1000, httpOnly: true});
        }
        else{
            res.cookie(cookieKey, sessionId, { maxAge: 3600 * 1000, httpOnly: true, secure: true, sameSite: 'none'});//, secure: true });
        }

        
        res.redirect(`${BASE_URL}/main?username=${googleUser.username}`);
    }

    else{ // if it's not login, then redirect back to profile page
        res.redirect(`${BASE_URL}/profile`);
    }
});


router.post('/login', login);
router.post('/register', register);

router.use('/', isLoggedIn);
router.put('/logout', logout);
router.put('/password', changePassword);

export default router


