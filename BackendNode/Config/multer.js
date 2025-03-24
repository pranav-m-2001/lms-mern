// const multer = require('multer')

// const storage = multer.diskStorage()

// const upload = multer({storage:storage})

// module.exports = upload

const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination : function (req, file, cb){
        cb(null, 'uploads/' )
    },
    filename : function (req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const checkFileFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    }else{
        cb(new Error('Not an image! please upload images'))
    }
}

// multer middleware
module.exports = multer({
    storage : storage,
    fileFilter : checkFileFilter,
    limits : {
        fileSize : 10 * 1024 * 1024 // 5mb file limit
    }
})