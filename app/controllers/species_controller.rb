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
end
