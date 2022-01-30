const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('./sendMail');

const { google } = require('googleapis');
const { OAuth2 } = google.auth;
// const fetch = require('node-fetch');

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

// Key coming from env file
const { CLIENT_URL } = process.env;

/*
User Control Actions for Vasl Authetication
1- Register the user
2- Activate the account via email
3- Login the user
4- Get access token for login
5- Forget Password
6- Reset Password
7- Get user information
8- Get all users infromation
9- Logout user
10- Update User
11- Update user to admin, admin to user
12- Delere the User
13- Google Login
14- Facebook Login
*/

const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return (
                    res.status(400).json({ msg: "Please fill first all the fields," })
                );
            }

            if (!validateEmail(email)) {
                return (
                    res.status(400).json({ msg: "Invalid Email." })
                );
            }

            const user = await Users.findOne({ email });
            if (user) {
                return (
                    res.status(400).json({ msg: "This Email is already registered." })
                );
            }
            if (password.length < 6) {
                return (
                    res.status(400).json({ msg: "Password must be at least 6 or more charcater." })
                );
            }

            const passwordHash = await bcrypt.hash(password, 12);

            const newUser = {
                name, email, password: passwordHash
            }
            // console.log(newUser);

            const activation_token = createActivationToken(newUser);

            const url = `${CLIENT_URL}/user/activate/${activation_token}`;
            sendMail(email, url, "Verify your email address");

            // console.log({activation_token});

            // console.log({ name, email, password });
            res.json({ msg: "Successfully Register please activate your email to start." })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    activateEmail: async (req, res) => {
        try {
            const { activation_token } = req.body
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            const { name, email, password } = user;
            const check = await Users.findOne({ email });
            if (check) return res.status(400).json({ msg: "This email is already registered" });

            const newUser = Users({
                name, email, password
            });

            await newUser.save();

            return res.json({ msg: "Your account is successfully activated!" })

            console.log(user);
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            //For duplication of  Email 
            const user = await Users.findOne({ email });
            if (!user) return res.status(400).json({ msg: "This Email Does not Exist." });
            //For omparing the exact password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Password is Incorrect." });

            const refresh_token = createRefreshToken({ id: user._id })
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 //Which is equal to 7 days.
            })
            res.json({ msg: "Logged In, Successfully!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAccessToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if (!rf_token) return res.status(400).json({ msg: "Now you can login." })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please login first!" })
                const access_token = createAccessToken({ id: user.id })
                res.json({ access_token })

                //console.log(user)
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "This email does not exist." })

            const access_token = createAccessToken({ id: user._id })
            const url = `${CLIENT_URL}/user/reset/${access_token}`

            sendMail(email, url, "Reset your password")
            res.json({ msg: "Just Re-send the password, please now check your email." })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { password } = req.body
            const passwordHash = await bcrypt.hash(password, 12)

            //console.log(req.user)
            await Users.findOneAndUpdate({ _id: req.user.id }, {
                password: passwordHash
            })
            res.json({ msg: "Congratulations! you've successfully changed your password." })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUserInfor: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            res.json(user)
            //console.log(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUserAllInfor: async (req, res) => {
        try {
            const users = await Users.find().select('-password')

            res.json(users)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: "Logged out!" })


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUser: async (req, res) => {
        try {
            const { name, avatar } = req.body
            await Users.findOneAndUpdate({ _id: req.user.id }, {
                name, avatar
            })
            res.json({ msg: "Updated Successfully" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUsersRole: async (req, res) => {
        try {
            const { role } = req.body
            await Users.findOneAndUpdate({ _id: req.params.id }, {
                role
            })
            res.json({ msg: "Updated Successfully" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteUser: async (req, res) => {
        try {
            await Users.findByIdAndDelete(req.params.id)
            res.json({ msg: "Deleted Successfully" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    googleLogin: async (req, res) => {
        try {
            const { tokenId } = req.body
            const verify = await client.verifyIdToken({ idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID })

            const { email_verified, email, name, picture } = verify.payload

            const password = email + process.env.GOOGLE_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            if(!email_verified) return res.status(400).json({ msg: "Email verification is failed." })
            const user = await Users.findOne({ email })
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) return res.status(400).json({ msg: "Password is incorrect" })

                const refresh_token = createRefreshToken({ id: user._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 //Which is equal to 7 days.
                })
                res.json({ msg: "Logged In, Successfully!" })

            }else{
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture
                })

                await newUser.save()

                
                const refresh_token = createRefreshToken({ id: newUser._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 //Which is equal to 7 days.
                })
                res.json({ msg: "Logged In, Successfully!" })
            }           

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
    
    // ,facebookLogin: async (req, res) => {
    //     try {
    //         const { accessToken, userID } = req.body
            
    //         const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`

    //         const data = await fetch(URL).then(res => res.json()).then(res => {return res})
            
    //         const { email, name, picture } = data

    //         const password = email + process.env.FACEBOOK_SECRET

    //         const passwordHash = await bcrypt.hash(password, 12)

    //         const user = await Users.findOne({ email })
    //         if (user) {
    //             const isMatch = await bcrypt.compare(password, user.password)
    //             if (!isMatch) return res.status(400).json({ msg: "Password is incorrect" })

    //             const refresh_token = createRefreshToken({ id: user._id })
    //             res.cookie('refreshtoken', refresh_token, {
    //                 httpOnly: true,
    //                 path: '/user/refresh_token',
    //                 maxAge: 7 * 24 * 60 * 60 * 1000 //Which is equal to 7 days.
    //             })
    //             res.json({ msg: "Logged In, Successfully!" })

    //         }else{
    //             const newUser = new Users({
    //                 name, email, password: passwordHash, avatar: picture.data.url
    //             })

    //             await newUser.save()

                
    //             const refresh_token = createRefreshToken({ id: newUser._id })
    //             res.cookie('refreshtoken', refresh_token, {
    //                 httpOnly: true,
    //                 path: '/user/refresh_token',
    //                 maxAge: 7 * 24 * 60 * 60 * 1000 //Which is equal to 7 days.
    //             })
    //             res.json({ msg: "Logged In, Successfully!" })
    //         }           

    //     } catch (err) {
    //         return res.status(500).json({ msg: err.message })
    //     }
    // }
}

//Template for email validation to check whether email is valid or not according to this pattern
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

//Genrate the token for user activation
const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' })
}

//Genrate the token for user access
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

//Genrate the token for user refresh
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl;