import { Router } from "express";
import cookieSession from "cookie-session";
import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import { BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../utils/secrets";
import { User } from "../models/User";
import { Profile } from "../models/Profile";
import { IUser } from "../utils/types";

const router = Router();


// router.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["email", "profile"],
//   })
// );




// Callback route after logging in
// router.get("/auth/google/redirect", passport.authenticate('google', { successRedirect: 'http://localhost:3000',
//         failureRedirect: '/' }));

router.get("/auth/google", (req, res) => {
  const state: string = <string> req.query.state!;
  
  passport.authenticate("google", { // strategy: google
    scope: ["email", "profile"],
    state: state,
    session: false
  })(req, res);
});

// router.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["email", "profile"],
//     state: "login"
//   })
// );


router.get("/auth/google/redirect", passport.authenticate("google" , {failureRedirect: BASE_URL }), async(req, res) => {
  // const session: any = req.session;
  // const user: any = session.passport;
  const googleUser: any = req.user

  
  if (req.query.state === 'login'){
      res.redirect(`${BASE_URL}/main?username=${googleUser.username}`);
  }

  else{
      res.redirect(`${BASE_URL}/profile`);
  }
});


            

export default router