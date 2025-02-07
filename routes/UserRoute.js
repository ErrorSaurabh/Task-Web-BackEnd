const express = require ("express")
const { Register, Login } = require("../controllers/Usercontroller")
const UserRoute = new express.Router()
UserRoute.post("/register", Register)
UserRoute.post("/login", Login)
module.exports = UserRoute