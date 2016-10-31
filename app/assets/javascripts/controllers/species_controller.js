$(document).ready(function(){

	/* 
	* Botones de cerrar las cajas del menú: Búsqueda, Info, Modelos, Contribuciones 
	*/
	$("#clsSearchBox").click(function(e){
		if ($(".vbtnfind").hasClass('vbtnact')){
      		$(".vbtnfind").removeClass('vbtnact');
   		}
	});
	$("#clsInfoBox").click(function(e){
		if ($(".vbtninfo").hasClass('vbtnact')){
      		$(".vbtninfo").removeClass('vbtnact');
   		}
	});
	$("#clsModelsBox").click(function(e){
		if ($(".vbtnhipo").hasClass('vbtnact')){
      		$(".vbtnhipo").removeClass('vbtnact');
   		}
	});
	$("#clsEditBox").click(function(e){
		if ($(".vbtnedit").hasClass('vbtnact')){
      		$(".vbtnedit").removeClass('vbtnact');
   		}
	});

	/*
	*	Funcionalidad de los botones de edición de polígonos y agregación de registros.
	*/
	function deactivateEdition(){
		if($(".polig").hasClass("polibtnact")){
			$(".polig").removeClass("polibtnact");
		}
		$(".polig").removeClass("opacitybtn");
		$(".polig").prop('disabled', false);
		$(".delpoli").removeClass("opacitybtn");
		$(".delpoli").prop('disabled', false);
		$(".editbotones").hide();
		$(".edipoli").removeClass("polibtnact");
	}
	function deactivateDeletion(){
		if($(".polig").hasClass("polibtnact")){
			$(".polig").removeClass("polibtnact");
		}
		$(".polig").removeClass("opacitybtn");
		$(".polig").prop('disabled', false);
		$(".edipoli").removeClass("opacitybtn");
		$(".edipoli").prop('disabled', false);
		$(".delbotones").hide();
		$(".delpoli").removeClass("polibtnact");
	}

	$(".polig").click(function(e){
		if($(this).hasClass("polibtnact")){
			_BioModelosVisorModule.deactivateDraw();
			$(this).removeClass("polibtnact");
		}
		else{
			if($("#newModel_field").val() == 'true'){
				_BioModelosVisorModule.drawPolygon(true);
			}
			else{
				_BioModelosVisorModule.drawPolygon(false);
			}
			$(this).addClass("polibtnact");
		}
		e.preventDefault();
	});
	$(".edipoli").click(function(e){
		_BioModelosVisorModule.deactivateDraw();
		_BioModelosVisorModule.editPolygon();
		$(".polig").addClass("opacitybtn");
		$(".polig").prop('disabled', true);
		$(".delpoli").addClass("opacitybtn");
		$(".delpoli").prop('disabled', true);
		if(!$(".editbotones").is(":visible")){
			$(".editbotones").show();
			$(this).addClass("polibtnact");
		}
		e.preventDefault();
	});
	$(".delpoli").click(function(e){
		_BioModelosVisorModule.deactivateDraw();
		_BioModelosVisorModule.deletePolygon();
		$(".polig").addClass("opacitybtn");
		$(".polig").prop('disabled', true);
		$(".edipoli").addClass("opacitybtn");
		$(".edipoli").prop('disabled', true);
		if(!$(".delbotones").is(":visible")){
			$(".delbotones").show();
			$(this).addClass("polibtnact");
		}
		e.preventDefault();
	});

	function resetPolygonButtons(){
		// Botón para volver los botones de edición a su estado normal.
		deactivateEdition();
		deactivateDeletion();			
	} 

	$(".saveedit").click(function(e){
		_BioModelosVisorModule.saveEditPolygon();
		deactivateEdition();
		e.preventDefault();
	});
	$(".canceledit").click(function(e){
		_BioModelosVisorModule.cancelEditPolygon();
		deactivateEdition();
		e.preventDefault();
	});
	$(".savedel").click(function(e){
		_BioModelosVisorModule.saveDeletePolygon();
		deactivateDeletion();
		e.preventDefault();
	});
	$(".canceldel").click(function(e){
		_BioModelosVisorModule.cancelDeletePolygon();
		deactivateDeletion();
		e.preventDefault();
	});
	$("#btnAddSingleRecord").click(function(e){
		_BioModelosVisorModule.deactivateDraw();
		_BioModelosVisorModule.drawSinglePoint();
		if(!$(this).hasClass("btngenact"))
			$(this).addClass("btngenact");
		e.preventDefault();
	});

	$("body").on("click", "#popUpCancelBtn", function(e){
  		e.preventDefault();
		_BioModelosVisorModule.cancelAddPoint();
		$("#btnAddSingleRecord").toggleClass("btngenact");
	});

	$("body").on("click", "#puNewPolygonCancelBtn", function(e){
  		e.preventDefault();
		_BioModelosVisorModule.cancelDrawnLayer();
		if($(this).hasClass("polibtnact"))
			$(this).removeClass("polibtnact");
	});

	$("#btnPauseEdition").click(function(e){
		e.preventDefault();
		$.ajax({
		    type: 'POST',
		    url: "/users_layers/pause_layer",
		    data: {
		    	id: $("#layer_id_field").val(),
		    	species_id: $("#species_id_field").val(),
		    	threshold: angular.element($("#visCntrl")).scope().corteSlider.value,
		    	geoJSON: _BioModelosVisorModule.getGeojsonLayer($("#newModel_field").val()),
		    	newModel: $("#newModel_field").val()
		    }
		});
	});

	$("#btnEnvEdition").click(function(e){
		e.preventDefault();
		alertify.confirm('¿Desea enviar esta como su versión final?', function(e){ 
			if(e){
				$.ajax({
		    		type: 'POST',
		    		url: "/users_layers/send_layer",
		    		data: {
		    			id: $("#layer_id_field").val(),
		    			species_id: $("#species_id_field").val(),
		    			threshold: angular.element($("#visCntrl")).scope().corteSlider.value,
		    			geoJSON: _BioModelosVisorModule.getGeojsonLayer($("#newModel_field").val()),
		    			newModel: $("#newModel_field").val()
		    		}	
				});
			}
		});
	});

	/* 
	 * Funcionalidad para seleccionar los valores de los filtros de manera dinámica.
	 */
	$("#filtroRegistro").change(function(){
		 _CustomSelectModule.selectValues("#resultadoFiltro", _BioModelosVisorModule.uniqueValues($('#filtroRegistro option:selected').text()));
	});


	/* Boton de filtrar registros */
	$("#filtrarBtn").click(function(e){
		var selectFilters = [],
			yearFilters = [],
			monthFilters = [];

		// Almacena el tipo de filtro y el valor
		selectFilters[0] = $("#filtroRegistro option:selected").text();
		selectFilters[1] = $("#resultadoFiltro option:selected").text();
  		// Guarda el rango de los años en un arreglo
  		yearFilters[0] = $("#sliYearMin").val();
  		yearFilters[1] = $("#sliYearMax").val();
  		if(yearFilters[0] === 'Hoy')
  			yearFilters[0] = moment().format("YYYY");
  		if(yearFilters[1] === 'Hoy')
  			yearFilters[1] = moment().format("YYYY");
  		// Guarda los meses seleccionados en un arreglo
  		$('input[type="checkbox"].meschk').each(function () {
  			if(this.checked)
  				monthFilters.push($(this).attr('name'));
  		});

  		var visFilters = [];
  		$('input[type="checkbox"].checkregistros').each(function () {
  			if(this.checked)
  				visFilters.push($(this).attr('name'));
  			else
  				visFilters.push("");
  		});
		_BioModelosVisorModule.filterRecords(selectFilters, visFilters, yearFilters, monthFilters);
	})

	/* Botón Limpiar filtros
		1. Reset DOM (año, mes, select, filtros)
	*/
	$("#limpiarBtn").click(function(e){
		var uri = "192.168.11.81:3000/BioModelos/records/" + $("#species_id_field").val();
		//Reset slider Año
		angular.element($("#visCntrl")).scope().resetSlider();
		//Reset meses
		$('input:checkbox.meschk').removeAttr('checked');
		//Reset filters
		$(".select-options li:contains('Tipo de filtro')").click();
		//Reset visualizar filters
		$('#chkBoxFilters input:checkbox').removeAttr('checked');
		//Reset data
		_BioModelosVisorModule.getSpeciesRecords(uri);
	});


	/* Botón para activar menú de edición */
	$("#visCntrl").on("click", "#cbt_editBtn", function(e){
		e.preventDefault(); 
		//Cierra menú edición
		$("#clsEditBox").click();
		//Carga umbrales, limpia la capa de edición y carga capa pausada si existe
		_BioModelosVisorModule.unloadThresholdLayer();
		_BioModelosVisorModule.loadThresholdLayer();
		_BioModelosVisorModule.unloadEditionLayer(); 
		_BioModelosVisorModule.loadEditionLayer();
		$.ajax({
		    type: 'POST',
		    url: "/users_layers/load_layer",
		    data: {
		    	species_id: $("#species_id_field").val() 
		    }
		});
		//Visibiliza y muestra el menú de edición
		resetPolygonButtons();
		$(".btnedicion").show();
		$(".btnedicion").click();
		//Set newModel value
		$("#newModel_field").val(false);
	});
	
	/* Botón crea tu mapa */
	$("#visCntrl").on("click", "#cbt_crearBtn", function(e){
		e.preventDefault(); 
		//Cierra menú edición
		$("#clsEditBox").click();
		//Limpia la capa de edición y carga capa pausada si existe 
		_BioModelosVisorModule.unloadEditionLayer(); 
		_BioModelosVisorModule.loadEditionLayer();
		_BioModelosVisorModule.unloadThresholdLayer();
		$.ajax({
		    type: 'POST',
		    url: "/users_layers/load_layer",
		    data: {
		    	species_id: $("#species_id_field").val(),
		    	new_map: true
		    }
		});
		//Oculta el slider de umbrales
		$("#regMenu_slider").hide();
		//Visibiliza y muestra el menú de edición
		resetPolygonButtons();
		if(!$(".btnedicion").is(":visible")){
			$(".btnedicion").show();
			$(".btnedicion").click();
		}
		//Set newModel value
		$("#newModel_field").val(true);
	});

	$(".vbtnedit").click(function(e){
		/* TODO clean layers */
		$("#regMenu_slider").show();
		$(".btnedicion").hide();
		if($(".cajitaeditar").is(":visible")){
			$(".btnedicion").click();
		}
		$.ajax({
		    type: 'POST',
		    url: "/models/get_thresholds",
		    data: {
		    	species_id: $("#species_id_field").val(),
		    }
		});
	});

	$(".vbtnhipo").click(function(e){
		/* TODO clean layers */
		$.ajax({
		    type: 'POST',
		    url: "/models/get_models",
		    data: {
		    	species_id: $("#species_id_field").val(),
		    }
		});
	});

	$(".vbtninfo").click(function(e){
		/* TODO clean layers */
		$.ajax({
		    type: 'POST',
		    url: "/species/species_info",
		    data: {
		    	species_id: $("#species_id_field").val(),
		    }
		});
	});

	$("#visCntrl").on("click",".sp_model_link",function(e){
        e.preventDefault();
        $("#clsModelsBox").click();
        $(".btnedicion").hide();
		if($(".cajitaeditar").is(":visible")){
			$(".btnedicion").click();
		}
        _BioModelosVisorModule.unloadModel();
        _BioModelosVisorModule.unloadEditionLayer();
        _BioModelosVisorModule.unloadThresholdLayer();
		_BioModelosVisorModule.loadModel($(this).find('#imgsrc_model').val(), $('.titlethumb').val());

	});

	/* Botón enviar edición de registro */
	$("body").on("click","#sendRecordEdition",function(e){
        e.preventDefault();
		$.ajax({
		    type: 'POST', 
		    url: "/species/update_record"
		});
	});

	/* Botón enviar nuevo registro */
	$("body").on("click","#r_saveBtn",function(e){
        e.preventDefault();
		$.ajax({
		    type: 'POST', 
		    url: "/species/new_record"
		});
	});

	/* Save or updates ecological variables */
	$("body").on("change", "#eco_var_accordion input[type=checkbox]", function () {
	    var box_id = $(this).attr('name'),
	        eco_var_val = false;

	    if ($(this).prop("checked"))
	        eco_var_val = true;

      	$.ajax({
          type: "POST",
          url: "/eco_variables/add_ecological_variable",
          data: { species_id: $("#species_id_field").val(), eco_variable_id: box_id, selected: eco_var_val },
          error: function( jqXHR, textStatus, error ) {
            isError = true;
            alertify.alert( "Ha ocurrido un error al guardar la variable ecológica" );
          } 	
     });
  });

	
});


