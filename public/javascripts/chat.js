$("document").ready(function(){

    $("#message").emojioneArea({
      pickerPosition : "right"
    })

    $("#ashis").on('click',()=>{
      $("#ashis").toggleClass("as-a")
    })

    var header = $(".header")  
    var socket = io()

    const username = $("#username").val();

    socket.emit('username', username);
    socket.emit("onlineUsers");
    $("#message").on("keypress",()=>{
      socket.emit("typing",$("#name").val())
    })
    
    socket.on("chat", addChat)
    socket.on('typing',(data) => {
      header.html(`<p><em> ${data} is typing a message...</em></p>`);
    })
    
    //to be deleted after fix user online
    s = ''
    $.each([1,2,3,4,1,2,],(a,b) => {
      s += `<div class="chat_list">
      <div class="chat_people">
        <div class="chat_img"></div>
        <div class="chat_ib"> ${b} </div>
        <span class="online_icon"></span>
      </div>
    </div>
  ` 


    })
    
    socket.on('online', (user) => {
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
        
        //$('#onlineUSers').html(str)
    });
    //to be deleted after fix user online
    $('#onlineUSers').html(s)
    
    function getChats() {
         $.get("/api/chat", (chats) => {
             chats.forEach(addChat)
         })
    }
    getChats();

    function postChat(chat){
      $.post("/api/chat", chat,()=>{
        //$("#message").val("")
        $(".emojionearea-editor").html("")
      })
    }

    function addChat(chatObj){
        let time = new Date(Number(chatObj.time) || 0);
        let day = ""
        if(time.toLocaleDateString() == new Date().toLocaleDateString()){
          day = "Today"
        } else if(time.toLocaleDateString() == new Date(new Date().setDate(new Date().getDate()-1)).toLocaleDateString()){
          day='Yesterday'
        } else{
          x = time.toDateString().substr(4).split(" ")
          day = `${x[1]} ${x[0]},${x[2]}`
        }
                        
        if(chatObj.username == username){
          msg = `<div class="outgoing_msg">
                    <div class="sent_msg">
                      <p>${chatObj.message}</p>
                      <span class="time_date"> ${time.toLocaleTimeString()}    |   ${day} </span>
                    </div>
                  </div>`;
          $("#messages").append(msg)
        } else {
          msg = `<div class="incoming_msg">
                    <div class="incoming_msg_img">${chatObj.name} </div>
                    <div class="received_msg">
                      <div class="received_withd_msg">
                        <p>${chatObj.message}</p>
                        <span class="time_date"> ${time.toLocaleTimeString()}    |   ${day}</span>
                      </div>
                    </div>
                  </div>`;
          $("#messages").append(msg);
          //$("#messages").animate({ scrollTop: document.getElementById("messages").scrollHeight }, "slow");
        }
        $("#messages").animate({ scrollTop: document.getElementById("messages").scrollHeight}, 5);
    }

    $("#send").click((e) => {
        e.preventDefault();
        var chatMessage = {
            name : $("#name").val(),
            username: username,
            message: $("#message").val()
        }
        postChat(chatMessage)
    });

    setInterval(()=>{
      header.html("")
    },3000)
});

