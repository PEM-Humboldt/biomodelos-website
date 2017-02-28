class Threshold
	include HTTParty
  	format :json
  	base_uri BASE_URI + '/models'

  	attr_accessor :modelID, :pngUrl, :zipUrl, :thumbUrl, :threshold

  	def initialize(modelID, pngUrl, zipUrl, thumbUrl, threshold)
  		self.modelID = modelID
	    self.pngUrl = pngUrl
	    self.zipUrl = zipUrl
	    self.thumbUrl = thumbUrl
	    self.threshold = threshold
  	end

    # Gets a species model thresholds developed by BioModelos via API.  
    #
    # @param species_id [Number] ID of the species.
    # @return [Array] Array with the Threshold objects.
  	def self.get_thresholds(species_id)
  		response = JSON.parse(get('/' + species_id + '?tipo=Thresholds').body)
		  thresholds_array = []
  		response.each do |threshold|
  			t = Threshold.new(threshold["modelID"], threshold["pngPath"], threshold["zipPath"], threshold["thumbPath"], threshold["thresholdType"])
  			thresholds_array.push(t)
		  end
		  return thresholds_array
  	end
end