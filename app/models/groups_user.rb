class GroupsUser < ApplicationRecord
	belongs_to :user
  	belongs_to :group

  	def user_name
  		self.user.name
  	end
end
