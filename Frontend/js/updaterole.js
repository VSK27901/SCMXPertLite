$(document).ready(function () {

    if(sessionStorage.getItem("username") == null || sessionStorage.getItem("username") == "")
    {
        window.location.href="login.html";
    }

    $("#backEndMessage").css("visibility", "hidden");
    $("#successMessage").css("visibility", "hidden");
    $("#email-error").css("visibility", "hidden");
    $("#role-error").css("visibility", "hidden");
    

    $("#email").click(function(){
        $("#email-error").css("visibility", "hidden");
        $("#backEndMessage").css("visibility", "hidden");
        $("#successMessage").css("visibility", "hidden");
    });
    $("#role").click(function(){
        $("#role-error").css("visibility", "hidden");
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

    $("#submit-button").click(function(){
        let create = true;

        let email = $("#email").val().trim();
        let role = $("#role").val();

        if(email=="")
        {
            $("#email-error").css("visibility", "visible");
            create = false;
        }
        if(role=="" || role == undefined)
        {
            $("#role-error").css("visibility", "visible");
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
        if (create) {
            console.log("in if contion");
            fetch(`http://${window.location.hostname}:8000/updaterole`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                },
                mode: 'cors',
                body: JSON.stringify({
                    "email": email, 
                    "newrole": role,
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                     // Update the UI with a success message
                    $("#successMessage").css("visibility", "visible");
                    
                    // Clear the form content
                    $("#email").val("");
                    $("#role").val("");
                })
                .catch(error => {
                    // console.log("erroe...........");
                    $("#backEndMessage").css("visibility", "visible");
                });
        }
    });
});
    











