class UsersLayer < ApplicationRecord
	belongs_to :user
  def species_name
    Species.find_name(species_id)
  end
end