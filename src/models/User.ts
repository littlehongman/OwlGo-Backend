import mongoose from "mongoose"
import { IUser } from "../utils/types"


const userSchema = new mongoose.Schema<IUser>({
	username: { type: String, required: [true, 'Username is required']},
	salt:{ type: String },
	hash:{ type: String },	
	googleId: { type: String }
})

export const User = mongoose.model('user', userSchema) // user ==> collection name

// module.exports = { userSchema }