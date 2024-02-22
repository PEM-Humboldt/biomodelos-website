class HomeController < ApplicationController

	before_action :authenticate_user!, :except => [:show, :about_us, :contact_us, :send_contact_form, :terms, :api]

	def show
	end

	def about_us
	end

	def publish
		@publication = Publication.new
	end

	def upload_model
		@publication = Publication.new(upload_params)

	    if @publication.save
	      AdministratorsMailer.model_uploaded(current_user, @publication).deliver_now
	      redirect_to home_publish_path, notice: I18n.t('biomodelos.publish.success_notice')
	    else
	      render 'publish'
	    end
  	end

	def contact_us
	end

	def send_contact_form
		@contact_message = ContactMessage.new(message_params)
		recaptcha_valid = verify_recaptcha(action: 'contact_us')
  		if @contact_message.valid? && recaptcha_valid
			AdministratorsMailer.contact_us(@contact_message).deliver_now
			redirect_to root_path, notice: I18n.t('biomodelos.contact.success_notice')
		else
			if !recaptcha_valid
				redirect_to home_contact_us_path
			elsif !@contact_message.valid?
			 	errores = I18n.t('biomodelos.contact.fields_error')
				if !@contact_message.errors.messages[:name].blank?
					errores << "Nombre "
				end
				if !@contact_message.errors.messages[:email].blank?
					errores << "E-mail "
				end
				if !@contact_message.errors.messages[:content].blank?
					errores << "Mensaje "
				end

				redirect_to home_contact_us_path, :flash => { :error => errores }
			end
		end
	end

	def terms
	end

	private

	    def message_params
	      params.require(:contact_message).permit(:name, :email, :subject, :content)
	    end

	    def upload_params
	      params.require(:publication).permit(:cc_license, :records_vis, :sib_contact, :files, :atlas_agreement, :terminos).merge(user_id: current_user.id)
	    end
end
