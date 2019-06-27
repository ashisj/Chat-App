var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var chatSchema = new Schema({
    username:{type:String,required:true},
    name:{type:String,required:true},
    message:{type:String,required:true},
    time:{type:String,required:true},
})

module.exports = mongoose.model('Chats',chatSchema);
