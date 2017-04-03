class Record
	include HTTParty
  	format :json
  	base_uri BASE_URI + '/records'		

	def self.report_record(data)
		JSON.parse(post('/' + data[:recordId], :body => data).body)
	end

	def self.new_record(data)
		puts data
		JSON.parse(post('', :body => data).body)
	end

	def self.update_record(data)
		JSON.parse(put('/' + data[:recordId], :body => data).body)
	end

end