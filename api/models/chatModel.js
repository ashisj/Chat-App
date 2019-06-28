var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var chatSchema = new Schema({
    username:{type:String,required:true},
    name:{type:String,required:true},
    message:{type:String,required:true},
    mediapath:{type:String,required:false},
    media:{type:Boolean,default:false},
    msgtype:{type:String,default:'text'},
    time:{type:String,required:true},
})

module.exports = mongoose.model('Chats',chatSchema);
