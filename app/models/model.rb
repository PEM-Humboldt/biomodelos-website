class Model
	include HTTParty
  	format :json
  	base_uri BASE_URI + '/models'

  	attr_accessor :modelID, :modelStatus, :pngUrl, :tifUrl, :thumbUrl, :threshold

  	def initialize(modelID, modelStatus, pngUrl, tifUrl, thumbUrl, threshold)
  		self.modelID = modelID
      self.modelStatus = modelStatus
	    self.pngUrl = pngUrl
	    self.tifUrl = tifUrl
	    self.thumbUrl = thumbUrl
	    self.threshold = threshold
  	end

  	def self.get_approved_models(species_id)
  		response = JSON.parse(get('/' + species_id).body)
  		models_array = []
    		response.each do |threshold|
          if threshold["ModelStatus"] == "approved"
    			 t = Model.new(threshold["Modelo"], threshold["ModelStatus"], threshold["Ruta_Mapa"], threshold["Ruta_Tif"], threshold["Ruta_Miniatura"], threshold["Umbral"])
    			 models_array.push(t)
          end
  		  end

		  return models_array
  	end

    def self.get_continous_model(species_id)
      response = JSON.parse(get('/' + species_id).body)
      continuous_model = nil
        response.each do |threshold|
          if threshold["Umbral"] == "Continuous"
            continuous_model = Model.new(threshold["Modelo"], threshold["ModelStatus"], threshold["Ruta_Mapa"], threshold["Ruta_Tif"], threshold["Ruta_Miniatura"], threshold["Umbral"])
          end
        end

      return continuous_model
    end

    def self.eoo(species_id)
      JSON.parse(get('/approved/eoo/' + species_id).body)
    end

    def self.rpa(species_id)
      JSON.parse(get('/approved/rpa/' + species_id).body)
    end

    def self.forest_loss(species_id)
      JSON.parse(get('/approved/forest_loss/' + species_id).body)
    end

    def self.covers(species_id)
      JSON.parse(get('/approved/covers/' + species_id).body)
    end

    def self.get_metadata(model_id)
      JSON.parse(get('/metadata/' + model_id.to_s).body)
    end

end