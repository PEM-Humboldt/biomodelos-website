class Species
	include HTTParty
  	format :json
  	#base_uri 'http://192.168.205.197:3000/BioModelos'
  	base_uri '192.168.11.81:3000/BioModelos/species'
	# has_many :tasks

	# def self.search(options)
	# 	if options[:query]
 	#      		where("sci_name like ?", "%#{options[:query]}%").limit(10)
 	#    	end
	# end

	def initialize

	end

	def self.find_name(taxID)
		JSON.parse(get('/' + taxID).body)[0]["species"]
	end

	def self.records_number(taxID)
		JSON.parse(get('/' + taxID).body)[0]["total"]
	end


end