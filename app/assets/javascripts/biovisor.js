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
    newRecordMarker,
		currentPopup,
		pointDrawer,
		polygonDrawer,
		modelLayer;

	var redIcon = new L.Icon({
    iconUrl: '/assets/redmarker.png',
    shadowUrl: "/assets/marker-shadow.png",
    iconSize:    [25, 25],
    iconAnchor:  [12, 25],
    popupAnchor: [1, -25],
    tooltipAnchor: [16, -28],
    shadowAnchor: [7, 25],
    shadowSize:  [25, 25]
  });
  var blueIcon = new L.Icon({
    iconUrl: '/assets/regperfil.png',
    shadowUrl: "/assets/marker-shadow.png",
    iconSize:    [25, 25],
    iconAnchor:  [12, 25],
    popupAnchor: [1, -25],
    tooltipAnchor: [16, -28],
    shadowAnchor: [7, 25],
    shadowSize:  [25, 25]
  })
  var greenIcon = new L.Icon({
    iconUrl: '/assets/cyanmarker.png',
    shadowUrl: "/assets/marker-shadow.png",
    iconSize:    [25, 25],
    iconAnchor:  [12, 25],
    popupAnchor: [1, -25],
    tooltipAnchor: [16, -28],
    shadowAnchor: [7, 25],
    shadowSize:  [25, 25]
  });

    var headers = {
    					"acceptedNameUsage":"Nombre aceptado",
						"speciesOriginal":"Especie original",
						"source":"Fuente",
						"suggestedStateProvince":"Departamento",
						"suggestedCounty":"Municipio",
						"verbatimLocality":"Localidad",
						"minimumElevationInMeters":"Altitud",
						"institutionCode":"Institución",
						"catalogNumber":"Número de catálogo",
						"basisOfRecord":"Evidencia",
						"recordedBy":"Recolector",
						"collectionCode":"Colección",
						"year":"Año",
						"month":"Mes",
						"day":"Día",
						"url":"Url"
					};

	var hiddenFields = ["stateProvince", "county", "taxID", "species", "reported", "updated", "environmentalOutlier"];

	var init = function(){
		var latlng = new L.LatLng(4, -72),
      zoom = 6,
      mZoom = 2,
      mxZoom = 16;

    /* Elevation API object */
    var elevator = new google.maps.ElevationService;

    /* Base Layers */
    var googleTerrain = new L.Google('TERRAIN', {minZoom:mZoom, maxZoom: mxZoom});
    var googleSatellite = new L.Google('SATELLITE', {minZoom:mZoom, maxZoom: mxZoom});
    var osmBase = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        minZoom: mZoom,
        maxZoom: mxZoom,
        attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> Contributors'
      });

    /* Overlays */
    var paramos_fondo_2016 = new L.tileLayer.wms('http://geoservicios.humboldt.org.co/geoserver/Proyecto_fondo_adaptacion/wms', {
      format: 'image/png',
      transparent: true,
      layers: 'Proyecto_fondo_adaptacion:Limites24Paramos_25K_2016'
    });
    var ecosistemas_etter = L.tileLayer.wms('http://geoservicios.humboldt.org.co/geoserver/Historicos/wms', {
      format: 'image/png',
      transparent: true,
      layers: 'Historicos:ecosistemas_generales_etter'
    });
    var bosque_seco = L.tileLayer.wms('http://geoservicios.humboldt.org.co/geoserver/Historicos/wms', {
      format: 'image/png',
      transparent: true,
      layers: 'Historicos:bosque_seco_tropical'
    });
    var zon_hidrografica = L.tileLayer.wms('http://geoapps.ideam.gov.co/geoserver/unidades_analisis/wfs', {
      format: 'image/png',
      transparent: true,
      layers: 'unidades_analisis:GDBIDEAM.ZONIFICACION_HIDROGRAFICA_2013'
    });

    var	baseLayers = {
      "Google Terrain": googleTerrain,
      "Google Satellite": googleSatellite,
      "OpenStreetMap": osmBase
    };

    var overlays = {
      "Páramos (2016)": paramos_fondo_2016,
      "Ecosistemas generales (Etter)" : ecosistemas_etter,
      "Bosque seco tropical" : bosque_seco,
      "Zonificación Hidrográfica 2013 (IDEAM)" : zon_hidrografica
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
    pointDrawer = new L.Draw.Marker(map, { icon: greenIcon });

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

	/**
 	* Gets the GeoJSON records of a species using AJAX. .
	* @param {integer} species_id - ID of the species.
	* @param {boolean} isEditable - True if the user can edit this species information.
	*/
	var getSpeciesRecords = function(species_id, isEditable){
		if(map.hasLayer(cluster)) {
			clearLayer(cluster);
       		layerControl.removeLayer(cluster);
       	}
       	var url;
       	if(!isEditable)
       		url = "/species/" + species_id + "/get_species_records";
       	else
       		url = "/species/" + species_id + "/get_species_records?inGroup=true";

		$.getJSON(url,function(data){
			species_records = data;
		    filterRecords(["",""], ["","","visualadd"], [], [], isEditable);
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

	/**
 	* Filters out the species records based on year, month, fields and visualization parameters.
	* @param {array} selectFilters - Array with 2 string values cointaining the name of the filter ("Evidencia", "Fuente" and "Institución") and the value.
	* @param {array} visFilters - Array with 3 string values of the visualization options ('visualrep', 'visualedit', 'visualadd' or '').
	* @param {array} yearFilters - Array with 2 values: Minimum year and Maximum year.
	* @param {array} monthFilters - Array with a maximum of 12 numeric values (1 to 12) for each month of the year.
	* @param {boolean} isEditable - True if the user can edit this species information.
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
					filtered = filtered || feature.properties.environmentalOutlier === true;
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
				var yearFilter = true,
					monthFilter = true,
					dataFilter = true;

				if (yearFilters != "") {
					var yearValue = feature.properties.year;
					if (yearValue == null) {
						yearValue = 0;
					}
					if (yearValue < yearFilters[0] || feature.properties.year > yearFilters[1]) {
						yearFilter = false;
					}
				}
				if (monthFilters != "") {
					monthFilter = includesValue(feature.properties.month, monthFilters);
				}
				switch (selectFilters[0]) {
					case 'Evidencia':
						dataFilter = feature.properties.basisOfRecord === selectFilters[1];
						break;
					case 'Fuente':
						dataFilter = feature.properties.source === selectFilters[1];
						break;
					case 'Institución':
						dataFilter = feature.properties.institutionCode === selectFilters[1];
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
				layer.on('click',function(e) {
					$.ajax({
							type: 'POST',
							url: "/records/show",
							data: {
								id: layer.feature.properties._id
							},
					});
				});
				layer.bindPopup();
			}
		});
		cluster.addLayer(recordsLayer);
		map.on('popupopen', function(e) {
		    currentPopup = e.popup;
		});
	}

	var closePopUp = function() {
		if (currentPopup)
			map.closePopup(currentPopup);
	}

	/*
	* Function that gets the unique values from the selected filter
	*/
	var uniqueValues = function(filterName){
		var result = [];

        if(['Evidencia', 'Fuente', 'Institución', '- Tipo de filtro -'].includes(filterName)) {
            result.push('- Categoria -');
        } else if(['Evidence', 'Source', 'Institution', '- Filter type -'].includes(filterName)) {
            result.push('- Category -');
        } else {
            result.push('- Categoria -');
        }

		if(species_records){
			var lookup = {},
				items = species_records.features,
				name;

			for (var item, i = 0; item = items[i++];) {
			  switch(filterName){
                case "Evidence":
                case "Evidencia":
			  		name = item.properties.basisOfRecord;
			  		break;
			  	case "Fuente":
                case "Source":
			  		name = item.properties["source"];
			  		break;
			  	case "Institución":
                case "Institution":
			  		name = item.properties.institutionCode;
			  		break;
			  	default:
			  		break;
			  }

			  if (name && !(name in lookup)) {
			    lookup[name] = 1;
			    result.push(name);
			  }
			}
		}
		return result;
	}

	/*
   *  Function that lets draw a Feature (Markers or Polygons) and add an editable popup to them.
   *  actionType = String with the name of the feature. "Polygon" or "Marker".
   *  newMap = Boolean. True if the user is creating a new map and not working over a existing one.
   */
  var drawObject = function (actionType, newModel) {
    if (actionType === 'Polygon') {
      polygonDrawer = new L.Draw.Polygon(map);
      polygonDrawer.enable();
      popUpForm = `
        <div class="commentForm">
          <input id="review_type" type="hidden">
          <div class="row-fluid clearfix">
          <div class="labelcom clearfix">Acción</div>
          </br>
          <input type="radio" name="EditType" value="Recortar del polígono" class="radiogaga"></input><label for="Cut">Recortar del polígono</label>
          </br>
          <input type="radio" name="EditType" value="Agregar área" class="radiogaga"></input><label for="Intersect">Agregar área</label>
          </br>
          <input type="radio" name="EditType" value="Sustraer área" class="radiogaga"></input><label for="Add">Eliminar área</label>
          </br>
          <input type="radio" name="EditType" value="Otra" class="radiogaga"></input><label for="Other">Otra</label>
          </br>
          <textarea rows="4" cols="32" placeholder="Defina otra acción" class="areaother" id="msgPolygon" maxlength="300"></textarea>
          </br>
          <div class="centering">
            <button class="botonpopup" id="savePolBtn" type="button">aceptar</button>
            <button class="botonpopup ml0" id="puNewPolygonCancelBtn" type="button">cancelar</button>
          </div>
        </div>
      `;
    } else {
      newRecordsLayer.clearLayers();
      pointDrawer.enable();
    }

    map.on('draw:created', function (e) {
      var type = e.layerType,
        layer = e.layer,
        popup = new L.Popup({
          keepInView: true,
            closeButton: false,
            maxWidth: 350,
            maxHeight: 450
        });

      if (type === 'marker') {
        var pLatLng = layer.getLatLng();
        layer.addTo(newRecordsLayer);
        $.ajax({
          type: 'POST',
          url: "/records/new_form",
          data: {
            lat: L.NumberFormatter.round(pLatLng.lat, 2, "."),
            lon: L.NumberFormatter.round(pLatLng.lng, 2, "."),
            spName: $(".spname").html(),
            user: $("#user_id_field").val(),
            tax: $("#species_id_field").val()
          }
        });
        newRecordMarker = layer;
        newRecordMarker.on('click', function(e) {
          if ($('#regboxclose').length) {
            $('#regboxclose').trigger('click')
          }
        })
      } else {
        if (newModel) {
          if (currentPopup)
            map.closePopup(currentPopup);
        }
        layer.addTo(editableLayer);
        if(!newModel) {
          popup.setContent(popUpForm);
          layer.bindPopup(popup);
          layer.openPopup();
          currentPopupID = layer._popup._leaflet_id;
        }
        $(".polig").removeClass("polibtnact");
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
				'<input type="hidden" name="msginput" value="'+ $("#msgPolygon").val() +'" /></div>';

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
			var messageProp = $(popUpContent).find("input[name='msginput']").val();
			var response;

			if (messageProp != "" && messageProp){
				response = {
					action: valueProp,
					message: messageProp
				};
			}
			else{
				response = {
					action: valueProp
				};
			}


			return response;
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
    newRecordsLayer.removeLayer(newRecordMarker);
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

  /**
   * Set and return the layer in leaflet to use base on the options created by the models helper
   *
   * @param {Object} modelOptions options for the model
   */
	var processModel = function(modelOptions) {;
  var imageBounds = [[13,-60],[-14, -83]];
		var layer;
		if (modelOptions.type === 'file') {
      if (modelOptions.extentSize === 'large') {
        imageBounds = [[17,-60],[-14, -86]];
      }
			layer = new L.ImageOverlay(modelOptions.fileName, imageBounds, { opacity: 0.6 });
		} else {
			// TODO: This won't be tested in continuous or thresholded models until thresholds are implemented in geoserver
			layer = L.tileLayer.wms(modelOptions.wmsUrl, {
				layers: modelOptions.layer,
				styles: modelOptions.styles,
				transparent: true,
				format:'image/png'
			})
			layer.setOpacity(0.6)
		}
		return layer;
	}

	var setLayers = function(imgThresholdC, imgThreshold0, imgThreshold10, imgThreshold20, imgThreshold30) {
		thresholdC = processModel(JSON.parse(imgThresholdC));
		threshold0 = processModel(JSON.parse(imgThreshold0));
		threshold10 = processModel(JSON.parse(imgThreshold10));
		threshold20 = processModel(JSON.parse(imgThreshold20));
		threshold30 = processModel(JSON.parse(imgThreshold30));
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

  var loadModel = function (jsonOptions) {
    /* Dispose older model if it exists */
    unloadModel();

    const modelInfo = JSON.parse(jsonOptions);

    if(modelInfo.id !== $("#valid_model_info").text()) {
      $(".vbtninfo").hide();
      $(".vbtnhipo").removeClass('btn2Top').addClass('btn1Top');
      $(".vbtnedit").removeClass('btn3Top').addClass('btn2Top');
    } else {
      $(".vbtninfo").show();
      $(".vbtnhipo").removeClass('btn1Top').addClass('btn2Top');
      $(".vbtnedit").removeClass('btn2Top').addClass('btn3Top');
    }

    modelLayer = processModel(modelInfo);
    map.addLayer(modelLayer, true);
    layerControl.addOverlay(modelLayer, "Modelo");
  };

	var unloadModel = function() {
		if(map.hasLayer(modelLayer)) {
       		map.removeLayer(modelLayer);
       		layerControl.removeLayer(modelLayer);
       }
	}

	var loadUserLayer = function (userLayer) {
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

   var unloadAllLayers = function(){
   		unloadModel();
        unloadEditionLayer();
        unloadThresholdLayer();
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
		unloadModel: unloadModel,
		unloadAllLayers: unloadAllLayers,
		closePopUp: closePopUp
	}
}();

$(document).ready(function() {
  _BioModelosVisorModule.init();
  $("body").on("click","#savePolBtn",function(e){
    e.preventDefault();
    _BioModelosVisorModule.addActionToPolygon(e);
  });
});
