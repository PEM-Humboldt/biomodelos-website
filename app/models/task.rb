class Task < ActiveRecord::Base
	belongs_to :species
	belongs_to :user
  	belongs_to :group
  	belongs_to :tasks_created, class_name: "User"
	belongs_to :tasks_completed , class_name: "User"
end