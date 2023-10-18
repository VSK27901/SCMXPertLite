$(document).ready(function () {
    
    // if(sessionStorage.getItem("username") == null || sessionStorage.getItem("username") == "")
    // {
    //     window.location.href="login.html";
    // }

    $(".email").text(`Email: ${sessionStorage.getItem("email")}`);
    $(".username").text(`Username: ${sessionStorage.getItem("username")}`);
    $(".role").text(`Role: ${sessionStorage.getItem("role")}`);

    // $("#backEndMessage").css("visibility", "hidden");
    // $("#conatiner-error").css("visibility", "hidden");
    // $("#route-error").css("visibility", "hidden");
    // $("#goods-error").css("visibility", "hidden");
    // $("#device-error").css("visibility", "hidden");
    // $("#date-error").css("visibility", "hidden");
    // $("#po-error").css("visibility", "hidden");
    // $("#delivery-error").css("visibility", "hidden");
    // $("#ndc-error").css("visibility", "hidden");
    // $("#batch-error").css("visibility", "hidden");
    // $("#serial-error").css("visibility", "hidden");
    // $("#description-error").css("visibility", "hidden");
    


    // $(".button1").click(function(){
    //     window.location.href="myshipment.html";
    // });

    if(sessionStorage.getItem("role") == "admin")
    {
        $(".forUser").hide();
    }
    else
    {
        $(".forAdmin").hide();
        $(".deviceData").hide();
        $(".viewShipments").hide();
    }
});



