$(document).ready(function () {
    $('#forgot-password-form').submit(function (event) {
        event.preventDefault();

        const email = $('.email').val();

        // Send a request to generate a reset token
        fetch('http://localhost:8000/forgotpassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ email: email }),
        })
        .then(response => {
            if (response.ok) {
                // Redirect to the "forgotpasslink.html" page after successful email sending
                window.location.href = 'forgotpasslink.html';
            } else {
                // Handle error response, e.g., email not registered
                // You can show an error message to the user here
            }
        })
        .catch(error => {
            // Handle any fetch-related errors
            console.error('Error:', error);
        });
    });
});