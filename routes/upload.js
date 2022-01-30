const router = require('express').Router();
const uploadImage = require('../middleware/uploadImage');
const uploadCtrl = require('../controllers/uploadCtrl');
const auth = require('../middleware/auth');

//creating the route or path to upload the image of avatar

router.post('/upload_avatar', uploadImage, auth, uploadCtrl.uploadAvatar)

module.exports = router;