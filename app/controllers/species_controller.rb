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
		begin
			@species_name = Species.find_name(params[:species_id])
			@records_number = Species.records_number(params[:species_id])
			respond_to do |format|
	      		format.js
	    	end
	    rescue => e
	    	render :js => "alertify.alert('Ha ocurrido un error en la conexión con la base de datos');"
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

	def send_record_report
		respond_to do |format|
      		format.js
    	end
	end

	def new_record
		respond_to do |format|
      		format.js
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
		
	end

end
