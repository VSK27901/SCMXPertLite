$(document).ready(function () {

    //To hide the messages
    $("#errorMessage").css("visibility", "hidden");
    $("#username-error").css("visibility", "hidden");
    $("#password-error").css("visibility", "hidden");
    // Code for password hide and show
    $(".showHidePw").click(function () {
        $(this).toggleClass("uil-eye-slash uil-eye");
        var passwordField = $(this).siblings(".password");
        if (passwordField.attr("type") === "password") {
            passwordField.attr("type", "text");
        } else {
            passwordField.attr("type", "password");
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

    $(".email").click(function(){
        $("#username-error").css("visibility", "hidden");
        $("#errorMessage").css("visibility", "hidden");
    });

    $(".password").click(function(){
        // alert("paaaa");
        $("#password-error").css("visibility", "hidden");
        $("#errorMessage").css("visibility", "hidden");
    });

    $("#submit-button").click(function () {
        let create = true;

        let username = $(".email").val();
        let password = $(".password").val();

        if(username == "")
        {
            $("#username-error").css("visibility", "visible");
        }
        else
        {
            if(ValidateEmail(username))
            {
                $("#username-error").css("visibility", "visible");
                $("#username-error").text("Email is Not valid"); 
                create = false; 
            }
        }

        if( password.length == 0)
        {
            $("#password-error").css("visibility", "visible");
            create = false; 
        }


        if(create)
        {
            const formData = new URLSearchParams();

            formData.append('username', `${username}`);
            formData.append('password', `${password}`);

            fetch(`http://${window.location.hostname}:8000/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                mode: 'cors',
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Handle successful login, e.g., redirect to the dashboard
                    localStorage.setItem('access_token', data.access_token);
                    sessionStorage.setItem('username', data.current_user.username);
                    sessionStorage.setItem('email', data.current_user.email);
                    sessionStorage.setItem('role', data.current_user.role);
                    window.location.href = 'dashboard.html';
                })
                .catch(error => {
                    $("#errorMessage").css("visibility", "visible");
                });
        }
    });
});
