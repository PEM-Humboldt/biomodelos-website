class HomeController < ApplicationController
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
	      redirect_to home_publish_path, notice: 'La publicación se ha realizado con éxito.'
	    else
	      render 'publish'
	    end
  	end

	def contact_us
	end

	def send_contact_form
		@contact_message = ContactMessage.new(message_params)
		if @contact_message.valid?
			AdministratorsMailer.contact_us(@contact_message).deliver_now
			redirect_to root_path, notice: 'Su mensaje ha sido enviado con éxito.'
		else
			errores = "Debe completar los siguientes campos: "
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

	def api
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
