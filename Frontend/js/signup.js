$(document).ready(function () {
    $("#backEndMessage").css("visibility", "hidden");
    $("#username-error").css("visibility", "hidden");
    $("#email-error").css("visibility", "hidden");
    $("#password-error").css("visibility", "hidden");
    $("#confirm-password-error").css("visibility", "hidden");
    
     // Code for password hide and show
    $(".showHidePw").click(function () {
        $(this).toggleClass("uil-eye-slash uil-eye");
        // Toggle the password field between "password" and "text" type
        var passwordField = $(this).closest(".input-field").find(".password");
        var confirmpasswordField = $(this).closest(".input-field").find(".confirmpassword");
        
        if (passwordField.attr("type") === "password") {
            passwordField.attr("type", "text");
        } else {
            passwordField.attr("type", "password");
        }

        if (confirmpasswordField.attr("type") === "password") {
            confirmpasswordField.attr("type", "text");
        } else {
            confirmpasswordField.attr("type", "password");
        }
    });

    function ValidateEmail(inputText) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!inputText.match(mailformat)) {
            return true;
        }
        else
        {
            return false;
        }
    }

    $(".name").click(function(){
        $("#username-error").css("visibility", "hidden");
        $("#backEndMessage").css("visibility", "hidden");
    });
    $(".email").click(function(){
        $("#email-error").css("visibility", "hidden");
        $("#backEndMessage").css("visibility", "hidden");
    });
    
    $(".password").click(function(){
        // alert("paaaa");
        $("#password-error").css("visibility", "hidden");
        $("#backEndMessage").css("visibility", "hidden");
    });
    $(".confirmpassword").click(function(){
        // alert("paaaa");
        $("#confirm-password-error").css("visibility", "hidden");
        $("#backEndMessage").css("visibility", "hidden");
    });


    function CheckPassword(inputtxt) 
    {
        var paswd= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/;
        if (!inputtxt.match(paswd)) 
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    $("#submit-button").click(function(){
        let create = true;

        let name = $(".name").val().trim();
        let email = $(".email").val().trim();
        let password = $(".password").val().trim();
        let confirmpassword = $(".confirmpassword").val().trim();

        if(name=="")
        {
            $("#username-error").css("visibility", "visible");
            create = false; 
        }
        if(email=="")
        {
            $("#email-error").css("visibility", "visible");
            create = false;
        }
        else
        {
            if(ValidateEmail(email))
            {
                $("#email-error").css("visibility", "visible");
                $("#email-error").text("Email is Not valid"); 
                create = false; 
            }
        }
        if(password=="")
        {
            $("#password-error").css("visibility", "visible");
            create = false;
        }
        else
        {
            let status = CheckPassword(password);
            if(status == false)
            {
                $("#password-error").css("visibility", "visible");
                $("#password-error").text("Password Requirements: 8+ characters, 1 digit, 1 capital letter, 1 special character."); 
                create = false; 
            }
        }
        if(confirmpassword=="")
        {
            $("#confirm-password-error").css("visibility", "visible");
            create = false;
        }
        else if(password != confirmpassword)
        {
            $("#confirm-password-error").css("visibility", "visible");
            $("#confirm-password-error").text("Password does not match");
            create = false;
        }

        if(create)
        {
            console.log("in if contion");

            fetch(`http://${window.location.hostname}:8000/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify({"username": name, "password": password, "email": email, "confirm_password": confirmpassword}),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // console.log(data);
                    window.location.href = 'accverification.html';
                })
                .catch(error => {
                    // console.log("erroe...........");
                    $("#backEndMessage").css("visibility", "visible");
                });
        }
    });
});










