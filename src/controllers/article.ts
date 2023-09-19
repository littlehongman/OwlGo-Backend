import { RequestHandler } from 'express';
import { Article } from '../models/Article'
import { Profile } from '../models/Profile';
import { IComment, IProfile } from '../utils/types';
import { uploadImage } from '../utils/uploadCloudinary';
import { getAvatar } from './profile';

// findOneAndUpdate (and its variants) return the document before the update by default, if you want the updated document, use new: true

export const getPosts: RequestHandler = async(req, res) => {
    
    // If specify id => return all posts of the user
    if (req.params.id !== undefined){
        const arg = parseInt(req.params.id);

        // Get the articles that belong this username
        if (isNaN(arg)){ // if params.id is username
            const username: string = req.params.id;
            const userPosts = await Article.find({'author.username': username});


            res.status(200).send({ articles: userPosts });
        } 
        // Get the article with the id
        else{
            const postId: number = arg;
            const post = await Article.findOne({ pid: postId });

            res.status(200).send({ article: post });
        }
    }

    // If no specify => return posts for current user
    const username: string = req.body.username;
    // const user: IProfile | null = await Profile.findOne({ username: username });
    // const friends: string[] | undefined = user?.friends;

    // const posts = await Article.find({ $or: [ { 'author.username': { $in: friends } }, { 'author.username': username } ] }).sort({ 'timestamp': -1 });
    const result = await getAllPosts(username);

    res.send({ articles: result.posts });
}

export const createPost: RequestHandler = async(req, res) => {
    const postNum: number = await Article.countDocuments({});
    const username: string = req.body.username;
    const userAvatar: string = await getAvatar(username);

    let imageURL: any = "";


    if (req.file !== undefined){
        imageURL = await uploadImage(req);
    }

    // Create new post
    await new Article({ 
        pid: postNum,
        author: {
            username: username,
            avatar: userAvatar,
        },
        text: req.body.text,
        img: imageURL,
        timestamp: Date.now()
    }).save();


    const result = await getAllPosts(username);

    res.status(200).send({ articles: result.posts });
}

// Update the post content or Update a comment or Create a comment
export const updatePost: RequestHandler = async(req, res) => {
    const pid = req.params.id;
    const username: string = req.body.username;
    //const userId: number = (await Profile.findOne({ username: req.body.username }))?.id
    const post = await Article.findOne({ pid: pid });
    
    const text = req.body.text;

    // Check if comments 
    if (req.body.commentId !== undefined){
        const commentId = req.body.commentId;

        // Add new comment
        if (commentId === "-1"){
            const newComment: IComment = {
                cid: post?.comments.length!,
                author: {
                    username: username,
                    avatar: req.body.avatar
                },
                text: text,
                timestamp: Date.now()
            }

            const newPost = await Article.findOneAndUpdate({ pid: pid }, { $push: { comments: newComment } }, { new: true });
            
            res.status(200).send({'article': newPost});
        }
        else{
            // check if the user owned the comment
            const comment = post?.comments[commentId]

            if (comment?.author.username !== username){
                res.status(403).send("This user does not owned the requested comment");
            }
            else{
                // update the comment
                const updatedPost = await Article.findOneAndUpdate(
                    { pid: pid, 'comments.cid': commentId }, 
                    { 
                        $set: {
                            'comments.$.text': text,
                            'comments.$.timestamp': Date.now()
                        }
                    },
                    { new: true }
                )

                res.status(200).send({'article': updatedPost}); 
            }
        }
    }
    // Update Post

     // check if the user owned the post
    if (post?.author.username !== username){
        res.status(403).send("This user does not owned the requested post");
    }
    else{
        const newPost = await Article.findOneAndUpdate({ pid: pid }, { text: text }, { new: true });

        res.status(200).send({'article': newPost});
    }
} 


const getAllPosts = async(username: string) =>{
    
    // Use the MongoDB aggregate pipeline
    // Get all posts for the user itself and posts from all of his friends
    const agg: any = [
        {   
            '$match': { // First find the user document (Only one)
                'username': username
            }
        }, 
        {
            '$lookup': { // Perform a JOIN operation
                'from': 'articles', // Join with table "articles"
                'let': { // Set the column 'username' equals to the value from the document
                    'username': '$username', 
                    'friends': '$friends'
                }, 
                'pipeline': [ 
                    // $variable is the document array field 
                    // $$variable is the variable you set in let{}
                    {
                        '$match': {
                            '$expr': { // build query expressions that compare fields from the same document
                                '$or': [ // Either of condition will be included
                                    {
                                        '$eq': [
                                            '$$username', '$author.username' // If the author of any posts is user itself
                                        ]
                                    }, {
                                        '$in': [
                                            '$author.username', '$$friends' // If the author of any posts is friend with user
                                        ]
                                    }
                                ]
                            }
                        }
                    }, 
                    {
                        '$sort': { // The latest posts stay on top
                            'timestamp': -1
                        }
                    }
                ], 
                'as': 'posts'
            }
        }, 
        {
            '$project': { // Project only the 'posts' field
                '_id': 0, 
                'posts': 1
            }
        }
    ];
  
    const result = await Profile.aggregate(agg);
  

    return result[0];
}
