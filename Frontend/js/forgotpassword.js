$(document).ready(function () {
    $("#backEndMessage").css("visibility", "hidden");
    $("#email-error").css("visibility", "hidden");
    
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
        $("#email-error").css("visibility", "hidden");
        $("#backEndMessage").css("visibility", "hidden");
    });

    $("#submit-button").click(function(){
        let create = true;

        let email = $(".email").val().trim();

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


        if(create)
        {
            console.log("in if contion");

            fetch(`http://${window.location.hostname}:8000/forgotpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify({"email": email}),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // console.log(data);
                    window.location.href = 'forgotpasslink.html';
                })
                .catch(error => {
                    // console.log("erroe...........");
                    $("#backEndMessage").css("visibility", "visible");
                });
        }
    });
});










