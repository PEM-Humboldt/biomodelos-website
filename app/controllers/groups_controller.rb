class GroupsController < ApplicationController
	def index
		
	end

	def show
		@group = Group.find(params[:id])
		# @group_admins = Group.users.
		# @group_members = Group.users.
		# @tasks = Group.tasks.
		# @species = 

	end
end