$(document).ready(function () {

    if(sessionStorage.getItem("username") == null || sessionStorage.getItem("username") == "")
    {
        window.location.href="login.html";
    }
    $("#backEndMessage").css("visibility", "hidden");
    $("#old-password-error").css("visibility", "hidden");
    $("#password-error").css("visibility", "hidden");
    $("#confirm-password-error").css("visibility", "hidden");


      // Code for password hide and show
    $(".showHidePw").click(function () {
        $(this).toggleClass("uil-eye-slash uil-eye");
        // Toggle the password field between "password" and "text" type
        var oldpasswordField = $(this).closest(".input-field").find(".oldpassword");
        var passwordField = $(this).closest(".input-field").find(".password");
        var confirmpasswordField = $(this).closest(".input-field").find(".confirmpassword");
        
        if (oldpasswordField.attr("type") === "password") {
            oldpasswordField.attr("type", "text");
        } else {
            oldpasswordField.attr("type", "password");
        }

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


    //errors
    $(".oldpassword").click(function(){
        $("#old-password-error").css("visibility", "hidden");
        $("#backEndMessage").css("visibility", "hidden");
    });

    $(".password").click(function(){
        $("#password-error").css("visibility", "hidden");
    });

    $(".confirmpassword").click(function(){
        $("#confirm-password-error").css("visibility", "hidden");
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

        let oldpassword = $(".oldpassword").val().trim();
        let password = $(".password").val().trim();
        let confirmpassword = $(".confirmpassword").val().trim();

        if(oldpassword=="")
        {
            $("#old-password-error").css("visibility", "visible");
            $("#backEndMessage").css("visibility", "hidden");
            create = false; 
        }
        if(password=="")
        {
            $("#password-error").css("visibility", "visible");
            create = false;
        }
        if(confirmpassword=="")
        {
            $("#confirm-password-error").css("visibility", "visible");
            create = false;
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
                fetch(`http://${window.location.hostname}:8000/updatepassword`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                    },
                    mode: 'cors',
                    body: JSON.stringify({"oldpassword": oldpassword, "password": password, "confirm_password": confirmpassword}),
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        // console.log(data);
                        window.location.href = 'successpass.html';
                    })
                    .catch(error => {
                        // console.log("erroe...........");
                        $("#backEndMessage").css("visibility", "visible");
                    });
            }
    });
});
