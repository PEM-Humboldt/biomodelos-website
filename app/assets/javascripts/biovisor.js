var _BioModelosVisorModule = function() {
	var map;

	//var setAltitude()

	var init = function(){
		var latlng = new L.LatLng(4, -72),
        zoom = 6,
        mZoom = 2,
        mxZoom = 16;
        
        /* Elevation API object */
        var elevator = new google.maps.ElevationService;

        /* Base Layers */
    	var googleTerrain = new L.Google('TERRAIN', {minZoom:mZoom, maxZoom: mxZoom}),
			googleSatellite = new L.Google('SATELLITE', {minZoom:mZoom, maxZoom: mxZoom}),
    		osmBase = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                minZoom: mZoom,
                maxZoom: mxZoom,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> Contributors'
            });

        /* Overlays */
        //var fo

	    var	baseLayers = {
	    		"Google Terrain": googleTerrain,
	    		"Google Satellite": googleSatellite,
	        	"OpenStreetMap": osmBase,
	    	},

	    	overlays = {};

        map = L.map('map', {crs: L.CRS.EPSG4326}).setView(latlng, zoom);

        map.addLayer(googleTerrain);

	    /* autoZIndex controls the layer order */
	    layerControl = L.control.layers(baseLayers, overlays, {autoZIndex: true});
	    layerControl.addTo(map);

	    // Elevation listener
	    // map.on('mouseover', function(e) {
	    //      getLocationElevation(e.latlng, elevator);
	    // });

	    loadSpeciesPoints();
	}

	var getLocationElevation = function (location, elevator){
	  // Initiate the location request
	  elevator.getElevationForLocations({
	    'locations': [location]
	  }, function(results, status) {
	    if (status === google.maps.ElevationStatus.OK) {
	    //Retrieve the first result
	      if (results[0]) {
	        console.log(parseFloat(results[0].elevation).toFixed(2));
	      } else {
	       //return 'No results found';
	      }
	    } else {
	      //return 'Elevation service failed due to: ' + status;
	    }
  	  });
	}

	var loadSpeciesPoints = function(){
		var cluster = new L.MarkerClusterGroup({}).addTo(map);

    		map.addLayer(cluster);
    		layerControl.addOverlay(cluster,"Registros");

			L.layerJSON({
			    url: "../test.json",
			    propertyLoc: 'lat',
			    caching: true,
			    layerTarget: cluster // Option layerTarget
			}).addTo(map);

	}  
	
	return{
		init:init
	}
}();

$(document).ready(function() {
	_BioModelosVisorModule.init();
});