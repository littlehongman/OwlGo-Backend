import mongoose from "mongoose"
import { IArticle } from "../utils/types"


const articleSchema = new mongoose.Schema<IArticle>({
	pid: { type: Number, required: true},
	userId: { type: Number, required: true},
	text: { type: String, required: true},
	img: { type: String, default: ""},
	timestamp: { type: String, required: true},
	comments: []
})

export const Article = mongoose.model('article', articleSchema) // user ==> collection name

// module.exports = { userSchema }