import mongoose from "mongoose";

const userScehma = new mongoose.Schema({

  name: String,
  email: String,
  phone: String,
  product: String,
  createdAt: {
    type: Date,
    default: Date.now
  }

})
const userData = mongoose.model('user', userScehma)
export default userData