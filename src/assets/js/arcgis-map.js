require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/geometry/Point",
    "esri/tasks/Locator",
    "esri/Graphic"
], function (
    WebMap, MapView, Point, Locator, Graphic
) {

    var webmap = new WebMap({
        basemap: "topo"
    });

    var view = new MapView({
        map: webmap,
        container: "viewDiv",
        center: [-74.183962, 4.776951],
        zoom: 16
    });

    // Se crea el boton para utilizar el API de Geolocalizacion de HTML5

    var boton = document.createElement("button");
    boton.style.height = "32px";
    boton.style.width = "32px";
    boton.style.backgroundColor = "#fff";
    boton.style.border = "none";
    boton.style.color = "#6e6e6e";
    boton.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
    boton.style.fontSize = "20px";
    boton.onmouseover = function () {
        this.style.backgroundColor = "lightGrey";
        boton.style.cursor = 'pointer';
    }
    boton.onmouseout = function () {
        this.style.backgroundColor = "#fff";
    }

    // Seccion de geolocalizacion

    boton.onclick = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log('Something failed !');
        }
    };

    function showPosition(position) {
        if (position !== undefined) {
            console.log("Latitude: " + position.coords.latitude +
                "\nLongitude: " + position.coords.longitude);
            showOwnLocation(position);
        }
    }

    // Pone el punto en su lugar del mapa

    function showOwnLocation(position) {
        var currentPosition = new Point({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });

        var locator = new Locator({
            url: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        });

        var pointMap = {
            type: "point",
            longitude: currentPosition.longitude,
            latitude: currentPosition.latitude
        };

        var markerSymbol = {
            type: "simple-marker",
            color: [226, 119, 40],
            outline: {
                color: [255, 255, 255],
                width: 2
            }
        };

        var pointGraphic = new Graphic({
            geometry: pointMap,
            symbol: markerSymbol
        });

        view.graphics.addMany([pointGraphic]);

        console.log('Starting locator');

        // Servicio de Geocoder de Arcgis

        locator.locationToAddress(currentPosition).then(function (response) {
            var address = response.attributes;
            showInfo(currentPosition, address);
        }, function (err) {
            console.log('Error on locator element.');
        })
    }

    function showInfo(position, address) {
        var currentPosition = new Point({
            latitude: position.latitude,
            longitude: position.longitude
        });

        view.popup.open({
            title: "John Milton",
            content: "Servicio de Field Service<br>" + address.CountryCode + ", " + address.City + ", " + address.PlaceName,            
            location: currentPosition
        })
    };    
    view.ui.add(boton, "top-left");

});