// JavaScript variables to track current page and rows per page.
$(document).ready(function(){
    let deviceId = $("#deviceid").val();
    
    let nextPage = $("#nextPage").val();
    let prevPage = $("#prevPage").val();

    $(".get-data-button").click(function(){
        getData();
    });
    $("#nextPage").click(function(){
        getData();
    });

    $("#prevPage").click(function(){
        console.log("prev page");
        if($("#prevPage").val() != "0")
        {
            let nvalue = parseInt($("#nextPage").val(), 10) - 1;

            $("#prevPage").attr("value", `${parseInt($("#nextPage").val(), 10)}`);  
            $("#nextPage").attr("value", `${nvalue}`);  
            getData();

        }
        console.log("prev page");
    });


    function getData()
    {

    console.log($("#deviceid").val());
    if($("#deviceid").val() != "")
    {
        fetch(`http://${window.location.hostname}:8000/devicedata?device_id=${$("#deviceid").val()}&page=${$("#nextPage").val()}&items_per_page=5`, {
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
                    console.log("before ok")
                    console.log(data);
                    if(data.length < 5)
                    {
                        //hide next button
                        $("#nextPage").hide();
                    }
                    else
                    {
                        $("#prevPage").show();
                        console.log("else");
                        //unhide next button
                        let nvalue = parseInt($("#nextPage").val(), 10) + 1;

                        $("#prevPage").attr("value", `${parseInt($("#nextPage").val(), 10)}`);  
                        $("#nextPage").attr("value", `${nvalue}`);  
                        let shipmentData = "";
                    for (let shipmentSno = 0; shipmentSno < data.length; shipmentSno++) {
                        const currentShipment = data[shipmentSno];
                        console.log("in loop");
                        
                        // console.log(data[0].route_details);
                        shipmentData = shipmentData + "<tr><td>"
                        + currentShipment.Device_Id + "</td><td>"
                        + currentShipment.Battery_Level + "</td><td>"
                        + currentShipment.First_Sensor_temperature + "</td><td>"
                        + currentShipment.Route_From + "</td><td>"
                        + currentShipment.Route_To + "</td><td></tr>";
                    }
                    console.log("outside loop");
                    $("#table-body").html(shipmentData);

                    }
                    
                })
                .catch(error => {
                    console.log("error getting.....");
                });
    }
}
    // let deviceId = ;
    console.log($("#nextPage").val())
});


// let currentPage = 1;
// const rowsPerPage = 10; // You can adjust this value as needed

// // Function to update the table based on the current page
// function updateTable() {
//     const tableRows = document.querySelectorAll("#data-table tbody tr");
//     const totalPages = Math.ceil(tableRows.length / rowsPerPage);

//     // Hide all rows
//     tableRows.forEach((row) => {
//         row.style.display = "none";
//     });

//     // Calculate start and end indices for the current page
//     const startIndex = (currentPage - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;

//     // Show rows for the current page
//     for (let i = startIndex; i < endIndex; i++) {
//         if (tableRows[i]) {
//             tableRows[i].style.display = "table-row";
//         }
//     }

//     // Update current page indicator
//     document.getElementById("currentPage").textContent = `Page ${currentPage} of ${totalPages}`;
// }

// // Handle "Next" button click
// document.getElementById("nextPage").addEventListener("click", () => {
//     const tableRows = document.querySelectorAll("#data-table tbody tr");
//     const totalPages = Math.ceil(tableRows.length / rowsPerPage);

//     if (currentPage < totalPages) {
//         currentPage++;
//         updateTable();
//     }
// });

// // Handle "Previous" button click
// document.getElementById("prevPage").addEventListener("click", () => {
//     if (currentPage > 1) {
//         currentPage--;
//         updateTable();
//     }
// });

// // Initial table update
// updateTable();
