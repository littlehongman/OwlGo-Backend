import { RequestHandler } from 'express';
import { Article } from '../models/Article'
import { Profile } from '../models/Profile';
import { IComment, IProfile } from '../utils/types';

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
        pid: postNum,
        userId: userId,
        text: req.body.text,
        img: "",
        timestamp: Date.now().toString()
    });

    await newPost.save();

    const allPosts = await Article.find({userId: userId});

    res.send(allPosts);
}

export const updatePost: RequestHandler = async(req, res) => {
    const pid = req.params.id;
    const userId: number = (await Profile.findOne({ username: req.body.username }))?.id
    const post = await Article.findOne({ pid: pid });
    
    const text = req.body.text;

    // Check if comments 
    if (req.body.commentId){
        const commentId = req.body.commentId;
        
        if (commentId == "-1"){
            const newComment: IComment = {
                cid: post?.comments.length?? 0,
                userId: userId,
                text: text,
                timestamp: Date.now().toString()
            }

            const newPost = await Article.findOneAndUpdate({ pid: pid }, { $push: { comments: newComment } }, { new: true });
            
            res.send(newPost);
            return;
        }
        else{
            // check if the user owned the comment
            const comment = post?.comments[commentId]

            if (comment?.userId !== userId){
                res.sendStatus(401);
                return;
            }
            else{
                // update the comment
                const newPost = await Article.findOneAndUpdate(
                    { pid: pid, 'comments.cid': commentId }, 
                    { 
                        $set: {
                            'comments.$.text': text,
                            'comments.$.timestamp': Date.now().toString()
                        }
                    },
                    { new: true }
                )

                res.send(newPost);
                return;
            }
        }
    }
    // Update Post

     // check if the user owned the post
     if (post?.userId !== userId){
         res.sendStatus(401);
         return;
     }
     else{
        const newPost = await Article.findOneAndUpdate({ pid: pid }, { text: text }, { new: true});

        res.send(newPost);
     }
} 