class RegistrationsController < Devise::RegistrationsController
  prepend_before_action :check_captcha, only: [:create]

  private
    def check_captcha
      recaptcha_valid = verify_recaptcha(action: 'registration')
      if recaptcha_valid
        self.resource = resource_class.new sign_up_params
        respond_with_navigational(resource) { render :new }
      end 
    end
    
  protected

    def after_update_path_for(resource)
    	current_user
	end
end