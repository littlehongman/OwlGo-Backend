import mongoose from "mongoose"
import { IProfile } from "../utils/types"



const profileSchema = new mongoose.Schema<IProfile>({
    //id: {type: Number, required: true},
    username: { type: String, required: [true, 'Username is required']},
    name: { type: String, default: ""},
    email:{ type: String, required: true },
    phone:{ type: String, default: "" },
    birthday: { type: String, default: "" },
    zipCode: { type: String },
    avatar: { type: String, default: ""},
    friends: [], // store other userIds
    headline: { type: String, default: "" }
})

export const Profile = mongoose.model('profile', profileSchema) // user ==> collection name

// module.exports = { userSchema }