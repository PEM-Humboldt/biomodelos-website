class GroupsController < ApplicationController
	def index
		@groups = Group.where(:group_state_id => 1)
	end

	def show
		begin
			@group = Group.find(params[:id])
			@tasks = Task.where(:group_id =>  @group.id)
			@species_ids = GroupsSpecies.where(:group_id => @group.id, :groups_species_state_id => 1)
			#@species_with_tasks_pending = @tasks.select{|x| x.task_state_id == 1}.map{|t| [Species.find_name(t.species_id.to_s),t.species_id]}.uniq
			@models_approved = 0
			# @species_with_tasks.each do |species|
			# 	approved_by_species = @tasks.select{|x| x.species_id == species[1] && x.task_type_id == 4}
			# 	approved_by_species_done = @tasks.select{|x| x.species_id == species[1] && x.task_type_id == 4 && x.task_state_id == 2}
			# 	if approved_by_species.size > 0 && approved_by_species.size == approved_by_species_done.size
			# 		@models_approved = @models_approved + 1
			# 	end
			# end
			@group_members_number = GroupsUser.where(:group_id => @group.id, :groups_users_state_id => 1).count
			@group_admins = GroupsUser.where(:group_id => @group.id, :groups_users_state_id => 1, :is_admin => true).joins(:user).order('users.name')
			@groups_species = GroupsSpecies.new
			@current_group_user = false
			@user_group = nil
			@groups_users = GroupsUser.new
			@task = Task.new
			if user_signed_in?
				@user_group = GroupsUser.find_by(group_id: @group.id, user_id: current_user.id)
				@current_group_user = (@user_group && @user_group[:groups_users_state_id] == 1) ? @user_group : nil
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

	def group_activity
		@group = Group.find(params[:id])
		respond_to do |format|
			format.js
		end
	end

	# Sends an email to every active member of a group.
	#
	def bulk_group_email
	    mails = []
	    group = Group.find(params[:message][:group_id])
	    group_users = GroupsUser.where(:group_id => group.id, :groups_users_state_id => 1)
	    group_users.each do |f|
	      mails.push(f.user.email)
	    end
	    if !params[:message][:message].blank?
	    	GroupMailer.bulk_email_group(params[:message][:message], mails, group.name, current_user.name).deliver_now
	    	redirect_to group_path(id: group.id), :flash => { :notice => "El mensaje ha sido enviado a los miembros del grupo." }
	    else
	    	redirect_to group_path(id: group.id), :flash => { :error => "Debe agregar un mensaje para enviar al grupo." }
	    end
	end

	def suggest_group
		@new_group = SuggestedGroup.new(suggested_group_params)
		if @new_group.valid?
			AdministratorsMailer.group_suggested(current_user, @new_group).deliver_now
			redirect_to groups_path, notice: 'Tu sugerencia ha sido recibida.'
		else
			redirect_to groups_path, :flash => { :error => "Debe llenar todos los campos para sugerir un grupo." }
		end
	end

	def invite_user
		mails = []
	    group = Group.find(params[:message][:group_id])
		mails = params[:message][:email].split(";")
		if !mails.blank? && !params[:message][:message].blank?
			GroupMailer.user_invitation(mails, group, current_user, params[:message][:message]).deliver_now
	    	redirect_to group_path(id: group.id), :flash => { :notice => "El mensaje ha sido enviado a los miembros del grupo." }
		else
			redirect_to group_path(id: group.id), :flash => { :error => "Debe llenar todos los campos para invitar a un experto al grupo." }
		end
	end

	private

		def suggested_group_params
      		params.require(:suggested_group).permit(:name, :moderator, :content)
    	end
end
