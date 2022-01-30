const mongoose = require('mongoose');

//making the schema of saving data of user in mongoDB

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter your name"],
        trim: true
    },
    email:{
        type: String,
        required: [true, "Please enter your email"],
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: [true, "Please enter your password"],
    },
    role:{
        type: Number,
        default: 0 // 0 = user, 1 = admin, This will be by default user
    },
    avatar:{
        type: String,
        default: "https://res.cloudinary.com/vaslcloth/image/upload/v1635600783/avatar/PSX_20201129_202505_dltkku.jpg"
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Users", userSchema);