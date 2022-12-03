import { RequestHandler } from 'express';
import { Article } from '../models/Article';
import { Profile } from '../models/Profile'
import { User } from '../models/User';
import { IProfile, IUser } from '../utils/types';
import { uploadImage } from '../utils/uploadCloudinary';

export const getUserHeadline: RequestHandler = async(req, res, next) => {
    let username: string = ""

    if (req.params.username){
        username = req.params.username;
    }
    else{
        username = req.body.username;
    }

    const user = await Profile.findOne({ username: username });

    const msg = { username: username, headline: user?.headline };
   
    res.send(msg);
};

export const updateHeadline: RequestHandler = async(req, res) => {
    let newHeadline = req.body.headline;

    const updatedUser = await Profile.findOneAndUpdate({username: req.body.username}, { headline: newHeadline }, { new: true });
    
    res.send({ username: updatedUser?.username, headline: updatedUser?.headline });
}

export const getUserEmail: RequestHandler = async(req, res) => {
    let username: string = "";

    if (req.params.user){
        username = req.params.user;
    }
    else{
        username = req.body.username;
    }


    const user: IProfile | null = await Profile.findOne({ username: username });
    const msg = { username: username, email: user?.email };

    res.send(msg);
}

export const updateEmail: RequestHandler = async(req, res) => {
    const username = req.body.username;
    const newEmail = req.body.email;

    const user = await Profile.findOneAndUpdate({ username: username }, { email: newEmail }, { new: true });

    const msg = { username: username, email: user?.email };

    res.send(msg);
}

export const updatePhone: RequestHandler = async(req, res) => {
    const username = req.body.username;
    const newPhone = req.body.phone;

    const user = await Profile.findOneAndUpdate({ username: username }, { phone: newPhone }, { new: true });

    const msg = { username: username, phone: user?.phone };

    res.send(msg);
}



export const getUserZipcode: RequestHandler = async(req, res) => {
    let username: string = "";

    if (req.params.user){
        username = req.params.user;
    }
    else{
        username = req.body.username;
    }


    const user: IProfile | null = await Profile.findOne({ username: username });

    const msg = { username: username, zipcode: user?.zipCode };

    res.send(msg);
}

export const updateZipcode: RequestHandler = async(req, res) => {
    const username = req.body.username;
    const newZipcode = req.body.zipcode;

    const user = await Profile.findOneAndUpdate({ username: username }, { zipCode: newZipcode }, { new: true });

    const msg = { username: username, zipcode: user?.zipCode };

    res.send(msg);
}


export const getUserAvatar: RequestHandler = async(req, res) => {
    let username: string = "";

    if (req.params.user){
        username = req.params.user;
    }
    else{
        username = req.body.username;
    }


    const user: IProfile | null = await Profile.findOne({ username: username });

    const msg = { username: username, avatar: user?.avatar };

    res.send(msg);
}

export const updateAvatar: RequestHandler = async(req, res) => {
    const username = req.body.username;

    const imageURL = await uploadImage(req);

    const user = await Profile.findOneAndUpdate({ username: username }, { avatar: imageURL }, { new: true });
    
    // need to update all avatar from articles
    await Article.updateMany({'author.username': username}, {'author.avatar': imageURL});

    // update all avatar from comments
    await Article.updateMany(
        { },
        { $set: { "comments.$[elem].author.username" : username, "comments.$[elem].author.avatar": imageURL} },
        { arrayFilters: [ { "elem.author.username": {"$eq": username} } ] }
    )

    const msg = { username: username, avatar: user?.avatar };

    res.send(msg);
}


export const getDateOfBirth: RequestHandler = async(req, res) => {
    let username: string = "";

    if (req.params.user){
        username = req.params.user;
    }
    else{
        username = req.body.username;
    }


    const user: IProfile | null = await Profile.findOne({ username: username });

    const msg = { username: username, dob: user?.birthday };

    res.send(msg);
}

export const getProfile: RequestHandler = async(req, res) => {
    const username = req.body.username;

    const user: IProfile | null = await Profile.findOne({ 'username': username });

    const msg = { username: username, profile: user };

    res.status(200).send(msg);
}

export const getAccount: RequestHandler = async(req, res) => {
    const username = req.body.username;
    const account: any = {};

    const user: IUser | null = await User.findOne({ 'username': username });


    if (user!['salt'] !== undefined){
        account.local = true; // this stands for ordinary registered user
    }
    else{
        account.local = false;
    }

    if (user!['googleId'] !== undefined){
        account.googleId = true;
    }
    else{
        account.googleId = false;
    }

    //console.log(account);
    const msg = { username: username, account: account };

    res.status(200).send(msg);
} 

export const unlinkGoogle: RequestHandler = async(req, res) => {
    const username = req.body.username;

    await User.findOneAndUpdate({ username: username }, { $unset: { googleId: 1 } });

    res.sendStatus(200);
}


// Help function for create new Post
export const getAvatar = async(username: string) => {
    const user: IProfile | null = await Profile.findOne({ username: username }, {avatar: 1});

   
    if (user !== null)
        return user.avatar;
    return "";

}


