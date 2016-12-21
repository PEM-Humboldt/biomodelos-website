module Api
	module V1
		class ModelsController < ApplicationController
			def index
			    @thresholds = Threshold.get_thresholds("105")
			    respond_to do |format|
			      format.json { render :json => @thresholds}
			    end
		  	end
		end
	end
end