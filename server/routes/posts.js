const router = require("express").Router()
const { Post, validatePost } =require("../models/post") 
const tokenVerification = require('../middleware/tokenVerification');

router.get("/all", async(req,res)=>{
    Post.find().exec()
        .then(async()=>{
            const posts = await Post.find()
            //konfiguracja odpowiedzi res z przekazaniem listy uzytkownikow:
            
            res.status(200).send({data:posts, message:"Posty"})
        })
        .catch(error=>{
            res.status(500).send({message: error.message})
        })
})

router.post("/", tokenVerification, async (req, res)=>{
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);
    const { error } = validatePost(req.body)
    if(error) return res.status(400).send({message: error.details[0].message })

    try{
        const post = new Post({
            title: req.body.title,
            author: req.user._id,
            content: req.body.content
        })
        await post.save()
        res.status(201).send(post)
    }catch (error){
        console.error("Error saving post:", error)
        res.status(500).send({message: "Internal Server Error"})
    }
})

router.get("/my-posts", tokenVerification, async (req, res) =>{
    try{
        const posts = await Post.find({ author: req.user._id})
        res.status(200).send(posts)
    }catch (error){
        res.status(500).send({message: "Internal Server Error"})
    }
})

router.put("/:id", tokenVerification, async (req, res) =>{

    validateData = {'title': req.body.title, 'content': req.body.content}
    
    const { error } = validatePost(validateData)
    if(error) return res.status(400).send({message: error.details[0].message })

    try{
        const post = await Post.findById(req.params.id);
        
        if(!post) return res.status(404).send({ message: "Post not found or unauthorized" })

        post.title = req.body.title
        post.content = req.body.content

        await post.save()

        res.status(200).send({message: "Post updated successfully", post})
    }catch(error){
        res.status(500).send({message: "Internal Server Error"})
    }
})

router.delete("/:id", tokenVerification, async(req, res)=>{
    try{
        const post = await Post.findOneAndDelete({_id: req.params.id, author: req.user._id})

        if (!post) return res.status(404).send({ message: "Post not found or unauthorized" })

        res.status(200).send({ message: "Post deleted successfully" })
    }catch (error){
        res.status(500).send({message: "Internal Server Error"})
    }
})

module.exports = router
