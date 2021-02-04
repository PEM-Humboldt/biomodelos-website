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
	    	render :js => "alertify.alert('Ha ocurrido un error en la búsqueda. #{err_msg}');"
	    end
	end

	def filter
		begin
			@species = Species.filter(params)
			respond_to do |format|
	      		format.js
	    	end
		rescue => e
			logger.error "#{e.message} #{e.backtrace}"
			err_msg = e.message.tr(?',?").delete("\n")
	    	render :js => "alertify.alert('Ha ocurrido un error en la búsqueda. #{err_msg}');"
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
				@records_number = Model.valid_records_number(params[:species_id])
				@approved_model = Model.get_valid_model(params[:species_id])
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
			if !params[:inGroup].blank? && params[:inGroup]
				records = Species.group_records(params[:id])
			else
				records = Species.records(params[:id])
			end
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
			@eoo = Model.eoo(params[:species_id])
			@rpa = Model.rpa(params[:species_id])
			@forest_loss = Model.forest_loss(params[:species_id])
			@forest_loss["years"] = []
			@forest_loss["values"] = []
			@forest_loss.keys.sort!.select do |key|
				matches = key.match(/statForestLoss([0-9]+)$/)
				unless matches.nil?
					if (matches[1].to_i >= 90)
						@forest_loss["years"].unshift("19#{matches[1]}")
						@forest_loss["values"].unshift(@forest_loss[key])
					else
						@forest_loss["years"].push("20#{matches[1]}")
						@forest_loss["values"].push(@forest_loss[key])
					end
				end
			end
			@forest_loss["years"] = @forest_loss["years"].to_json.html_safe
			@forest_loss["values"] = @forest_loss["values"].to_json.html_safe
			@all_covers = Model.covers(params[:species_id])
			# Sort the covers by value
			@covers = nil
			if !@all_covers.blank?
				@covers =  Hash[@all_covers.select{|k, v| v && v!= 0 && k != "modelID" && k!= "modelLevel"}.sort_by{ |k, v| v }.reverse]
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
