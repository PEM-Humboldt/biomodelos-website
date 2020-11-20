class GeoserverController < ApplicationController
	def wms
		chunk = HTTParty.get("#{GEOSERVER_URI}/wms?#{request.query_string}").body
		send_data(chunk)
	end
end
