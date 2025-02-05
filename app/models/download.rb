class Download < ApplicationRecord

	attr_accessor :terminos

	validates :user_id, :presence => true
	validates :model_id, :presence => true
	validates :species_id, :presence => true
	validates :model_use_id, :presence => true
	validates :terminos, presence: true, acceptance: {message: "Debe aceptar los términos y condiciones."} 

	belongs_to :user
	belongs_to :species
	has_one :model_use

	# Gets the average rating of a model rounded to 2 decimals. 
    #
    # @param model_id [Number] ID of the model.
	def self.downloads(model_id)
		where("model_id = ?", "#{model_id}").count
	end	
end