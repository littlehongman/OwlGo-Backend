import { RequestHandler } from "express";
import { Profile } from "../models/Profile";

export const getFollowing: RequestHandler = async(req, res) => {
    let username: string = ""
    
    // If specify id => return all posts of the user
    if (req.params.id){
        username = req.params.user;
    }
    else{
        username = req.body.username;
    }

    const user = await Profile.findOne({ username: username});
    const msg = { username: username, following: user?.friends };

    res.send(msg)
}


export const addFollowing: RequestHandler = async(req, res) => {
    const newFriend: string = req.params.user;
    const username: string = req.body.username;

    const newFriends = await Profile.findOneAndUpdate({ username: username }, { $push: { friends: newFriend } }, { new: true });

    const msg = { username: username, following: newFriends?.friends };

    res.send(msg);

}

export const deleteFollowing: RequestHandler = async(req, res) => {
    const deleteFriend: string = req.params.user;
    const username: string = req.body.username;

    const updateFriends = await Profile.findOneAndUpdate({ username: username }, { $pull: { friends: deleteFriend } }, { new: true });

    const msg = { username: username, following: updateFriends?.friends };

    res.send(msg);
}

export const getFriends: RequestHandler = async(req, res) => {
    const username: string = req.body.username;

    const result = await getFriendData(username);

    const msg = { username: username, friends: result.friends };

    res.status(200).send(msg)
}

export const addFriend: RequestHandler = async(req, res) => {
    const username: string = req.body.username;
    const newUser: string = req.params.user;

    // 1. first check if newUser exists
    const userExist = await Profile.findOne({ username: newUser });
    
    if (userExist === null){
        res.status(404).send("Username not found");; // resources cannot find

        return;
    }

    // 2. check if newUser == current user
    if (username === newUser){
        res.status(403).send("You cannot as yourself as friend"); // forbidden

        return;
    }

    // 3. check if newUser already a friend
    const duplicateUser = await Profile.findOne({ username: username, friends: newUser });

    if (duplicateUser !== null){
        res.status(409).send("Already a friend with the user");; // conflict

        return;
    }

    await Profile.findOneAndUpdate({ username: username }, { $push: { friends: newUser } }, { new: true });

    const result = await getFriendData(username);

    const msg = { username: username, friends: result.friends };

    res.status(200).send(msg);

}

export const deleteFriend: RequestHandler = async(req, res) => {
    const username: string = req.body.username;
    const deleteUser: string = req.params.user;

    await Profile.findOneAndUpdate({ username: username }, { $pull: { friends: deleteUser } }, { new: true });

    const result = await getFriendData(username);

    const msg = { username: username, friends: result.friends };

    res.status(200).send(msg);

}



const getFriendData = async(username: string) => {

    // Use the MongoDB aggregate pipeline
    // Get all information about the user's friends

    const agg = [
        {
            '$match': { // First find the user document (Only one)
                'username': username
            }
        }, 
        {
            '$project': { // Project the friend column
                'friends': 1
            }
        }, 
        {
            '$lookup': { // Perform Self JOIN on table 'profiles'
                'from': 'profiles', 
                // Match the values from the "friends" list from table 'profile' to the 'username' column
                'localField': 'friends', 
                'foreignField': 'username', 
                'as': 'friends', // New array name
                'pipeline': [
                    {
                        '$project': { // Project these columns
                            '_id': 0, 
                            'username': 1, 
                            'headline': 1, 
                            'avatar': 1
                        }
                    }
                ]
            }
        }
    ];
    
    const result = await Profile.aggregate(agg);
    
    return result[0];
}