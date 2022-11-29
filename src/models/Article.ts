import mongoose from "mongoose"
import { IArticle, IComment } from "../utils/types"


const commentSchema = new mongoose.Schema<IComment>({
	cid: { type: Number, required: true},
    author: {
        username: { type: String, required: true},
        avatar: { type: String, required: true}
    },
    text: { type: String, required: true},
    timestamp: { type: Number, required: true},
})

const articleSchema = new mongoose.Schema<IArticle>({
	pid: { type: Number, required: true},
	author: {
		username: { type: String, required: true},
		avatar: { type: String, required: true}
	},
	text: { type: String, required: true},
	img: { type: String, default: ""},
	timestamp: { type: Number, required: true},
	comments: [commentSchema]
})

export const Article = mongoose.model('article', articleSchema) // user ==> collection name

// module.exports = { userSchema }