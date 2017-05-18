class ModelsController < ApplicationController
	include UsersHelper
		
	# Sets the initial model to be loaded and the pop-up content based on:
	# 1. There's only a valid model.
	# 2. There's a valid model and one or more hypotheses waiting for approval
    # 3. There's no valid model and just one hypothesis waiting for approval
    # 4. There are multiple hypotheses waiting for approval and no valid model
    # 5. There is no valid model, no hypotheses and just the BioModelos continuous model
    # 6. There is no distribution model for the species yet.
    #
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
				@init_model = Model.get_best_hypothesis(@hypotheses)
				@popup_content = "Esta es una de las hipótesis de distribución disponibles pendientes de aprobación por expertos. Consulta la pestaña 'Hipótesis de distribución' para visualizar otras hipótesis de distribución pendientes de aprobación disponibles para esta especie."
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
	# each one in case the user is signed in and can edit.
	#    
	def get_hypotheses
		@ratings = Hash.new

		begin
			@valid_model = Model.get_valid_model(params[:species_id])
			@models = Model.get_hypotheses(params[:species_id])
			@can_edit = false

			
			# If there's a valid model, adds it first to the array.
			if @valid_model
				@models.unshift(@valid_model)
			end
			# If the user is signed in and can edit the species, it gets and sets the user ratings for each model.
			if user_signed_in?
				@can_edit = can_edit(current_user.id, params[:species_id])
				if @can_edit
					@models.each do |m|
		          		@rating = Rating.where(model_id: m.modelID, user_id: current_user.id).first
		          		@ratings[m.modelID] = @rating.blank? ? 0 : @rating.score
		        	end
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

	# Sets the metadata information for a model, along with the species name and number of records
	# 
	def metadata
		begin
			@metadata = Model.get_metadata(params[:id])
			@species_name = Species.find_name(@metadata[0]["taxID"])
			@records_number = Species.records_number(@metadata[0]["taxID"])
		rescue => e
			logger.error "#{e.message} #{e.backtrace}"
			err_msg = e.message.tr(?',?").delete("\n")
			redirect_to species_visor_path, notice: 'Se ha producido un error al obtener los metadatos del modelo.'
		end
	end

	def download_model
	    respond_to do |format|
	      format.js{}
	      format.html { send_file Rails.root.join("public" + params[:zip_url]), :type => 'application/zip', :disposition => 'attachment' }
	    end
  	end
end