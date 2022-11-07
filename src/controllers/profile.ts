import { RequestHandler } from 'express';
import { Profile } from '../models/Profile'

export const getUserHeadline: RequestHandler = async(req, res, next) => {
    let username: string = ""

    if (req.params.username){
        username = req.params.username;
    }
    else{
        username = req.body.username;
    }

    const user = await Profile.findOne({ username: username });
   
    res.send(user?.headline);
};

export const updateHeadline: RequestHandler = async(req, res) => {
    let newHeadline = req.body.headline;

    const updatedUser = await Profile.findOneAndUpdate({username: req.body.username}, {headline: newHeadline});
    
    res.send({ username: updatedUser?.username, headline: updatedUser?.headline });
}
