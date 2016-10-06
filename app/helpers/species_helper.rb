module SpeciesHelper
	def get_species_name
  		Species.uniq.pluck(:sci_name)    
	end

	def is_integer_num(parameter)
    	!!(parameter =~ /\A[-+]?[0-9]+\z/)
    end

    def model_title_thumb(modelStatus)
    	case modelStatus # a_variable is the variable we want to compare
		when 'Developing'    #compare to 1
		  return 'MODELO EN DESARROLLO'
		when 'Approved'   #compare to 2
		  return 'MODELO VALIDADO BIOMODELOS'
		when 'Published'
		  return 'MODELO PUBLICADO'
		else
		  return "MODELO"
		end	
    end
end
