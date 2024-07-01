const router = require("express").Router()
const { User, validate } =require("../models/user") 
const bcrypt = require("bcrypt")
const tokenVerification = require('../middleware/tokenVerification');
const { clear } = require("console");


router.post("/", async(req, res)=>{
    try{
        const { error } = validate(req.body)
        if(error)
            return res.status(400).send({message: error.details[0].message})
        const user = await User.findOne({email:req.body.email})
        if(user)
            return res.status(409).send({message:"User with given email already Exist!"})

        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        await new User({...req.body, password:hashPassword}).save()
        res.status(201).send({message:"User created successfully"})
    }catch(error){
        res.status(500).send({message:"Internal Server Error"})
    }
})

// Route for getting account details
router.get("/account", tokenVerification, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        console.log("user:")
        console.log(user)

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({
            data: user,
            message: "Account details retrieved successfully"
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.get("/allUsers", async(req,res)=>{
    //pobreanie wszystkich uzytkownikow z bd:
    User.find().exec()
        .then(async()=>{
            const users = await User.find()
            //konfiguracja odpowiedzi res z przekazaniem listy uzytkownikow:
            res.status(200).send({data:users, message:"Lista uzytkownikow"})
        })
        .catch(error=>{
            res.status(500).send({message: error.message})
        })
})

// Route for deleting a user
router.delete("/delete", tokenVerification, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        console.log("USERID: ",userId)
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        console.log("USERID: ",userId)

        await User.findByIdAndDelete(userId);
        res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router
