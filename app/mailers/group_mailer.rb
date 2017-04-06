class GroupMailer < ApplicationMailer
  	# Mail to every active group member
  	def bulk_email_group (message, group_emails, group_name, admin_name)
	    @message = message
	    @group_name = group_name
	    @datetime = DateTime.now
	    @admin_name = admin_name
	    mail bcc: group_emails,  subject: "Mensaje del moderador del grupo " + group_name
  	end
end
