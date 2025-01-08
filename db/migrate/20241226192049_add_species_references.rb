class AddSpeciesReferences < ActiveRecord::Migration[6.1]
  def change
    #add_reference :groups_species, :species, foreign_key: true
    add_foreign_key :groups_species, :species, column: :species_id, primary_key: :species_id
    add_foreign_key :downloads, :species, column: :species_id, primary_key: :species_id
    add_foreign_key :eco_variables_species, :species, column: :species_id, primary_key: :species_id
    add_foreign_key :ratings, :species, column: :species_id, primary_key: :species_id
    add_foreign_key :tasks, :species, column: :species_id, primary_key: :species_id
    add_foreign_key :users_layers, :species, column: :species_id, primary_key: :species_id
  end
end


