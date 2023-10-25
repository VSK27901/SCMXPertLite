$(document).ready(function () {

         // Function to check if the user is logged in
        function checkAuthentication() {
            const accessToken = localStorage.getItem("access_token");
    
            if (!accessToken) {
                // If access_token is not found, redirect to the login page
                window.location.href = "login.html";
            } 
        }

    if (sessionStorage.getItem("username") == null || sessionStorage.getItem("username") == "") {
        window.location.href = "login.html";
    }

    fetch(`http://${window.location.hostname}:8000/userslist`, {
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
            let userTable = "";

            for (let i = 0; i < data.length; i++) {
                const user = data[i];

                userTable += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>${user.creation_date}</td>
                        <td>${user.creation_time}</td>
                    </tr>
                `;
            }

            // Populate the table body with user data
            $("#table-body").html(userTable);
        })
        .catch(error => {
            console.log("Error getting user data: " + error);
        });
        checkAuthentication() 
});
