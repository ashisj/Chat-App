$("document").ready(function(){
    var socket = io()

    const username = $("#username").val();

    socket.on("chat", addChat)
    socket.emit('username', username);
    socket.emit("onlineUsers");

    // socket.on("offline",(user) => {
    //   console.log(user);
    // })
    socket.on('online', function(user) {
        let str = ""
        let msg = ``
        $.each(user,(key,name)=>{
          if(key != username){
            msg = `<div class="chat_list">
                      <div class="chat_people">
                        <div class="chat_img"></div>
                        <div class="chat_ib"> ${name} </div>
                        <span class="online_icon"></span>
                      </div>
                    </div>
                  `
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
        if(chatObj.username == username){
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
