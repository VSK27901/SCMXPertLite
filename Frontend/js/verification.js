$(document).ready(function () {

    $(".container").hide();
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    fetch(`http://${window.location.hostname}:8000/verification?token=${token}`, {
        method: 'GET',
        mode: 'cors'
    })
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
    })
    .then( data => {
        $(".container").show();
        // $("#tokendiv").show();
        $("#span").html("Account Verified Successfully. You will be redirected to the login Page. If not redirected, click <a href=\"login.html\" class=\"text login-link\">here</a>.");
        // $("#login-link").text("here");
        // setTimeout(function(){
        //     window.location.href="login.html";
        // }, 5000);
    }
    )
    .catch(error => {
        
        // $(".container").hide();
        // $("#token").show();
    });

    
});