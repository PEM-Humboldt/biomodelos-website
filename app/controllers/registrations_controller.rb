class RegistrationsController < Devise::RegistrationsController
  prepend_before_action :check_captcha, only: [:create]

  private
    def check_captcha
      recaptcha_v3_valid = verify_recaptcha(action: 'registration', minimum_score: 0.8, secret_key: Rails.application.credentials.dig(:recaptcha, :RECAPTCHA_SECRET_KEY_V3))
      recaptcha_v2_valid = verify_recaptcha unless recaptcha_v3_valid
      if !(recaptcha_v3_valid || recaptcha_v2_valid)
    	  if !recaptcha_v3_valid
    		  @show_checkbox_recaptcha = true
    	  end
    	  self.resource = resource_class.new sign_up_params
    	  respond_with_navigational(resource) { render :new }
      end
    end
    
  protected
    def after_update_path_for(resource)
      current_user
    end
end