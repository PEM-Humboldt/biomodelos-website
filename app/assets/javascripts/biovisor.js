var _BioModelosVisorModule = function() {
	var map, editableLayer, polygonEditor, polygonDelete, thresholdLayers, thresholdC, threshold0, threshold10, threshold20, threshold30;

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
        	test_bio = L.tileLayer.wms('http://geoservicios.humboldt.org.co/geoserver/Biomodelos/wms', {
	            format: 'image/png',
	            transparent: true,
	            layers: 'Biomodelos:aburria_aburri'
        	}); 

	    var	baseLayers = {
	    		"Google Terrain": googleTerrain,
	    		"Google Satellite": googleSatellite,
	        	"OpenStreetMap": osmBase,
	    	},

	    	overlays = {
	    		"Páramos y humedales fondo": paramos_humedales_fondo,
	    		"Ecosistemas Etter" : ecosistemas_etter,
	    		"Test BioModelos" : test_bio
	    	};

        map = L.map('map', {crs: L.CRS.EPSG4326}).setView(latlng, zoom);

        map.addLayer(googleTerrain);

	    /* autoZIndex controls the layer order */
	    layerControl = L.control.layers(baseLayers, overlays, {autoZIndex: true, collapsed: false});
	    layerControl.addTo(map);

	    editableLayer = new L.FeatureGroup(); //Capa editable
	    map.addLayer(editableLayer);

	    var drawControl = new L.Control.Draw({
		    draw: false,
		    edit: false
		}).addTo(map);

		//Polygon editor and delete handler
		polygonEditor = new L.EditToolbar.Edit(map, {
                featureGroup: editableLayer
		});

		polygonDelete = new L.EditToolbar.Edit(map, {
                featureGroup: editableLayer
		});

		pointHandler = new L.Draw.Marker(map);


	    // Elevation listener
	    // map.on('mouseover', function(e) {
	    //      getLocationElevation(e.latlng, elevator);
	    // });
		setLayers("../Aburria aburri_0.png", "../Aburria aburri_0.png", "../Aburria aburri_10.png", "../Aburria aburri_20.png", "../Aburria aburri_30.png");
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

		  $.getJSON("http://192.168.11.81:3000/BioModelos/species/Aburria aburri",function(data){
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

	var drawPolygon = function (){

		// Polygon handler
		var polygonDrawer = new L.Draw.Polygon(map).enable(),
			popUpForm = '<div class="commentForm">' +
			'<input id="review_type" type="hidden">'+
			'<div class="row-fluid clearfix">'+
			'<div class="labelcom clearfix">Acción</div></br>'+
			'<input type="radio" name="EditType" value="Intersect" class="radiogaga"></input><label for="Intersect">Agregar área</label></br>'+
			'<input type="radio" name="EditType" value="Add" class="radiogaga"></input><label for="Add">Sustraer área</label></br>'+
			'<input type="radio" name="EditType" value="Cut" class="radiogaga"></input><label for="Cut">Recortar del polígono</label></br>'+
			'<button class="botonpopup" id="saveBtn" type="button">guardar</button>'+
			'<button class="botonpopup ml0" id="popUpCancelBtn" type="button">cancelar</button>'+
			'<a href="http://biomodelos.humboldt.org.co/faq#faq" target="_blank" title="Cómo utilizamos este aporte?" class="infolink" id="gotofaq"></a></div>';

		// Add polygon layer to map
		map.on('draw:created', function (e) {
		    var type = e.layerType,
		        layer = e.layer,
		        popup = new L.Popup({
		        	keepInView: true,
		        	closeButton: false
		        }).setContent(popUpForm);

		    // Do whatever you want with the layer.
		    // e.type will be the type of layer that has been draw (polyline, marker, polygon, rectangle, circle)
		    // E.g. add it to the map
		    layer.bindPopup(popup);
		    layer.addTo(editableLayer);
		    layer.openPopup();
		});

		map.on('popupclose', function(e) {
    		e.popup.update();
		});

	}

	var editPolygon = function (){
		polygonEditor.enable();
	}

	var cancelEditPolygon = function(){
		polygonEditor.revertLayers();
		polygonEditor.disable();
	}

	var saveEditPolygon = function(){
		polygonEditor.save();
		polygonEditor.disable();
	}

	var deletePolygon = function(){
		polygonDelete.enable();
	}

	var cancelDeletePolygon = function(){
		polygonDelete.revertLayers();
		polygonDelete.disable();
	}

	var saveDeletePolygon = function(){
		polygonDelete.save();
		polygonDelete.disable();
	} 

	var addSinglePoint = function(){
		var pointDrawer = new L.Draw.Polygon(map).enable();
	}

	var clearLayer = function(layer){
		if(map.hasLayer(layer)) {
       		map.removeLayer(layer);
       		//layerControl.removeLayer(layer);
       	}
	}

	var setLayers = function(imgThresholdC, imgThreshold0, imgThreshold10, imgThreshold20, imgThreshold30){

		var imageBounds = [[12.675, -60.48333], [-13.84166, -82.94999]];

		thresholdC = new L.ImageOverlay(imgThresholdC, imageBounds, {opacity: 0.6});
		threshold0 = new L.ImageOverlay(imgThreshold0, imageBounds, {opacity: 0.6});
		threshold10 = new L.ImageOverlay(imgThreshold10, imageBounds, {opacity: 0.6});
		threshold20 = new L.ImageOverlay(imgThreshold20, imageBounds, {opacity: 0.6});
		threshold30 = new L.ImageOverlay(imgThreshold30, imageBounds, {opacity: 0.6});

		thresholdLayers = new L.layerGroup();


		
		// thresholdC = new L.ImageOverlay(imgThresholdC, imageBounds, {opacity: 0.6});
		// threshold0 = new L.ImageOverlay(imgThreshold0, imageBounds, {opacity: 0.6});
		// threshold10 = new L.ImageOverlay(imgThreshold10, imageBounds, {opacity: 0.6});
		// threshold20 = new L.ImageOverlay(imgThreshold20, imageBounds, {opacity: 0.6});
		// threshold30 = new L.ImageOverlay(imgThreshold30, imageBounds, {opacity: 0.6});

		map.addLayer(thresholdLayers, true);
	}

	var changeThresholdLayer = function (threshold){
		console.log(thresholdLayers.hasLayer(threshold0) +" 0");
		console.log(thresholdLayers.hasLayer(threshold10)+" 10");
		console.log(thresholdLayers.hasLayer(threshold20)+" 20");
		console.log(thresholdLayers.hasLayer(threshold30)+" 30");
		thresholdLayers.clearLayers();

		switch (threshold) {
				  // case 'C':
				  // 	map.addLayer(thresholdC);
				  // 	clearLayer(threshold0);
				  // 	clearLayer(threshold10);
				  // 	clearLayer(threshold20);
				  // 	clearLayer(threshold30);
				  //   break;
				  case '0%':
				    //Statements executed when the result of expression matches value2
				    thresholdLayers.addLayer(threshold0);
				    break;
				  case '10%':
				    //Statements executed when the result of expression matches valueN
				    thresholdLayers.addLayer(threshold10);
				    break;
				  case '20%':
				    //Statements executed when the result of expression matches valueN
				    thresholdLayers.addLayer(threshold20);
				    break;
				  case '30%':
				    //Statements executed when the result of expression matches valueN
				    thresholdLayers.addLayer(threshold30);
				    break;
				  default:
				    //Statements executed when none of the values match the value of the expression
				    break;
			}	    
	}
	
	return{
		init:init,
		drawPolygon:drawPolygon,
		editPolygon:editPolygon,
		cancelEditPolygon: cancelEditPolygon,
		saveEditPolygon: saveEditPolygon,
		cancelDeletePolygon: cancelDeletePolygon,
		saveDeletePolygon: saveDeletePolygon,
		addSinglePoint: addSinglePoint,
		setLayers: setLayers,
		changeThresholdLayer:changeThresholdLayer
	}
}();

$(document).ready(function() {
	_BioModelosVisorModule.init();
});