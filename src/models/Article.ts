import mongoose from "mongoose"
import { IArticle } from "../utils/types"


const articleSchema = new mongoose.Schema<IArticle>({
	id: { type: Number, required: true},
	userId: { type: Number, required: true},
	text: { type: String, required: true},
	img: { type: String, default: ""},
	timestamp: { type: String, required: true},
	comments: [String]
})

export const Article = mongoose.model('article', articleSchema) // user ==> collection name

// module.exports = { userSchema }