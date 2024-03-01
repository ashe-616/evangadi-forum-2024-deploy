require("dotenv").config()
const express = require("express");
const cors = require('cors');
const app = express();
// Enable CORS for all routes
app.use(cors());
const port = 5500;
const dbConnection = require("./db/dbConfig");
const userRoutes = require("./routes/userRoute");
const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
// answers routes middleware ??
app.use("/api/answers",answerRoutes)
async function start() {
  try {
    const result = await dbConnection.execute("select 'test' ");
    await app.listen(port);
    console.log("database connection established");
    console.log(`listening on ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}
start();
