class DownloadsController < ApplicationController
    def download
      file_path = Rails.root.join('public/atlas_files', request.parameters["filename"] + "." + request.parameters["format"])
      if File.exist?(file_path)
        send_file file_path, type: "application/pdf", disposition: "attachment"
        FilesDownload.create(file: request.parameters["filename"], path: request.original_fullpath, ip: request.remote_ip)
      else
        flash[:error] = "El archivo no existe."
        redirect_to info_index_url
      end
    end
    
    def generate_report
      @data = FilesDownload.all
  
      csv_string = CSV.generate do |csv|
        csv << ["ID", "File", "IP", "Created At", "Updated At"]
        @data.each do |record|
          csv << [record.id, record.file, record.ip, record.created_at, record.updated_at]
        end
      end
  
      send_data csv_string, filename: "files_download_report_#{Date.today}.csv"
    end
  
  end
  