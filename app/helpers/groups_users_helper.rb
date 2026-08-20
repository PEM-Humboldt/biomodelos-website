module GroupsUsersHelper
  # Renders a group's logo, or a placeholder when no logo is available.
  #
  # @param group [Group] the group whose logo should be rendered
  # @param version [Symbol, String] the uploader version to use
  # @param html_options [Hash] HTML attributes for the rendered element
  # @return [ActiveSupport::SafeBuffer] the rendered logo or placeholder markup
  def group_logo_tag(group, version:, html_options: {})
    uploader = group.logo
    url = uploader.url(version).to_s
    if url == uploader.default_url.to_s
      svg = inline_svg_tag('icons/nogrouplogo.svg', class: 'icon icon-group-placeholder', aria_hidden: true)
      wrapper_classes = ['icon-group-placeholder-bg', html_options[:class]].compact.join(' ')
      content_tag(:span, svg, class: wrapper_classes)
    else
      image_tag(url, html_options)
    end
  end
end
