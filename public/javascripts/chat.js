$('document').ready(function(){
    const messageInput = $('#message');
    const onlineUsersButton = $("#onlineUsersButton");
    const onlineUsers = $('#onlineUSers');
    const messageBox = $("#messages");
    const msgForm = $('#msgForm');
    const header = $('.header');
    const fileInputButton = $('#fileInputButton');
    const fileInput = $('#fileInput');
    const username = $("#username").val();
    const name = $("#name").val();

    var onlineUsersData ={}

    const socket = io()

    messageInput.emojiPicker({
      width: messageInput.width(),
      height: '200px',
      container : 'form .col-sm-11'
    });

    socket.emit('username', username);
    socket.emit('onlineUsers');

    socket.on('chat', addChat)
    socket.on('typing',(data) => {
      header.html(`<p><em> ${data} is typing a message...</em></p>`);
    })
    socket.on('online', (user) => {
        onlineUsersData = user;
        let str = ''
        let msg = ''
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

        if(str == ''){
             onlineUsers.html("No user is available now");
         } else{
            onlineUsers.html(str);
        }
    });

    onlineUsersButton.on('click',()=>{
      onlineUsersButton.toggleClass('online-user-button-position')
    })
    messageInput.on('keypress',()=>{
      socket.emit('typing',name)
    })

    function getChats() {
         $.get('/api/chat', (chats) => {
             chats.forEach(addChat)
         })
    }

    getChats();

    function postChat(chat){
      $.post('/api/chat', chat,()=>{
        messageInput.val("")
      })
    }

    function addChat(chatObj){
        header.html('')
        console.log(chatObj);
        let time = new Date(Number(chatObj.time) || 0);
        let day = ''
        if(time.toLocaleDateString() == new Date().toLocaleDateString()){
          day = 'Today'
        } else if(time.toLocaleDateString() == new Date(new Date().setDate(new Date().getDate()-1)).toLocaleDateString()){
          day='Yesterday'
        } else{
          x = time.toDateString().substr(4).split(' ')
          day = `${x[1]} ${x[0]},${x[2]}`
        }

        if(chatObj.media){
          chatObj.message = `<img class="chat-img" src=${chatObj.mediapath} alt="File not available anymore">`
        }
        if(chatObj.username == username){
          msg = `<div class="outgoing_msg">
                    <div class="sent_msg">
                      <p>${chatObj.message}</p>
                      <span class="time_date"> ${time.toLocaleTimeString()}    |   ${day} </span>
                    </div>
                  </div>`;
          messageBox.append(msg)
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
          messageBox.append(msg);
        }
        messageBox.animate({ scrollTop: document.getElementById('messages').scrollHeight}, 5);
    }

    msgForm.submit((e) =>{
        e.preventDefault();
        var chatMessage = {
            name : name,
            username: username,
            message: messageInput.val()
        }
        postChat(chatMessage)
    });

    fileInputButton.on('click',(e)=>{
      fileInput.click();
    });

    fileInput.on('change',(e) =>{
      e.preventDefault();
      formdata = new FormData();
      file =fileInput[0].files[0];
      formdata.append("myFile", file);
      formdata.append("username", username);
      formdata.append("name", name);
      $.ajax({
          url : 'api/chat/media',
          type : 'POST',
          data : formdata,
          processData: false,  // tell jQuery not to process the data
          contentType: false,  // tell jQuery not to set contentType
          success : function(result){
            console.log(result);
            fileInput.val("")
          }
      })

    });

    setInterval(()=>{
        header.html('');
    },3000);
});
