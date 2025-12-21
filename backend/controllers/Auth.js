const bcrypt = require("bcryptjs");
const User = require("../models/User");

const CreateAuth = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existing = await User.findOne({ email })
        const ip = req.headers['x-forwarded-for']?.split(',')[0]
        || req.headers['cf-connecting-ip']
        || req.socket.remoteAddress;

        if(existing) {
            return res.status(400).json({ message: "Email already exists."})
        }
        if(!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required."})
        }
        if(password.length < 10) {
            return res.status(400).json({ message: "Password length must be 10+."})
        }
        if(email.length < 11) {
            return res.status(400).json({ message: "Please submit your real E-Mail address."})
        }
        const hashed = await bcrypt.hash(password, 10)

        const newuser = await User.create({
            username,
            email,
            password: hashed,
            IP_Address: ip
        })
        req.session.userId = user._id;

        await newuser.save()
    } catch (error) {
        res.status(500).json({ error })
    }
}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "All fields are required."})
        }
        const user = await User.findOne({ email })
        if(!user) return res.status(400).json({ message: "Invalid credentials" })
        const match = await bcrypt.compare(password, user.password)
        if(!match) return res.status(400).json({ message: "Invalid credentials "})
        
        req.session.userId = user._id;
        res.json({ message: "Logged In", user: { id: user._id, username: user.username, email }})
    } catch (error) {
        res.status(500).json({ message: "Server Error"})
    }
}

const me = async (req, res) => {
    try {
        if(!req.session.userId) {
            return res.status(401).json({ message: "Not logged in."})
        }
        const user = await User.findById(req.session.userId)
            .select("-password")
            .select("-IP_Address")

        if(!user) {
            req.session.destroy((err) => {
                if (err) {
                    res.status(400).json({ message: "Session destroy error."})
                }
            })

            res.clearCookie("connect.sid");
            return res.status(401).json({ message: "Session expired, please login again"})
        }

        res.json({  user })
    } catch (error) {
        res.status(500).json({ message: "Server Error"})
    }
}

// I'll finish, maybe today maybe yesterday maybe tomorrow maybe next year MAYBE NEXT SUMMER maybe a few days ago.

module.exports = {
    CreateAuth,
    me,
    Login
}