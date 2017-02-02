class RecordsController < ApplicationController

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