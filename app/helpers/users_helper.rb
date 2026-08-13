module UsersHelper
  # Checks if certain user can edit a species record or model. The user must be
  # an active member of a group and the species must belong to that group.
  #
  # @param user_id [Number] ID of the current user.
  # @param species_id [Number] ID of the current species.
  # @return [Boolean] TRUE if it meets the condition, FALSE otherwise.
  def can_edit(user_id, species_id)
    species_groups_array = GroupsSpecies.where(species_id: species_id).map { |t| [t.group_id] }.uniq
    user_species_groups = GroupsUser.where( 
      user_id: user_id, 
      group_id: species_groups_array.flatten, 
      groups_users_state_id: 1)
    user_species_groups.size.positive? || false
  end

  def user_avatar_tag(user, version:, html_options: {})
    uploader = user.avatarURL
    url = uploader.url(version).to_s
    if url == uploader.default_url.to_s
      classes = ['icon', 'icon-avatar-placeholder', html_options[:class]].compact.join(' ')
      inline_svg_tag('icons/noperfil.svg', html_options.merge(class: classes, aria_hidden: true))
    else
      image_tag(url, html_options)
    end
  end
end
