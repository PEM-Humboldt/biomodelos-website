class Species < ActiveRecord::Base

	def self.search(options)
		if options[:query]
      		where("sci_name like ?", "%#{options[:query]}%").limit(10)
    	end
	end

end