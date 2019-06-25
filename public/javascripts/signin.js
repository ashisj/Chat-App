$(document).ready(function(){
    let loginMessage = $("#loginMessage")
    $("#signin").on('click',function(e){
        e.preventDefault();
        $.ajax({
            url:'/api/user/login',
            type:'POST',
            data:{
                email : $("#email").val(),
                password : $("#password").val()
            },
            success:function(response){
                window.location.replace('/')
            },
            error:function(error){
                loginMessage.html(error.responseJSON.message) 
            }
        })
    })
});