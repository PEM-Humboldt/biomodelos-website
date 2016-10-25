class GroupsController < ApplicationController
	def index
		@groups = Group.where(:group_state_id => 1)
	end

	def show
		@group = Group.find(params[:id])
		@tasks = Task.where(:group_id =>  @group.id, :active => true)
		@species_ids = SpeciesGroup.where(:group_id => @group.id)
		@group_species = @species_ids.map{|t| [Species.find_name(t.species_id.to_s),t.species_id]}.uniq
		@species_with_tasks = @tasks.map{|t| [Species.find_name(t.species_id.to_s),t.species_id]}.uniq
		@group_members = GroupsUser.where(:group_id => @group.id, :groups_users_state_id => 1).joins(:user).order('users.name')
		@species_group = SpeciesGroup.new
	end
end