$(document).ready(function(){
    $("input[type=text]").on("change", function(e){
        $(".error").text("");
    });

    $(".login-form").on("submit", function(e){
        $("input[type=text]").on("change", function(e){
            $(".error").text("");
        })
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/login',
            data: $(".login-form").serialize()
        }).done(function(response){
            if (response.error) {
                $(".error").text("login error");
            }
            else {
                $(location).attr('href', '/challenges');
            }
        })
    });

    $(".register-form").on("submit", function(e){
        $("input[type=text]").on("change", function(e){
            $(".error").text("");
        })                
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/register',
            data: $(".register-form").serialize()
        }).done(function(response){
            if (response.error){
                $(".error").text(response.error.toLowerCase())
            }
            else {
                $(".register-form").fadeOut();
                $(".pointer-to-login").css("display", "inline-block");
                $("body").addClass("color")                        
            }
        })
    });
});