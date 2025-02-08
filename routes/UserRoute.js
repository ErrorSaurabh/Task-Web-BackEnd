const express = require ("express")
const { Register, Login, getuser } = require("../controllers/Usercontroller")
const UserRoute = new express.Router()
UserRoute.post("/register", Register)
UserRoute.post("/login", Login)
UserRoute.post("/get", getuser)
module.exports = UserRoute