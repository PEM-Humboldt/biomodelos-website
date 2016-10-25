class SpeciesGroupsController < ApplicationController

	def create
		@species_group = SpeciesGroup.find_by_group_id_and_species_id(params[:group_id], params[:species_id])

		if @species_group
			render :js => "alertify.alert('La especie ya se encuentra en el grupo');"
		else
			@species_group = SpeciesGroup.new(species_group_params)
    			if @species_group.save
    				respond_to do |format|
						format.js
					end 
    			else
      				render :js => "alertify.alert('Ha ocurrido un error agregando la especie al grupo.');"
   				end
   		end
	end

	private

		def species_group_params
      		params.require(:species_group).permit(:group_id, :species_id)
    	end

end