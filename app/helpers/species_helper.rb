module SpeciesHelper
	def get_species_name
  		Species.uniq.pluck(:sci_name)    
	end

	def is_integer_num(parameter)
    	!!(parameter =~ /\A[-+]?[0-9]+\z/)
    end

    def model_title_thumb(modelStatus, published)
    	if modelStatus == 'pendingValidation' && published
    		return 'PUBLICADO POR VALIDAR'
    	elsif modelStatus == 'pendingValidation' && !published
    		return 'POR VALIDAR'
    	elsif modelStatus == 'Valid' && published
    		return 'PUBLICADO VALIDADO'
    	elsif modelStatus == 'Valid' && !published
    		return 'VALIDADO'
		end	
    end
end
