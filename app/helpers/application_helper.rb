module ApplicationHelper
  def user_avatar_tag(user, version:, html_options: {})
    uploader = user.avatarURL
    url = uploader.url(version).to_s
    if url == uploader.default_url.to_s
      classes = ["icon", "icon-avatar-placeholder", html_options[:class]].compact.join(" ")
      inline_svg_tag("icons/noperfil.svg", html_options.merge(class: classes, aria_hidden: true))
    else
      image_tag(url, html_options)
    end
  end

  def group_logo_tag(group, version:, html_options: {})
    uploader = group.logo
    url = uploader.url(version).to_s
    if url == uploader.default_url.to_s
      svg = inline_svg_tag("icons/nogrouplogo.svg", class: "icon icon-group-placeholder", aria_hidden: true)
      wrapper_classes = ["icon-group-placeholder-bg", html_options[:class]].compact.join(" ")
      content_tag(:span, svg, class: wrapper_classes)
    else
      image_tag(url, html_options)
    end
  end
end
