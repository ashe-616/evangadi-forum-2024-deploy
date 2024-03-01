// //use express router
// const express=require("express");
// // const authMiddleware=require("../middleware/authMiddleware")
// const router=express.Router();

// //authonthocation middleware
// const {createQuestions}=require("../controller/questionContoller")
// router.post("/createQuestions",createQuestions)
// router.get("/createQuestions",createQuestions)

// module.exports = router;
// const express = require("express");
// const router = express.Router();


// router.get("/all-questions",(req, res)=>{
//     res.send("all question")
// })
// module.exports = router





const express = require("express");
const {
  postQuestions,
  allQuestions,
  singleQuestions,
} = require("../controller/questionContoller");


const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
//post questions routes
router.post("/post_question",authMiddleware, postQuestions);
//all questions routesz
router.get("/all-questions",authMiddleware, allQuestions);
//single questions routes
router.get("/question/:questionid",authMiddleware, singleQuestions);{
  
}
module.exports = router;