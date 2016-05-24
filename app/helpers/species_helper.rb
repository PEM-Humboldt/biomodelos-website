module SpeciesHelper
	def get_species_name
  		Species.uniq.pluck(:sci_name)    
	end
end
