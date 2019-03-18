require([
  "esri/WebMap",
  "esri/views/MapView"
], function (
    WebMap, MapView
) {

  /************************************************************
   * Creates a new WebMap instance. A WebMap must reference
   * a PortalItem ID that represents a WebMap saved to
   * arcgis.com or an on-premise portal.
   *
   * To load a WebMap from an on-premise portal, set the portal
   * url with esriConfig.portalUrl.
   ************************************************************/
    
  /************************************************************
   * Set the WebMap instance to the map property in a MapView.
   ************************************************************/
  var webmap = new WebMap({
    basemap: "dark-gray"
  });

  var view = new MapView({
    map: webmap,
    container: "viewDiv",
    center: [-74.183962, 4.776951],
    zoom: 16
  });

  var boton = document.createElement("button");
  boton.style.height = "32px";
  boton.style.width = "32px";
  boton.style.backgroundColor = "#fff";
  boton.style.border = "none";
  boton.style.color = "#6e6e6e";
  boton.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
  boton.style.fontSize = "20px";
  boton.onmouseover = function(){
    this.style.backgroundColor = "lightGrey";
    boton.style.cursor = 'pointer';
  }
  boton.onmouseout = function(){
    this.style.backgroundColor = "#fff";
  }
  
  boton.onclick = function (){
    if (navigator.geolocation) {
      console.log(navigator.geolocation.getCurrentPosition(showPosition));
    } else {
      console.log('Something failed !');
    }
  };
  
  
  
  view.ui.add(boton, "top-left");

});
