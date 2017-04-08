class GroupMailer < ApplicationMailer

	# Sends the user a notification when he's accepted in the group
	def user_accepted(user_mail, group)
	    @group = group
	    mail to: user_mail,  subject: "Ha sido aceptado en el grupo " + group.name
	end

  	# Mails a message to every active group member
  	def bulk_email_group (message, group_emails, group_name, admin_name)
	    @message = message
	    @group_name = group_name
	    @datetime = DateTime.now
	    @admin_name = admin_name
	    mail bcc: group_emails,  subject: "Mensaje del moderador del grupo " + group_name
  	end
end
