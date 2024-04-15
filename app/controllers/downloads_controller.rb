# app/controllers/downloads_controller.rb
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
  end
  