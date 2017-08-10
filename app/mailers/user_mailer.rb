class UserMailer < ApplicationMailer
	# Sets an email with a message to a user.
	def message_to_user(user, sender, message)
		@user = user
		@sender = sender
		@message = message
		@datetime = DateTime.now
		mail to: @user.email,  subject: "BioModelos: Ha recibido un mensaje de " + sender.name
	end
end
