const { json } = require("express");//This function is used to parse JSON in the request body.
const { StatusCodes } = require("http-status-codes")
const jwt =require("jsonwebtoken");//This line imports the jsonwebtoken module, which is used for generating and verifying JSON Web Tokens (JWTs) for user authentication.
async function authMiddleware(req,res,next) {
    //Find and check token
    const authHeader=req.headers.authorization
    if(!authHeader||!authHeader.startsWith('Bearer')){
        return res.status(StatusCodes.UNAUTHORIZED).json({msg:"authorization invalid"})
    }
    // const token=authHeader.split('')[1]
    const token = authHeader.split(' ')[1];
   
    try {
        const {username,userid}=jwt.verify(token,process.env.JWT_SECRET);

       req.user={username,userid}
        //next is used to pass the next middleware
        next();
        // return res.status(StatusCodes.OK).json({data})
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({msg:"authorization invalid"})
    }
}
module.exports=authMiddleware