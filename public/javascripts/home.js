$(document).ready(function() {
    $("input:not([type=image],[type=button],[type=submit])").on("change", function(e) {
        $(".error").text("");
    }).on("focus", function(e) {
        $(".right").animate({
            opacity: 1.0
        });
        $(".left").animate({
            opacity: 1.0
        });
    });
    
    countUpYear = function() {
        var digit = 4;
        $("#ones").html("5");
        setInterval(function() {
            if (digit++ < 9) {
                $("#ones").html(digit);
            }
        }, 300);
        setTimeout(countUpYear, 5000);
    }

    countUpYear();


    $(".login-form").on("submit", function(e) {
        $("input[type=text]").on("change", function(e) {
            $(".error").text("");
        })
        e.preventDefault();
        $('.container').animate({
            opacity: 0.6
        }, 500);
        $.ajax({
            type: 'POST',
            url: '/login',
            data: $(".login-form").serialize()
        }).done(function(response) {
            if (response.error) {
                $(".error").text("login error");
                $('.container').animate({
                    opacity: 1.0
                }, 700);
            } else {
                $('body').addClass("color");
                $('.container').animate({
                    opacity: 0
                }, 450, function() {
                    location.href = '/challenges';
                });
            }
        })
    });

    $(".register-form").on("submit", function(e) {
        $("input[type=text]").on("change", function(e) {
            $(".error").text("");
        })
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/register',
            data: $(".register-form").serialize()
        }).done(function(response) {
            if (response.error) {
                $(".error").text(response.error.toLowerCase())
            } else {
                $(".register-form").fadeOut();
                $(".pointer-to-login").css("display", "inline-block");
                $("body").addClass("color")
            }
        })
    });
});
