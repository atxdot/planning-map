var map = L.map('map', {zoomControl: false}).setView([30.417, -98.120], 9);

var layer = L.esri.Vector.basemap('Navigation').addTo(map);

var zoomHome = L.Control.zoomHome();
    zoomHome.addTo(map);

  function setBasemap(basemap) {
    if (layer) {
      map.removeLayer(layer);
    }

    layer = L.esri.Vector.basemap(basemap);
    map.addLayer(layer);
  }

  function changeBasemap(basemaps){
    var basemap = basemaps.value;
    setBasemap(basemap);
  }
  
  //load AUS district boundary AGO service
  L.esri.featureLayer({
    url: 'http://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/AUS_District_Boundary/FeatureServer/0',
    style: function (feature) {
        return {color: 'red', weight: 2, fillOpacity: 0}
    }
  }).addTo(map);
    
  //load AUS strategic corridors AGO service
  L.esri.featureLayer({
    url: 'http://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/AUS_Strategic_Corridors_20160823/FeatureServer/0',
    style: function (feature) {
        return {color: 'black', weight: 2, opacity: 0.5}
  }
  }).addTo(map);