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

	def search
		begin
			species = Species.search(params)
			render json: species
		rescue => e
			logger.error "#{e.message} #{e.backtrace}"
			err_msg = e.message.tr(?',?").delete("\n")
	    	render :js => "alert('Ha ocurrido un error en la búsqueda. #{err_msg}');"
	    end
	end

	def set_species
		begin
			@species_id = params[:species_id]
			@species_name = Species.find_name(params[:species_id])
			@records_number = Species.records_number(params[:species_id])
			respond_to do |format|
	      		format.js
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

	def species_info
		begin
			@approved_model = Model.get_approved_models(params[:species_id])
			@eoo = Model.eoo(params[:species_id])
			@rpa = Model.rpa(params[:species_id])
			@forest_loss = Model.forest_loss(params[:species_id])
			@covers = Model.covers(params[:species_id])

			respond_to do |format|
	      		format.js
	    	end
	    rescue => e
	    	render :js => "alertify.alert('Ha ocurrido un error en la conexión con la base de datos' + #{e.message} + ' ' + #{e.backtrace});"
	    end
	end

	def records_metadata
		begin
			# @metadata = .get_metadata(params[:id])
			# @species_name = Species.find_name(@metadata[0]["taxID"])
			# @records_number = Species.records_number(@metadata[0]["taxID"])
		rescue => e
			render :js => "alertify.alert('Se ha producido un error al obtener los metadatos del modelo.  #{e.message} + #{e.backtrace}');"
		end	
	end

end
