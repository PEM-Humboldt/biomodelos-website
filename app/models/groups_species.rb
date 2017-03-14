class GroupsSpecies < ActiveRecord::Base
	belongs_to :group

	#Avoids undefined method '_path' error due to plural name
	model_name.instance_variable_set(:@route_key, 'groups_species')
end