$(document).ready(function(){
	$(".group_tasks_tab").click(function(e){
		e.preventDefault();
		$.ajax({
		    type: 'POST',
		    url: "/tasks/tasks_by_group",
		    data: {
		    	id: $("#group_id_field").val()
		    }
		});
	})

	$(".group_species_tab").click(function(e){
		$.post( "/groups_species/species_by_group", { id: $("#group_id_field").val()});
	});

	function updateGroupSpecies(event){
		event.preventDefault();
		console.log($(this).parent('div').parent('div').find('.p_sp_id').attr("value"));
		data = {
			group_id: $("#group_id_field").val(), 
			species_id: $(this).parent('div').parent('div').find('.p_sp_id').attr("value"), 
			sp_action: event.data.sp_action
		}
		alertify.confirm('¿Quiere cambiar el estado de esta especie?', function(e){
			if(e){
				$.post("/groups_species/update_groups_species", data);
			}
		});
	}

	$(".sppbox").on("click", ".btn_approve_sp", {sp_action: "approve"}, updateGroupSpecies);

	$(".sppbox").on("click", ".btn_dismiss_sp", {sp_action: "dismiss"}, updateGroupSpecies);

});