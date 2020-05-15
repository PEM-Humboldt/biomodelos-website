class Record
	include HTTParty
  	format :json
  	base_uri BASE_URI + '/records'
    headers 'authorization' => "apiKey #{ENV['GATEWAY_API_KEY']}"
    headers 'host' => 'api.biomodelos.humboldt.org'

  	def self.find(record_id)
		JSON.parse(get('/' + record_id.to_s).body)
	end

	def self.report_record(data)
		JSON.parse(post('/' + data[:recordId], :body => data).body)
	end

	def self.new_record(data)
		JSON.parse(post('', :body => data).body)
	end

	def self.update_record(data)
		JSON.parse(put('/' + data[:recordId], :body => data).body)
	end

	def self.records_institutions(taxID)
		JSON.parse(get('/metadata/institutions/' + taxID.to_s).body)
	end

	def self.records_collectors(taxID)
		JSON.parse(get('/metadata/collectors/' + taxID.to_s).body)
	end

	def self.records_sources(taxID)
		JSON.parse(get('/metadata/sources/' + taxID.to_s).body)
	end

	def self.records_collaborators(taxID)
		JSON.parse(get('/metadata/collaborators/' + taxID.to_s).body)
	end

	def self.records_collections(taxID)
		JSON.parse(get('/metadata/collection/' + taxID.to_s).body)
	end

	def self.records_latest_date(taxID)
		JSON.parse(get('/metadata/latest_date/' + taxID.to_s).body)
	end

end
