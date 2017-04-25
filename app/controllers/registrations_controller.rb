class RegistrationsController < Devise::RegistrationsController

  protected

    def after_update_path_for(resource)
    	current_user
	end
end