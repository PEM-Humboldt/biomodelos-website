class Species
	include HTTParty
  	format :json
  	base_uri 'http://192.168.205.197:3000/BioModelos'
  	#base_uri '192.168.205.197:3000/BioModelos'
	# has_many :tasks

	# def self.search(options)
	# 	if options[:query]
 	#      		where("sci_name like ?", "%#{options[:query]}%").limit(10)
 	#    	end
	# end

	def initialize

	end

	def self.find_name(taxID)
		JSON.parse(get('/species/' + taxID).body)[0]["_id"]["characteristics"]["species"]
	end
end