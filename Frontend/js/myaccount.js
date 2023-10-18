$(document).ready(function () {
    
    if(sessionStorage.getItem("username") == null || sessionStorage.getItem("username") == "")
    {
        window.location.href="login.html";
    }

    $(".email").text(`Email: ${sessionStorage.getItem("email")}`);
    $(".username").text(`Username: ${sessionStorage.getItem("username")}`);
    $(".role").text(`Role: ${sessionStorage.getItem("role")}`);


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

});



