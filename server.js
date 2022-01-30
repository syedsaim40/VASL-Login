require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');


const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true
}))

//Routes
app.use('/user', require('./routes/userRouter'));
app.use('/api', require('./routes/upload'));

//I will comnnect here MongoDB
                                    //This Way is no longer supported after mongoose 6
// const URI = process.env.MONGODB_URL
// mongoose.connect(URI, {
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useNewUrlParserL: true,
//     useUnifiedTopology: true
// }, err => {
//     if(err) throw err;
//     console.log("Successfully connected to MongoDB")
// })

//connecting the vasl data to save in MongoDB
const URI = process.env.MONGODB_URL
mongoose.connect(URI, ()=>{
    console.log('Successfully connected to mongoDb');
})

//key is coming from env file
const PORT = process.env.PORT || 5000;

//node backend server is listening on this port
app.listen(PORT, () => {
    console.log('server is listening on port', PORT);
})