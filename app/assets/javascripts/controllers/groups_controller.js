$(document).ready(function(){
	$("#addNewTask").click(function(e){
		/* TODO clean layers */
		if($("#Filtrousuario_task").val() == 'hide')
			alertify.alert("Seleccione un usuario al cual le asignará la tarea");
		else if ($("#Filtroespecie_task").val() == 'hide')
			alertify.alert("Seleccione una especie a la cual le asignará la tarea");
		else{
			if($('input[name="regvalid"]').is(':checked'))
				$.ajax({
			    	type: 'POST',
			    	url: "/tasks",
			    	data: {
			    		task: {
			    			species_id: $("#Filtroespecie_task").val(),
			    			user_id: $("#Filtrousuario_task").val(),
			    			group_id: $("#group_id_field").val(),
			    			task_state_id: 1, 
			    			task_type_id: 1
			    		}	
			    	}
			});
			if($('input[name="editvalid"]').is(':checked'))
				$.ajax({
			    	type: 'POST',
			    	url: "/tasks",
			    	data: {
			    		task: {
			    			species_id: $("#Filtroespecie_task").val(),
			    			user_id: $("#Filtrousuario_task").val(),
			    			group_id: $("#group_id_field").val(),
			    			task_state_id: 1, 
			    			task_type_id: 2
			    		}
			    	}
			});
		}
	});
});