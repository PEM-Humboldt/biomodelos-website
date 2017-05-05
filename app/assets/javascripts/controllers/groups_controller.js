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

	$(".group_users_tab").click(function(e){
		$.post( "/groups_users/users_by_group", { id: $("#group_id_field").val()});
	});

	$(".group_activity_tab").click(function(e){
		$.post( "/groups/group_activity", { id: $("#group_id_field").val()});
	});

	/**
 	* Updates the status of a pending species in a group. 
 	* 
	* @param {String} event.data.sp_action - Action selected by the group mods ("approve" or "dismiss").
	* menu or False if it's the model edition menu.
	*/
	function updateGroupSpecies(event){
		event.preventDefault();
		data = {
			group_id: $("#group_id_field").val(), 
			species_id: $(this).parent('div').parent('div').find('.p_sp_id').attr("value"), 
			sp_action: event.data.sp_action
		}
		var alert_message = "";
		if (event.data.sp_action == "approve")
			alert_message = "¿Quiere agregar esta especie al grupo actual?";
		else if (event.data.sp_action == "dismiss")
			alert_message = "¿Quiere eliminar esta especie del listado?"

		alertify.confirm(alert_message, function(e){
			if(e){
				$.post("/groups_species/update_groups_species", data);
			}
		});
	}

	/**
 	* Updates the status of a pending user in a group. 
 	* 
	* @param {String} event.data.usr_action - Action selected by the group mods ("approve" or "dismiss").
	* menu or False if it's the model edition menu.
	*/
	function updateUserStatus(event){
		event.preventDefault();
		data = {
			group_id: $("#group_id_field").val(), 
			user_id: $(this).parent('div').parent('div').find('.p_usr_id').attr("value"), 
			usr_action: event.data.usr_action
		}
		var alert_message = "";
		if (event.data.usr_action == "approve")
			alert_message = "¿Quiere aceptar a este experto en el grupo?";
		else if (event.data.usr_action == "dismiss")
			alert_message = "¿Quiere eliminar a este usuario del listado?"

		alertify.confirm(alert_message, function(e){
			if(e){
				$.post("/groups_users/update_groups_user", data);
			}
		});
	}

	$(".sppbox").on("click", ".btn_approve_sp", {sp_action: "approve"}, updateGroupSpecies);

	$(".sppbox").on("click", ".btn_dismiss_sp", {sp_action: "dismiss"}, updateGroupSpecies);

	$(".usrbox").on("click", ".btn_approve_usr", {usr_action: "approve"}, updateUserStatus);

	$(".usrbox").on("click", ".btn_dismiss_usr", {usr_action: "dismiss"}, updateUserStatus);

});