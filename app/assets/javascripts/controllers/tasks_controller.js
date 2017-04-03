$(document).ready(function(){
	/**
 	* Asks for a confirmation of the finish task action. If it's positive, 
 	* sends an ajax request to finish the task.
	* @param {string} task_id - ID of the task to be marked as finished.
	*/
	function _markFinishedTask(task_id){
		alertify.confirm('¿Quiere marcar esta tarea como finalizada?', function(e){
			if(e){
				$.ajax({
		    		type: 'POST',
		    		url: "/tasks/finish_task",
		    		data: {
		    			id: task_id
		    		},
					error: function(jqXHR, textStatus, errorThrown){
						alertify.alert("Ha ocurrido un error al actualizar la tarea: " + textStatus);
					}	
				});	
			}
			else{
				$("#task_active_"+task_id).prop('checked', false);
			}
		});
	}

	/**
 	* Gets the ID of the task being checked and calls a function to mark the task as finished.
	* 
	*/
	$("body").on("change", "#group_tasks_table input[type=checkbox]", function () {
		var task_id = $(this).val();
		_markFinishedTask(task_id);
  });
});