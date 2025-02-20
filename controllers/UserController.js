const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const Register = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already registered" });
        }

        const hashedPwd = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({ ...req.body, password: hashedPwd });
        await newUser.save();

        res.json({ msg: "Account created" });
    } catch (err) {

        res.json({ msg: "Registration error" });
    }
};


const Login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
            if (isPasswordValid) {
                    res.json({ 
                    token: jwt.sign({ "_id": user._id }, "abcd"), 
                    _id: user._id, 
                    name: user.name, 
                    role: user.role 
                });
            } 
            else {
                res.json({ msg: "Check password" }); 
            }
        } else {
            res.json({ msg: "Check email" }); 
        }
    } catch (err) {
        res.json({ msg: "Login error" });
    }
};

const getUsersByRoles = async (req, res) => {
    try {
        const roles = req.query.roles ? req.query.roles.split(',') : []; 

        const users = await User.find({ role: { $in: roles } });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching users" });
    }
};

module.exports = {Register, Login, getUsersByRoles};
