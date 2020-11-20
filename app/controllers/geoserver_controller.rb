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
end
