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
		  return I18n.t('biomodelos.visor.models.level_1')
		when 2
		  return I18n.t('biomodelos.visor.models.level_2')
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
		  return I18n.t('biomodelos.visor.models.pending_validation')
		when 'Valid'
		  return I18n.t('biomodelos.visor.models.valid')
		when 'Developing'
		  return I18n.t('biomodelos.visor.models.developing')
		else
		  return status
		end
	end

	# Sets the full file path for the models, thumbnails and downloadable zip files.
	#
	# @param fileName [String] File name.
	# @param fileType [String] Type of file "model", "thumb" and "zip".
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

	# Constructs a hash with options required to load a model from geoserver
	#
	# @param model [Model] Model object.
	# @return [Hash] Hash with options for the model to be loaded
	def gs_options(model)
		return {
			"type" => "wmsLayer",
			"layer" => model.gsLayer,
			"styles" => model.level == 2 ? "level2" : "binario"
		}
	end

	# Create json object with options to load a model layer
	#
	# @param model [Model] Model object.
	# @return [String] json object
	def model_layer(model)
		if model.gsLayer.nil?
			return {
				"type" => "file",
				"fileName" => set_path(model.pngUrl, "model")
			}.to_json
		else
			model_options = gs_options model
			model_options["wmsUrl"] = "/geoserver/wms"
			return model_options.to_json
		end
	end

	# Create url to load model thumbnail
	#
	# @param model [Model] Model object.
	# @return [String] url to the thumbnail image
	def model_thumb(model)
		if model.gsLayer.nil?
			return set_path(model.thumbUrl, "thumb")
		else
			model_options = gs_options model
			return "/geoserver/thumb?layer=#{model_options["layer"]}&styles=#{model_options["styles"]}"
		end
	end

	# Create model download url
	#
	# @param model [Model] Model object.
	# @return [String] url for download
	def model_zip(model)
		if model.gsLayer.nil?
			return {
				"type" => "file",
				"fileName" => set_path(model.zipUrl, "zip")
			}.to_json
		else
			model_options = gs_options model
			model_options["wmsUrl"] = "/geoserver/zip"
			return model_options.to_json
		end
	end

	# Gets the cover full name based on the db name.
	#
	# @param method [String] DB cover name
	# @return [String] Full cover name if it exists.
	def get_cover_name(value)
		covers = {	"statCoverLC2" => I18n.t('biomodelos.visor.covers.cover_111'),
					"statCoverLC3" => I18n.t('biomodelos.visor.covers.cover_112'),
					"statCoverLC4" => I18n.t('biomodelos.visor.covers.cover_121'),
					"statCoverLC5" => I18n.t('biomodelos.visor.covers.cover_122'),
					"statCoverLC6" => I18n.t('biomodelos.visor.covers.cover_123'),
					"statCoverLC7" => I18n.t('biomodelos.visor.covers.cover_124'),
					"statCoverLC8" => I18n.t('biomodelos.visor.covers.cover_125'),
					"statCoverLC9" => I18n.t('biomodelos.visor.covers.cover_131'),
					"statCoverLC10" => I18n.t('biomodelos.visor.covers.cover_132'),
					"statCoverLC11" => I18n.t('biomodelos.visor.covers.cover_141'),
					"statCoverLC12" => I18n.t('biomodelos.visor.covers.cover_142'),
					"statCoverLC13" => I18n.t('biomodelos.visor.covers.cover_211'),
					"statCoverLC14" => I18n.t('biomodelos.visor.covers.cover_212'),
					"statCoverLC15" => I18n.t('biomodelos.visor.covers.cover_213'),
					"statCoverLC16" => I18n.t('biomodelos.visor.covers.cover_214'),
					"statCoverLC17" => I18n.t('biomodelos.visor.covers.cover_215'),
					"statCoverLC18" => I18n.t('biomodelos.visor.covers.cover_221'),
					"statCoverLC19" => I18n.t('biomodelos.visor.covers.cover_222'),
					"statCoverLC20" => I18n.t('biomodelos.visor.covers.cover_223'),
					"statCoverLC21" => I18n.t('biomodelos.visor.covers.cover_224'),
					"statCoverLC22" => I18n.t('biomodelos.visor.covers.cover_225'),
					"statCoverLC23" => I18n.t('biomodelos.visor.covers.cover_231'),
					"statCoverLC24" => I18n.t('biomodelos.visor.covers.cover_232'),
					"statCoverLC25" => I18n.t('biomodelos.visor.covers.cover_233'),
					"statCoverLC26" => I18n.t('biomodelos.visor.covers.cover_241'),
					"statCoverLC27" => I18n.t('biomodelos.visor.covers.cover_242'),
					"statCoverLC28" => I18n.t('biomodelos.visor.covers.cover_243'),
					"statCoverLC29" => I18n.t('biomodelos.visor.covers.cover_244'),
					"statCoverLC30" => I18n.t('biomodelos.visor.covers.cover_245'),
					"statCoverLC31" => I18n.t('biomodelos.visor.covers.cover_311'),
					"statCoverLC32" => I18n.t('biomodelos.visor.covers.cover_312'),
					"statCoverLC33" => I18n.t('biomodelos.visor.covers.cover_313'),
					"statCoverLC34" => I18n.t('biomodelos.visor.covers.cover_314'),
					"statCoverLC35" => I18n.t('biomodelos.visor.covers.cover_315'),
					"statCoverLC36" => I18n.t('biomodelos.visor.covers.cover_321'),
					"statCoverLC37" => I18n.t('biomodelos.visor.covers.cover_322'),
					"statCoverLC38" => I18n.t('biomodelos.visor.covers.cover_323'),
					"statCoverLC39" => I18n.t('biomodelos.visor.covers.cover_331'),
					"statCoverLC40" => I18n.t('biomodelos.visor.covers.cover_332'),
					"statCoverLC41" => I18n.t('biomodelos.visor.covers.cover_333'),
					"statCoverLC42" => I18n.t('biomodelos.visor.covers.cover_334'),
					"statCoverLC43" => I18n.t('biomodelos.visor.covers.cover_335'),
					"statCoverLC44" => I18n.t('biomodelos.visor.covers.cover_411'),
					"statCoverLC45" => I18n.t('biomodelos.visor.covers.cover_412'),
					"statCoverLC46" => I18n.t('biomodelos.visor.covers.cover_413'),
					"statCoverLC47" => I18n.t('biomodelos.visor.covers.cover_421'),
					"statCoverLC48" => I18n.t('biomodelos.visor.covers.cover_422'),
					"statCoverLC49" => I18n.t('biomodelos.visor.covers.cover_423'),
					"statCoverLC50" => I18n.t('biomodelos.visor.covers.cover_511'),
					"statCoverLC51" => I18n.t('biomodelos.visor.covers.cover_512'),
					"statCoverLC52" => I18n.t('biomodelos.visor.covers.cover_513'),
					"statCoverLC53" => I18n.t('biomodelos.visor.covers.cover_514'),
					"statCoverLC54" => I18n.t('biomodelos.visor.covers.cover_521'),
					"statCoverLC55" => I18n.t('biomodelos.visor.covers.cover_522')
         }

         if covers[value]
         	return covers[value]
         else
         	return value
         end
	end
end
