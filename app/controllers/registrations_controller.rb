class RegistrationsController < Devise::RegistrationsController
  prepend_before_action :check_captcha, only: [:create]

  private
    def check_captcha
      success = verify_recaptcha(action: 'user_registration', minimum_score: 0.8, secret_key: Rails.application.secrets.reCaptcha_secret)
      checkbox_success = verify_recaptcha unless success  
      if success || checkbox_success
        self.resource = resource_class.new sign_up_params
        respond_with_navigational(resource) { render :new }
      end 
    end
    
  protected

    def after_update_path_for(resource)
    	current_user
	end
end