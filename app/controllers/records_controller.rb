class RecordsController < ApplicationController
	include UsersHelper

	def edit_record
		@can_edit = can_edit(current_user.id, params[:species_id])
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

end