class UsersLayer < ActiveRecord::Base
	belongs_to :species
	belongs_to :user
end