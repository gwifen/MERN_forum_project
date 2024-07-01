const mongoose = require("mongoose")
const Joi = require('joi')

const postSchema = new mongoose.Schema({
    title:{
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 255
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    content:{
        type: String,
        required: true,
        minlength: 10,
        maxlength: 2000
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Post = mongoose.model("Post", postSchema)

function validatePost(post){
    const schema = Joi.object({
        title: Joi.string().min(5).max(255).required(),
        content: Joi.string().min(10).max(2000).required()
    })

    return schema.validate(post)
}

module.exports = { Post, validatePost }
