$(document).ready(function () {
    $("#backEndMessage").css("visibility", "hidden");
    $("#email-error").css("visibility", "hidden");
    $("#role-error").css("visibility", "hidden");
    

    $("#email").click(function(){
        $("#email-error").css("visibility", "hidden");
        $("#backEndMessage").css("visibility", "hidden");
    });
    $("#role").click(function(){
        $("#role-error").css("visibility", "hidden");
        $("#backEndMessage").css("visibility", "hidden");
    });
});
    











