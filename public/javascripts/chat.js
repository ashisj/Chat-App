$('document').ready(function(){
    const messageInput = $('#message');
    const onlineUsersButton = $("#onlineUsersButton");
    const onlineUsers = $('#onlineUSers');
    const messageBox = $("#messages");
    const msgForm = $('#msgForm');
    const header = $('.header');
    const fileInputButton = $('#fileInputButton');
    const fileInput = $('#fileInput');
    const modal = $('.modal-content');
    const username = $("#username").val();
    const name = $("#name").val();


    var onlineUsersData ={};
    var newUserMsg = '';
    var newUserMsgStatus = true;

    const socket = io()
    const maxFileSize = 1024 * 1024 * 30//30*(10**6)

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
                        ${name}
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

    onlineUsersButton.on('click',(e)=>{
      $(".chat_users_details").toggleClass('overlay_class')
      
      onlineUsersButton.toggleClass('online_user_button_position');
    })
    messageInput.on('keypress',()=>{
      socket.emit('typing',name)
    })

    function getChats() {
      $.ajax({
        url:'/api/chat',
        type:'GET',
        beforeSend: function() {
          modal.show();
        },
        success:function(chats){
          chats.forEach(addChat)
          modal.hide();
        },
        error:function(error){
          modal.hide();
          alert("Failed to import previous chat")
        }
      })
    }

    getChats();

    function postChat(chat){
      $.ajax({
        url:'/api/chat',
        type:'POST',
        data:chat,
        success:function(response){
          messageInput.val("")
        },
        error:function(error){
          alert("Message sending failed")
          messageInput.val("")
        }
      })
    }

    function addChat(chatObj){
        let msg = ''
        let time = new Date(Number(chatObj.time) || 0);
        let day = ''

        header.html('')

        if(newUserMsg !=  chatObj.username){
            newUserMsg = chatObj.username;
            newUserMsgStatus = true;
        } else {
          newUserMsgStatus = false;
        }

        if(time.toLocaleDateString() == new Date().toLocaleDateString()){
          day = 'Today'
        } else if(time.toLocaleDateString() == new Date(new Date().setDate(new Date().getDate()-1)).toLocaleDateString()){
          day='Yesterday'
        } else{
          x = time.toDateString().substr(4).split(' ')
          day = `${x[1]} ${x[0]},${x[2]}`
        }

        if(chatObj.media){
            if(chatObj.msgtype == 'image/jpeg' || chatObj.msgtype == 'image/png'){
              chatObj.message =  `<img class="chat_img" src=${chatObj.mediapath} alt="File not available anymore">`
            } else if(chatObj.msgtype == 'audio/mp3'){
              chatObj.message =`<audio class="chat_img" controls>
                                  <source src=${chatObj.mediapath} type="audio/mpeg"></source>
                                </audio>`
            } else if(chatObj.msgtype == 'video/mp4'){
              chatObj.message =`<video class="chat_img" controls>
                                  <source src=${chatObj.mediapath} type="video/mp4"></source>
                                </video>`
            }
        }

        if(chatObj.username == username){
          msg = `<div class="outgoing_msg">
                    <div class="sent_msg">
                      <p>${chatObj.message}</p>
                      <span class="time_date"> ${time.toLocaleTimeString()}    |   ${day} </span>
                    </div>
                  </div>`;
        } else {
          msg = `<div class="incoming_msg">
                    <div class="incoming_msg_name">${ newUserMsgStatus ? chatObj.name.split(' ')[0] : ''} </div>
                    <div class="received_msg">
                      <div class="received_withd_msg">
                        <p>${chatObj.message}</p>
                        <span class="time_date"> ${time.toLocaleTimeString()}    |   ${day}</span>
                      </div>
                    </div>
                  </div>`;
        }
        messageBox.append(msg);
        messageBox.animate({ scrollTop: document.getElementById('messages').scrollHeight}, 5);
    }

    msgForm.submit((e) =>{
        e.preventDefault();
        if(messageInput.val() != ''){
          var chatMessage = {
            name : name,
            username: username,
            message: messageInput.val()
          }
          postChat(chatMessage)
        }
        
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
      
      if(file.size > maxFileSize){
        alert("File size is too large")
      } else if (!(file.type == 'image/jpeg' || file.type == 'image/png' || file.type =='audio/mp3' || file.type =='video/mp4')){
        alert("Unsupported file")
      } else{
        $.ajax({
          url : 'api/chat/media',
          type : 'POST',
          data : formdata,
          processData: false,  // tell jQuery not to process the data
          contentType: false,  // tell jQuery not to set contentType
          success : function(result){
            console.log(result);
            fileInput.val("")
          },
          error:function(error){
            console.log(error);
            
            alert("file upload failed");
            fileInput.val("")
          }
        })
      } 
    });

    setInterval(()=>{
        header.html('');
    },3000);
});
