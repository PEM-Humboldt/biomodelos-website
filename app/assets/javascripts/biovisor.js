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
        var paramos_humedales_fondo = new L.tileLayer.wms('http://geoservicios.humboldt.org.co/geoserver/Proyecto_fondo_adaptacion/wms', {
            format: 'image/png',
            transparent: true,
            layers: 'Proyecto_fondo_adaptacion:Limite_Paramo_2015'
        }),
        	ecosistemas_etter = L.tileLayer.wms('http://geoservicios.humboldt.org.co/geoserver/Historicos/wms', {
	            format: 'image/png',
	            transparent: true,
	            layers: 'Historicos:ecosistemas_generales_etter'
        	}); 

	    var	baseLayers = {
	    		"Google Terrain": googleTerrain,
	    		"Google Satellite": googleSatellite,
	        	"OpenStreetMap": osmBase,
	    	},

	    	overlays = {
	    		"Páramos y humedales fondo": paramos_humedales_fondo,
	    		"Ecosistemas Etter" : ecosistemas_etter
	    	};

        map = L.map('map', {crs: L.CRS.EPSG4326}).setView(latlng, zoom);

        map.addLayer(googleTerrain);

	    /* autoZIndex controls the layer order */
	    layerControl = L.control.layers(baseLayers, overlays, {autoZIndex: true, collapsed: false});
	    layerControl.addTo(map);

	    // Elevation listener
	    // map.on('mouseover', function(e) {
	    //      getLocationElevation(e.latlng, elevator);
	    // });

	    //loadSpeciesPoints();
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

			var geojsonMarkerOptions = {
			    radius: 8,
			    fillColor: "#ff7800",
			    color: "#000",
			    weight: 1,
			    opacity: 1,
			    fillOpacity: 0.8
			};

		  $.getJSON("/test.json",function(data){
		    var points = L.geoJson(data,{
		    	pointToLayer: function (feature, latlng) {
    				return L.circleMarker(latlng, geojsonMarkerOptions);
				},
		 		onEachFeature: function (feature, layer) {
					var popupcontent = [];
					popupcontent .push('<b><div id="point_lon">'+ feature.geometry.coordinates[0]+'</div>, <div id="point_lat"> '+ feature.geometry.coordinates[1] + '</div></b><br /><br />');
					for (var prop in feature.properties) {
    					popupcontent.push(prop + ": " + feature.properties[prop]);
						}
						layer.bindPopup(popupcontent.join("<br />"));

				}
		    });
		    var clusters = L.markerClusterGroup();
		    clusters.addLayer(points);
		    map.addLayer(clusters);
		    layerControl.addOverlay(clusters,"Registros");
		  });
	}  
	
	return{
		init:init
	}
}();

$(document).ready(function() {
	_BioModelosVisorModule.init();
});