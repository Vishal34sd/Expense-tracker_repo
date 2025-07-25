import User from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userRegister = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields (username, email, password) are required"
      });
    }

    const userExists = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message:
          userExists.username === username
            ? "Username already taken"
            : "Email already registered"
      });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

     const  savedUser= await newUser.save();

    if (!savedUser) {
      return res.status(400).json({
        success: false,
        message: "User registration failed"
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data : newUser
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const userLogin = async(req , res)=>{
  try{
    const {email , password} = req.body ;
    const emailExist = await User.findOne({email});
    if(!email){
      return res.status(400).json({
        success : false ,
        message : "Email doesn't exist"
      });
    }
    const matchPassword = await bcrypt.compare(password , emailExist.password);
    if(!matchPassword){
      return res.status(401).json({
        success : false ,
        message : "Password is incorrect"
      })
    }
    const accessToken = await jwt.sign({
      userId : emailExist._id ,
      username : emailExist.username,
      email : emailExist.email
    

    }, process.env.JWT_SECRET_KEY, {expiresIn : "30m"});
    
    if(!accessToken){
      return res.status(400).json({
        success : false , 
        message : "Login failed"
      })
    }
    return res.status(200).json({
      success : true ,
      message : "Login successfull",
      token : accessToken
    })

  }
  catch(err){
    console.log(err);
    return res.status(500).json({
      success : false ,
      message : "Something went wrong"
    })
  }
}

export { userRegister , userLogin };
