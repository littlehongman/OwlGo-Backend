import { RequestHandler } from "express";
import { Profile } from "../models/Profile";

export const getFriends: RequestHandler = async(req, res) => {
    let username: string = ""
    
    // If specify id => return all posts of the user
    if (req.params.id){
        username = req.params.id;
    }
    else{
        username = req.body.username;
    }

    const user = await Profile.findOne({ username: username});

    const friendsId = user?.friends;
    const agg = [
        {
            '$match': {
            'id': {
                '$in': friendsId,
            }
            }
        }, {
            '$project': {
            'username': 1, 
            '_id': 0
            }
        }
        ];

    const friends = await Profile.aggregate(agg);

    const msg = { username: username, following: friends.map(f => f.username)};


    res.send(msg)
}


export const addFriend: RequestHandler = async(req, res) => {

}

export const deleteFriend: RequestHandler = async(req, res) => {
    
}