$("document").ready(function(){
  //"http://192.168.56.1:3000"
    var socket = io()
    
    const username = $("#username").val();
    let host = location.host

    socket.on("chat", addChat)
    
    socket.emit('username', username);

    socket.on('is_online', function(users) {

        let str = ""
        let msg = ``
        users.forEach(user => {
          msg = `<div class="chat_list">
                    <div class="chat_people">
                      <div class="chat_img"></div>
                      <div class="chat_ib"> ${user} </div>
                      <span class="online_icon"></span>
                    </div>
                  </div>
                `
          if(user != username){
            str += msg  
          }
        });
        $('#onlineUSers').html(str)
    });
    
    function getChats() {
         $.get("/api/chat", (chats) => {
             chats.forEach(addChat)
         })
    }
    getChats();
    
    function postChat(chat){  
      $.post("/api/chat", chat,()=>{
        $("#message").val("")
      })
    }

    function addChat(chatObj){
        let msg=''
        if(chatObj.name == username){
          msg = `<div class="outgoing_msg">
                    <div class="sent_msg"> 
                      <p>${chatObj.message}</p>
                      <span class="time_date"> 11:01 AM    |    June 9</span> 
                    </div>
                  </div>`;
          $("#messages").append(msg)
        } else {
          msg = `<div class="incoming_msg">
                    <div class="incoming_msg_img">${chatObj.name} </div>
                    <div class="received_msg">
                      <div class="received_withd_msg"> 
                        <p>${chatObj.message}</p>
                        <span class="time_date"> 11:01 AM    |    June 9</span> 
                      </div>
                    </div>
                  </div>`;
          $("#messages").append(msg);
        }
    }

    $("#send").click((e) => {
        e.preventDefault();
        var chatMessage = {
            name : $("#name").val(),
            username: username,
            message: $("#message").val()
        }
        postChat(chatMessage)
    })
  })
