document.addEventListener("DOMContentLoaded", function () {
    // Get all password input fields
    const passwordFields = document.querySelectorAll('.password');

    // Get all show/hide password icons
    const showHideIcons = document.querySelectorAll('.showHidePw');

    // Add click event listener to each show/hide password icon
    showHideIcons.forEach(function (icon, index) {
        icon.addEventListener('click', function () {
            // Toggle the password field between "password" and "text" type
            if (passwordFields[index].type === "password") {
                passwordFields[index].type = "text";
                icon.classList.remove("uil-eye-slash");
                icon.classList.add("uil-eye");
            } else {
                passwordFields[index].type = "password";
                icon.classList.remove("uil-eye");
                icon.classList.add("uil-eye-slash");
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    var errorMessage = document.getElementById("error-message");

    if (errorMessage) {
        errorMessage.style.display = "block";
        setTimeout(function () {
            errorMessage.style.display = "none";
        }, 5000);
    }
});

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Make a POST request to your FastAPI login route
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => response.json())
        .then(data => {
            // Store the access token in local storage
            localStorage.setItem('access_token', data.access_token);

            // Redirect to the dashboard page
            window.location.href = 'dashboard.html';
        })
        .catch(error => {
            // Handle login error, e.g., display an error message
            if (error.status === 400) {
                // Handle specific error messages
                if (error.detail === "User not found") {
                    errorMessage.innerText = "User not found";
                } else if (error.detail === "Incorrect Password") {
                    errorMessage.innerText = "Incorrect password. Please try again.";
                } else {
                    errorMessage.innerText = "An error occurred during login.";
                }
                errorMessage.style.display = "block";
            }
        });
});
