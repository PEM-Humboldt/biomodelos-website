class GroupsSpeciesController < ApplicationController

	def create
		@groups_species = GroupsSpecies.find_by_species_id(params[:groups_species][:species_id])

		if !@groups_species.blank?
			if @groups_species.group_id == params[:groups_species]
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
	end

	private

		def groups_species_params
      		params.require(:groups_species).permit(:group_id, :species_id, :groups_species_state_id)
    	end

end