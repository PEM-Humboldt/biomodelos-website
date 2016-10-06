class GroupsController < ApplicationController
	def index
		
	end

	def show
		@group = Group.find(params[:id])
		@tasks = Task.where(:group_id =>  @group.id, :active => true)
		@species_with_tasks = @tasks.map{|t| [t.species.sci_name,t.species_id]}.uniq
		@group_members = GroupsUser.where(:group_id => @group.id, :groups_users_state_id => 1).joins(:user).order('users.name')



		# @group_admins = Group.users.
		# @group_members = Group.users.
		# @tasks = Group.tasks.
		# @species_with_tasks = 
		# @species_tasks = ['Wingardium leviosa','Amatura leviosa','Rafica leviosa','Rata comun']
		
		# @species = 

	end
end