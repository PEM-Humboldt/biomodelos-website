class Rating < ApplicationRecord

	belongs_to :users

	def self.rating_exists(options)
		exists?(model_id: options[:model_id], user_id: options[:user_id])
	end

	# Gets the average rating of a model rounded to 2 decimals. 
    #
    # @param model_id [Number] ID of the model.
	def self.average_rating(model_id)
		where("model_id = ? AND score > 0", "#{model_id}").count == 0 ? 0.0 : where("model_id = ?", "#{model_id}").sum(:score).fdiv(where("model_id = ? AND score > 0", "#{model_id}").count).round(2)
	end

	def self.rating_number(model_id)
		where("model_id = ? AND score > 0", "#{model_id}").count
	end

end
