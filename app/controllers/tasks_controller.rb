class TasksController < ApplicationController
	
	def tasks_by_group
			@group = Group.find(params[:id])
			@tasks = Task.where(:group_id =>  @group.id).group(:species_id, :user_id, :task_type_id, :group_id)
			@species_with_tasks = @tasks.map{|t| [Species.find_name(t.species_id.to_s),t.species_id]}.uniq
			@members_with_tasks = @tasks.map{|t| [t.user.id]}.uniq
			@current_group_user = false
			if user_signed_in?
	        	@current_group_user = GroupsUser.find_by_group_id_and_user_id(@group.id, current_user.id)
	        end

	        respond_to do |format|
				format.js
			end
	end

	def create
		@task = Task.find_by(species_id: params[:species_id], user_id: params[:user_id], task_type_id: params[:task_type_id], :task_state_id => 1)

		if @task.nil?
			@task = current_user.tasks_created.new(task_params)

	    	if @task.save
	    		respond_to do |format|
					format.js
				end 
	    	else
      			render :js => "alertify.alert('Ha ocurrido un error en la creación de la tarea.');"
   			end
		else
			render :js => "alertify.alert('La tarea de " + @task.task_type.description + " que está tratando de crear ya existe.');"
		end
	end

	def finish_task
		@task = Task.find(params[:id])
		if @task
			Task.update(@task.id, {:completed_by => current_user.id, :task_state_id => 2})

	    	respond_to do |format|
				format.js
			end 
		else
			render :js => "alertify.alert('Existe un problema con la tarea que intenta actualizar.');"
		end
	end

	def add_tasks
		if(params[:records_task] == "1")
			Task.create({:species_id => params[:task][:species_id], :user_id => params[:task][:user_id], :group_id => params[:task][:group_id], :task_type_id => params[:records_task], :created_by => current_user.id, :task_state_id => 1})
		end
		if(params[:edition_task] == "2")
			Task.create({:species_id => params[:task][:species_id], :user_id => params[:task][:user_id], :group_id => params[:task][:group_id], :task_type_id => params[:edition_task], :created_by => current_user.id, :task_state_id => 1})
		end
		if(params[:eco_task] == "3")
			Task.create({:species_id => params[:task][:species_id], :user_id => params[:task][:user_id], :group_id => params[:task][:group_id], :task_type_id => params[:eco_task], :created_by => current_user.id, :task_state_id => 1})
		end
		if(params[:approval_task] == "4")
			Task.create({:species_id => params[:task][:species_id], :user_id => params[:task][:user_id], :group_id => params[:task][:group_id], :task_type_id => params[:approval_task], :created_by => current_user.id, :task_state_id => 1})
		end

		respond_to do |format|
			format.js
		end 
	end

	private
		def task_params
			params.require(:task).permit(:species_id, :user_id, :group_id, :task_type_id, :created_by, :completed_by, :task_state_id)
		end
end
