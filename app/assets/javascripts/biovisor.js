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
		polygonDrawer,
		modelLayer;

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

    var headers = {
    					"acceptedNameUsage":"Nombre aceptado",
						"speciesOriginal":"Especie original",
						"source":"Fuente",
						"suggestedStateProvince":"Departamento",
						"suggestedCounty":"Municipio",
						"locality":"Localidad",
						"alt":"Altitud",
						"institution":"Institución",
						"catalogNumber":"Número de catálogo",
						"basisOfRecord":"Evidencia",
						"collector":"Recolector",
						"yyyy":"Año",
						"mm":"Mes",
						"dd":"Día",
						"url":"Url"
					};

	var imageBounds = [[13,-60],[-14, -83]];

	var addNiceScroll = function(){
		$('.regscroller').niceScroll({
				cursorcolor: "#124c5e",
				cursorwidth: "7px",
				cursorborder: "none"
		});
	}

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
        	}),
        	test_bio = L.tileLayer.wms('http://geoservicios.humboldt.org.co/geoserver/Biomodelos/wms', {
	            format: 'image/png',
	            transparent: true,
	            //opacity: 0.6,
	            layers: 'Biomodelos:Cebus_apella'
        	});
        	iucn = L.tileLayer.wms('http://mapservices.iucnredlist.org/arcgis/services/icunwms/SpeciesRangeWMS/MapServer/WMSServer?&token=lFiIlLaUaaMzZxxMEB7OfKRnxIf8I4YmaMV8SMw88d0htqW3Jgd26pOzlF4vn0hGHtc6Lz__EZ1Z8T70G_wgckX_w09hXS0zuF26_HlUh5I.&layerDefs=0%3AID_NO%3D42189',{
        		format: 'image/png',
	            transparent: true,
	            //opacity: 0.6,
	            layers: 'show:0'
        	}); 

	    var	baseLayers = {
	    		"Google Terrain": googleTerrain,
	    		"Google Satellite": googleSatellite,
	        	"OpenStreetMap": osmBase,
	    	},

	    	overlays = {
	    		"Páramos y humedales": paramos_humedales_fondo,
	    		"Ecosistemas Generales (Etter)" : ecosistemas_etter,
	    		"Test BioModelos" : test_bio,
	    		"IUCN" : iucn
	    	};

        map = L.map('map', {crs: L.CRS.EPSG4326}).setView(latlng, zoom);

        map.addLayer(googleTerrain);

	    /* autoZIndex controls the layer order */
	    layerControl = L.control.layers(baseLayers, overlays, {autoZIndex: true, collapsed: false});
	    layerControl.addTo(map);

	    //Capa editable
	    editableLayer = new L.FeatureGroup(); 
	    
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

		//Threshold layers
		thresholdLayers = new L.layerGroup();

		L.control.coordinates({
    		position:"bottomright", //optional default "bootomright"
		    decimals:2, //optional default 4
		    decimalSeperator:".", //optional default "."
		    labelTemplateLat:"Latitud: {y}", //optional default "Lat: {y}"
		    labelTemplateLng:"Longitud: {x}", //optional default "Lng: {x}"
		    enableUserInput:false, //optional default true
		    useDMS:false, //optional default false
		    useLatLngOrder: true //ordering of labels, default false-> lng-lat
		}).addTo(map);

	    // Elevation listener
	    // map.on('mouseover', function(e) {
	    //      getLocationElevation(e.latlng, elevator);
	    // });
		//setLayers("../Aburria aburri_0.png", "../Aburria aburri_0.png", "../Aburria aburri_10.png", "../Aburria aburri_20.png", "../Aburria aburri_30.png");
	   	// getSpeciesRecords();
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

	var getSpeciesRecords = function(species_id, isEditable){

		if(map.hasLayer(cluster)) {
			clearLayer(cluster);
       		layerControl.removeLayer(cluster);
       	}	

		$.getJSON("/species/" + species_id + "/get_species_records",function(data){
			species_records = data;
		    filterRecords(["",""], ["","",""], [], [], isEditable);
		}).fail(function(jqxhr, textStatus, error) {
    		alertify.alert("Ha ocurrido un error al cargar los registros: " + error);
  		});

		cluster = L.markerClusterGroup();
		map.addLayer(cluster);
		layerControl.addOverlay(cluster,"Registros");
	}

	var includesValue = function(val, arr){
		for(var i=0; i<arr.length; i++){
       		if (val == arr[i])
       			return true;
       	}
       	return false;
	}

	/*
	* Función que permite filtrar los registros
	* @selectFilters: Array de la selección 
	* @visFilters: Array con 3 valores que cambian el color del registro según la cantidad de opciones activas.
	* @yearFilters: Array con 2 valores [año mínimo, año máximo].
	* @monthFilters: Array con máximo 12 valores que incluye un valor negativo o positivo para los meses.
	*/
	var filterRecords = function(selectFilters, visFilters, yearFilters, monthFilters, isEditable){
		cluster.clearLayers();
       	recordsLayer = L.geoJson(species_records,{
       			pointToLayer: function(feature, latlng) {
       				var filtered = false;

	       			if(visFilters[0] === 'visualrep'){
	       				filtered = feature.properties.reported === true;
	       			}
	       			if(visFilters[1] === 'visualedit'){
	       				filtered = filtered || feature.properties.updated === true;
	       			}
	       			if(visFilters[2] === 'visualadd'){
	       				filtered = filtered || feature.properties.source === 'BioModelos';
	       			}
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

       				console.log(yearFilters[0] + " " + yearFilters[1]);

       				var yearFilter = true, 
       					monthFilter = true,
       					dataFilter = true;

       				if(yearFilters != ""){

       					var yearValue = feature.properties.yyyy;
       					if(yearValue == null){
       						yearValue = 0;
       					}
       					if(yearValue < yearFilters[0] || feature.properties.yyyy > yearFilters[1]){
       						yearFilter = false;	
       					}
       				}
       				if(monthFilters != ""){
       					monthFilter = includesValue(feature.properties.mm, monthFilters);
       				}
					switch (selectFilters[0]){
					  case 'Evidencia':
					    dataFilter = feature.properties.basisOfRecord === selectFilters[1];
					    break;
					  case 'Fuente':
					    dataFilter = feature.properties.source === selectFilters[1];
					    break;
					  case 'Institución':
					  	dataFilter = feature.properties.institution === selectFilters[1];
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
						else if (prop != "taxID" && prop != "species" && prop != "reported" && prop != "updated")
							popupcontent.push('<b>'+ headers[prop] + ":</b></br>" + feature.properties[prop] + "</br>");
		
					}
					if(isEditable)
						popupcontent.push('</div><div class="centering"><a href="" class="wrongbtn" id="editRecordBtn">Editar</a><a href="/records/report_record" data-method="post" data-remote="true" rel="nofollow" class="wrongbtn">Reportar</a></div>');
					else
						popupcontent.push('</div>');
					layer.bindPopup(popupcontent.join('<div class="mt10"></div>'));
				}	
		});
		cluster.addLayer(recordsLayer);

		map.on('popupopen', function(e) {
		   currentPopupID = e.popup._leaflet_id;
		   addNiceScroll();
		});
	}

	var editRecord = function(){

		recordsLayer.eachLayer(function(layer) {
	        if (layer._popup._leaflet_id === currentPopupID) {
	            editableLayer = layer;
	        }
	    });

	    var editableForm = [];
	    editableForm.push('<div class="cajita"><div class="regscroller"><div id="point_lat"><input type="text" id="txtLatEdit" value="'+ editableLayer.feature.geometry.coordinates[1] +'"/input></div><div id="point_lon"><input type="text" id="txtLonEdit" value="'+ editableLayer.feature.geometry.coordinates[0] + '"/input></div>');
		editableForm.push('<input type="hidden" id="oldLatEdit" value="'+ editableLayer.feature.geometry.coordinates[1] +'"/input><input type="hidden" id="oldLonEdit" value="'+ editableLayer.feature.geometry.coordinates[0] + '"/input>');
					for (var prop in editableLayer.feature.properties) {
						if(prop === '_id')
							editableForm.push("<input id='bm_db_id' type='hidden' value='" + editableLayer.feature.properties[prop] + "'>");
						else if(prop === 'speciesOriginal'){
							editableForm.push('<b>Especie original:</b></br><input type="text" id="txtSpeciesEdit" value="' + editableLayer.feature.properties[prop] +'"/input></br>');
							editableForm.push('<input type="hidden" id="oldSpeciesEdit" value="' + editableLayer.feature.properties[prop] +'"/input>');
						}
						else if(prop === 'locality'){
							editableForm.push('<b>Localidad:</b></br><input type="text" id="txtLocEdit" value="' + editableLayer.feature.properties[prop] +'"/input></br>');
							editableForm.push('<input type="hidden" id="oldLocEdit" value="' + editableLayer.feature.properties[prop] +'"/input>');
						}
						else if(prop != "taxID" && prop != "species" && prop != "reported" && prop != "updated")
							editableForm.push('<b>'+ headers[prop] + "</b></br>" + editableLayer.feature.properties[prop] + "</br>");	
					}
					editableForm.push('</div><div class="centering"><a href="" class="wrongbtn" id="sendRecordEdition">Enviar</a><a href="" class="wrongbtn" id="cancelRecordEdition">Cancelar</a></div>');
					// editableLayer.bindPopup(editableForm.join('<div class="mt10"></div>'));
					var oldContent = editableLayer._popup.getContent();
					editableLayer.setPopupContent(editableForm.join('<div class="mt10"></div>'));

		// Set the old content back when the popup closes.
		map.on('popupclose', function(e) {
		   editableLayer.setPopupContent(oldContent);
		});
		//Set the old content back when cancel button is pressed.
		$( "#cancelRecordEdition" ).on( "click", function(e) {
  			e.preventDefault();
			editableLayer.setPopupContent(oldContent);
			addNiceScroll();
		});

		addNiceScroll();
	}

	/*
	* Function that gets the unique values from the selected filter
	*/
	var uniqueValues = function(filterName){
		console.log(filterName);
		var result = [];
		if(species_records){
			var lookup = {},
				items = species_records.features,
				name;

			for (var item, i = 0; item = items[i++];) {
			  switch(filterName){
			  	case "Evidencia":
			  		name = item.properties.basisOfRecord;
			  		break;
			  	case "Fuente":
			  		name = item.properties["source"];
			  		break;
			  	case "Institución":
			  		name = item.properties.institution;
			  		break;
			  	default:
			  		break;	
			  }

			  if (!(name in lookup)) {
			    lookup[name] = 1;
			    result.push(name);
			  }
			}
		}
		return result;		
	}

	/*
	*	Function that lets draw a Feature (Markers or Polygons) and add an editable popup to them.
	*	actionType = String with the name of the feature. "Polygon" or "Marker".
	*	newMap = Boolean. True if the user is creating a new map and not working over a existing one.
	*/
	var drawObject = function (actionType, newModel){

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
				'<button class="botonpopup ml0" id="puNewPolygonCancelBtn" type="button">cancelar</button></div>'+
				'<a href="http://biomodelos.humboldt.org.co/faq#faq" target="_blank" title="Cómo utilizamos este aporte?" class="infolink" id="gotofaq"></a></div>';
		}
		else{
				newRecordsLayer.clearLayers();
				pointDrawer.enable();
				newPointForm = '<div class="regform">' +
		           '<input id="review_type" type="hidden">'+
		           '<div class="labelcom clearfix">nuevo Registro</div></br>'+
		           '<label>Lat </label><input type="text" name="latitude" id="txtNewRecordLat" size="7" class="smallinput"></input>'+
		           '<label> Lon </label><input type="text" name="longitude" id="txtNewRecordLon" size="7" class="smallinput"></input></br>' +
			       '<label> Altura </label><input type="text" name="altitude" id="r_altitude" size="7" class="smallinput"></input></br>' +
			       '<label> Fecha </label><input type="text" id="year_registro" name="year_registro" placeholder="YYYY" class="smallinput" size="4"></input><input type="text" id="month_registro" name="month_registro" placeholder="MM" class="smallinput" size="2"></input><input type="text" id="day_registro" name="day_registro" placeholder="DD" class="smallinput" size="2"></input>' +
			       '<input type="text" id="r_departamento" name="departamento" placeholder="Departamento" class="inputforma"></input>' +
			       '<input type="text" id="r_municipio" name="municipio" placeholder="Municipio" class="inputforma"></input>' +
			       '<input type="text" id="r_localidad" name="localidad" placeholder="Localidad" class="inputforma"></input>' +
			       '<input type="text" name="tipo" id="r_tipo" placeholder="Tipo de registro" class="inputforma"></input>' +
			       '<input type="text" name="colector" id="r_observador" placeholder="Observador" class="inputforma"></input>' +
			       '<input type="text" name="cita" id="r_cita" placeholder="Cita" class="inputforma"></input>' +
			       '<textarea rows="4" cols="30" placeholder="Ingrese una observación" id="r_comment" class="inputforma"></textarea>' +
			       '<div class="centering"><button class="botonpopup" id="r_saveBtn" type="button">guardar</button>' +
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
		    	var pLatLng = layer.getLatLng();
    			popup.setContent(newPointForm);	
    			layer.bindPopup(popup);
		    	layer.addTo(newRecordsLayer);
    		}
    		else {
    			//popup.setContent($('.editControls').html());
    			if(!newModel){
    				popup.setContent(popUpForm);
    				layer.bindPopup(popup);
    			}
		    	layer.addTo(editableLayer);
    		}
    		$(".polig").removeClass("polibtnact");
    		if(!newModel){
		    	layer.openPopup();
		    	if(type === 'marker') {
		    		$('#txtNewRecordLat').val(L.NumberFormatter.round(pLatLng.lat, 2, "."));
		        	$('#txtNewRecordLon').val(L.NumberFormatter.round(pLatLng.lng, 2, "."));
		        }
		    	currentPopupID = layer._popup._leaflet_id;
		    }
		});

		map.on('popupclose', function(e) {
    		e.popup.update();
		});
	}

	var addActionToPolygon = function(e){
		var polygonLayer = getCurrentEditableLayer(currentPopupID);

		if (polygonLayer){
	    	var popUpActionForm = '<div class="commentForm">' +
				'<div class="row-fluid clearfix">'+
				'<div class="labelcom clearfix">Acción</div></br>'+
				'<label id="propValue">'+ $("input[name='EditType']:checked").val() +'</label></br>'+
				'<a href="http://biomodelos.humboldt.org.co/faq#faq" target="_blank" title="Cómo utilizamos este aporte?" class="infolink" id="gotofaq"></a></div>';

			polygonLayer.bindPopup(popUpActionForm);

			// saveEditionLayer(editableLayer);
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

	var toGeoJSONWithProperties = function(layers, newModel){

		var jsons = [];

		layers.eachLayer(function (layer) {
			if (layer.toGeoJSON) {
				var properties = getLayerProperties(layer, newModel);
				var json = polygonToGeoJSON(layer, properties);
				
				jsons.push(asFeature(json, properties));
			}
		});

		return {
			type: 'FeatureCollection',
			features: jsons
		};
	}


	var getLayerProperties = function(layer, newModel){
		
		if(newModel == 'true'){
			return {
			}
		}
		else{
			var popUpContent = layer._popup.getContent();
			var valueProp = $(popUpContent).find("label").html();

			return {
				action: valueProp
			}
		}
	}

	var getCurrentEditableLayer = function(popupId){
		var polygonLayer;
		editableLayer.eachLayer(function(layer) {
	        if (layer._popup._leaflet_id === popupId) {
	            polygonLayer = layer;
	        }
	    });

	    return polygonLayer;
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

	var getGeojsonLayer = function(newModel){
		return JSON.stringify(toGeoJSONWithProperties(editableLayer, newModel));
	}

	var drawPolygon = function(newModel){
		drawObject('Polygon', newModel);
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
		drawObject('Marker', false);
	}

	var clearLayer = function(layer){
		if(map.hasLayer(layer)) {
       		map.removeLayer(layer);
       		//layerControl.removeLayer(layer);
       	}
	}

	var cancelDrawnLayer = function(){
		var delLayer = getCurrentEditableLayer(currentPopupID);
		editableLayer.removeLayer(delLayer);
		//$(".polig").re
	}

	var setLayers = function(imgThresholdC, imgThreshold0, imgThreshold10, imgThreshold20, imgThreshold30){

		thresholdC = new L.ImageOverlay(imgThresholdC, imageBounds, {opacity: 0.6});
		threshold0 = new L.ImageOverlay(imgThreshold0, imageBounds, {opacity: 0.6});
		threshold10 = new L.ImageOverlay(imgThreshold10, imageBounds, {opacity: 0.6});
		threshold20 = new L.ImageOverlay(imgThreshold20, imageBounds, {opacity: 0.6});
		threshold30 = new L.ImageOverlay(imgThreshold30, imageBounds, {opacity: 0.6});
	}

	var changeThresholdLayer = function (threshold){
		thresholdLayers.clearLayers();
		switch (threshold) {
				  case 'C':
				    thresholdLayers.addLayer(thresholdC);
				    break;
				  case '0%':
				    thresholdLayers.addLayer(threshold0);
				    break;
				  case '10%':
				    thresholdLayers.addLayer(threshold10);
				    break;
				  case '20%':
				    thresholdLayers.addLayer(threshold20);
				    break;
				  case '30%':
				    thresholdLayers.addLayer(threshold30);
				    break;
				  default:
				    break;
		}	    
	}

	var loadModel = function (modelUrl, name) {

       /* Dispose older model if it exists */
        unloadModel();
       	
	    modelLayer = new L.ImageOverlay(modelUrl, imageBounds, {opacity: 0.6});
	    
	    map.addLayer(modelLayer, true);
	    layerControl.addOverlay(modelLayer, "Modelo" + name);
	};

	var unloadModel = function() {
		if(map.hasLayer(modelLayer)) {
       		map.removeLayer(modelLayer);
       		layerControl.removeLayer(modelLayer);
       }
	}

	var loadUserLayer = function (userLayer) {
	   console.log(userLayer);
		/* Dispose older review if it exists */
       editableLayer.clearLayers();

       reviewLayer = new L.GeoJSON(JSON.parse(userLayer), {
       	onEachFeature: function (feature, layer) {
       		var popUpContent = '<div class="commentForm">' +
				'<div class="row-fluid clearfix">'+
				'<div class="labelcom clearfix">Acción</div></br>'+
				'<label id="propValue">'+ feature.properties.action +'</label></br>'+
				'</div>';


			layer.setStyle({color: '#f06eaa'})
       		layer.bindPopup(popUpContent);
       		editableLayer.addLayer(layer);
       	}
       });
   };

   var loadEditionLayer = function(){
   		if(!map.hasLayer(editableLayer)) {
       		map.addLayer(editableLayer);
       		layerControl.addOverlay(editableLayer, 'Edición');
       }
   }

   var unloadEditionLayer = function(){
   		console.log("Has editableLayer: " + map.hasLayer(editableLayer));
   		if(map.hasLayer(editableLayer)) {
   			editableLayer.clearLayers();
       		map.removeLayer(editableLayer);
       		layerControl.removeLayer(editableLayer);
       }
   }

   var loadThresholdLayer = function(){
   	   	if(!map.hasLayer(thresholdLayers)) {
       		map.addLayer(thresholdLayers);
       		layerControl.addOverlay(thresholdLayers, 'Umbrales');
       }
   }

   var unloadThresholdLayer = function(){
   	   	if(map.hasLayer(thresholdLayers)) {
   			thresholdLayers.clearLayers();
       		map.removeLayer(thresholdLayers);
       		layerControl.removeLayer(thresholdLayers);
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
		getGeojsonLayer: getGeojsonLayer,
		uniqueValues: uniqueValues,
		cancelAddPoint: cancelAddPoint,
		deletePolygon: deletePolygon,
		deactivateDraw: deactivateDraw,
		getSpeciesRecords: getSpeciesRecords,
		loadUserLayer: loadUserLayer,
		cancelDrawnLayer: cancelDrawnLayer,
		loadEditionLayer: loadEditionLayer,
		unloadEditionLayer: unloadEditionLayer,
		loadThresholdLayer: loadThresholdLayer,
		unloadThresholdLayer: unloadThresholdLayer,
		loadModel: loadModel,
		unloadModel: unloadModel
	}
}();

$(document).ready(function() {
	_BioModelosVisorModule.init();
  	$("body").on("click","#savePolBtn",function(e){
        e.preventDefault();
		_BioModelosVisorModule.addActionToPolygon(e);
  	});
  	$("body").on("click","#popUpCancelBtn",function(e){
        e.preventDefault();
		_BioModelosVisorModule.cancelAddPoint();
  	});
});
