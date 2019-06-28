var express = require("express")
var app = express()
var Chat = require('../models/chatModel');

exports.addChart = async (req,res,next) => {
    try {
        req.body.time = String(new Date().getTime())
        var chat = new Chat(req.body1)
        await chat.save()
        res.sendStatus(200)
        io.emit("chat", req.body)
    } catch (error) {
        return next(error);
    }
}

exports.addMedia = async (req,res,next) => {
    
    req.body.message = "File not present any more";
    req.body.mediapath = req.file.path.replace("public","");
    req.body.msgtype = req.file.mimetype;
    req.body.media = true;
    next();
}

exports.getChart = async(req,res,next) => {
    Chat.find({}, (error, chats) => {
        if(error){
            return next(error);
        } else {
            res.send(chats)
        }
    })
}
