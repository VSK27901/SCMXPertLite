$(document).ready(function(){
    let prevPage = $("#prevPage").val();
    let nextPage = $("#nextPage").val();

    $(".get-data-button").click(function(){
        getData();
    });

    $("#nextPage").click(function(){
        getData();
    });

    $("#prevPage").click(function(){
        if (parseInt(prevPage, 10) > 0) {
            let pvalue = parseInt(prevPage, 10) - 1;
            let nvalue = pvalue + 1;

            $("#prevPage").attr("value", pvalue);
            $("#nextPage").attr("value", nvalue);

            getData();
        }
    });

    function getData() {
        console.log($("#deviceid").val());
        if ($("#deviceid").val() != "") {
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
                console.log("before ok");
                console.log(data);
                if (data.length < 5) {
                    // Hide next button when there are no more pages
                    $("#nextPage").hide();
                } else {
                    // Show the previous button
                    $("#prevPage").show();

                    // Unhide next button
                    let nvalue = parseInt($("#nextPage").val(), 10) + 1;

                    $("#prevPage").attr("value", `${parseInt($("#nextPage").val(), 10)}`);
                    $("#nextPage").attr("value", `${nvalue}`);
                    let shipmentData = "";
                    for (let shipmentSno = 0; shipmentSno < data.length; shipmentSno++) {
                        const currentShipment = data[shipmentSno];
                        console.log("in loop");
                        
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
                console.error("Error getting data: " + error);
            });
        }
    }
});
