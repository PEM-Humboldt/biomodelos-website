module UsersHelper
	# Checks if certain user can edit a species record or model. The user must be 
	# an active member of a group and the species must belong to that group. 
	#
	# @param user_id [Number] ID of the current user.
	# @param species_id [Number] ID of the current species.
	# @return [Boolean] TRUE if it meets the condition, FALSE otherwise.	
  	def can_edit(user_id, species_id)
	  	species_groups_array = GroupsSpecies.where(species_id: species_id).map{|t| [t.group_id]}.uniq
	    user_species_groups = GroupsUser.where(user_id: user_id, group_id: species_groups_array.flatten, groups_users_state_id: 1)
	    return user_species_groups.size > 0 ? true : false
  	end

end
