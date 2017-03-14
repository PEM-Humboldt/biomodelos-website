class GroupsController < ApplicationController
	def index
		@groups = Group.where(:group_state_id => 1)
	end

	def show
		begin
			@group = Group.find(params[:id])
			@tasks = Task.where(:group_id =>  @group.id, :task_state_id => 1)
			@species_ids = GroupsSpecies.where(:group_id => @group.id)
			@group_species = @species_ids.map{|t| [Species.find_name(t.species_id.to_s), t.species_id]}.uniq
			@species_with_tasks = @tasks.map{|t| [Species.find_name(t.species_id.to_s),t.species_id]}.uniq
			@members_with_tasks = @tasks.map{|t| [t.user.name]}.uniq
			@group_members = GroupsUser.where(:group_id => @group.id, :groups_users_state_id => 1).joins(:user).order('users.name')
			@groups_species = GroupsSpecies.new
			@current_group_user = false
			@task = Task.new
			if user_signed_in?
	        	@current_group_user = GroupsUser.find_by_group_id_and_user_id(@group.id, current_user.id)
	        end
	    rescue => e
	    	render :js => "alertify.alert('Ha ocurrido un error en la conexión con la base de datos' + #{e.message} + ' ' + #{e.backtrace});"
	    end
	end
end