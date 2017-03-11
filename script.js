function displayError(msg) {
    document.getElementById("error").innerHTML = msg;
    document.getElementById("error").style.backgroundColor = "#fcc";
    window.setTimeout(function() {
        displayInfo("");
    }, 2000);
}

function displayInfo(msg) {
    document.getElementById("error").innerHTML = msg;
    document.getElementById("error").style.backgroundColor = "#fff";
}

function calc(showErrors) {
    displayInfo("Berechne...");
    var directionsService = new google.maps.DirectionsService();

    var startpoint = document.getElementById("startpoint").value;
    var endpoint = document.getElementById("endpoint").value;
    if (startpoint == "" || endpoint == "") {
        displayInfo("");
        if (showErrors)
            displayError("Start- und Endpunkt müssen ausgefüllt sein");
        return;
    }
    
    var request = {
	origin      : startpoint, // a city, full address, landmark etc
	destination : endpoint,
	travelMode  : google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
        if ( status == google.maps.DirectionsStatus.OK ) {
            var distance = response.routes[0].legs[0].distance.value
            if (document.getElementById("return-check").checked) {
		distance *= 2;
            }
            document.getElementById("result-kilometers").value = Math.round(distance/10)/100;
            var price = document.getElementById("price").value;
            var consumption = document.getElementById("consumption").value;
            var costs = distance/1000/100*consumption*price;
            document.getElementById("result-costs").value = Math.round(costs*100)/100;
            displayInfo("");

	    // display on map
	    directionsDisplay.setDirections(response);
	    directionsDisplay.setMap(map);
	} else {
            displayInfo("");
            if (showErrors)
		displayError("Konnte keine Verbindung finden");
        }
    });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
	center: {lng: 7.8421043, lat: 47.9990077},
	zoom: 8
    });
    directionsDisplay = new google.maps.DirectionsRenderer();
}

document.getElementById("calc-button").onclick = function() {calc(true)};
document.getElementById("consumption").onfocus = function() {calc(false)};
document.getElementById("return-check").onclick = function() {calc(false)};
document.getElementById("swap").onclick = function() {
    var startpoint = document.getElementById("startpoint");
    var endpoint = document.getElementById("endpoint");
    var tmp = startpoint.value;
    startpoint.value = endpoint.value;
    endpoint.value = tmp;
};
document.getElementById("label-return").onclick = function() {
    document.getElementById("return-check").click();
};
document.getElementById("label-startpoint").onclick = function() {
    document.getElementById("startpoint").select();
};
document.getElementById("label-endpoint").onclick = function() {
    document.getElementById("endpoint").select();
};
document.getElementById("label-consumption").onclick = function() {
    document.getElementById("consumption").select();
};
document.getElementById("label-price").onclick = function() {
    document.getElementById("price").select();
};
document.getElementById("label-distance").onclick =
    document.getElementById("result-kilometers").onclick = function() {
    document.getElementById("result-kilometers").select();
};
document.getElementById("label-costs").onclick =
    document.getElementById("result-costs").onclick = function() {
    document.getElementById("result-costs").select();
};

var map, directionsDisplay;
google.maps.event.addDomListener(window, 'load', initMap);
