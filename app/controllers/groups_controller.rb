class GroupsController < ApplicationController
	def index
		@groups = Group.where(:group_state_id => 1)
	end

	def show
		begin
			@group = Group.find(params[:id])
			@tasks = Task.where(:group_id =>  @group.id, :task_state_id => 1)
			@species_ids = GroupsSpecies.where(:group_id => @group.id, :groups_species_state_id => 1)
			@group_species = @species_ids.map{|t| [Species.find_name(t.species_id.to_s), t.species_id]}.uniq
			@species_with_tasks = @tasks.map{|t| [Species.find_name(t.species_id.to_s),t.species_id]}.uniq
			@group_members = GroupsUser.where(:group_id => @group.id, :groups_users_state_id => 1).joins(:user).order('users.name')
			@groups_species = GroupsSpecies.new
			@current_group_user = false
			@task = Task.new
			if user_signed_in?
	        	@current_group_user = GroupsUser.find_by_group_id_and_user_id(@group.id, current_user.id)
	        end
	    rescue => e
			logger.error "#{e.message} #{e.backtrace}"
			err_msg = e.message.tr(?',?").delete("\n")
			redirect_to root_path, :flash => { :error => "Ha ocurrido un error: #{err_msg}" }	    
	    end
	end

	def update
		group_params = params[:group]
	    @group = Group.find(params[:id])
	    @group.name=group_params[:name]
	    @group.message=group_params[:message]
	    @group.logo=group_params[:logo]
	    if @group.save
	      redirect_to group_path(id:params[:id]), :flash => { :notice => "El perfil de grupo ha sido actualizado con éxito." }
	    else
	      redirect_to group_path(id:params[:id]), :flash => { :error => "Ha ocurrido un error actualizando el pefil de grupo" }
	    end
	end
end