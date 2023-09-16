import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import { Article } from "../models/Article";
import { Profile } from "../models/Profile";
import { User } from "../models/User";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, MODE } from "../utils/secrets";
import { IProfile, IUser } from "../utils/types";
import { getRandomString } from "../utils/random";
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
      callbackURL: MODE === "development"? "http://localhost:4000/auth/google/redirect" : "https://owl-go.herokuapp.com/auth/google/redirect",
      passReqToCallback: true,
	  //proxy: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
	// This part is verify callback
	// done(error, user)
	// done(null, user) => No error

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
						const username: string = profile.name?.givenName + '-'+ getRandomString(3);

						const newUser = new User({ 
							username: username, 
							googleId: profile.id
						});
	
						newUser.save().then((res: any) => {
							// console.log(res);
							done(null, res);
						})
	
						const newProfile = new Profile({
							username: username, 
							email: profile.emails?.[0].value,
							avatar: profile.photos?.[0].value,
							friends: ['Mack']
						})
	
						newProfile.save();
	
					} 
					else{ // if googleId in database => login User
						done(null, user);
					} 
				})
			}
			else { // if has username => link account
				const username = req.query.state;
				const currentUser: IUser | null = await User.findOne({ username: username });
				const googleUser: IUser | null = await User.findOne({ googleId: profile.id });

				if (!googleUser){
					currentUser!.googleId = profile.id;
					await currentUser!.save();

					done(null, currentUser!);
				}

				else{
					console.log(currentUser, googleUser);
					const currentProfile: IProfile | null = await Profile.findOne({ username: username });
					const googleProfile: IProfile | null = await Profile.findOne({username: googleUser.username });

					// Merge Comments
					await Article.updateMany(
						{ },
						{ $set: { "comments.$[elem].author.username" : username, "comments.$[elem].author.avatar": currentProfile!.avatar} },
						{ arrayFilters: [ { "elem.author.username": {"$eq": googleUser.username} } ] }
					)

					// Merge Articles
					await Article.updateMany(
						{ 'author.username': googleUser.username },
						{ $set: { "author.username" : username, 'author.avatar': currentProfile!.avatar} },
					)

					// Merge Following
					const friendUnion = [...new Set([...currentProfile!.friends, ...googleProfile!.friends])];
					currentProfile!.friends = friendUnion.filter(u => u !== username);
					//console.log(currentProfile!.friends);
					await currentProfile!.save();
					

					// Delete Account
					await User.deleteOne({ username: googleUser.username});
					await Profile.deleteOne({username: googleUser.username});

					currentUser!.googleId = googleUser.googleId;
					await currentUser!.save();


					done(null, currentUser!);
				}
			}
		}
		catch (e: any){
			done(e, undefined);
		}
		
	}
  )
);
