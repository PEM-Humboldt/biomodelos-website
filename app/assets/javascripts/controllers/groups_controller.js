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
});