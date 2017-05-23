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
	      # AdministratorsMailer.model_uploaded(current_user, @publication).deliver_now
	      redirect_to home_publish_path, notice: 'La publicación se ha realizado con éxito.'
	    else
	      puts @publication.errors.inspect
	      render 'publish'
	    end
  	end

	def contact_us
	end

	def api
	end

	def terms
	end

	private

	    def message_params
	      params.require(:message).permit(:name, :email, :subject, :content)
	    end

	    def upload_params
	      params.require(:publication).permit(:cc_license, :records_vis, :sib_contact, :files, :atlas_agreement, :terminos).merge(user_id: current_user.id)
	    end
end
