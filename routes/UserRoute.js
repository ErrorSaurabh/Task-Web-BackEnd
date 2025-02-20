const express = require ("express")
const { Register, Login, getUsersByRoles } = require("../controllers/UserController")
const UserRoute = new express.Router()
UserRoute.post("/register", Register)
UserRoute.post("/login", Login)
UserRoute.get("/user", getUsersByRoles)
module.exports = UserRoute