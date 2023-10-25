$(document).ready(function () {
    if (!localStorage.getItem("access_token")) {
        window.location.href = "login.html";
    }
    if(sessionStorage.getItem("username") == null || sessionStorage.getItem("username") == "")
    {
        window.location.href="login.html";
    }

    // $(".email").text(`Email: ${sessionStorage.getItem("email")}`);
    // $(".username").text(`Username: ${sessionStorage.getItem("username")}`);
    // $(".role").text(`Role: ${sessionStorage.getItem("role")}`);


    $(".update-button1").click(function(){
        window.location.href="updaterole.html";
    });
    $(".update-button2").click(function(){
        window.location.href="updatepassword.html";
    });

    $(".update-button3").click(function(){
        window.location.href="userslist.html";
    });

    $(".update-button4").click(function(){
        window.location.href="updatepassword.html";
    });


    if(sessionStorage.getItem("role") == "admin")
    {
        $(".forUser").hide();
    }
    else
    {
        $(".forAdmin").hide();
        $(".deviceData").hide();
        $(".viewShipments").hide();
        // $(".nav_name").hide();

    }

    // Fetch user data and update the placeholders in your HTML
    fetch(`http://${window.location.hostname}:8000/myaccount`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("access_token")}`
        },
        mode: 'cors',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Update placeholders in your HTML with user data
            $(".email").text(`Email: ${data.email}`);
            $(".username").text(`Username: ${data.username}`);
            $(".role").text(`Role: ${data.role}`);
            $(".creation_date").text(`Created On: ${data.creation_date}`);
        })
        .catch(error => {
            console.log("Error getting user data: " + error);
        });
});
