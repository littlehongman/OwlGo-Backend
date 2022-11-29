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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const Article_1 = require("../models/Article");
const Profile_1 = require("../models/Profile");
const User_1 = require("../models/User");
const secrets_1 = require("../utils/secrets");
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
const getRandomString = (num) => {
    const arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num).join('');
};
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.User.findOne({ username: user.username }, (err, user) => {
        if (err) {
            done(err, undefined);
        }
        if (user) {
            done(null, user);
        }
    });
}));
// passport.deserializeUser(async (id, done) => {
//   const user = await User.findById(id);
//   done(null, user);
// });
passport_1.default.use(new GoogleStrategy({
    clientID: secrets_1.GOOGLE_CLIENT_ID,
    clientSecret: secrets_1.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/redirect",
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    //done(null, profile);
    //   get profile details
    //   save profile details in db
    try {
        if (req.query.state === "login") { // req.query.state == username
            User_1.User.findOne({ googleId: profile.id }, (err, user) => {
                var _a, _b, _c;
                if (err) {
                    console.log(err);
                    done(err, undefined);
                }
                if (!user) { // if googleId not in database => create new User
                    const username = ((_a = profile.name) === null || _a === void 0 ? void 0 : _a.givenName) + '-' + getRandomString(3);
                    const newUser = new User_1.User({
                        username: username,
                        googleId: profile.id
                    });
                    newUser.save().then((res) => {
                        // console.log(res);
                        done(null, res);
                    });
                    const newProfile = new Profile_1.Profile({
                        username: username,
                        email: (_b = profile.emails) === null || _b === void 0 ? void 0 : _b[0].value,
                        avatar: (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0].value,
                        friends: []
                    });
                    newProfile.save();
                }
                else { // if googleId in database => login User
                    done(null, user);
                }
            });
        }
        else { // if has username => link account
            const username = req.query.state;
            const currentUser = yield User_1.User.findOne({ username: username });
            const googleUser = yield User_1.User.findOne({ googleId: profile.id });
            if (!googleUser) {
                currentUser.googleId = profile.id;
                yield currentUser.save();
                done(null, currentUser);
            }
            else {
                const currentProfile = yield Profile_1.Profile.findOne({ username: username });
                const googleProfile = yield Profile_1.Profile.findOne({ username: googleUser.username });
                // Merge Posts
                yield Article_1.Article.updateMany({}, { $set: { "comments.$[elem].author.username": username, "comments.$[elem].author.avatar": currentProfile.avatar } }, { arrayFilters: [{ "elem.author.username": { "$eq": googleUser.username } }] });
                // Merge Comments
                yield Article_1.Article.updateMany({ 'author.username': "Barry" }, { $set: { "author.username": username, 'author.avatar': currentProfile.avatar } });
                // Merge Following
                const friendUnion = [...new Set([...currentProfile.friends, ...googleProfile.friends])];
                currentProfile.friends = friendUnion.filter(u => u !== username);
                //console.log(currentProfile!.friends);
                yield currentProfile.save();
                // Delete Account
                yield User_1.User.deleteOne({ username: googleUser.username });
                yield Profile_1.Profile.deleteOne({ username: googleUser.username });
                currentUser.googleId = googleUser.googleId;
                yield currentUser.save();
                done(null, currentUser);
            }
            // User.findOne({ username: username }, async (err: Error, currentUser: IUser) => { // first find the login user
            // 	if (!currentUser || err) {
            // 		done(err, undefined);
            // 	}
            // 	User.findOne({ googleId: profile.id }, (err: Error, googleUser: IUser) => {
            // 		if (!googleUser || err){
            // 			currentUser.googleId = profile.id;
            // 			currentUser.save();
            // 			done(null, currentUser);
            // 		}
            // 		else{ // merge
            // 			Profile.findOne({ username: username }, (err: Error, currentProfile: IProfile) => {
            // 				Profile.findOne({ username: googleUser.username }, (err: Error, googleProfile: IProfile) => {
            // 					// Merge Posts
            // 					Article.updateMany(
            // 						{ },
            // 						{ $set: { "comments.$[elem].author.username" : username, "comments.$[elem].author.avatar": currentProfile.avatar} },
            // 						{ arrayFilters: [ { "elem.author.username": {"$eq": googleUser.username} } ] }
            // 					)
            // 					// Merge Comments
            // 					Article.updateMany(
            // 						{ 'author.username': "Barry"},
            // 						{ $set: { "author.username" : username, 'author.avatar': currentProfile.avatar} },
            // 					)
            // 					// Merge Following
            // 					const friendUnion = [...new Set([...currentProfile.friends, ...googleProfile.friends])];
            // 					currentProfile.friends = friendUnion.filter(u => u !== username);
            // 					console.log(currentProfile.friends);
            // 					currentProfile.save();
            // 					// Delete Account
            // 					User.deleteOne({ username: googleUser.username});
            // 					Profile.deleteOne({username: googleUser.username});
            // 					currentUser.googleId = googleUser.googleId;
            // 					currentUser.save();
            // 					done(null, currentUser);
            // 				});
            // 			})
            // 		}
            // 	})
            // });
        }
    }
    catch (e) {
        done(e, undefined);
    }
})));
