class ModelsController < ApplicationController
	def get_thresholds
		@thresholds = Threshold.get_thresholds(params[:species_id])

		@thresholds.each do |t|
			case t.threshold
			  when "continuous"
			    @continuous_t = t
			  when "0"
			    @zero_t = t
			  when "10"
			    @ten_t = t
			  when "20"
			  	@twenty_t = t
			  when "30"
			    @thirty_t = t
			end
		end

		respond_to do |format|
      		format.js
    	end
	end

	def get_models
		@models = Model.get_models(params[:species_id])
		respond_to do |format|
	      format.js
	    end
	end

	def metadata
	end

	def download_model
	    respond_to do |format|
	      #format.js {}
	      format.html { send_file Rails.root.join(params[:tif_url]), :type => 'image/tiff', :disposition => 'attachment' }
	    end
  	end

end