class Species
	include HTTParty
  	format :json
  	base_uri BASE_URI + '/species'
	# has_many :tasks

	def self.find_name(taxID)
   		JSON.parse(get('/' + taxID.to_s).body)[0]["acceptedNameUsage"]	
	end

	def self.records_number(taxID)
		JSON.parse(get('/' + taxID.to_s).body)[0]["totalRecords"]
	end

	def self.info(taxID)
		JSON.parse(get('/' + taxID.to_s).body)
	end

	def self.records(taxID)
		JSON.parse(get('/records/' + taxID.to_s).body)
	end

	def self.search(params)
		url = "/search"
		if params[:query]
			url += "/" + params[:query] + "?"
		end
		if params[:bmClass1]
			url += "&bmClass1=" + params[:bmClass1]
		end
		if params[:bmClass2]
			url += "&bmClass2=" + params[:bmClass2]
		end
		if params[:bmClass3]
			url += "&bmClass3=" + params[:bmClass3]
		end
		if params[:bmClass4]
			url += "&bmClass4=" + params[:bmClass4]
		end
		if params[:bmClass5]
			url += "&bmClass5=" + params[:bmClass5]
		end
		if params[:bmClass6]
			url += "&bmClass6=" + params[:bmClass6]
		end
		if params[:bmClass7]
			url += "&bmClass7=" + params[:bmClass7]
		end
		if params[:endemic]
			url += "&endemic=" + params[:endemic]
		end
		if params[:invasive]
			url += "&invasive=" + params[:invasive]
		end
		if params[:endangered]
			url += "&endangered=" + params[:endangered]
		end

		JSON.parse(get(URI.escape(url)).body)
	end
end