import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import { Profile } from "../models/Profile";
import { User } from "../models/User";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../utils/secrets";
import { IUser } from "../utils/types";
const GoogleStrategy = passportGoogle.Strategy;



passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser(async(user: any, done) => {
	User.findOne({ username: user.username }, (err: Error, user: IUser) => {
		if (err) {
			done(err, undefined);
		}
		if (user){
			done(null, user);
		}
	})
	
});

// passport.deserializeUser(async (id, done) => {
//   const user = await User.findById(id);
//   done(null, user);
// });

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    	passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
			//done(null, profile);
        
    //   get profile details
    //   save profile details in db
		try{
			if (req.query.state === "login") { // req.query.state == username
				User.findOne({ googleId: profile.id }, (err: Error, user: IUser) => {
				
					if (err) {
						console.log(err);
						done(err, undefined);
					}
	
					if (!user) { // if googleId not in database => create new User
						const newUser = new User({ 
							username: profile.displayName, 
							googleId: profile.id
						});
	
						newUser.save().then((res: any) => {
							// console.log(res);
							done(null, res);
						})
	
						const newProfile = new Profile({
							username: profile.displayName,
							email: profile.emails?.[0].value,
							avatar: profile.photos?.[0].value,
							friends: []
						})
	
						newProfile.save();
	
						
	
					} 
					else{ // if googleId in database => login User
						done(null, user);
					} 
				})
			}
			else { // if has username => link account
				User.findOne({ username: req.query.state }, async (err: Error, user: IUser) => {
					if (err || !user) {
						done(err, undefined);
					}
					else{
						done(null, user);
					}
	
				});
			}
		}
		catch (e: any){
			done(e, undefined);
		}
		
	}
  )
);
