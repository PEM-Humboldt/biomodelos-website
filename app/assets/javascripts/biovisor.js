var _BioModelosVisorModule = function() {
	var map, editableLayer, polygonEditor, polygonDelete, thresholdLayers, thresholdC, threshold0, threshold10, threshold20, threshold30, species_records, recordsLayer, cluster, currentPopupID;
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

		var url = "http://192.168.205.197:3000/BioModelos/species/Aburria aburri";
		// var url = "http://192.168.11.81:3000/BioModelos/species/Aburria aburri";

		$.getJSON(url,function(data){
			species_records = data
		    filterRecords('', '');
		    console.log(uniqueValues("Institucion"));
		});

		cluster = L.markerClusterGroup();
		map.addLayer(cluster);
		layerControl.addOverlay(cluster,"Registros");
	}

	// function foo(callback) {

	//    $.getJSON(url,function(data){
	// 	    loadSpeciesRecords(data);
	// 	});
	// }

	// var loadSpeciesRecords = function(sp_records){

	// 		species_records = sp_records;

	// 		if(cluster.hasLayer(recordsLayer)) {
 //       			cluster.removeLayer(recordsLayer);
 //       			//layerControl.removeLayer(layer);
 //       		}

	// 	    recordsLayer = L.geoJson(sp_records,{
	// 	 		onEachFeature: function (feature, layer) {
	// 	 			var popupcontent = [];
	// 				popupcontent .push('<div class="cajita"><b><div id="point_lon">'+ feature.geometry.coordinates[0]+'</div>, <div id="point_lat"> '+ feature.geometry.coordinates[1] + '</div></b></br></br>');
	// 				for (var prop in feature.properties) {
	// 					if(prop === '_id')
	// 						popupcontent.push("<input id='bm_db_id' type='hidden' value='" + feature.properties[prop] + "'>");
	// 					else
	// 						popupcontent.push('<b>'+ prop + ":</b></br>" + feature.properties[prop] + "</br>");
							
	// 				}
	// 				popupcontent.push('<a href="/species/comment_point" data-method="post" data-remote="true" rel="nofollow" class="wrongbtn">Reportar Error</a></div>');
	// 				layer.bindPopup(popupcontent.join('</br>'));
	// 			}
	// 	    });
	// 	    // cluster = L.markerClusterGroup();
	// 	    cluster.addLayer(recordsLayer);
	// 	    // map.addLayer(cluster);
	// 	    // layerControl.addOverlay(cluster,"Registros");
	// }

	var filterRecords = function(filter, val){

		cluster.clearLayers();
       	recordsLayer = L.geoJson(species_records,{
       			pointToLayer: function(feature, latlng) {

   			      switch (feature.properties.Institucion) {
			        case "IAvH":
			          return new L.Marker(latlng, {
			            icon: redIcon        
			          });
			        default:
			          return new L.Marker(latlng, {
			          	icon: blueIcon
			          });
			      }
			    },
       			filter: function(feature, layer) {
					switch (filter) {
					  case 'Evidencia':
					    return feature.properties.Evidencia === val;
					  case 'Fuente':
					    return feature.properties.Fuente === val;
					  case 'Institucion'
					  :
					  	return feature.properties.Institucion === val;
					  case '':
					    return true;
					  default:
					    return true;
					}
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

		var editableLayer;

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

	var uniqueValues = function(filterType){
		
		var lookup = {};
		var items = species_records.features;
		var result = [];
		console.log(items);
		for (var item, i = 0; item = items[i++];) {
		  var name = item.properties.Institucion;
		  console.log("Item: " + item);

		  if (!(name in lookup)) {
		    lookup[name] = 1;
		    result.push(name);
		  }
		}

		return result;

	}


	var drawObject = function (actionType){

		// Polygon handler
		if (actionType === 'Polygon'){
			var polygonDrawer = new L.Draw.Polygon(map).enable(),
				popUpForm = '<div class="commentForm">' +
				'<input id="review_type" type="hidden">'+
				'<div class="row-fluid clearfix">'+
				'<div class="labelcom clearfix">Acción</div></br>'+
				'<input type="radio" name="EditType" value="Intersect" class="radiogaga"></input><label for="Intersect">Agregar área</label></br>'+
				'<input type="radio" name="EditType" value="Add" class="radiogaga"></input><label for="Add">Sustraer área</label></br>'+
				'<input type="radio" name="EditType" value="Cut" class="radiogaga"></input><label for="Cut">Recortar del polígono</label></br>'+
				'<div class="centering"><button class="botonpopup" id="saveBtn" type="button">guardar</button>'+
				'<button class="botonpopup ml0" id="popUpCancelBtn" type="button">cancelar</button></div>'+
				'<a href="http://biomodelos.humboldt.org.co/faq#faq" target="_blank" title="Cómo utilizamos este aporte?" class="infolink" id="gotofaq"></a></div>';
		}
		else{
			var pointDrawer = new L.Draw.Marker(map, {icon: blueIcon}).enable(),
				newPointForm = '<div class="regform">' +
		           '<input id="review_type" type="hidden">'+
		           '<div class="labelcom clearfix">nuevo Registro</div></br>'+
		           '<label>Lat </label><input type="text" name="latitude" id="lat" size="7" class="smallinput"></input>'+
		           '<label> Lng </label><input type="text" name="longitude" id="lng" size="7" class="smallinput"></input></br>' +
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
		        }).setContent(popUpForm);

		    if (type === 'marker') {
    			popup.setContent(newPointForm);	
    		}
    		else {
    			//popup.setContent($('.editControls').html());
    			popup.setContent(popUpForm);
    		}

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

	var drawPolygon = function(){
		drawObject('Polygon');
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
		drawSinglePoint: drawSinglePoint,
		setLayers: setLayers,
		changeThresholdLayer:changeThresholdLayer,
		filterRecords:filterRecords,
		editRecord: editRecord
	}
}();

$(document).ready(function() {
	_BioModelosVisorModule.init();
	$("body").on("click","#editRecordBtn",function(e){
        e.preventDefault();
		_BioModelosVisorModule.editRecord();
  	});
});
