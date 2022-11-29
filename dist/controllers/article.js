"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTest = exports.updatePost = exports.createPost = exports.getPosts = void 0;
const Article_1 = require("../models/Article");
const Profile_1 = require("../models/Profile");
const uploadCloudinary_1 = require("../utils/uploadCloudinary");
const profile_1 = require("./profile");
// findOneAndUpdate (and its variants) return the document before the update by default, if you want the updated document, use new: true
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // If specify id => return all posts of the user
    if (req.params.id !== undefined) {
        const arg = parseInt(req.params.id);
        if (isNaN(arg)) { // if params.id is username
            const username = req.params.id;
            const userPosts = yield Article_1.Article.find({ 'author.username': username });
            res.send({ articles: userPosts });
            return;
        }
        else {
            const postId = arg;
            const post = yield Article_1.Article.findOne({ pid: postId });
            res.send({ article: post });
            return;
        }
    }
    // If no specify => return posts for current user
    const username = req.body.username;
    // const user: IProfile | null = await Profile.findOne({ username: username });
    // const friends: string[] | undefined = user?.friends;
    // const posts = await Article.find({ $or: [ { 'author.username': { $in: friends } }, { 'author.username': username } ] }).sort({ 'timestamp': -1 });
    const result = yield getAllPosts(username);
    res.send({ articles: result.posts });
});
exports.getPosts = getPosts;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postNum = yield Article_1.Article.countDocuments({});
    const username = req.body.username;
    const userAvatar = yield (0, profile_1.getAvatar)(username);
    let imageURL = "";
    // console.log(req.file);
    // console.log(req.body);
    if (req.file !== undefined) {
        imageURL = yield (0, uploadCloudinary_1.uploadImage)(req);
    }
    const newPost = yield new Article_1.Article({
        pid: postNum,
        author: {
            username: username,
            avatar: userAvatar,
        },
        text: req.body.text,
        img: imageURL,
        timestamp: Date.now()
    }).save();
    // await newPost.save();
    // const allPosts: any = await Article.find({ 'author.username': username });
    // res.send({ articles: allPosts.posts });
    const result = yield getAllPosts(username);
    res.send({ articles: result.posts });
});
exports.createPost = createPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pid = req.params.id;
    const username = req.body.username;
    //const userId: number = (await Profile.findOne({ username: req.body.username }))?.id
    const post = yield Article_1.Article.findOne({ pid: pid });
    const text = req.body.text;
    // Check if comments 
    if (req.body.commentId !== undefined) {
        const commentId = req.body.commentId;
        if (commentId === "-1") {
            const newComment = {
                cid: post === null || post === void 0 ? void 0 : post.comments.length,
                author: {
                    username: username,
                    avatar: req.body.avatar
                },
                text: text,
                timestamp: Date.now()
            };
            const newPost = yield Article_1.Article.findOneAndUpdate({ pid: pid }, { $push: { comments: newComment } }, { new: true });
            res.send(newPost);
            return;
        }
        else {
            // check if the user owned the comment
            const comment = post === null || post === void 0 ? void 0 : post.comments[commentId];
            if ((comment === null || comment === void 0 ? void 0 : comment.author.username) !== username) {
                res.sendStatus(401);
                return;
            }
            else {
                // update the comment
                const updatedPost = yield Article_1.Article.findOneAndUpdate({ pid: pid, 'comments.cid': commentId }, {
                    $set: {
                        'comments.$.text': text,
                        'comments.$.timestamp': Date.now()
                    }
                }, { new: true });
                res.send({ 'article': updatedPost }); // 
                return;
            }
        }
    }
    // Update Post
    // check if the user owned the post
    if ((post === null || post === void 0 ? void 0 : post.author.username) !== username) {
        res.sendStatus(401);
        return;
    }
    else {
        const newPost = yield Article_1.Article.findOneAndUpdate({ pid: pid }, { text: text }, { new: true });
        res.send(newPost);
    }
});
exports.updatePost = updatePost;
const getAllPosts = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const agg = [
        {
            '$match': {
                'username': username
            }
        }, {
            '$lookup': {
                'from': 'articles',
                'let': {
                    'username': '$username',
                    'friends': '$friends'
                },
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$or': [
                                    {
                                        '$eq': [
                                            '$$username', '$author.username'
                                        ]
                                    }, {
                                        '$in': [
                                            '$author.username', '$$friends'
                                        ]
                                    }
                                ]
                            }
                        }
                    }, {
                        '$sort': {
                            'timestamp': -1
                        }
                    }
                ],
                'as': 'posts'
            }
        }, {
            '$project': {
                '_id': 0,
                'posts': 1
            }
        }
    ];
    const result = yield Profile_1.Profile.aggregate(agg);
    return result[0];
});
const updateTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Article_1.Article.updateMany({}, { $set: { "comments.$[elem].author.username": "Barry" } }, { arrayFilters: [{ "elem.author.username": { "$eq": "Jack" } }] });
    yield Article_1.Article.updateMany({ 'author.username': "Barry" }, { $set: { "author.username": "Mack" } });
    res.sendStatus(200);
});
exports.updateTest = updateTest;
