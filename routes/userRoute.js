//use express router
const express=require("express");
const authMiddleware=require("../middleware/authMiddleware")
const router=express.Router();
//import user controllers
const {register,login,checkUser}=require("../controller/userController")
router.post("/register",register)
//Login Route
router.post("/login",login)
//Check user the method is get method
//We can check on the browser but we cannot check post request on the browser but we can use postman ro swagger
router.get("/check",authMiddleware,checkUser)
module.exports=router