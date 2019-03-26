require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/geometry/Point",
    "esri/tasks/Locator",
    "esri/config",
    "esri/request",
    "esri/Graphic"
  ], function (
    WebMap, MapView, Point, Locator, esriConfig, esriRequest, Graphic
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
      zoom: 7
    });
  
    async function pedirDatos() {
      var options = {
        query: {
          f: "json"
        },
        responseType: "json"
      }
      var respuesta = null;
      await esriRequest("https://962080e4.ngrok.io/api/workers", options).then(function (response) {
        respuesta = response;
      })
      return respuesta;
    };
  
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
      clicked = true;
      showWorkers();
      tracking = setTimeout(startTracking, 30000);
    };
  
    var locator = new Locator({
      url: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
    });
  
    // Pone el punto en su lugar del mapa
  
    async function showWorkers() {
      var address = {};
      view.popup.close();
      view.graphics.removeAll();
      var resultados = await pedirDatos();
      if (resultados !== null) {
        for (var i = 0; i < resultados.data.length; i++) {
          let pointMap, markerSymbol, textSymbol, markerSymbol2;
          let nombre = resultados.data[i].Nombre;
          let iniciales =  nombre.split(" "); 
          let coords = resultados.data[i].CoordenadasEspecialista.split(",");
          workers[nombre] = new Point({
            latitude: coords[1],
            longitude: coords[0]
          });
          // Servicio de Geocoder de Arcgis
  
          locator.locationToAddress(workers[nombre]).then(function (response) {
            address = response.attributes;
            pointMap = {
              type: "point",
              longitude: workers[nombre].longitude,
              latitude: workers[nombre].latitude
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
  
            markerSymbol2 = {
              type: "simple-marker",
              color: [255,255,255],
              size: "40px",
              outline: {
                color: [100, 119, 40],
                width: 3
              }
            };
  
            textSymbol = {
                type: "text",
                text: iniciales.length == 4 ? String(iniciales[0][0]+iniciales[2][0]) : String(iniciales[0][0]+iniciales[1][0]) 
            };
  
            view.graphics.add(
              new Graphic({
                geometry: pointMap,
                symbol: markerSymbol2,
                popupTemplate: {
                  title: nombre,
                  content: "Servicio de Field Service<br>[ " + workers[nombre].longitude + ", " + workers[nombre].latitude + " ]<br>" + address.CountryCode + ", " + address.City + ", " + address.PlaceName,
                }
              })
              );
              view.graphics.add(
                new Graphic({
                  geometry: pointMap,
                  symbol: textSymbol,
                  popupTemplate: {
                    title: nombre,
                    content: "Servicio de Field Service<br>[ " + workers[nombre].longitude + ", " + workers[nombre].latitude + " ]<br>" + address.CountryCode + ", " + address.City + ", " + address.PlaceName,
                  }
                })
                );
  
          }, function (err) {
            console.log('Error on locator element.');
          })
        }
  
  
      }
  
  
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