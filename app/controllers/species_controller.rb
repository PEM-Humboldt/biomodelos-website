class SpeciesController < ApplicationController
	include UsersHelper

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

	def search
		begin
			species = Species.search(params)
			if species.blank?
				species = { species: "Not found", taxID: 0 }
			end
			render json: species
		rescue => e
			logger.error "#{e.message} #{e.backtrace}"
			err_msg = e.message.tr(?',?").delete("\n")
	    	render :js => "alert('Ha ocurrido un error en la búsqueda. #{err_msg}');"
	    end
	end

	def set_species
		begin
			@can_edit = false
			if params[:species_id] == "0"
				render :js => "alertify.alert('La especie #{params[:query]} no está disponible.');"
			else
				if user_signed_in?
					@can_edit = can_edit(current_user.id, params[:species_id])
				end
				#TO DO: get species and find if it's empty (id doesn't exist) or not.
				@species_id = params[:species_id]
				@species_name = Species.find_name(params[:species_id])
				@records_number = Species.records_number(params[:species_id])
				respond_to do |format|
	      			format.js
	    		end
			end
	    rescue => e
	    	logger.error "#{e.message} #{e.backtrace}"
			err_msg = e.message.tr(?',?").delete("\n")
	    	render :js => "alertify.alert('Ha ocurrido un error cosultando la especie. #{err_msg}');"
	    end
	end

	def get_species_records
		begin
			records = Species.records(params[:id])
			render json: records
		rescue => e
			logger.error "#{e.message} #{e.backtrace}"
			err_msg = e.message.tr(?',?").delete("\n")
	    	render :js => "alertify.alert('Ha ocurrido consultando los registros. #{err_msg}');"
	    end
	end

	# Sets the statistics info for the species, sorting and filtering the cover's data
    #
	def species_info
		begin
			@approved_model = Model.get_valid_model(params[:species_id])
			@eoo = Model.eoo(params[:species_id])
			@rpa = Model.rpa(params[:species_id])
			@forest_loss = Model.forest_loss(params[:species_id])
			@all_covers = Model.covers(params[:species_id])
			# Sort the covers by value
			@covers = nil
			if !@all_covers.blank?
				@covers =  Hash[@all_covers[0].select{|k, v| v && v!= 0 && k != "modelID"}.sort_by{ |k, v| v }.reverse]
			end

			respond_to do |format|
	      		format.js
	    	end
	    rescue => e
	    	logger.error "#{e.message} #{e.backtrace}"
			err_msg = e.message.tr(?',?").delete("\n")
			render :js => "alertify.alert('Se ha producido un error al consultar las estadísticas. #{err_msg}');"
	    end
	end
end
