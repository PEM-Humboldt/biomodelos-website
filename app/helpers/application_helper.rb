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
end
