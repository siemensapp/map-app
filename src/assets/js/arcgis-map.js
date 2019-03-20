require([
  "esri/WebMap",
  "esri/views/MapView",
  "esri/geometry/Point",
  "esri/tasks/Locator",
  "esri/request",
  "esri/Graphic"
], function (
  WebMap, MapView, Point, Locator, esriRequest, Graphic
) {
  var workers = {};
  var clicked = false;
  var tracking;

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
    if (!clicked) {
      startTracking();
    } else {
      stopTracking();
    }
  };

  function stopTracking() {
    clearTimeout(tracking);
    clicked = false;
  };

  function startTracking() {
    navigator.geolocation.getCurrentPosition(showPosition);
    clicked = true;
    tracking = setTimeout(startTracking, 30000);
  };

  function showPosition(position) {
    if (position !== undefined) {
      console.log("Latitude: " + position.coords.latitude +
        "\nLongitude: " + position.coords.longitude);
      showOwnLocation(position, "John Milton");
    }
  }

  // Pone el punto en su lugar del mapa

  function showOwnLocation(position, worker) {
    var pointMap, markerSymbol, pointGraphic;
    var address = {};
    view.popup.close();
    view.graphics.removeAll();

    workers[worker] = new Point({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
    console.log(workers);

    var locator = new Locator({
      url: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
    });

    // Servicio de Geocoder de Arcgis

    locator.locationToAddress(workers[worker]).then(function (response) {
      address = response.attributes;
      console.log(address);
      pointMap = {
        type: "point",
        longitude: workers[worker].longitude,
        latitude: workers[worker].latitude
      };

      markerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],
        size: "25px",
        outline: {
          color: [255, 255, 255],
          width: 2
        }
      };

      pointGraphic = new Graphic({
        geometry: pointMap,
        symbol: markerSymbol,
        popupTemplate: {
          title: "John Milton",
          content: "Servicio de Field Service<br>[ " + workers[worker].longitude + ", " + workers[worker].latitude + " ]<br>" + address.CountryCode + ", " + address.City + ", " + address.PlaceName,
        }
      });

      view.graphics.add(pointGraphic);

      //showInfo(workers[worker], address);
    }, function (err) {
      console.log('Error on locator element.');
    })
  }

  // function showInfo(position, address) {
  //     latitud=position.latitude;
  //     longitud=position.longitude;
  //     direccion=address;
  //     view.popup.open({
  //         title: "John Milton",
  //         content: "Servicio de Field Service<br>[ " + longitud + ", " + latitud + " ]<br>" + address.CountryCode + ", " + address.City + ", " + address.PlaceName,            
  //         location: currentPosition
  //     })
  // };

  view.ui.add(boton, "top-left");

  // view.on("click", function(event) {

  //     // Get the coordinates of the click on the view
  //     var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
  //     var la = lat.toFixed(3);
  //     var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
  //     var lo = lon.toFixed(3);
  //     if(latitud.toFixed(3) == la && longitud.toFixed(3) == lo){
  //     view.popup.open({
  //       // Set the popup's title to the coordinates of the location
  //       title: "John Milton",  
  //       content: "Servicio de Filed Service<br>"+ address.CountryCode + ", " + address.City +", "+address.PlaceName,        
  //       location: event.mapPoint // Set the location of the popup to the clicked location
  //     });
  //     }
  // });

});
