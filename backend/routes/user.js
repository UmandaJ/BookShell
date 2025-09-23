const User = require('../models/user');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {authenticateToken} = require("./userAuth");

//Sign Up
router.post('/signup',async (req,res) =>{
    try{
        const{username,email,password,address,role='buyer'} = req.body;
        // Checking username length is more than 3
        if(username.length <= 3){
            return res.status(400).json({message:"Username length should be greater than 3"});
        }
        // Checking username already exists
        const existingUsername = await User.findOne({username:username});
        if(existingUsername){
             return res.status(400).json({message:"Username already exists"});
        }
        // Checking email already exists
        const existingEmail = await User.findOne({email:email});
        if(existingEmail){
             return res.status(400).json({message:"Email already exists"});
        }
        // Checking password length is more than 5
        if(password.length <= 5){
            return res.status(400).json({message:"Password length should be greater than 5"});
        }
        const hashPass = await bcrypt.hash(password,10)
        const newUser = new User({
            username:username,
            email:email,
            password:hashPass,
            address:address,
            role: role,
        });
        await newUser.save();
        return res.status(200).json({message:"SignUp Successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
});
//Sign In
router.post('/signin',async (req,res) =>{
    try{
        const{username,password} = req.body;
        const existingUser = await User.findOne({username});
        if(!existingUser)
            {return res.status(400).json({message:"Invalid Credentials"});
        }
        await bcrypt.compare(password,existingUser.password,(err,data) => {
            if(data)
            {    
                const authClaims = [
                    {
                        name: existingUser.username},
                        {role: existingUser.role},
                    
                ];
                const token = jwt.sign({authClaims},"BookSwap123",{expiresIn:"60d"}); //Authentication token valid for 60 days
                return res.status(200).json(
                    {id:existingUser._id,
                     role:existingUser.role,
                     token:token,
                    });
                    
            }
            else{
                return res.status(400).json({message:"Invalid Credentials"});
            }
        });

    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }            
});
//Get User Information
router.get("/get-user-information",authenticateToken,async(req, res) =>{
    try{
        const{id} = req.headers;
        const data = await User.findById(id).select("-password");
        return res.status(200).json(data);
    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
});
//Update Address
router.put("/update-address",authenticateToken,async(req,res) =>{
try{
    const{id} = req.headers;
    const{address} = req.body;
    await User.findByIdAndUpdate(id,{address:address});
    return res.status(200).json({message:"Address Updated Successfully"});
}catch(error){
    res.status(500).json({message:"Internal Server Error"});
}
});
module.exports = router;
