module ModelsHelper
	# Maps the model method abbreviation to the full name. 
	#
	# @param method [String] Abbreviation of the model method.
	# @return [String] Full name of the model method.
	def map_method_name(method)
		case method 
		when 'mx'
		  return 'Maxent'
		when 'bc'
		  return 'Bioclim'
		when 'ch'
		  return 'Convex Hull'
		else
		  return method
		end	
	end

	# Maps the model level number to the model level name. 
	#
	# @param method [Number] Model's level.
	# @return [String] Name of the model's level.
	def map_level_name(level)
		case level 
		when 1
		  return 'Climático'
		when 2
		  return 'Coberturas'
		else
		  return level
		end	
	end

	# Maps the model status name. 
	#
	# @param method [String] Model status.
	# @return [String] Model status in spanish.
	def map_status_name(status)
		case status 
		when 'pendingValidation'
		  return 'Validación pendiente'
		when 'Valid'
		  return 'Validado'
		when 'Developing'
		  return 'Desarrollo'
		else
		  return status
		end	
	end

	# Sets the full file path for the models, thumbnails and downloadable zip files. 
	#
	# @param method [String] File name.
	# @param method [String] Type of file "model", "thumb" and "zip".
	# @return [String] Full file path.
	def set_path(fileName, fileType)
		case fileType 
		when "model"
		  return "/models/#{fileName}"
		when "thumb"
		  return "/thumbs/#{fileName}"
		when "zip"
		  return "/zip/#{fileName}"  
		else
		  return fileName
		end		
	end

	# Gets the cover full name based on the db name. 
	#
	# @param method [String] DB cover name
	# @return [String] Full cover name if it exists.
	def get_cover_name(value)
		covers = {	"statCoverLC2" => "Tejido urbano continuo",
					"statCoverLC3" => "Tejido urbano discontinuo",
					"statCoverLC4" => "Zonas industriales o comerciales",
					"statCoverLC5" => "Red vial, ferroviaria y terrenos asociados",
					"statCoverLC6" => "Zonas portuarias",
					"statCoverLC7" => "Aeropuertos",
					"statCoverLC8" => "Obras hidraulicas",
					"statCoverLC9" => "Zonas de extraccion minera",
					"statCoverLC10" => "Zona de disposicion de residuos",
					"statCoverLC11" => "Zonas verdes urbanas",
					"statCoverLC12" => "Instalaciones recreativas",
					"statCoverLC13" => "Otros cultivos transitorios",
					"statCoverLC14" => "Cereales",
					"statCoverLC15" => "Oleaginosas y leguminosas",
					"statCoverLC16" => "Hortalizas",
					"statCoverLC17" => "Tuberculos",
					"statCoverLC18" => "Cultivos permanentes herbaceos",
					"statCoverLC19" => "Cultivos permanentes arbustivos",
					"statCoverLC20" => "Cultivos permanentes arboreos",
					"statCoverLC21" => "Cultivos agrdeorestales",
					"statCoverLC22" => "Cultivos confinados",
					"statCoverLC23" => "Pastos limpios",
					"statCoverLC24" => "Pastos arbolados",
					"statCoverLC25" => "Pastos enmalezados",
					"statCoverLC26" => "Mosaico de cultivos",
					"statCoverLC27" => "Mosaico de pastos y cultivos",
					"statCoverLC28" => "Mosaico de cultivos, pastos y espacios naturales",
					"statCoverLC29" => "Mosaico de pastos con espacios naturales",
					"statCoverLC30" => "Mosaico de cultivos con espacios naturales",
					"statCoverLC31" => "Bosque denso",
					"statCoverLC32" => "Bosque abierto",
					"statCoverLC33" => "Bosque fragmentado",
					"statCoverLC34" => "Bosque de galeria y ripario",
					"statCoverLC35" => "Plantacion forestal",
					"statCoverLC36" => "Herbazal",
					"statCoverLC37" => "Arbustal",
					"statCoverLC38" => "Vegetacion secundaria o en transicion",
					"statCoverLC39" => "Zonas arenosas naturales",
					"statCoverLC40" => "Afloramientos rocosos",
					"statCoverLC41" => "Tierras desnudas y degradadas",
					"statCoverLC42" => "Zonas quemadas",
					"statCoverLC43" => "Zonas glaciares y nivales",
					"statCoverLC44" => "Zonas Pantanosas",
					"statCoverLC45" => "Turberas",
					"statCoverLC46" => "Vegetacion acuatica sobre cuerpos de agua",
					"statCoverLC47" => "Pantanos costeros",
					"statCoverLC48" => "Salitral",
					"statCoverLC49" => "Sedimentos expuestos en bajamar",
					"statCoverLC50" => "Rios (50 m)",
					"statCoverLC51" => "Lagunas, lagos y cienagas naturales",
					"statCoverLC52" => "Canales",
					"statCoverLC53" => "Cuerpos de agua artificiales",
					"statCoverLC54" => "Lagunas costeras",
					"statCoverLC55" => "Mares y oceanos"
         }

         if covers[value]
         	return covers[value]
         else
         	return value
         end
	end
end