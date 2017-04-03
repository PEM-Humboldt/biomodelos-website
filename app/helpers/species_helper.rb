module SpeciesHelper
	def get_species_name
  		Species.uniq.pluck(:sci_name)    
	end

	def is_integer_num(parameter)
    	!!(parameter =~ /\A[-+]?[0-9]+\z/)
    end

    def model_title_thumb(modelStatus)
    	case modelStatus 
		when 'pendingValidation'
		  return 'HIPÓTESIS'
		when 'Valid'
		  return 'MODELO VALIDADO'
		else
		  return "MODELO"
		end	
    end
end
