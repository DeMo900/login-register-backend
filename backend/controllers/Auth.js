const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {registerValidation,loginValidation} = require("../validation/auth");
const CreateAuth = async (req, res) => {
 
        const { username, email, password } = req.body;
     
        const ip = req.headers['x-forwarded-for']?.split(',')[0]
        || req.headers['cf-connecting-ip']
        || req.socket.remoteAddress;
      try {
          //validation
          const validate = registerValidation(req.body);//validating the body

//if validation failed we show a detailed error message 
if(!validate.success) return res.status(400).json({ errors: validate.error.issues[0].message });
   const existing = await User.findOne({ email })
        if(existing) {
            return res.status(400).json({ message: "Email already exists."})
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

        const validate = loginValidation(req.body);
        if (!validate.success) return res.status(400).json({ errors: validate.error.issues[0].message });

        const user = await User.findOne({ email })
        if(!user) return res.status(400).json({ message: "Signup first" })
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