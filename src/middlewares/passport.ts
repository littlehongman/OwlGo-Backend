import { Router } from "express";
import cookieSession from "cookie-session";
import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../utils/secrets";
const GoogleStrategy = passportGoogle.Strategy;
const router = Router();



router.use(cookieSession({
    secret: 'doNotGuessTheSecret',
}));

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user!);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // get profile details
      // save profile details in db
    }
  )
);

//router.get('/auth/google', passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/plus.login'] })); // could have a passport auth second arg {scope: 'email'}
router.get('/auth/google', passport.authenticate("google", {
    scope: ["email", "profile"],
})); // could have a passport auth second arg {scope: 'email'}

// router.get("/auth/google/callback", passport.authenticate("google"), (req, res) => {
//     res.send("This is the callback route");
//     console.log(123);
//     //res.redirect("https://www.rice.edu/")
// });

router.get('/auth/google/callback',
    passport.authenticate('google', { 
        successRedirect: 'http://localhost:4000', 
        failureRedirect: '/' 
    })
);




export default router