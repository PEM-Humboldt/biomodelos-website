class UsersController < ApplicationController
	#before_filter :authenticate_user!
	
	def index
		
	end
	
	def show
		@user = User.find(params[:id])
		@tasks = Task.where(:user_id => @user.id, :task_state_id => 1)
		@user_groups = GroupsUser.where(:user_id => @user.id, :groups_users_state_id => 1)
		@species_with_tasks = @tasks.map{|t| [Species.find_name(t.species_id.to_s),t.species_id]}.uniq
	end
end