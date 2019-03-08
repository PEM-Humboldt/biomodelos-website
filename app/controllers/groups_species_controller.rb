class GroupsSpeciesController < ApplicationController

	def create
		@current_group_user = false
		if user_signed_in?
	        @current_group_user = GroupsUser.find_by(group_id: params[:groups_species][:group_id], user_id: current_user.id, groups_users_state_id: 1)
	    end
	    if !params[:groups_species][:species_id].blank? && params[:groups_species][:species_id] != "0"
			@groups_species = GroupsSpecies.find_by_species_id(params[:groups_species][:species_id])
			if !@groups_species.blank?
				if @groups_species.group_id == params[:groups_species][:group_id].to_i
					if @groups_species.groups_species_state_id == 1
						render :js => "alertify.alert('La especie ya se encuentra en el grupo');"
					elsif @groups_species.groups_species_state_id == 2
						render :js => "alertify.alert('La especie ya ha sido sugerida y se encuentra en espera de aprobación');"
					end
				else
					group_name = Group.find(@groups_species.group_id).name
					if @groups_species.groups_species_state_id == 1
						render :js => "alertify.alert('La especie pertenece al grupo: #{group_name}');"
					elsif @groups_species.groups_species_state_id == 2
						render :js => "alertify.alert('La especie ya ha sido sugerida en el grupo #{group_name} y se encuentra en espera de aprobación');"
					end
				end
			else
				@groups_species = GroupsSpecies.new(groups_species_params)
	    		if @groups_species.save
	    			respond_to do |format|
						format.js
					end
	    		else
	      			render :js => "alertify.alert('Ha ocurrido un error agregando la especie al grupo.');"
	   			end
	   		end
	   	else
	   		render :js => "alertify.alert('La especie sugerida no se encuentra en BioModelos.');"
	   	end
	end

	def species_by_group
		@group = Group.find(params[:id])
		@species_ids = GroupsSpecies.where(:group_id => @group.id)
		@pending_species = Species.find_names(@species_ids.select{|c| c.groups_species_state_id == 2}.map{|t| t.species_id}.uniq)\
			.map{|e| [e['acceptedNameUsage'].to_s, e['taxID'].to_s]}
		@actual_species = Species.find_names(@species_ids.select{|c| c.groups_species_state_id == 1}.map{|t| t.species_id}.uniq)\
			.map{|e| [e['acceptedNameUsage'].to_s, e['taxID'].to_s]}
		@groups_species = GroupsSpecies.new
		@current_group_user = false
		if user_signed_in?
	        @current_group_user = GroupsUser.find_by(group_id: @group.id, user_id: current_user.id, groups_users_state_id: 1)
	    end

	    respond_to do |format|
			format.js
		end
	end

	def update_groups_species
		@group_species = GroupsSpecies.where(:group_id => params[:group_id], :species_id => params[:species_id]).first
		if !@group_species.blank?
			if params[:sp_action] == 'approve'
			  GroupsSpecies.update(@group_species.id, {:groups_species_state_id => 1})
			elsif params[:sp_action] == 'dismiss'
			  @group_species.destroy
			end
			respond_to do |format|
				format.js
			end
		else
			redirect_to group_path(id: @group_species.group_id), :flash => { :error => "No existe la especie a actualizar." }
		end
	end

	def update
	end

	private

		def groups_species_params
      		params.require(:groups_species).permit(:group_id, :species_id, :groups_species_state_id)
    	end

end
