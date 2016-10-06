class UsersController < ApplicationController
	before_filter :authenticate_user!
	
	def index
		
	end
	
	def show
		@user = User.find(params[:id])
		@tasks = Task.where(:user_id => @user.id, :active => true)
		@user_groups = GroupsUser.where(:user_id => @user.id, :groups_users_state_id => 1)
	end
end