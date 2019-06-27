var express = require("express")
var app = express()
var Chat = require('../models/chatModel');

exports.addChart = async (req,res,next) => {
    try {
        req.body.time = String(new Date().getTime())
        var chat = new Chat(req.body)
        await chat.save()
        res.sendStatus(200)
        io.emit("chat", req.body)
    } catch (error) {
        res.sendStatus(500)
        console.error(error)
    }
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