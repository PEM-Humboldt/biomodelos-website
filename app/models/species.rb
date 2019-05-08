class Species
	include HTTParty
  	format :json
  	base_uri BASE_URI + '/species'
	# has_many :tasks

	def self.find_name(taxID)
   		res = JSON.parse(get('/' + taxID.to_s).body)
   		if !res.blank?
   			res = res[0]["acceptedNameUsage"]
   		else
   			res = ""
   		end
   		return res
	end

	def self.find_names(taxIDList)
		res = JSON.parse(get('?speciesIn=' + taxIDList.join(',')).body)
		return res
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

	def self.group_records(taxID)
		JSON.parse(get('/records/group/' + taxID.to_s).body)
	end

	def self.filter(params)
		url = "?"
		if params[:bmclasses]
			params[:bmclasses].each do |bm_class|
				url += "&bmClass=" + bm_class
			end
		end
		if params[:categories]
			params[:categories].each do |category|
				if(category == 'Endemic')
					url += "&endemic=true"
				end
				if(category == 'Invasive')
					url += "&invasive=true"
				end
				if(category == 'Endangered')
					url += "&endangered=true"
				end
				if(category == 'Valid')
					url += "&modelStatus=Valid"
				end
			end
		end
		JSON.parse(get(URI.escape(url)).body)
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
