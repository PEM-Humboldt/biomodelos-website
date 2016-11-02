class Record
	include HTTParty
  	format :json
  	base_uri BASE_URI + '/records'

  	def self.find(taxID)
		JSON.parse(get('/' + taxID.to_s).body)
	end
end