import { RequestHandler } from 'express';
import { Article } from '../models/Article'
import { Profile } from '../models/Profile';
import { IProfile } from '../utils/types';

// findOneAndUpdate (and its variants) return the document before the update by default, if you want the updated document, use new: true

export const getPosts: RequestHandler = async(req, res) => {
    
    // If specify id => return all posts of the user
    if (req.params.id){
        const userId: number = (await Profile.findOne({ username: req.params.id }))?.id
        const userPosts = await Article.find({userId: userId});

        res.send(userPosts);

        return
    }
    // If no specify => return posts for current user
    const user: IProfile | null = await Profile.findOne({ username: req.body.username });
    const friends: number[] | undefined = user?.friends;

    const posts = await Article.find({ $or: [ { userId: { $in: friends } }, { userId: user?.id } ] })

    res.send(posts)
}

export const createPost: RequestHandler = async(req, res) => {
    const postNum: number = await Article.countDocuments({});
    const userId: number = (await Profile.findOne({ username: req.body.username }))?.id

    
    const newPost = new Article({ 
        id: postNum,
        userId: userId,
        text: req.body.text,
        img: "",
        timestamp: Date.now().toString()
    });

    await newPost.save();

    const allPosts = await Article.find({userId: userId});

    res.send(allPosts);
}