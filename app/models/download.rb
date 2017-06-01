class Download < ActiveRecord::Base

	attr_accessor :terminos

	validates :user_id, :presence => true
	validates :model_id, :presence => true
	validates :species_id, :presence => true
	validates :model_use_id, :presence => true
	validates :terminos, presence: true, acceptance: {message: "Debe aceptar los términos y condiciones."} 

	belongs_to :user
	has_one :model_use	
end