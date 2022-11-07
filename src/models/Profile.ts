import mongoose from "mongoose"

interface Profile{
    id: number,
	username: string;
    name: string;
	email: string;
    phone: string;
    birthday: string;
    zipCode: string;
    avatar: string;
    friends: number[];
	headline: string;
}


const profileSchema = new mongoose.Schema<Profile>({
    id: {type: Number, required: true},
    username: { type: String, required: [true, 'Username is required']},
    name: { type: String, default:""},
    email:{ type: String, required: true },
    phone:{ type: String, required: true },
    birthday: { type: String, required: true },
    zipCode: { type: String },
    avatar: { type: String, default: ""},
    friends: [Number], // store other userIds
    headline: { type: String, default: "" }
})

export const Profile = mongoose.model('profile', profileSchema) // user ==> collection name

// module.exports = { userSchema }