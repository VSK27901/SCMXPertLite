$(document).ready(function () {

    if(sessionStorage.getItem("username") == null || sessionStorage.getItem("username") == "")
    {
        window.location.href="login.html";
    }

    console.log("in if contion");
    fetch(`http://${window.location.hostname}:8000/myshipment`, {
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
                    let shipmentData = "";
                    for (let shipmentSno = 0; shipmentSno < data.length; shipmentSno++) {
                        const currentShipment = data[shipmentSno];
                        console.log("in loop");
                        
                        // console.log(data[0].route_details);
                        shipmentData = shipmentData + "<tr><td>" +  (shipmentSno + 1) + "</td><td>"
                        + currentShipment.shipment_no + "</td><td>"
                        + currentShipment.container_no + "</td><td>"
                        + currentShipment.route_details + "</td><td>"
                        + currentShipment.goods_type + "</td><td>"
                        + currentShipment.device + "</td><td>"
                        + currentShipment.expected_delivery + "</td><td>"
                        + currentShipment.po_no + "</td><td>"
                        + currentShipment.ndc_no + "</td><td>"
                        + currentShipment.delivery_no + "</td><td>"
                        + currentShipment.batch_id + "</td><td>"
                        + currentShipment.serial_no + "</td><td>"
                        + currentShipment.shipment_des + "</td></tr>";
                    }
                    console.log("outside loop");
                    $("#table-body").html(shipmentData);
                    console.log(data);
                })
                .catch(error => {
                    console.log("error getting.....");
                });
});
