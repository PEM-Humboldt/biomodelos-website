class SuggestedGroup
	include ActiveModel::Validations
	validates_presence_of :name, :moderator, :content
 
  	attr_accessor :name, :moderator, :content
  	
  	def initialize(attributes)
    	@name, @moderator, @content = attributes[:name], attributes[:moderator], attributes[:content]
  	end
end
