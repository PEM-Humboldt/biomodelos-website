module Api
	module V1
		class SpeciesController < ApplicationController
		  	def records
		  		@species_records = Species.records(params[:id])
			    respond_to do |format|
			      format.json { render :json => @species_records}
			    end
		  	end

		  	def show
		  		@species_info = Species.info(params[:id])
		  		respond_to do |format|
			      format.json { render :json => @species_info}
			    end
		  	end
		end
	end
end