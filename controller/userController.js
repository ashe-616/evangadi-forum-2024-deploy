const dbConnection = require("../db/dbConfig");
const {StatusCodes}=require('http-status-codes')
const bcrypt = require('bcryptjs');
const jwt=require("jsonwebtoken");//This line imports the jsonwebtoken module, which is used for generating and verifying JSON Web Tokens (JWTs) for user authentication.
// const { use } = require("../routes/userRoute");

//const bcrypt = require('bcrypt');
//we use async to use tryCatch for running our function without break
async function register(req,res) {
    //Destructure register forms
 const {username,firstname,lastname,email,password}=req.body;
 //Validate the form
 if(!email||!password||!firstname||!lastname||!username){
    return res.status(StatusCodes.BAD_REQUEST).json({msg:"please provide all required information"})
 }
 try {
    //check the user whether it exists in the database table or not 
    const[user]=await dbConnection.query("select username,userid from users where username=? or email=?",[username,email])
    if (user.length>0) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg:"User is already registered"})
    }
  //Check Password Length
  if (password.length<8) {
    return res.status(StatusCodes.BAD_REQUEST).json({msg:"password must be atleast 8 characters"})
  }
  //Encrypt password
  const salt=await bcrypt.genSalt(10)
  const hashedPassword=await bcrypt.hash(password,salt)
    //write query to insert table
    await dbConnection.query("INSERT INTO users(username,firstname,lastname,email,password) values(?,?,?,?,?)",[username,firstname,lastname,email,hashedPassword])
    return res.status(StatusCodes.CREATED).json({msg:"User is created succesfully"})
} catch (error) {
    console.log(error.message)
    return res.status(StatusCodes.inte).json({msg:"Something went wrong! try again"})
 }
}
//Login functionality
// async function login(req,res) {
//     const {email,password}=req.body;
//     if(!email||password){
//         return res.status(StatusCodes.BAD_REQUEST).json({msg:"please enter correct email and password"})
//     }
    
//     try {
//         const[user]=await dbConnection.query("select username,userid,password from users where email=?",[email])
//        return res.json({user:user})
//     } catch (error) {
//         console.log(error.message)
//       return res.status(StatusCodes.BAD_REQUEST).json({msg:"Something went wrong please try again"})
//     }}
// async function login(req, res) {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please enter both email and password" });
//     }
  
//     try {
//       const [user] = await dbConnection.query("SELECT username, userid, password FROM users WHERE email=?", [email]);
//       if (user.length === 0) {
//         return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid email or password" });
//       }
  
//       const storedPassword = user[0].password;
//       const passwordMatch = await bcrypt.compare(password, storedPassword);
//       if (!passwordMatch) {
//         return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid email or password" });
//       }
//       const username=user[0].username;
//       const userid=user[0].userid;
//      const token= jwt.sign({username,userid},process.env.JWT_SECRET,{expiresIn:"30d"})
  
//       // Password is correct, proceed with successful login
//       return res.status(StatusCodes.OK).json({msg:"user login successful",token})
//       // return res.status(StatusCodes.OK).json({ user: user[0].password });
//     } catch (error) {
//       console.log(error.message);
//       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong! Please try again" });
//     }
//   }
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please enter all required fields" });
  }
  try {
    const [user] = await dbConnection.query(
      "select username, userid, password from users where email=? ",
      [email]
    );
    if (user.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credentials" });
    }
    // compare password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credentials" });
    }
    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, { expiresIn: "1d" });//
    return res
      .status(StatusCodes.OK)
      .json({ msg: "user login successful", token });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}

async function checkUser(req,res) {
  //This declares an asynchronous function named checkUser that takes req and res as parameters. This function likely checks if a user is authenticated and authorized to access certain routes.
  const username=req.user.username;
  const userid=req.user.userid
    res.status(StatusCodes.OK).json({msg:"valid user",username,userid})

}
//send as an object
module.exports={register,login,checkUser}


