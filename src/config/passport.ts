import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import { Article } from "../models/Article";
import { Profile } from "../models/Profile";
import { User } from "../models/User";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../utils/secrets";
import { IProfile, IUser } from "../utils/types";
const GoogleStrategy = passportGoogle.Strategy;

const getRandomString = (num: number) => {
	const arr = ['1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

	const shuffled = [...arr].sort(() => 0.5 - Math.random());
  
	return shuffled.slice(0, num).join('');
}


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
      passReqToCallback: true,
	  proxy: true
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
				const username = req.query.state;
				const currentUser: IUser | null = await User.findOne({ username: username });
				const googleUser: IUser | null = await User.findOne({ googleId: profile.id });

				if (!googleUser){
					currentUser!.googleId = profile.id;
					await currentUser!.save();

					done(null, currentUser!);
				}

				else{
					const currentProfile: IProfile | null = await Profile.findOne({ username: username });
					const googleProfile: IProfile | null = await Profile.findOne({username: googleUser.username });

					// Merge Posts
					await Article.updateMany(
						{ },
						{ $set: { "comments.$[elem].author.username" : username, "comments.$[elem].author.avatar": currentProfile!.avatar} },
						{ arrayFilters: [ { "elem.author.username": {"$eq": googleUser.username} } ] }
					)

					// Merge Comments
					await Article.updateMany(
						{ 'author.username': "Barry"},
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
		catch (e: any){
			done(e, undefined);
		}
		
	}
  )
);
