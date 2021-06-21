class RecordsController < ApplicationController
	include UsersHelper

	def show
		@record = Record.find(params[:id])
		@record["id"] = params[:id]
		respond_to do |format|
      		format.js
    	end
	end

	def new_form
		@record = {
      "lat" => params[:lat],
      "lon" => params[:lon],
      "tax" => params[:tax],
      "user" => params[:user],
      "spName" => params[:spName]
    }
		respond_to do |format|
			format.js
		end
	end

  def new_record
    new_record = new_record_params()
    unless new_record[:date].empty?
      mydate = Date.parse(new_record[:date])
      new_record[:year] = mydate.year
      new_record[:month] = mydate.month
      new_record[:day] = mydate.day
      new_record.delete(:date)
    end
    @alerts_to_show = []
    begin
      Record.new_record(new_record)
      @alerts_to_show.push({
        "message" => t('biomodelos.records.success_new_record'),
        "type" => 'notice'
      })
    rescue => myError
      @alerts_to_show.push({
        "message" => t('biomodelos.records.error_new_record'),
        "type" => 'error'
      })
    end
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
    @alerts_to_show = []
    begin
		  Record.update_record(params)
      @alerts_to_show.push({
        "message" => t("biomodelos.records.edit.success_notice"),
        "type" => "notice"
      })
    rescue => myError
      @alerts_to_show.push({
        "message" => t('biomodelos.records.edit.error_notice'),
        "type" => 'error'
      })
    end
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
    @alerts_to_show = []
    begin
      Record.report_record(params)
      @alerts_to_show.push({
        "message" => t("biomodelos.records.report.success_notice"),
        "type" => "notice"
      })
    rescue => myError
      @alerts_to_show.push({
        "message" => t('biomodelos.records.report.error_notice'),
        "type" => 'error'
      })
    end
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

  def new_record_params
    params[:new_record]
      .permit([
        :decimalLatitude, :decimalLongitude, :verbatimLocality, :acceptedNameUsage, :userIdBm,
        :taxID, :verbatimElevation, :date, :stateProvince, :county, :basisOfRecord, :recordedBy,
        :createdCitationBm, :catalogNumber, :collectionCode, :institutionCode, :createdCommentsBm
      ]).to_h
  end

end
