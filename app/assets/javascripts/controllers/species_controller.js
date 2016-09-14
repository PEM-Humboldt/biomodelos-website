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
		$(".polig").removeClass("opacitybtn");
		$(".polig").prop('disabled', false);
		$(".delpoli").removeClass("opacitybtn");
		$(".delpoli").prop('disabled', false);
		if($(".editbotones").is(":visible")){
			$(".editbotones").hide();
			$(".edipoli").removeClass("polibtnact");
		}
	}
	function deactivateDeletion(){
		$(".polig").removeClass("opacitybtn");
		$(".polig").prop('disabled', false);
		$(".edipoli").removeClass("opacitybtn");
		$(".edipoli").prop('disabled', false);
		if($(".delbotones").is(":visible")){
			$(".delbotones").hide();
			$(".delpoli").removeClass("polibtnact");
		}
	}

	$(".polig").click(function(e){
		if($(this).hasClass("polibtnact")){
			_BioModelosVisorModule.deactivateDraw();
			$(this).removeClass("polibtnact");
		}
		else{
			_BioModelosVisorModule.drawPolygon();
			$(this).addClass("polibtnact");
		}
		e.preventDefault();
	});
	$(".edipoli").click(function(e){
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

	/* 
	 * Funcionalidad para seleccionar los valores de los filtros de manera dinámica.
	 */
	customSelect();
	$("#filtroRegistro").change(function(){
		var filterValues = _BioModelosVisorModule.uniqueValues($('#filtroRegistro option:selected').text());
		$('#resultadoFiltro').html('<option value="">- Categoria -</option>');
		if(filterValues != ""){
			$.each(filterValues, function (index, value) {
	    		$('#resultadoFiltro').append($('<option/>', { 
	        		value: value,
	        		text : value 
	    		}));
			});
		}
		var $customSelectBox = $('#resultadoFiltro').parent().find(".select-styled"),
			$customSelectOptions = $('#resultadoFiltro').parent().find(".select-options");
		
		$customSelectBox.text($('#resultadoFiltro').children('option').eq(0).text());
		$customSelectOptions.html("");
		for (var i = 0; i < $("#resultadoFiltro").children('option').length; i++) {
		        $('<li />', {
		            text: $("#resultadoFiltro").children('option').eq(i).text(),
		            rel: $("#resultadoFiltro").children('option').eq(i).val()
		        }).appendTo($customSelectOptions);
		}
		$customSelectOptions.children('li').click(function(e) {
		        e.stopPropagation();
		        $customSelectBox.text($(this).text()).removeClass('active');
		        $('#resultadoFiltro').val($(this).attr('rel'));
		        $customSelectOptions.hide();
		        $('#resultadoFiltro').trigger('change'); //Change the hidden select
		});
		$(document).click(function() {
		        $customSelectBox.removeClass('active');
		        $customSelectOptions.hide();
		 }); 
	});

	/*
	* Custom Select Box
	*/
	function customSelect() {
		$('select').each(function(){
			// Cache the number of options
		    var $this = $(this), numberOfOptions = $(this).children('option').length;
		  	
		  	// Hides the select element
		    $this.addClass('select-hidden');
		    // Wrap the select element in a div 
		    $this.wrap('<div class="select"></div>');
		    // Insert a styled div to sit over the top of the hidden select element
		    $this.after('<div class="select-styled"></div>');

		    // Cache the styled div
		    var $styledSelect = $this.next('div.select-styled');
		    // Show the first select option in the styled div
		    $styledSelect.text($this.children('option').eq(0).text());
		  	// Insert an unordered list after the styled div and also cache the list
		    var $list = $('<ul />', {
		        'class': 'select-options'
		    }).insertAfter($styledSelect);
		  	
		  	// Insert a list item into the unordered list for each select option
		    for (var i = 0; i < numberOfOptions; i++) {
		        $('<li />', {
		            text: $this.children('option').eq(i).text(),
		            rel: $this.children('option').eq(i).val()
		        }).appendTo($list);
		    }
		  	
		  	// Cache the list items
		    var $listItems = $list.children('li');
		  	// Show the unordered list when the styled div is clicked (also hides it if the div is clicked again)
		    $styledSelect.click(function(e) {
		        e.stopPropagation();
		        $('div.select-styled.active').each(function(){
		            $(this).removeClass('active').next('ul.select-options').hide();
		        });
		        $(this).toggleClass('active').next('ul.select-options').toggle();
		    });
		  	
		  	// Hides the unordered list when a list item is clicked and updates the styled div to show the selected list item
		  	// Updates the select element to have the value of the equivalent option
		    $listItems.click(function(e) {
		        e.stopPropagation();
		        $styledSelect.text($(this).text()).removeClass('active');
		        $this.val($(this).attr('rel'));
		        $list.hide();
		        $this.trigger('change'); //Change the hidden select
		        //console.log($this.val());
		    });
		  	// Hides the unordered list when clicking outside of it
		    $(document).click(function() {
		        $styledSelect.removeClass('active');
		        $list.hide();
		    });
		});
	}

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
  		var visFilters = ["", "visualedit",""];

  		console.log(yearFilters + " " + monthFilters);
		_BioModelosVisorModule.filterRecords(selectFilters, visFilters, yearFilters, monthFilters);
	})

	/* Botón Limpiar filtros
		1. Reset DOM (año, mes, select, filtros)
	*/
	$("#limpiarBtn").click(function(e){
		//Reset slider Año
		angular.element($("#visCntrl")).scope().resetSlider();
		//Reset meses
		$('input:checkbox.meschk').removeAttr('checked');
		//Reset filters
		$(".select-options li:contains('Tipo de filtro')").click();
		//Reset visualizar filters
		$('#chkBoxFilters input:checkbox').removeAttr('checked');
		//Reset data
		_BioModelosVisorModule.getSpeciesRecords();
	});


	/* Botón para activar menú de edición */
	$("#cbt_editBtn").click(function(e){
		/*
		* TODO: . cerrar menú edición
		*		. Limpiar capa de edición
				. Cargar capas de umbral
		*		2. Si existe edición pausada, cargarla (umbral, capa editada, variables?)
		*		3. Si no existe ediciòn cargar capa continua y capa de edición limpia
		*
		*/
		$("#clsEditBox").click();
		$(".btnedicion").show();
		$(".btnedicion").click();
	});
	/* Botón crea tu mapa */
	$("#cbt_crearBtn").click(function(e){
		/*
		* TODO: . cerrar menú edición
		*		. Limpiar capa de edición
		*		. deshabilitar sección umbrales
		*		2. Si existe edición pausada, cargarla (capa editada, variables?)
		*		3. Si no existe ediciòn cargar capa de edición limpia
		*
		*/
		$("#clsEditBox").click();
		$(".btnedicion").show();
		$("#regMenu_slider").hide();
		$(".btnedicion").click();
	});

	$(".vbtnedit").click(function(e){
		/* TODO clean layers */
		$("#regMenu_slider").show();
		$(".btnedicion").hide();
		if($(".cajitaeditar").is(":visible")){
			$(".btnedicion").click();
		}
	});


	/* Botón enviar edición de registro */
	$("body").on("click","#sendRecordEdition",function(e){
        e.preventDefault();
		$.ajax({
		    type: 'POST', 
		    url: "/species/update_record"
		});
	});
});


