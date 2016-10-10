class Rating < ActiveRecord::Base

	belongs_to :users

	def self.rating_exists(options)
		exists?(model_id: options[:model_id], user_id: options[:user_id])
	end

end
