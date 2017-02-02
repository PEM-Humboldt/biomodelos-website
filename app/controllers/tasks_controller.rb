class TasksController < ApplicationController
	
	def create
		@task = Task.find_by(species_id: params[:species_id], user_id: current_user.id, task_type_id: params[:task_type_id], :task_state_id => 1)

		if @task
			@task = current_user.tasks_created.new(task_params)

	    	if @task.save
	    		respond_to do |format|
					format.js
				end 
	    	else
      			render :js => "alertify.alert('Ha ocurrido un error en la creación de la tarea.');"
   			end
		else
			render :js => "alertify.alert('La tarea que está tratando de crear ya existe.');"
		end
	end

	def update
	end

	def add_task
		if(params[:regvalid] == 1)
			Task.create({:species_id => params[:species_id], :user_id => current_user.id, :group_id => params[:group_id], :task_type_id => params[:task_type_id], :created_by => current_user.id, :task_state_id => 1})
		end
		if(params[:regvalid] == 1)
			Task.create({:species_id => params[:species_id], :user_id => current_user.id, :group_id => params[:group_id], :task_type_id => params[:task_type_id], :created_by => current_user.id, :task_state_id => 1})
		end
	end

	private
		def task_params
			params.require(:task).permit(:species_id, :user_id, :group_id, :task_type_id, :created_by, :completed_by, :task_state_id)
		end
end
