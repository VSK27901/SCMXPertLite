$(document).ready(function () {

    if (sessionStorage.getItem("username") == null || sessionStorage.getItem("username") == "") {
        window.location.href = "login.html";
    }

    $("#backEndMessage").css("visibility", "hidden");
    $("#shipment-error").css("visibility", "hidden");
    $("#conatiner-error").css("visibility", "hidden");
    $("#route-error").css("visibility", "hidden");
    $("#goods-error").css("visibility", "hidden");
    $("#device-error").css("visibility", "hidden");
    $("#date-error").css("visibility", "hidden");
    $("#po-error").css("visibility", "hidden");
    $("#delivery-error").css("visibility", "hidden");
    $("#ndc-error").css("visibility", "hidden");
    $("#batch-error").css("visibility", "hidden");
    $("#serial-error").css("visibility", "hidden");
    $("#description-error").css("visibility", "hidden");


    $(".shipment_no").click(function () {
        $("#shipment-error").css("visibility", "hidden");
        $("#backEndMessage").css("visibility", "hidden");
    });
    $(".container_no").click(function () {
        $("#conatiner-error").css("visibility", "hidden");
    });

    $(".route_details").click(function () {
        // alert("paaaa");
        $("#route-error").css("visibility", "hidden");
    });
    $(".goods_type").click(function () {
        // alert("paaaa");
        $("#goods-error").css("visibility", "hidden");
    });

    $(".device").click(function () {
        // alert("paaaa");
        $("#device-error").css("visibility", "hidden");
    });
    $(".expected_delivery").click(function () {
        // alert("paaaa");
        $("#date-error").css("visibility", "hidden");
    });
    $(".po_no").click(function () {
        // alert("paaaa");
        $("#po-error").css("visibility", "hidden");
    });
    $(".delivery_no").click(function () {
        // alert("paaaa");
        $("#delivery-error").css("visibility", "hidden");
    });
    $(".ndc_no").click(function () {
        // alert("paaaa");
        $("#ndc-error").css("visibility", "hidden");
    });
    $(".batch_id").click(function () {
        // alert("paaaa");
        $("#batch-error").css("visibility", "hidden");
    });
    $(".serial_no").click(function () {
        // alert("paaaa");
        $("#serial-error").css("visibility", "hidden");
    });
    $(".shipment_des").click(function () {
        // alert("paaaa");
        $("#description-error").css("visibility", "hidden");
    });

    if (sessionStorage.getItem("role") == "admin") {
        $(".forUser").hide();
    }
    else {
        $(".forAdmin").hide();
        $(".deviceData").hide();
        $(".viewShipments").hide();
    }



    $("#submit-buttonInCreate").click(function () {
        // alert("hello");
        let create = true;

        let shipment_no = $(".shipment_no").val().trim();
        let container_no = $(".container_no").val().trim();
        let route = $(".route_details").val();
        let goods_type = $(".goods_type").val();
        let device = $(".device").val();
        let expected_delivery = $(".expected_delivery").val().trim();
        let po_no = $(".po_no").val().trim();
        let delivery_no = $(".delivery_no").val().trim();
        let ndc_no = $(".ndc_no").val().trim();
        let batch_id = $(".batch_id").val().trim();
        let serial_no = $(".serial_no").val().trim();
        let shipment_des = $(".shipment_des").val().trim();

        // console.log(shipment_no);
        // console.log(container_no);
        // console.log(route);
        // console.log(goods_type);
        // console.log(device);
        // console.log(expected_delivery);
        // console.log(po_no);
        // console.log(delivery_no);
        // console.log(ndc_no);
        // console.log(batch_id);
        // console.log(serial_no);
        // console.log(shipment_des);
        if (shipment_no == "") {
            $("#shipment-error").css("visibility", "visible");
            create = false;
        }
        if (container_no == "") {
            $("#conatiner-error").css("visibility", "visible");
            create = false;
        }
        if(route=="" || route == undefined)
        {
            $("#route-error").css("visibility", "visible");
            create = false; 
            // console.log("if block");
        }
        // else
        // {
        //     console.log("else block");
        //     $("#route-error").css("visibility", "hidden");

        // }
        if(goods_type=="" || goods_type == undefined)
        {
            $("#goods-error").css("visibility", "visible");
            create = false;
        }

        if(device=="" || device == undefined)
        {
            $("#device-error").css("visibility", "visible");
            create = false; 
        }
        if (expected_delivery == "") {
            $("#date-error").css("visibility", "visible");
            create = false;
        }

        if (po_no == "") {
            $("#po-error").css("visibility", "visible");
            create = false;
        }
        if (delivery_no == "") {
            $("#delivery-error").css("visibility", "visible");
            create = false;
        }
        if (ndc_no == "") {
            $("#ndc-error").css("visibility", "visible");
            create = false;
        }

        if (batch_id == "") {
            $("#batch-error").css("visibility", "visible");
            create = false;
        }

        if (serial_no == "") {
            $("#serial-error").css("visibility", "visible");
            create = false;
        }
        if (shipment_des == "") {
            $("#description-error").css("visibility", "visible");
            create = false;
        }

        if (create) {
            console.log("in if contion");
            fetch(`http://${window.location.hostname}:8000/createshipment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                },
                mode: 'cors',
                body: JSON.stringify({
                    "shipment_no": shipment_no, 
                    "route_details": route,
                    "device": device,
                    "po_no": po_no,
                    "ndc_no": ndc_no,
                    "serial_no": serial_no,
                    "container_no": container_no,
                    "goods_type": goods_type,
                    "expected_delivery": expected_delivery,
                    "delivery_no": delivery_no,
                    "batch_id": batch_id,
                    "shipment_des": shipment_des
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // console.log(data);
                    window.location.href = 'myshipment.html';
                })
                .catch(error => {
                    // console.log("erroe...........");
                    $("#backEndMessage").css("visibility", "visible");
                });
        }
    });
});