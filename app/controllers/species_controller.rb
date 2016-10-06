class SpeciesController < ApplicationController
	def autocomplete
	    species = Species.search(query: params[:query])
	    result = species.collect do |t|
	      { sci_name: t.sci_name, id: t.id }
	    end
	    render json: result
  	end

  	def visor
	  	@skip_footer = true
	end

	def set_species
		@species = Species.find_name(params[:species_id])

		respond_to do |format|
      		format.js
    	end
	end

	def update_record
		respond_to do |format|
      		format.js
    	end
	end

	def report_record
		respond_to do |format|
      		format.js
    	end
	end

end
