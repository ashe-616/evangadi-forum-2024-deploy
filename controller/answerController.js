
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");

// Post answer
async function post_answer(req, res){
  const { answer } = req.body;
  const questionid = req.params.questionid;
  const { userid } = req.user;

  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Provide answer field" });
  }
 
  try {
    await dbConnection.query(
      "INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)",
      [userid, questionid, answer]
    );

    return res
      .status(StatusCodes.OK)
      .json({ msg: "Answer posted successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong. Please try again later" });
  }
};

// Get all answers
async function all_answer(req, res){
  const questionid = req.params.questionid;

  try {
    const [answer] = await dbConnection.query(
      "SELECT answer, username FROM answers JOIN users ON answers.userid = users.userid WHERE questionid = ?",
      [questionid]
    );

    return res.status(StatusCodes.OK).json({ answer });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong. Please try again later" });
  }
};

module.exports = { post_answer, all_answer };