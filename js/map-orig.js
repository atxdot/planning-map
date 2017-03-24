//create var bounds
var northWest = L.latLng(30.95, -99.49),
	southEast = L.latLng(29.72, -96.66),
	bounds = L.latLngBounds(northWest, southEast);

//create map
var map = L.map('map');
map.fitBounds(bounds);

//load custom txdot basemap as initial base (not included in basemap changer) 
var layer = L.esri.tiledMapLayer({
                url: 'https://tiles.arcgis.com/tiles/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Statewide_Planning_Map/MapServer'
            }).addTo(map);

//openstreetmap variable for layer control
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="//osm.org/copyright">OpenStreetMap</a> contributors'
});

//custom easy button control, zoom to var bounds
L.easyButton('fa-globe fa-lg', function(){
    map.fitBounds(bounds)
}).addTo(map);

//leaflet plugin custom zoom in/out home tool
//var zoomHome = L.Control.zoomHome();
//    zoomHome.addTo(map);

//esri geocoder control
//var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider();

/*var searchControl = L.esri.Geocoding.geosearch({
    providers: [
      arcgisOnline,
      L.esri.Geocoding.featureLayerProvider({
        url: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Projects/FeatureServer/0',
        searchFields: ['CONTROL_SECT_JOB', 'HIGHWAY_NUMBER'],
        formatSuggestion: function(feature){
          return feature.properties.HIGHWAY_NUMBER + ' - ' + feature.properties.CONTROL_SECT_JOB;
        }
      })
    ]
  }).addTo(map);

var results = L.layerGroup().addTo(map);
*/

//basemap changer control - top right
function setBasemap(basemap) {
    if (layer) {
      map.removeLayer(layer);
    }

    layer = L.esri.basemapLayer(basemap);

    map.addLayer(layer);

    if (layerLabels) {
      map.removeLayer(layerLabels);
    }

    if (basemap === ''
     || basemap === 'Topographic'
     || basemap === 'Streets'
     || basemap === 'NationalGeographic'
     || basemap === 'Terrain'
     || basemap === 'Gray'
     || basemap === 'DarkGray'
     || basemap === 'USATopo'
     || basemap === 'Imagery'
     || basemap === 'ShadedRelief'
   ) {
      layerLabels = L.esri.basemapLayer(basemap + 'Labels');
      map.addLayer(layerLabels);
    }
  }

function changeBasemap(basemaps){
    var basemap = basemaps.value;
    setBasemap(basemap);
  }
  
//load AUS district boundary AGO feature service
var ausBounds = L.esri.featureLayer({
                url: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/AUS_District_Boundary_Ln/FeatureServer/0',
                style: function (feature) {
                    return {color: '#000000', weight: 3};
                    }
                }).addTo(map);

//load AUS TxDOT projects AGO feature service - filter for AUS & create proper symbology
var ausProjects = L.esri.featureLayer({
                    url: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Projects/FeatureServer/0',
                    where: "DISTRICT_NAME = 'Austin'",
                    style: function (feature) {
                        if(feature.properties.PRJ_STATUS === 'Construction Scheduled'){
                            return {color: '#d7191c', weight: 3};
                        }   else if(feature.properties.PRJ_STATUS === 'Finalizing for Construction'){
                            return {color: '#fdae61', weight: 3};
                        }   else if(feature.properties.PRJ_STATUS === 'Under Development'){
                            return {color: '#80cdc1', weight: 3};
                        }   else if(feature.properties.PRJ_STATUS === 'Long Term Planning'){
                            return {color: '#2c7bb6', weight: 3};
                        }   else {
                            return {color: '#aaaaaa', weight: 3};
                        }
                      }
                    }).addTo(map);

//popup box for ausProjects
ausProjects.bindPopup(function (evt) {
    return L.Util.template('<p><b>HWY: </b>{HIGHWAY_NUMBER}<br><b>CSJ: </b>{CONTROL_SECT_JOB}</p>', evt.feature.properties);
});

//zoom to bounds of ausBounds
//ausBounds.query().bounds(function (error, latlngbounds) {
//    map.fitBounds(latlngbounds);
//});

//filter by county control
var county = document.getElementById('county');

county.addEventListener('change', function(){
    ausProjects.setWhere(county.value);
});

//layer control
var overlayMaps = {
	"TxDOT Projects": ausProjects,
	"AUS District Boundary": ausBounds
};

var baseMaps = {
	"OpenStreetMap": osm
};

L.control.layers(overlayMaps, baseMaps).addTo(map);

//jquery for table of contents pop out - layers
function plusOne(){
			$('#arrow').css({transform:'scaleX(1)'});
		}
		
		function minusOne(){
			$('#arrow').css({transform:'scaleX(-1)'});
		}
		
		$(document).ready(function(){
			$('#arrow').click(function(){
				if($('#toc').css('width')=='30px'){
					$('#toc').animate({width:'250px'}, 500, minusOne);
					$('#toc-content').show();
					$('#vert').hide();
				}else{
					$('#toc').animate({width:'30px'}, 500, plusOne);
					$('#toc-content').hide();
					$('#vert').show();
				}
        	});
		});