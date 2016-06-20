class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :configure_permitted_parameters, if: :devise_controller?
  
  protected

	 def configure_permitted_parameters
	   devise_parameter_sanitizer.for(:sign_up) << :name << :group_id << :requested_group_name
	   devise_parameter_sanitizer.for(:account_update) { |u| u.permit(:name, :location, :organization, :bio, :interestGroups, :password, :password_confirmation, :current_password, :group_id, :requested_group_name, :periodicity_id, :last_email_send, :avatarUrl, :periodicity_id) }
	 end
end
