$(document).ready(function(){
    $('.cajaperfil').niceScroll({
    	cursorcolor: "#5d5e5e",
    	cursorwidth: "7px",
    	cursorborder: "none"
	});

	$('#centerbox').niceScroll({
		cursorcolor: "#5d5e5e",
		cursorwidth: "7px",
		cursorborder: "none"
	});

	$( ".tareaspp:odd" ).css( "background-color", "#f2f2f2" );

	$(".user_tasks_tab").click(function(e){
		$.post( "/" + $("#locale_field").val() + "/tasks/tasks_by_user", { user_id: $("#user_id_field").val()});
	});
});
