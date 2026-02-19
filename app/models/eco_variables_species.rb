class EcoVariablesSpecies < ApplicationRecord
	def species_name
    Species.find_name(species_id)
  end
end