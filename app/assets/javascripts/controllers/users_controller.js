$(document).ready(function(){
	$( ".tareaspp:odd" ).css( "background-color", "#f2f2f2" );

	$(".user_tasks_tab").click(function(e){
		$.post( "/" + $("#locale_field").val() + "/tasks/tasks_by_user", { user_id: $("#user_id_field").val()});
	});
});
