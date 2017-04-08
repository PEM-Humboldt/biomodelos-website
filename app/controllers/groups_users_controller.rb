class GroupsUsersController < ApplicationController
	def users_by_group
		@group = Group.find(params[:id])
		@group_members = GroupsUser.where(:group_id => @group.id, :groups_users_state_id => 1).joins(:user).order('users.name')
		@pending_members = GroupsUser.where(:group_id => @group.id, :groups_users_state_id => 2).joins(:user).order('users.name')
		@current_group_user = false
		if user_signed_in?
	        @current_group_user = GroupsUser.find_by(group_id: @group.id, user_id: current_user.id, groups_users_state_id: 1)
	    end

	    respond_to do |format|
			format.js
		end
	end

	def create
		@groups_user = GroupsUser.new(groups_users_params.merge(user_id: current_user.id, is_admin: false))

		if @groups_user.save
			redirect_to group_path(id: @groups_user.group_id), :flash => { :notice => "La solicitud para unirse al grupo ha sido enviada." }
		else
			redirect_to group_path(id: @groups_user.group_id), :flash => { :error => "Ha ocurrido un error mientras se realizaba la solicitud." }
		end
  	end

  	def update_groups_user
  		@groups_user = GroupsUser.where(:group_id => params[:group_id], :user_id => params[:user_id]).first
		if !@groups_user.blank?
			if params[:usr_action] == 'approve'
			  GroupsUser.update(@groups_user.id, {:groups_users_state_id => 1})
			  GroupMailer.user_accepted(@groups_user.user.email, @groups_user.group).deliver_now
			elsif params[:usr_action] == 'dismiss'
			  @groups_user.destroy
			end
			respond_to do |format|
				format.js
			end	
		else
			redirect_to group_path(id: @groups_user.group_id), :flash => { :error => "Hay un problema intentando cambiar el estado del usuario." }
		end
  	end

	private

		def groups_users_params
      		params.require(:groups_user).permit(:group_id, :user_id, :groups_users_state_id)
    	end

end
