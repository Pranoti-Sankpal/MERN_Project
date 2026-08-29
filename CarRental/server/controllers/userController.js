import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const generateToken = (userId)=>{
    return jwt.sign({ userId }, process.env.JWT_SECRET);
}
//Register user
export const registerUser = async (req, res)=>{
    try{
        const {name,email,password}= req.body

        
        if(!name || !email || !password){
    return res.json({success:false, message:'All fields required'})
}

       if(password.length < 8){
    return res.json({success:false, message:'Password must be at least 8 characters'})
}
        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({success:false, meassage:'User already exists'})
        }

        const hashedPassword =await bcrypt.hash(password,10)
        const user = await User.create({name,email,password: hashedPassword})
        const token = generateToken(user._id.toString())
        res.json({success:true,token})

    }catch(error){
        console.log(error.message);
        return res.json({success:false, message:error.message})

    }
}

// login user 
export const loginUser = async (req,res)=>{
    try{
        const {email,password}= req.body
        const user=await User.findOne({email})
        if(!user){
            return res.json({success: false,message: "User not found"})

        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({success: false,message: "Invalid Credentials"})
        }
        const token = generateToken(user._id.toString())
        res.json({success:true,token})


    }catch(error)
    {
          console.log(error.message);
        return res.json({success:false, message:error.message})
    }
}

// Get User data using Token (JWT)
 export const getUserData=async (req,res) =>{
    try{
        const {user}=req;
        res.json({success:true,user})
    }catch(error){
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
 }