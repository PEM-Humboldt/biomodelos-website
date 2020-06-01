class RecordsController < ApplicationController
	include UsersHelper

	def show
		@record = Record.find(params[:id])
		@record["id"] = params[:id]
		respond_to do |format|
      		format.js
    	end
	end

	def edit_record
		@can_edit = false
		if user_signed_in?
			@can_edit = can_edit(current_user.id, params[:species_id])
		end
		respond_to do |format|
      		format.json { render :json => @can_edit }
    	end
	end

	def update_record
		Record.update_record(params)
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

	def new_report
		Record.report_record(params)
		respond_to do |format|
      		format.js
    	end
	end

	def new_record
		Record.new_record(params)
		respond_to do |format|
      		format.js
    	end
	end

	def records_metadata
		begin
			@institutions = Record.records_institutions(params[:id])
			@collectors = Record.records_collectors(params[:id])
			@sources = Record.records_sources(params[:id])
			@collaborators = Record.records_collaborators(params[:id])
			@latest_date = Record.records_latest_date(params[:id])["maxDate"]
			@species_name = Species.find_name(params[:id])
			@records_number = Species.records_number(params[:id])
			@collections = Record.records_collections(params[:id])
	    rescue => e
	    	logger.error "#{e.message} #{e.backtrace}"
			err_msg = e.message.tr(?',?").delete("\n")
			redirect_to root_path, :flash => { :error => "Error intentando obtener los metadatos de registro: #{err_msg}" }
	    end
	end

end
