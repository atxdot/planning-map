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
  
//load AUS district boundary AGO feature service
var ausHilite = L.esri.featureLayer({
				url: 'http://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Austin_Hilite_TxGeneral_Boundary/FeatureServer/0',
				style: function(feature) {
					return {color: '#000000', opacity: '0.2'};
					}
				}).addTo(map);

//load AUS TxDOT projects AGO feature service - filter for AUS & create proper symbology
var ausProjects = L.esri.featureLayer({
                    url: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Projects/FeatureServer/0',
                    where: "DISTRICT_NAME = 'Austin'",
                    style: function (feature) {
                        if(feature.properties.PRJ_STATUS === 'Construction Scheduled'){
                            return {color: '#d7191c', weight: 4};
                        }   else if(feature.properties.PRJ_STATUS === 'Finalizing for Construction'){
                            return {color: '#fdae61', weight: 4};
                        }   else if(feature.properties.PRJ_STATUS === 'Under Development'){
                            return {color: '#80cdc1', weight: 4};
                        }   else if(feature.properties.PRJ_STATUS === 'Long Term Planning'){
                            return {color: '#2c7bb6', weight: 4};
                        }   else {
                            return {color: '#aaaaaa', weight: 4};
                        }
                      }
                    });

//popup box for ausProjects
ausProjects.bindPopup(function (evt) {
    return L.Util.template('<p><b>CSJ: </b>{CONTROL_SECT_JOB}<br><b>HWY: </b>{HIGHWAY_NUMBER}</p>', evt.feature.properties);
});

//filter by county control
var county = document.getElementById('county');

county.addEventListener('change', function(){
    ausProjects.setWhere(county.value);
});

//layer control
var overlayMaps = {
	"TxDOT Projects": ausProjects
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
	$('#toc').draggable();
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

//input checkbox/radio button in layers popout
function onClickHandler(){
	var chk=document.getElementById("box").value;
}