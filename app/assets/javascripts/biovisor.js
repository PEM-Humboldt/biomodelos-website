var _BioModelosVisorModule = function() {
	var map, 
		editableLayer,
		newRecordsLayer, 
		polygonEditor, 
		polygonDelete, 
		thresholdLayers, 
		thresholdC, 
		threshold0, 
		threshold10, 
		threshold20, 
		threshold30, 
		species_records, 
		recordsLayer, 
		cluster, 
		currentPopupID,
		pointDrawer,
		polygonDrawer;

	var redIcon = new L.Icon({	iconUrl: '/assets/redmarker.png',
       							shadowUrl: "/assets/marker-shadow.png",
	       						iconSize:    [25, 41],
								iconAnchor:  [12, 41],
								popupAnchor: [1, -34],
								tooltipAnchor: [16, -28],
								shadowSize:  [41, 41]}),
       	blueIcon = new L.Icon({	iconUrl: '/assets/marker-icon.png',
       			  				shadowUrl: "/assets/marker-shadow.png",
       			  				iconSize:    [25, 41],
								iconAnchor:  [12, 41],
								popupAnchor: [1, -34],
								tooltipAnchor: [16, -28],
								shadowSize:  [41, 41]});

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
	            //opacity: 0.6,
	            layers: 'Biomodelos:Cebus_apella'
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

	    //Capa editable
	    editableLayer = new L.FeatureGroup(); 
	    map.addLayer(editableLayer);
		//Capa registros nuevos
	    newRecordsLayer = new L.FeatureGroup();
	    map.addLayer(newRecordsLayer);

	    var drawControl = new L.Control.Draw({
		    draw: false,
		    edit: false
		}).addTo(map);

		//Polygon editor and delete handler
		polygonEditor = new L.EditToolbar.Edit(map, {
                featureGroup: editableLayer
		});

		polygonDelete = new L.EditToolbar.Delete(map, {
                featureGroup: editableLayer
		});

		//Point handler
		pointDrawer = new L.Draw.Marker(map, {icon: blueIcon});

	    // Elevation listener
	    // map.on('mouseover', function(e) {
	    //      getLocationElevation(e.latlng, elevator);
	    // });
		setLayers("../Aburria aburri_0.png", "../Aburria aburri_0.png", "../Aburria aburri_10.png", "../Aburria aburri_20.png", "../Aburria aburri_30.png");
	   	getSpeciesRecords();
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

	var getSpeciesRecords = function(){

		clearLayer(cluster);

		var url = "http://192.168.205.197:3000/BioModelos/species/Zamia tolimensis";
		// var url = "http://192.168.11.81:3000/BioModelos/species/Aburria aburri";

		$.getJSON(url,function(data){
			species_records = data
		    filterRecords('', '', ["","",""], ["",""], ["", ""]);
		});

		cluster = L.markerClusterGroup();
		map.addLayer(cluster);
		layerControl.addOverlay(cluster,"Registros");
	}

	var filterRecords = function(filter, val, visFilters, yearFilters, monthFilters){
		cluster.clearLayers();
       	recordsLayer = L.geoJson(species_records,{
       			pointToLayer: function(feature, latlng) {
       				var filtered = false;

	       			// if(visFilters[0] === 'visualrep')
	       			// 	filtered = feature.properties.IsReported === true;
	       			// if(visFilters[1] === 'visualedit')
	       			// 	filtered = filtered || feature.properties.IsEdited === true;
	       			// if(visFilters[2] === 'visualadd')
	       			// 	filtered = filtered || feature.properties.Fuente === 'BioModelos';

	   			    if (filtered){
	   			    	return new L.Marker(latlng, {
				            icon: redIcon        
				        });
	   			    }
	   			    else{
	   			    	return new L.Marker(latlng, {
				          	icon: blueIcon
				        });
	   			    }
			    },
       			filter: function(feature, layer) {

       				var yearFilter = true, 
       					monthFilter = true,
       					dataFilter = true;

       				// if(feature.properties.Year < yearFilters[0] && feature.properties.Year > yearFilters[1]){
       				// 	yearFilter = false;	
       				// }
       					
       				// for(var i=0; i<monthFilters.length; i++){
       				// 	if (feature.properties.Month != monthFilters[i]){
       				// 		monthFilter = false;
       				// 	}
       				// }
					switch (filter) {
					  case 'Evidencia':
					    dataFilter = feature.properties.Evidencia === val;
					    break;
					  case 'Fuente':
					    dataFilter = feature.properties.Fuente === val;
					    break;
					  case 'Institución':
					  	dataFilter = feature.properties.Institucion === val;
					  	break;
					  case '':
					    dataFilter = true;
					    break;
					  default:
					    dataFilter = true;
					    break;
					}
					return yearFilter && monthFilter && dataFilter;

   				},	
		 		onEachFeature: function (feature, layer) {
		 			var popupcontent = [];
					popupcontent.push('<div class="cajita"><div class="regscroller"><div id="point_lat">'+ feature.geometry.coordinates[1]+'</div><div id="point_lon"> '+ feature.geometry.coordinates[0] + '</div>');
					for (var prop in feature.properties) {
						if(prop === '_id')
							popupcontent.push("<input id='bm_db_id' type='hidden' value='" + feature.properties[prop] + "'>");
						else
							popupcontent.push('<b>'+ prop + "</b></br>" + feature.properties[prop] + "</br>");	
					}
					popupcontent.push('</div><div class="centering"><a href="" class="wrongbtn" id="editRecordBtn">Editar</a><a href="/species/comment_point" data-method="post" data-remote="true" rel="nofollow" class="wrongbtn">Reportar</a></div>');
					layer.bindPopup(popupcontent.join('<div class="mt10"></div>'));
				}	
		});
		cluster.addLayer(recordsLayer);

		map.on('popupopen', function(e) {
		   currentPopupID = e.popup._leaflet_id;
		   $('.regscroller').niceScroll({
				cursorcolor: "#124c5e",
				cursorwidth: "7px",
				cursorborder: "none"
			});
		});
	}

	var editRecord = function(){

		recordsLayer.eachLayer(function(layer) {
	        if (layer._popup._leaflet_id === currentPopupID) {
	            editableLayer = layer;
	        }
	    });

		console.log(editableLayer);

	    var editableForm = [];
	    editableForm.push('<div class="cajita"><div class="regscroller"><div id="point_lat"><input type="text" value="'+ editableLayer.feature.geometry.coordinates[1] +'"/input></div><div id="point_lon"><input type="text" value="'+ editableLayer.feature.geometry.coordinates[0] + '"/input></div>');
					for (var prop in editableLayer.feature.properties) {
						if(prop === '_id')
							editableForm.push("<input id='bm_db_id' type='hidden' value='" + editableLayer.feature.properties[prop] + "'>");
						else if(prop === 'Especie_Original')
							editableForm.push('<b>'+ prop + '</b></br><input type="text" id="originalSpecies" value="' + editableLayer.feature.properties[prop] +'"/input></br>');
						else if(prop === 'Localidad')
							editableForm.push('<b>'+ prop + '</b></br><input type="text" id="localidad" value="' + editableLayer.feature.properties[prop] +'"/input></br>');
						else if(prop === 'Fecha')
							editableForm.push('<b>'+ prop + '</b></br><input type="text" id="fecha" value="' + editableLayer.feature.properties[prop] +'"/input></br>');
						else if(prop === 'Colector')
							editableForm.push('<b>'+ prop + '</b></br><input type="text" id="colector" value="' + editableLayer.feature.properties[prop] +'"/input></br>');
						else
							editableForm.push('<b>'+ prop + "</b></br>" + editableLayer.feature.properties[prop] + "</br>");	
					}
					editableForm.push('</div><div class="centering"><a href="" class="wrongbtn">Enviar</a><a href="" class="wrongbtn" id="cancelRecordEdition">Cancelar</a></div>');
					// editableLayer.bindPopup(editableForm.join('<div class="mt10"></div>'));
					var oldContent = editableLayer._popup.getContent();
					console.log(oldContent);
					editableLayer.setPopupContent(editableForm.join('<div class="mt10"></div>'));

		// Set the old content back when the popup closes.
		map.on('popupclose', function(e) {
		   editableLayer.setPopupContent(oldContent);
		});
		//Set the old content back when cancel button is pressed.
		$( "#cancelRecordEdition" ).on( "click", function(e) {
  			e.preventDefault();
			editableLayer.setPopupContent(oldContent);
		});

	    console.log(editableLayer);
	}

	var uniqueValues = function(filterName){
		console.log(filterName);
		var lookup = {},
			items = species_records.features,
			result = [],
			name;

		for (var item, i = 0; item = items[i++];) {
		  switch(filterName){
		  	case "Evidencia":
		  		name = item.properties.Evidencia;
		  		break;
		  	case "Fuente":
		  		name = item.properties.Fuente;
		  		break;
		  	case "Institución":
		  		name = item.properties.Institucion;
		  		break;
		  	default:
		  		break;	
		  }

		  if (!(name in lookup)) {
		    lookup[name] = 1;
		    result.push(name);
		  }
		}

		return result;
	}

	/*
	*	Function that lets draw a Feature (Markers or Polygons) and add an editable popup to them.
	*	actionType = String with the name of the feature. "Polygon" or "Marker".
	*	newMap = Boolean. True if the user is creating a new map and not working over a existing one.
	*/
	var drawObject = function (actionType, newMap){

		// Polygon handler
		if (actionType === 'Polygon'){
				polygonDrawer = new L.Draw.Polygon(map);
				polygonDrawer.enable();
				popUpForm = '<div class="commentForm">' +
				'<input id="review_type" type="hidden">'+
				'<div class="row-fluid clearfix">'+
				'<div class="labelcom clearfix">Acción</div></br>'+
				'<input type="radio" name="EditType" value="Intersect" class="radiogaga"></input><label for="Intersect">Agregar área</label></br>'+
				'<input type="radio" name="EditType" value="Add" class="radiogaga"></input><label for="Add">Sustraer área</label></br>'+
				'<input type="radio" name="EditType" value="Cut" class="radiogaga"></input><label for="Cut">Recortar del polígono</label></br>'+
				'<div class="centering"><button class="botonpopup" id="savePolBtn" type="button">guardar</button>'+
				'<button class="botonpopup ml0" id="popUpCancelBtn" type="button">cancelar</button></div>'+
				'<a href="http://biomodelos.humboldt.org.co/faq#faq" target="_blank" title="Cómo utilizamos este aporte?" class="infolink" id="gotofaq"></a></div>';
		}
		else{
				newRecordsLayer.clearLayers();
				pointDrawer.enable();
				newPointForm = '<div class="regform">' +
		           '<input id="review_type" type="hidden">'+
		           '<div class="labelcom clearfix">nuevo Registro</div></br>'+
		           '<label>Lat </label><input type="text" name="latitude" id="txtNewRecordLat" size="7" class="smallinput"></input>'+
		           '<label> Lng </label><input type="text" name="longitude" id="txtNewRecordLng" size="7" class="smallinput"></input></br>' +
			       '<label> Altura </label><input type="text" name="altitude" id="sle" size="7" class="smallinput"></input></br>' +
			       '<input type="date" id="fecha_registro" name="fecha_registro" placeholder="Fecha de registro (mm/dd/aa)" class="inputforma"></input>' +
			       '<input type="text" id="r_localidad" name="localidad" placeholder="Localidad" class="inputforma"></input>' +
			       '<input type="text" name="tipo" id="r_tipo" placeholder="Tipo de registro" class="inputforma"></input>' +
			       '<input type="text" name="colector" id="r_observador" placeholder="Observador" class="inputforma"></input>' +
			       '<input type="text" name="cita" id="r_cita" placeholder="Cita" class="inputforma"></input>' +
			       '<textarea rows="4" cols="30" placeholder="Ingrese una observación" id="comment" class="inputforma"></textarea>' +
			       '<div class="centering"><button class="botonpopup" id="saveBtn" type="button">guardar</button>' +
		           '<button class="botonpopup" id="popUpCancelBtn" type="button">cancelar</button></div></div>';
		}	

		// Add polygon layer to map
		map.on('draw:created', function (e) {
		    var type = e.layerType,
		        layer = e.layer,

		        popup = new L.Popup({
		        	keepInView: true,
		        	closeButton: false
		        });

		    if (type === 'marker') {
    			popup.setContent(newPointForm);	
    			layer.bindPopup(popup);
		    	layer.addTo(newRecordsLayer);
    		}
    		else {
    			//popup.setContent($('.editControls').html());
    			popup.setContent(popUpForm);
    			layer.bindPopup(popup);
		    	layer.addTo(editableLayer);
    		}
		    layer.openPopup();
		    currentPopupID = layer._popup._leaflet_id;
		});

		map.on('popupclose', function(e) {
    		e.popup.update();
		});
	}

	var addActionToPolygon = function(e){
		var polygonLayer;
		editableLayer.eachLayer(function(layer) {
	        if (layer._popup._leaflet_id === currentPopupID) {
	            polygonLayer = layer;
	        }
	    });
		if (polygonLayer){
	    	var popUpActionForm = '<div class="commentForm">' +
				'<div class="row-fluid clearfix">'+
				'<div class="labelcom clearfix">Acción</div></br>'+
				'<label id="propValue">'+ $("input[name='EditType']:checked").val() +'</label></br>'+
				'<a href="http://biomodelos.humboldt.org.co/faq#faq" target="_blank" title="Cómo utilizamos este aporte?" class="infolink" id="gotofaq"></a></div>';

			polygonLayer.bindPopup(popUpActionForm);

			saveEditionLayer(editableLayer);
		}

	}

	/*
	*	Saving the polygon layers as a GeoJSON Feature Group
	*
	*	Original functions taken from  https://github.com/Leaflet/Leaflet/blob/master/src/layer/GeoJSON.js
	*/

	var polygonToGeoJSON = function(layer, properties){

		var coords = [];

		for (var i = 0, len = layer._latlngs.length; i < len; i++) {
			coords.push(L.GeoJSON.latLngToCoords(layer._latlngs[i]));
		}
		coords.push(coords[0]);
		coords = [coords];

		return getFeature(this, {
			type: 'Polygon',
			coordinates: coords
		}, properties);

	}

	var getFeature = function(layer, newGeometry, properties){
		return layer.feature ?
				L.extend({}, layer.feature, {geometry: newGeometry}) :
				asFeature(newGeometry, properties);
	}

	var asFeature = function(geojson, properties){
		if (geojson.type === 'Feature') {
			return geojson;
		}

		return {
			type: 'Feature',
			properties: properties,
			geometry: geojson
		};
	}

	var toGeoJSONWithProperties = function(layers){

		var jsons = [];

		layers.eachLayer(function (layer) {
			if (layer.toGeoJSON) {
				var properties = getLayerProperties(layer);
				var json = polygonToGeoJSON(layer, properties);
				
				jsons.push(asFeature(json, properties));
			}
		});

		return {
			type: 'FeatureCollection',
			features: jsons
		};
	}


	var getLayerProperties = function(layer){
		console.log("getLayerProperties");
		var popUpContent = layer._popup.getContent();
		var valueProp = $(popUpContent).find("label").html();

		return {
			action: valueProp
		}

	}

	var cancelAddPoint = function(){
		pointDrawer.disable();

		var currentLayer;
		console.log(newRecordsLayer);
		console.log(currentPopupID);
		newRecordsLayer.eachLayer(function(layer) {
	        if (layer._popup._leaflet_id === currentPopupID) {
	            currentLayer = layer;
	        }
	    });
		newRecordsLayer.removeLayer(currentLayer);
	}

	var saveEditionLayer = function(layer){
		console.log(JSON.stringify(toGeoJSONWithProperties(layer)));
	}

	var drawPolygon = function(){
		drawObject('Polygon');
	}
		
	var deactivateDraw = function(){
		if(polygonDrawer)
			polygonDrawer.disable();
	}

	var editPolygon = function (){
		console.log(polygonEditor);
		polygonEditor.enable();
		console.log(polygonEditor);
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
		if(typeof polygonDelete._deletedLayers != 'undefined')
			polygonDelete.revertLayers();
		polygonDelete.disable();
	}

	var saveDeletePolygon = function(){
		polygonDelete.save();
		polygonDelete.disable();
	} 

	var drawSinglePoint = function(){
		drawObject('Marker');
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

		map.addLayer(thresholdLayers, true);
	}

	var changeThresholdLayer = function (threshold){
		console.log(thresholdLayers.hasLayer(threshold0) +" 0");
		console.log(thresholdLayers.hasLayer(threshold10)+" 10");
		console.log(thresholdLayers.hasLayer(threshold20)+" 20");
		console.log(thresholdLayers.hasLayer(threshold30)+" 30");
		thresholdLayers.clearLayers();

		switch (threshold) {
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
		drawSinglePoint: drawSinglePoint,
		setLayers: setLayers,
		changeThresholdLayer:changeThresholdLayer,
		filterRecords:filterRecords,
		editRecord: editRecord,
		addActionToPolygon: addActionToPolygon,
		saveEditionLayer: saveEditionLayer,
		uniqueValues: uniqueValues,
		cancelAddPoint: cancelAddPoint,
		deletePolygon: deletePolygon,
		deactivateDraw: deactivateDraw
	}
}();

$(document).ready(function() {
	_BioModelosVisorModule.init();
	$("body").on("click","#editRecordBtn",function(e){
        e.preventDefault();
		_BioModelosVisorModule.editRecord();
  	});
  	$("body").on("click","#savePolBtn",function(e){
        e.preventDefault();
		_BioModelosVisorModule.addActionToPolygon(e);
  	});

});
