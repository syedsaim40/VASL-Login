const router = require('express').Router();
const useCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


/*
Making the routes or paths for Vasl Authetication
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

router.post('/register', useCtrl.register);

router.post('/activation', useCtrl.activateEmail);

router.post('/login', useCtrl.login);

router.post('/refresh_token', useCtrl.getAccessToken);

router.post('/forgot', useCtrl.forgotPassword);

router.post('/reset', auth, useCtrl.resetPassword);

router.get('/infor', auth, useCtrl.getUserInfor);

router.get('/all_infor', auth, authAdmin, useCtrl.getUserAllInfor);

router.get('/logout', useCtrl.logout);

router.patch('/update', auth, useCtrl.updateUser);

router.patch('/update_role/:id', auth, authAdmin, useCtrl.updateUsersRole);

router.delete('/delete/:id', auth, authAdmin, useCtrl.deleteUser);


router.post('/google_login', useCtrl.googleLogin);
// router.post('/facebook_login', useCtrl.facebookLogin);


module.exports = router;