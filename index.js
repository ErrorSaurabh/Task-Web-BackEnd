const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UserRoute = require("./routes/UserRoute")
const ProjectRoute = require('./routes/ProjectRoute')
const IssueRoute = require("./routes/IssueRoute")
const CommentRoute = require("./routes/CommentRoute")
mongoose.connect("mongodb://127.0.0.1:27017/webtask").then(()=>{
    console.log("connected to database")
})
const app = express()
app.use(express.json())
app.use(cors())
app.use("/",UserRoute)
app.use("/",ProjectRoute)
app.use("/",IssueRoute)
app.use("/",CommentRoute)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));