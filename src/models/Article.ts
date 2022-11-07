import mongoose from "mongoose"

const articleSchema = new mongoose.Schema({
  username: {
    type: Number,
    required: [true, 'Username is required']
  },
  created: {
    type: Date,
    required: [true, 'Created date is required']
  }
})

export const Article = mongoose.model('article', articleSchema) // user ==> collection name

// module.exports = { userSchema }