const fs = require('fs')

//Upoload local images for vatar, or changing the user dp
module.exports = async function(req, res, next) {
    try {
        if(!req.files || Object.keys(req.files).length === 0)
        return res.status(400).json({msg: "No file found and uploaded"})

        const file = req.files.file;

        if(file.size > 1024 * 1024){
            removeTmp(file.tempFilePath) //it's equal to 1-mb
            return res.status(400).json({msg: "Size to large!, try upload small size image."})
        }

        //making the condition for image sizing
        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "File format unsupported! Please upload jpeg/png image."})
        }

        next();
    } catch (err) {
        return res.status(500).json({msg: err.mesaage})        
    }
}

const removeTmp = (path) =>{
    fs.unlink(path, err =>{
        if(err) throw err
    })
}