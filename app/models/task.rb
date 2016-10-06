class Task < ActiveRecord::Base
	belongs_to :species
	belongs_to :user
  	belongs_to :group
end