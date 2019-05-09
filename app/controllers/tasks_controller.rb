class TasksController < ApplicationController

	def tasks_by_group
		@group = Group.find(params[:id])
		@tasks = Task.where(:group_id =>  @group.id).group(:id, :species_id, :user_id, :task_type_id, :group_id)
		@species_with_tasks = Species.find_names(@tasks.map{|t| t.species_id}.uniq).map{|s| [s["acceptedNameUsage"], s["taxID"]]}
		@members_with_tasks = @tasks.map{|t| [t.user.id]}.uniq
		@current_group_user = false
		if user_signed_in?
	        @current_group_user = GroupsUser.find_by_group_id_and_user_id(@group.id, current_user.id)
	    end
	    respond_to do |format|
			format.js
		end
	end

	def tasks_by_user
		@user= User.find(params[:user_id])
		@tasks = Task.where(:user_id =>  @user.id).group(:id, :species_id, :user_id, :task_type_id)
		@species_with_tasks = @tasks.map{|t| [Species.find_name(t.species_id.to_s),t.species_id]}.uniq
		@current_group_user = false
	    respond_to do |format|
			format.js
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
		@tasks = []
		duplicate_error_counter = 0
		validation_errors = [false, false]

		if(params[:records_task].blank? && params[:edition_task].blank? && params[:eco_task].blank? && params[:approval_task].blank?)
			validation_errors[0] = true
		end
		if(params[:task][:species_id].blank? || params[:task][:user_id].blank?)
			validation_errors[1] = true
		end

		if validation_errors[0] || validation_errors[1]
			render :js => "alertify.alert('Error: Debe elegir una especie, un experto y al menos un tipo de tarea a asignar.');"
		else
			if(params[:records_task] == "1")
				@task_records = Task.new(:species_id => params[:task][:species_id], :user_id => params[:task][:user_id], :group_id => params[:task][:group_id], :task_type_id => params[:records_task], :created_by => current_user.id, :task_state_id => 1)
				if @task_records.valid?
					@tasks.push(@task_records)
				else
					if @task_records.errors.size == 1 && @task_records.errors.messages[:user_id][0] == "Tarea duplicada"
						duplicate_error_counter += 1
					end
				end
			end
			if(params[:edition_task] == "2")
				@task_edition = Task.new(:species_id => params[:task][:species_id], :user_id => params[:task][:user_id], :group_id => params[:task][:group_id], :task_type_id => params[:edition_task], :created_by => current_user.id, :task_state_id => 1)
				if @task_edition.valid?
					@tasks.push(@task_edition)
				else
					if @task_edition.errors.size == 1 && @task_edition.errors.messages[:user_id][0] == "Tarea duplicada"
						duplicate_error_counter += 1
					end
				end
			end
			if(params[:eco_task] == "3")
				@task_eco = Task.new(:species_id => params[:task][:species_id], :user_id => params[:task][:user_id], :group_id => params[:task][:group_id], :task_type_id => params[:eco_task], :created_by => current_user.id, :task_state_id => 1)
				if @task_eco.valid?
					@tasks.push(@task_eco)
				else
					if @task_eco.errors.size == 1 && @task_eco.errors.messages[:user_id][0] == "Tarea duplicada"
						duplicate_error_counter += 1
					end
				end
			end
			if(params[:approval_task] == "4")
				@task_approval = Task.new(:species_id => params[:task][:species_id], :user_id => params[:task][:user_id], :group_id => params[:task][:group_id], :task_type_id => params[:approval_task], :created_by => current_user.id, :task_state_id => 1)
				if @task_approval.valid?
					@tasks.push(@task_approval)
				else
					if @task_approval.errors.size == 1 && @task_approval.errors.messages[:user_id][0] == "Tarea duplicada"
						duplicate_error_counter += 1
					end
				end
			end

			if duplicate_error_counter > 0
				render :js => "alertify.alert('Error: #{duplicate_error_counter} de las tareas que quiere asignar se encuentran duplicadas.');"
			else
				if @tasks
					@tasks.each do |t|
						t.save
					end
					respond_to do |format|
						format.js
					end
				end
			end
		end
	end

	def destroy
  		@task = Task.find(params[:id])
  		if @task.destroy
  			respond_to do |format|
				format.js
			end
  		else
			render :js => "alertify.alert('Error: No fue posible eliminar la tarea.');"
  		end
	end

	private
		def task_params
			params.require(:task).permit(:species_id, :user_id, :group_id, :task_type_id, :created_by, :completed_by, :task_state_id)
		end
end
