class UsersController < ApplicationController
	#before_filter :authenticate_user!
	
	def index
		
	end
	
	def show
		@user = User.find(params[:id])
		@tasks = Task.where(:user_id => @user.id)
		@user_groups = GroupsUser.where(:user_id => @user.id, :groups_users_state_id => 1)
		@task_pending = @tasks.select{|t| t.task_state_id == 1}.uniq
		@species_with_tasks = @tasks.map{|t| [Species.find_name(t.species_id.to_s),t.species_id]}.uniq
	end

	# Sends email to the user.
	def send_message_to_user
	    user = User.find(params[:message][:user_id])
	    UserMailer.message_to_user(user, current_user, params[:message][:message]).deliver_now
	 	redirect_to user_path(id: user.id), :flash => { :notice => "El mensaje ha sido enviado al experto." }	
	end
end