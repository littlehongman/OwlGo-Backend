import { RequestHandler } from 'express';
import { Profile } from '../models/Profile'
import { IProfile } from '../utils/types';

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
    const newAvatar = req.body.avatar;

    const user = await Profile.findOneAndUpdate({ username: username }, { avatar: newAvatar }, { new: true });

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