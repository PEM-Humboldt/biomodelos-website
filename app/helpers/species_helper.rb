module SpeciesHelper
	def get_species_name
  		Species.uniq.pluck(:sci_name)    
	end

	def is_integer_num(parameter)
    	!!(parameter =~ /\A[-+]?[0-9]+\z/)
    end

    def model_title_thumb(modelStatus, published)
    	if modelStatus == 'pendingValidation' && published
    		return I18n.t('biomodelos.visor.hypotheses.pending_and_published_thumb')
    	elsif modelStatus == 'pendingValidation' && !published
    		return I18n.t('biomodelos.visor.hypotheses.pending_thumb')
    	elsif modelStatus == 'Valid' && published
    		return I18n.t('biomodelos.visor.hypotheses.valid_published_thumb')
    	elsif modelStatus == 'Valid' && !published
    		return I18n.t('biomodelos.visor.hypotheses.valid_thumb')
		end	
    end
end
