class GeoserverController < ApplicationController
	def wms
		chunk = HTTParty.get("#{GEOSERVER_URI}/wms?#{request.query_string}").body
		send_data(chunk)
	end

	def thumb
		query_opts = {
			"service" => "WMS",
			"version" => "1.1.0",
			"request" => "GetMap",
			"layers" => "Base:alt,Base:geo_contries,#{params[:layer]}",
			"bbox" => "-80.58333,-4.30833,-66.76666,12.63334",
			"width" => "179",
			"height" => "220",
			"srs" => "EPSG:4326",
			"format" => "image/png",
			"styles" => "alt,polygon,#{params[:styles]}"
		}
		chunk = HTTParty.get("#{GEOSERVER_URI}/wms?#{URI.encode_www_form(query_opts)}").body
		send_data(chunk)
	end

	def continuous_thumb
		query_opts = {
			"service" => "WMS",
			"version" => "1.1.0",
			"request" => "GetMap",
			"layers" => "#{params[:layer]},Base:geo_contries",
			"bbox" => "-80.58333,-4.30833,-66.76666,12.63334",
			"width" => "179",
			"height" => "220",
			"srs" => "EPSG:4326",
			"format" => "image/png",
			"styles" => "#{params[:styles]},polygon"
		}
		chunk = HTTParty.get("#{GEOSERVER_URI}/wms?#{URI.encode_www_form(query_opts)}").body
		send_data(chunk)
	end

	def zip
		query_opts = {
			"service" => "CSW",
			"version" => "1.1.0",
			"request" => "DirectDownload",
			"resourceId" => params[:resource]
		}
		chunk = HTTParty.get("#{GEOSERVER_URI}/wms?#{URI.encode_www_form(query_opts)}").body
		send_data chunk, :filename => "#{params[:model_id]}.zip"
	end
end
