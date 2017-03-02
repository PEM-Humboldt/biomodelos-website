class ModelsController < ApplicationController
	#protect_from_forgery except: :metadata
	
	
	def load_initial_model
		@init_model = nil
		@popup_content = ""
		@valid_model = Model.get_valid_model(params[:species_id])
		@hypotheses = Model.get_hypotheses(params[:species_id])
		@continuous_model = Model.get_continous_model(params[:species_id])

		if @valid_model
			@init_model = @valid_model
			if @hypotheses.size > 0
				@popup_content = "Esta es una hipótesis de distribución aprobada por expertos. Consulta la pestaña 'Hipótesis de distribución' para visualizar otras hipótesis de distribución no aprobadas por expertos, disponibles para esta especie."
			end
		elsif @hypotheses.size > 0
			if @hypotheses.size == 1
				@init_model = @hypotheses[0]
				@popup_content = "Esta hipótesis de distribución está pendiente de aprobación por expertos."
			else
				#Todo Function to calculate hypothesis
			end
		elsif @continuous_model
			@init_model = @continuous_model
			@popup_content = "Esta es una hipótesis de distribución sin aportes de expertos. Para contribuir a mejorarlo, registrate en el grupo de expertos de la especie."
		end

		respond_to do |format|
		      	format.js
		end
	end

	# Gets the model information of each threshold and the continuous model.
    #
	def get_thresholds
		begin
			@continuous_t = Model.get_continous_model(params[:species_id])
			@thresholds = Model.get_thresholds(params[:species_id])

			if @thresholds
				@thresholds.each do |t|
					case t.threshold
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
	    	end

		    respond_to do |format|
		      	format.js
		    end
		rescue => e
			logger.error "#{e.message} #{e.backtrace}"
			err_msg = e.message.tr(?',?").delete("\n")
			render :js => "alertify.alert('Se ha producido un error al consultar los umbrales. #{err_msg}');"
		end
	end

	# Gets the model information of the valid model and each of the hypotheses, along with the rating for 
	# each one.
	#    
	def get_hypotheses
		@ratings = Hash.new

		begin
			@valid_model = Model.get_valid_model(params[:species_id])
			@models = Model.get_hypotheses(params[:species_id])
			
			# If there's a valid model, adds it first to the array.
			if @valid_model
				@models.unshift(@valid_model)
			end

			if user_signed_in?
				@models.each do |m|
	          		@rating = Rating.where(model_id: m.modelID, user_id: current_user.id).first
	          		@ratings[m.modelID] = @rating.blank? ? 0 : @rating.score
	        	end
	        end

			respond_to do |format|
		      format.js
		    end
		rescue => e
			logger.error "#{e.message} #{e.backtrace}"
			err_msg = e.message.tr(?',?").delete("\n")
			render :js => "alertify.alert('Se ha producido un error al consultar las hipótesis. #{err_msg}');"
		end
		
	end

	def metadata
		begin
			@metadata = Model.get_metadata(params[:id])
			@species_name = Species.find_name(@metadata[0]["taxID"])
			@records_number = Species.records_number(@metadata[0]["taxID"])
		rescue => e
			logger.error "#{e.message} #{e.backtrace}"
			err_msg = e.message.tr(?',?").delete("\n")
			render :js => "alertify.alert('Se ha producido un error al obtener los metadatos del modelo.  #{err_msg}');"
		end
	end

	def download_model
	    respond_to do |format|
	      #format.js {}
	      format.html { send_file Rails.root.join("public" + params[:zip_url]), :type => 'application/zip', :disposition => 'attachment' }
	    end
  	end

end