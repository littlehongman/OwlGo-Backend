import mongoose from "mongoose"


interface User{
	username: string;
	salt: string;
	hash?: string;
}

const userSchema = new mongoose.Schema<User>({
	username: { type: String, required: [true, 'Username is required']},
	salt:{ type: String, required: true},
	hash:{ type: String, require: true},
})

export const User = mongoose.model('user', userSchema) // user ==> collection name

// module.exports = { userSchema }