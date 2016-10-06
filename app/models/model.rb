class Model
	include HTTParty
  	format :json
  	#base_uri '192.168.11.81:3000/BioModelos'
    base_uri '192.168.205.197:3000/BioModelos'

  	attr_accessor :modelID, :modelStatus, :pngUrl, :tifUrl, :thumbUrl, :threshold

  	def initialize(modelID, modelStatus, pngUrl, tifUrl, thumbUrl, threshold)
  		self.modelID = modelID
      self.modelStatus = modelStatus
	    self.pngUrl = pngUrl
	    self.tifUrl = tifUrl
	    self.thumbUrl = thumbUrl
	    self.threshold = threshold
  	end

  	def self.get_models(species_id)
  		response = JSON.parse(get('/models/' + species_id).body)
  		models_array = []
    		response.each do |threshold|
    			t = Model.new(threshold["Modelo"], threshold["ModelStatus"], threshold["Ruta_Mapa"], threshold["Ruta_Tif"], threshold["Ruta_Miniatura"], threshold["Umbral"])
    			models_array.push(t)
  		end

		  return models_array
  	end
end