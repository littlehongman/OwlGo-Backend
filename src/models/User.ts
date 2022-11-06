import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: {
    type: Number,
    required: [true, 'Username is required']
  },
  created: {
    type: Date,
    required: [true, 'Created date is required']
  }
})

export const User = mongoose.model('user', userSchema) // user ==> collection name

// module.exports = { userSchema }