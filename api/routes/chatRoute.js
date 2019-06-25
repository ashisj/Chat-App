const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');

router.post('/',ChatController.addChart)
router.get('/',ChatController.getChart)

module.exports = router;
