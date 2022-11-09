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
exports.updatePost = exports.createPost = exports.getPosts = void 0;
const Article_1 = require("../models/Article");
const Profile_1 = require("../models/Profile");
// findOneAndUpdate (and its variants) return the document before the update by default, if you want the updated document, use new: true
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // If specify id => return all posts of the user
    if (req.params.id !== undefined) {
        const arg = parseInt(req.params.id);
        if (isNaN(arg)) { // if params.id is username
            const username = req.params.id;
            const userPosts = yield Article_1.Article.find({ username: username });
            res.send({ articles: userPosts });
            return;
        }
        else {
            const postId = arg;
            console.log(postId);
            const post = yield Article_1.Article.findOne({ pid: postId });
            res.send({ article: post });
            return;
        }
    }
    // If no specify => return posts for current user
    const username = req.body.username;
    const user = yield Profile_1.Profile.findOne({ username: username });
    const friends = user === null || user === void 0 ? void 0 : user.friends;
    const posts = yield Article_1.Article.find({ $or: [{ username: { $in: friends } }, { username: username }] });
    res.send({ articles: posts });
});
exports.getPosts = getPosts;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postNum = yield Article_1.Article.countDocuments({});
    const username = req.body.username;
    const newPost = new Article_1.Article({
        pid: postNum,
        username: username,
        text: req.body.text,
        img: "",
        timestamp: Date.now().toString()
    });
    yield newPost.save();
    const allPosts = yield Article_1.Article.find({ username: username });
    //const allPosts = await getPosts(req, res, );
    res.send({ articles: allPosts });
});
exports.createPost = createPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const pid = req.params.id;
    const username = req.body.username;
    //const userId: number = (await Profile.findOne({ username: req.body.username }))?.id
    const post = yield Article_1.Article.findOne({ pid: pid });
    const text = req.body.text;
    // Check if comments 
    if (req.body.commentId !== '0') {
        const commentId = req.body.commentId;
        if (commentId == "-1") {
            const newComment = {
                cid: (_a = post === null || post === void 0 ? void 0 : post.comments.length) !== null && _a !== void 0 ? _a : 0,
                username: username,
                text: text,
                timestamp: Date.now().toString()
            };
            const newPost = yield Article_1.Article.findOneAndUpdate({ pid: pid }, { $push: { comments: newComment } }, { new: true });
            res.send(newPost);
            return;
        }
        else {
            // check if the user owned the comment
            const comment = post === null || post === void 0 ? void 0 : post.comments[commentId];
            if ((comment === null || comment === void 0 ? void 0 : comment.username) !== username) {
                res.sendStatus(401);
                return;
            }
            else {
                // update the comment
                const newPost = yield Article_1.Article.findOneAndUpdate({ pid: pid, 'comments.cid': commentId }, {
                    $set: {
                        'comments.$.text': text,
                        'comments.$.timestamp': Date.now().toString()
                    }
                }, { new: true });
                res.send(newPost);
                return;
            }
        }
    }
    // Update Post
    // check if the user owned the post
    if ((post === null || post === void 0 ? void 0 : post.username) !== username) {
        res.sendStatus(401);
        return;
    }
    else {
        const newPost = yield Article_1.Article.findOneAndUpdate({ pid: pid }, { text: text }, { new: true });
        res.send(newPost);
    }
});
exports.updatePost = updatePost;
