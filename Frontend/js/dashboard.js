$(document).ready(function () {
    if(sessionStorage.getItem("username") == null || sessionStorage.getItem("username") == "")
    {
        window.location.href="login.html";
    }
    $(".welcome-text").text(`Welcome! to SCMXPertLite, ${sessionStorage.getItem("username")}`);



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


$(document).ready(function () {
    // Function to toggle the navigation menu
    function showNavbar(toggleId, navId, bodyId, headerId) {
        const toggle = $(toggleId);
        const nav = $(navId);
        const bodypd = $(bodyId);
        const headerpd = $(headerId);

        if (toggle && nav && bodypd && headerpd) {
            // Toggle the navigation menu visibility on click
            toggle.click(function () {
                nav.toggleClass('show');
                toggle.toggleClass('bx-x');
                bodypd.toggleClass('body-pd');
                headerpd.toggleClass('body-pd');
            });
        }
    }

    // Call the showNavbar function to enable the navigation menu toggle
    showNavbar('#header-toggle', '#nav-bar', '#body-pd', '#header');

    // Get all navigation links
    const linkColor = $('.nav_link');

    // Function to handle link click and change its color
    function colorLink() {
        if (linkColor) {
            // Remove 'active' class from all links
            linkColor.removeClass('active');
            // Add 'active' class to the clicked link
            $(this).addClass('active');
        }
    }

    // Add click event listener to navigation links
    linkColor.click(colorLink);

    // Check if the username element exists
    const usernameElement = $('.username');
    if (usernameElement.length > 0) {
        // Check if the username is empty (not logged in)
        if (usernameElement.text().trim() === '') {
            // Hide the user-info section
            $('.user-info').css('display', 'none');
        }
    }

    // Get the 'Create Shipment' button and shipment iframe elements
    const createShipmentBtn = $("#create-shipment-btn");
    const createshipmentIframe = $("#createshipment-iframe");

    // Add click event listener to 'Create Shipment' button
    createShipmentBtn.click(function () {
        // Show the shipment iframe when the button is clicked
        createshipmentIframe.css('display', 'block');
    });
});


$(document).ready(function() {
    // Logout button click event
    $(".logout").click(function() {
        // Clear local storage
        localStorage.clear();

        // Clear session storage
        sessionStorage.clear();

        // Redirect to the index page
        window.location.href = 'index.html';
    });
});

