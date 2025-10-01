import User from '../models/userModel.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//generate a token jwt
const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, { expiresIn: '7d'})
}


export const registerUser = async (req, res) =>{
    try{
        const {name, email, password} = req.body;

        //check user exist or not
        const userExist = await User.findOne({email})
        if(userExist){
            return res.status(400).json({message: "User Already Exist"})
        }
        if(password.length < 8)
        {
            return res.status(400).json({success: false, message: "Password Must Be Atleast 8 character"})
        }
        // hashing Password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt)

        // create a user
        const user = await User.create({
            name,
            email,
            password: hashedpassword
        })
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }
    catch (error){
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
    
}

//login function
export const loginUser = async(req,res) =>{
    try{
        const {email, password} = req.body
        const user = await User.findOne({ email })
        if(!user)
        {
            return res.status(500).json({ message: "Invalid Email"})
        }

        // compare the password 
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch)
        {
            return res.status(500).json({message: "Invalid Password"})
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }
    catch (error){
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

// getuser profile
export const getUserProfile = async (req,res) => {
    try{
        const user = await User.findById(req.user.id).select("-password")
        if(!user)
        {
            return res.status(404).json({ message: "User Not Found" })
        }
        res.json(user)
    }
    catch (error){
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}