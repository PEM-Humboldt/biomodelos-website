class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #protect_from_forgery with: :exception

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_locale

  def set_locale
    I18n.locale = params[:locale] || session[:locale] || I18n.default_locale
    session[:locale] = I18n.locale
  end

  def default_url_options(options = {})
    { locale: I18n.locale }
  end

  protected

	 def configure_permitted_parameters
	   devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :terms_of_service, :data_policy])
	   devise_parameter_sanitizer.permit(:account_update, keys: [:email, :name, :location, :organization, :bio, :expertise, :password, :password_confirmation, :current_password, :avatarURL])
	 end
end
