class Threshold
	include HTTParty
  	format :json
  	#base_uri '192.168.11.81:3000/BioModelos'
  	base_uri '192.168.205.197:3000/BioModelos'

  	attr_accessor :modelID, :pngUrl, :tifUrl, :thumbUrl, :threshold

  	def initialize(modelID, pngUrl, tifUrl, thumbUrl, threshold)
  		self.modelID = modelID
	    self.pngUrl = pngUrl
	    self.tifUrl = tifUrl
	    self.thumbUrl = thumbUrl
	    self.threshold = threshold
  	end

  	def self.get_thresholds(species_id)
  		response = JSON.parse(get('/models/threshold/' + species_id).body)
		thresholds_array = []
  		response.each do |threshold|
  			t = Threshold.new(threshold["Modelo"], threshold["Ruta_Mapa"], threshold["Ruta_Tif"], threshold["Ruta_Miniatura"], threshold["Umbral"])
  			thresholds_array.push(t)
		end

		return thresholds_array
  	end
end