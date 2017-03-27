//create var bounds
var northWest = L.latLng(30.95, -99.49),
	southEast = L.latLng(29.72, -96.66),
	bounds = L.latLngBounds(northWest, southEast);

//create map
var map = L.map('map');
map.fitBounds(bounds);

//load custom txdot basemap as initial base (not included in basemap changer) 
var spm = L.esri.tiledMapLayer({
                url: 'https://tiles.arcgis.com/tiles/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Statewide_Planning_Map/MapServer'
            }).addTo(map);

//openstreetmap variable for layer control
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

//carto basemap variables
var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://carto.com/attribution">Carto</a>'
    });

var darkmatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://carto.com/attribution">Carto</a>'
    });

//custom easy button control, zoom to var bounds
L.easyButton('fa-globe fa-lg', function(){
    map.fitBounds(bounds)
}).addTo(map);
  
//load AUS district boundary AGO feature service
var ausHilite = L.esri.featureLayer({
				url: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Austin_Hilite_TxGeneral_Boundary/FeatureServer/0',
				style: function(feature) {
					return {color: '#000000', opacity: '0.3'};
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
    return L.Util.template('<b>CSJ: </b>{CONTROL_SECT_JOB}<br><b>HWY: </b>{HIGHWAY_NUMBER}<br><b>COUNTY: </b>{COUNTY_NAME}<br><b>LENGTH: </b>{PROJ_LENGTH}<br><b>PROJECT CLASS: </b>{PROJ_CLASS}<br><b>EST. COST: </b>{EST_CONST_COST}<br><b>TYPE OF WORK: </b>{TYPE_OF_WORK}<br><b>LET DATE: </b>{DIST_LET_DATE}<br><b>BEGIN MILE PT: </b>{BEG_MILE_POINT}<br><b>END MILE PT: </b>{END_MILE_POINT}<br><b>FUND CATEGORY: </b>{TPP_CATEGORY_P2}<br><b>WORK PROGRAM: </b>{TPP_WORK_PROGRAM}<br><b>STATUS: </b>{PRJ_STATUS}', evt.feature.properties);
});

//filter by county control
/*var county = document.getElementById('county');

county.addEventListener('change', function(){
    ausProjects.setWhere(county.value);
});
*/

//basemap layer control
var baseMaps = {
	"TxDOT SPM": spm,
	"OpenStreetMap": osm,
	"Positron": positron,
	"Dark Matter": darkmatter
};

L.control.layers(baseMaps).addTo(map);

//jquery for table of contents - custom layer control
function plusOne(){
	$('#arrow').css({transform:'scaleX(1)'});
}
		
function minusOne(){
	$('#arrow').css({transform:'scaleX(-1)'});
}
		
$(document).ready(function(){
	$('#toc').draggable();
	$('#arrow').click(function(){
		if($('#toc').css('width')=='33px'){
			$('#toc').animate({width:'250px', height:'320px'}, 500, minusOne);
			$('#layer-control').show();
			$('#vert').hide();
		}else{
			$('#toc').animate({width:'33px', height:'215px'}, 500, plusOne);
			$('#layer-control').hide();
			$('#vert').show();
		}
    });
	
    $('#ausProjects').change(function() {
        if($(this.checked)) {
            var returnVal = ausProjects.addTo(map);
            $(this).prop('checked', returnVal);
        }else{
			var removeVal = map.removeLayer(ausProjects);
			$(this).prop(removeVal);
		}       
    });
});

