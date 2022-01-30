const cloudinary = require('cloudinary');
const fs = require('fs');

// Information for cloudinary to upload, save, change images or avatar

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const uploadCtrl = {

    uploadAvatar: (req, res) => {
        try {
            const file = req.files.file;

            // Avatar Sizing with cloudinary images

            cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: 'avatar', width: 150, height: 150, crop: "fill"
            }, async (err, result) => {
                if (err) throw err;

                removeTmp(file.tempFilePath)

                //console.log({ result })
                res.json({url: result.secure_url})
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

}

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}

module.exports = uploadCtrl;