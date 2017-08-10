class ContactMessage
	include ActiveModel::Validations
	validates_presence_of :name, :email, :content
 
  	attr_accessor :name, :email, :subject, :content
  	
  	def initialize(attributes)
    	@name, @email, @subject, @content = attributes[:name], attributes[:email], attributes[:subject], attributes[:content]
  	end
end