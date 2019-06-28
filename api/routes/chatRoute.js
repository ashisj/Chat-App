const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/uploads');
    },
    filename:function(req,file,cb){
      console.log(file);
        cb(null,file.fieldname + '-' + Date.now());
    }
});

const upload = multer({
    storage:storage ,
    limits:{
        fileSize:1024 * 1024 * 5
    }
});

router.post('/',ChatController.addChart);
router.get('/',ChatController.getChart);
router.post('/media',upload.single('myFile'),ChatController.addMedia,ChatController.addChart);

module.exports = router;
