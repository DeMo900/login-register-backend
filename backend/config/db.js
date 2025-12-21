const mongoose = require('mongoose')

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('MongoDB connected.')
  } catch (err) {
    console.error('MongoDB didnt connect:', err)
  }
}

module.exports = db