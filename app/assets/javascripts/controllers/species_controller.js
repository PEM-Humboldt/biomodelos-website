var _speciesFunctionsModule = function() {
	/**
 	* Reset the filter controls (año, mes, select, filtros) to the
 	* default values.
	*/
	function resetRecordsFilters(){
		//Reset slider Año
		angular.element($("#visCntrl")).scope().resetSlider();
		//Reset meses
		$('input:checkbox.meschk').removeAttr('checked');
		//Reset filters
		$(".select-options li:contains('Tipo de filtro')").click();
		//Reset visualizar filters
		$('#chkBoxFilters input:checkbox').removeAttr('checked');
		//Activate the default checkbox
		$('#chkBoxFilters input:checkbox[name="visualadd"]').prop('checked', true);
	}
	return { resetRecordsFilters: resetRecordsFilters };
}();

$(document).ready(function() {
	// Report - cancel report - send report button
  $("body").on("click", ".unapproved", function( event ) {
    $(".reportar").toggle("slow");
  });
  $("body").on("click", "#cancel-point-cmt", function( event ) {
    $(".reportar").toggle("slow");
	});
	$("body").on("click", "#send-report", function( event ) {
		event.preventDefault();
		$.post("/records/send_report_record", $("#report-form").serializeArray());
		$(".reportar").toggle("slow");
	});

	// Actions for show more - show less button on _show for record information
  $("body").on("click", "#Showreg", function( event ) {
    $("#Reghidden").toggle("slow");
    if ($("#Showreg").hasClass("rotate")){
      $("#Showreg").removeClass("rotate");
      $(".vermas").removeClass("vermenos");
    } else {
      $("#Showreg").addClass("rotate");
      $(".vermas").addClass("vermenos");
    }
	});

	/*
	* Advanced search filters
	*/

	function add_species_filters(){
		var bmclasses = [];
		var categories = [];
		$('.sppbtn input[type="checkbox"]').each(function () {
                    if (this.checked && this.value == 1)
                      bmclasses.push('mamiferos');
                    if (this.checked && this.value == 2)
                      bmclasses.push('aves');
                    if (this.checked && this.value == 3)
                      bmclasses.push('reptiles');
                    if (this.checked && this.value == 4)
                      bmclasses.push('anfibios');
                    if (this.checked && this.value == 5)
                      bmclasses.push('peces');
                    if (this.checked && this.value == 6)
                      bmclasses.push('invertebrados');
                    if (this.checked && this.value == 7)
                      bmclasses.push('plantas');
        });

		$('.typebtn input[type="checkbox"]').each(function () {
                    if (this.checked && this.value == 1)
                      categories.push('Endemic');
                    if (this.checked && this.value == 2)
                      categories.push('Invasive');
                    if (this.checked && this.value == 3)
                      categories.push('Endangered');
                  	if (this.checked && this.value == 4)
                      categories.push('Valid');
         });
		var bio_locale = $("#locale_field").val();
		$.post( "/" + bio_locale + "/species/filter", {bmclasses: bmclasses, categories: categories});
	}

	$(".cajasearch").on("click"," .sppbtn input[type='checkbox']", add_species_filters);
	$(".cajasearch").on("click"," .typebtn input[type='checkbox']", add_species_filters);

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

	$("#edit_tools_box").on("click",".polig",function(e){
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
	$("#edit_tools_box").on("click",".edipoli",function(e){
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
	$("#edit_tools_box").on("click",".delpoli",function(e){
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

	$("#edit_tools_box").on("click",".saveedit",function(e){
		_BioModelosVisorModule.saveEditPolygon();
		deactivateEdition();
		e.preventDefault();
	});
	$("#edit_tools_box").on("click",".canceledit",function(e){
		_BioModelosVisorModule.cancelEditPolygon();
		deactivateEdition();
		e.preventDefault();
	});
	$("#edit_tools_box").on("click",".savedel",function(e){
		_BioModelosVisorModule.saveDeletePolygon();
		deactivateDeletion();
		e.preventDefault();
	});
	$("#edit_tools_box").on("click",".canceldel",function(e){
		_BioModelosVisorModule.cancelDeletePolygon();
		deactivateDeletion();
		e.preventDefault();
	});
	$("#add_records_box").on("click","#btnAddSingleRecord",function(e){
		_BioModelosVisorModule.deactivateDraw();
		_BioModelosVisorModule.drawSinglePoint();
		if(!$(this).hasClass("btngenact"))
			$(this).addClass("btngenact");
		e.preventDefault();
	});

	$("body").on("click", "#puNewPolygonCancelBtn", function(e){
  		e.preventDefault();
		_BioModelosVisorModule.cancelDrawnLayer();
		if($(this).hasClass("polibtnact"))
			$(this).removeClass("polibtnact");
	});

	$("#edit_tools_box").on("click","#btnPauseEdition",function(e){
		e.preventDefault();
		$.post("/users_layers/pause_layer", {
				id: $("#layer_id_field").val(),
		    	species_id: $("#species_id_field").val(),
		    	threshold: angular.element($("#visCntrl")).scope().corteSlider.value,
		    	geoJSON: _BioModelosVisorModule.getGeojsonLayer($("#newModel_field").val()),
		    	newModel: $("#newModel_field").val()
		});
	});

	$("#edit_tools_box").on("click","#btnEnvEdition",function(e){
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
		    		},
		    		success: function(){
				    	/* TODO CANCELAR EDICION */
						alertify.alert("El registro ha sido agregado con éxito");
					},
					error: function(jqXHR, textStatus, errorThrown){
						alertify.alert("Ha ocurrido un error al enviar las ediciones: " + textStatus);
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


	/**
 	* Records filter action
	* On click action that initializes arrays with the actual values of each type of filter
	* (Año, Mes, Buscar por, Visualizar) and passes them to a function.
	*/
	$("#filtrarBtn").click(function(e){
		var findByFilters = [],
			yearFilters = [],
			monthFilters = [],
			visualizeFilters = [],
			yearNotApplicableValue = 0,
			yearTodayValue = moment().format("YYYY");

		findByFilters[0] = $("#filtroRegistro option:selected").text();
		findByFilters[1] = $("#resultadoFiltro option:selected").text();

  		yearFilters[0] = $("#sliYearMin").val();
  		yearFilters[1] = $("#sliYearMax").val();

  		//Set default values to non-numeric options of the Year slider.
  		if(yearFilters[0] === 'Hoy')
  			yearFilters[0] = yearTodayValue;
  		else if (yearFilters[0] === 'NA')
  			yearFilters[0] = yearNotApplicableValue;
  		if(yearFilters[1] === 'Hoy')
  			yearFilters[1] = yearTodayValue;
  		else if (yearFilters[1] === 'NA')
  			yearFilters[1] = yearNotApplicableValue;

  		//Goes through every month checkbox and stores the attribute name of the checked ones.
  		$('input[type="checkbox"].meschk').each(function () {
  			if(this.checked)
  				monthFilters.push($(this).attr('name'));
  		});
  		/*Goes through every visualize checkbox and stores the attribute name of the checked ones.
  		* If the option is not checked, it stores an empty string */
  		$('input[type="checkbox"].checkregistros').each(function () {
  			if(this.checked)
  				visualizeFilters.push($(this).attr('name'));
  			else
  				visualizeFilters.push("");
  		});
  		$.post( "/records/edit_record", { species_id: $("#species_id_field").val()}).done(function(data) {
    		_BioModelosVisorModule.filterRecords(findByFilters, visualizeFilters, yearFilters, monthFilters, data);
  		});
	});

	/* Botón Limpiar filtros
	*
	*/
	$("#limpiarBtn").click(function(e){
		_speciesFunctionsModule.resetRecordsFilters();
		//Reset data
		$.post( "/records/edit_record", { species_id: $("#species_id_field").val()}).done(function(data) {
    		_BioModelosVisorModule.getSpeciesRecords($("#species_id_field").val(), data);
  		});
	});


	/**
 	* Shows the edition menu for editing an existing model or creating a new one.
 	*
	* @param {Boolean} event.data.IsNewMap - True if it's activating the create a new map edition
	* menu or False if it's the model edition menu.
	*/
	function _activateEditionMenu(event){
		//Cierra menú edición
		$("#clsEditBox").click();
		//Carga umbrales si es edición de mapa y carga capa pausada si existe
		if(event.data.isNewMap){
			//Oculta el slider de umbrales
			$("#regMenu_slider").hide();
		}
		else{
			_BioModelosVisorModule.loadThresholdLayer();
		}
		_BioModelosVisorModule.loadEditionLayer();
		$.ajax({
		    type: 'POST',
		    url: "/users_layers/load_layer",
		    data: {
		    	species_id: $("#species_id_field").val(),
		    	new_map: event.data.isNewMap
		    }
		});
		//Visibiliza y muestra el menú de edición
		resetPolygonButtons();
		if($(".cajaregistros").is(":visible")){
			$(".btnregistros").click();
		}
		$(".btnedicion").show();
		$(".btnedicion").click();
		//Set newModel value
		$("#newModel_field").val(event.data.isNewMap);
	}

	/* Edition Menu button */
	$("#visCntrl").on("click", "#cbt_editBtn", { isNewMap: false }, _activateEditionMenu);

	/* Create your map button */
	$("#visCntrl").on("click", "#cbt_crearBtn", { isNewMap: true }, _activateEditionMenu);

	$("#visCntrl").on("click",".vbtnedit", function(e){
		if ($(".cajasearch").is(":visible")) $("#clsSearchBox").click();
		if ($(".hipotesis").is(":visible")) $("#clsModelsBox").click();
		if ($(".infocaja").is(":visible")) $("#clsInfoBox").click();
		/* TODO clean layers */
		$("#regMenu_slider").show();
		$(".modelname").html("");
		if($(".modelname").hasClass("gradient"))
          $(".modelname").removeClass("gradient");
		$(".btnedicion").hide();
		if($(".cajitaeditar").is(":visible")){
			$(".btnedicion").click();
		}
		$.ajax({
		    type: 'POST',
		    url: "/" + $("#locale_field").val() + "/models/get_thresholds",
		    data: {
		    	species_id: $("#species_id_field").val(),
		    }
		});
	});

	$(".vbtnfind").click(function(e){
		if ($(".editbox").is(":visible")) $("#clsEditBox").click();
		if ($(".hipotesis").is(":visible")) $("#clsModelsBox").click();
		if ($(".infocaja").is(":visible")) $("#clsInfoBox").click();
		if ($(".vbtnfind").hasClass('vbtnact')) add_species_filters();
	});

	$(".vbtnhipo").click(function(e){
		if ($(".cajasearch").is(":visible")) $("#clsSearchBox").click();
		if ($(".editbox").is(":visible")) $("#clsEditBox").click();
		if ($(".infocaja").is(":visible")) $("#clsInfoBox").click();
		/* TODO clean layers */
		$(".modelname").html("");
		if($(".modelname").hasClass("gradient"))
          $(".modelname").removeClass("gradient");
		$(".btnedicion").hide();
		if($(".cajitaeditar").is(":visible")){
			$(".btnedicion").click();
		}
		$.ajax({
		    type: 'POST',
		    url: "/" + $("#locale_field").val() + "/models/get_hypotheses",
		    data: {
		    	species_id: $("#species_id_field").val(),
		    }
		});
	});

	$(".vbtninfo").click(function(e){
		if ($(".cajasearch").is(":visible")) $("#clsSearchBox").click();
		if ($(".editbox").is(":visible")) $("#clsEditBox").click();
		if ($(".hipotesis").is(":visible")) $("#clsModelsBox").click();
		/* TODO clean layers */
		$.ajax({
		    type: 'POST',
		    url: "/" + $("#locale_field").val() + "/species/species_info",
		    data: {
		    	species_id: $("#species_id_field").val(),
		    }
		});
	});

	function map_status_name(status){
		var mapped_status ="";
		switch (status) {
	  		case 'pendingValidation':
	    		mapped_status = 'Validación pendiente';
	    		break;
	  		case 'Valid':
	    		mapped_status = 'Validado';
	    		break;
	  		case 'Developing':
	    		mapped_status = 'En desarrollo';
	    		break;
	  		default:
	    		mapped_status = status;
	    		break;
		}
		return mapped_status;
	}

	$("#visCntrl").on("click",".sp_model_link",function(e) {
		e.preventDefault();
		$("#clsModelsBox").click();
		$(".btnedicion").hide();
		if($(".cajitaeditar").is(":visible")) {
			$(".btnedicion").click();
		}
		$(".modelname").html(map_status_name($("#txt_model_status").val()));
    _BioModelosVisorModule.unloadAllLayers();
		_BioModelosVisorModule.loadModel($(this).find('#model_layer').val());
	});

	// Reload species records
	function _refreshSpeciesRecords() {
		$.post( "/records/edit_record", { species_id: $("#species_id_field").val()}).done(function(data) {
			_BioModelosVisorModule.getSpeciesRecords($("#species_id_field").val(), data);
		});
	}

	// Action for Edit - Save - Cancel buttons on _show for record information / edition
	$("body").on("click", "#editregbtn", function(){
    $(".contented").attr("contenteditable","true").addClass("redtext");
		$("#editregbtn").replaceWith('<button id="saveregbtn" class="botonpopup2">guardar</button>');
		$("#cancelEditBtn").html('<button id="cancelregbtn" class="botonpopup2">cancelar</button>');
	});
	$("body").on("click", "#cancelregbtn", function() {
		$.post( "/records/show", { id: $("span#record_id").text()}).done();
	});

  $("body").on("click", "#saveregbtn", function() {
  	validate.validators.presence.message = "no puede estar vacío";

		const latRecordEdition = $("#txtLatEdit");
		const lonRecordEdition = $("#txtLonEdit");
		const speRecordEdition = $("#txtSpeciesEdit");
		const locRecordEdition = $("#txtLocEdit");

		const varsToValidate = {},
		constraints = {},
		data = {
			userIdBm: $("#user_id_field").val(),
			recordId: $("#record_id").text(),
		};

		if (latRecordEdition.text() != latRecordEdition.attr('oldVal')){
			varsToValidate.lat = latRecordEdition.text();
			constraints.lat = {};
			constraints.lat.presence = true;
			constraints.lat.numericality = {
				greaterThanOrEqualTo: -90,
				lessThanOrEqualTo: 90,
			};
			data.decimalLatitude = latRecordEdition.text();
		}
		if (lonRecordEdition.text() != lonRecordEdition.attr('oldVal')){
			varsToValidate.lon = lonRecordEdition.text();
			constraints.lon = {};
			constraints.lon.presence = true;
			constraints.lon.numericality = {
				greaterThanOrEqualTo: -180,
				lessThanOrEqualTo: 180,
			};
			data.decimalLongitude = lonRecordEdition.text();
		}
		if(speRecordEdition.text() != speRecordEdition.attr('oldVal')){
			varsToValidate.acceptedNameUsage = speRecordEdition.text();
			constraints.acceptedNameUsage = {};
			constraints.acceptedNameUsage.length = { maximum: 100 };
			data.acceptedNameUsage = speRecordEdition.text();
		}
		if (locRecordEdition.text() != locRecordEdition.attr('oldVal')){
			varsToValidate.localidad = locRecordEdition.text();
			constraints.localidad = {};
			constraints.localidad.presence = true;
			constraints.localidad.length = { maximum: 100 };
			data.verbatimLocality = locRecordEdition.text();
		}
		const valResponse = validate(varsToValidate, constraints, { format: "flat" });
		if (valResponse) {
			let response = "";
			valResponse.forEach(function (message) {
				response += `${message} <br />`;
			})
			alertify.alert(response);
		} else {
			$.post("/records/update_record", data)
				.done(function() {
					$.post( "/records/show", { id: $("span#record_id").text()}).done();
					_refreshSpeciesRecords();
				});
		}
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
            alertify.alert( "Ha ocurrido un error al guardar la variable ecológica: " + error );
          }
    });
  });
});
