const express = require("express")
const cors = require("cors")
const db = require("./config/db")
const app = express()
const session = require("express-session")
const { MongoStore } = require("connect-mongo")

require("dotenv").config()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const store = new MongoStore({
    mongoUrl: process.env.MONGO_URL,
    collectionName: "sessions",
    crypto: {
        secret: process.env.MONGO_CRYPTO_SECRET
    }
})

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "lax",
        secure: false
    }
}))

db()

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})