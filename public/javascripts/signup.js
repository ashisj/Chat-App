$(document).ready(function(){
    let username = $("#username");
    let name = $("#name");
    let email = $("#email");
    let password = $("#password");

    let userNameError = $("#userNameError");
    let nameError = $("#nameError");
    let emailError = $("#emailError");
    let passwordError = $("#passwordError");

    let registrationMessage =$("#registrationMessage");
    
    $("#registrationForm").on('input',function(e){
        e.target.nextElementSibling.innerHTML = ''
        registrationMessage.html("")
    });

    username.on('focusout',function(){
        let usernameValue = username.val()
        $.ajax({
            url:"/api/user/username/" + usernameValue,
            success:function(response){

            },
            error:function(error){
                userNameError.html(error.responseJSON.message);
            }
        })    
    })

    email.on('focusout',function(){
        let emailValue = email.val()
        $.ajax({
            url:"/api/user/email/" + emailValue,
            success:function(response){

            },
            error:function(error){
                emailError.html(error.responseJSON.message);
            }
        })    
    })

    $("#signup").on('click',function(e){
        e.preventDefault();
        $.ajax({
            url: "/api/user/register",
            type:"post",
            data:{
                username : username.val(),
                name:name.val(),
                email:email.val(),
                password:password.val()      
            },
            success:function(response){
                registrationMessage.removeClass('text-danger')
                registrationMessage.addClass('text-success')
                registrationMessage.html(response.message)
                $("#registrationForm input").val("")
            },
            error:function(error){
                errors = error.responseJSON.message
                if(error.status == 400){
                    if(errors.username){
                        userNameError.html(errors.username);
                    }
                    if(errors.name){
                        nameError.html(errors.name);
                    }
                    if(errors.email){
                        emailError.html(errors.email);
                    }
                    if(errors.password){
                        passwordError.html(errors.password);
                    }
                } else{
                    registrationMessage.addClass('text-danger')
                    registrationMessage.removeClass('text-success')
                    registrationMessage.html(errors)
                }
            }
        })
    })
});