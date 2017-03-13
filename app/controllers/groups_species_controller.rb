class GroupsSpeciesController < ApplicationController

	def create
		@groups_species = GroupsSpecies.find_by_group_id_and_species_id(params[:group_id], params[:species_id])

		if @groups_species
			render :js => "alertify.alert('La especie ya se encuentra en el grupo');"
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
      		params.require(:groups_species).permit(:group_id, :species_id)
    	end

end