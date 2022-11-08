import { RequestHandler } from "express";
import { Profile } from "../models/Profile";

export const getFriends: RequestHandler = async(req, res) => {
    let username: string = ""
    
    // If specify id => return all posts of the user
    if (req.params.id){
        username = req.params.user;
    }
    else{
        username = req.body.username;
    }

    const user = await Profile.findOne({ username: username});

    // const friendsId = user?.friends;
    // const agg = [
    //     {
    //         '$match': {
    //         'id': {
    //             '$in': friendsId,
    //         }
    //         }
    //     }, {
    //         '$project': {
    //         'username': 1, 
    //         '_id': 0
    //         }
    //     }
    //     ];

    // const friends = await Profile.aggregate(agg);

    const msg = { username: username, following: user?.friends };


    res.send(msg)
}


export const addFriend: RequestHandler = async(req, res) => {
    const newFriend: string = req.params.user;
    const username: string = req.body.username;

    const newFriends = await Profile.findOneAndUpdate({ username: username }, { $push: { friends: newFriend } }, { new: true });

    const msg = { username: username, following: newFriends?.friends };

    res.send(msg);

}

export const deleteFriend: RequestHandler = async(req, res) => {
    const deleteFriend: string = req.params.user;
    const username: string = req.body.username;

    const updateFriends = await Profile.findOneAndUpdate({ username: username }, { $pull: { friends: deleteFriend } }, { new: true });

    const msg = { username: username, following: updateFriends?.friends };

    res.send(msg);
}