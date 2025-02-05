class CreateSpecies < ActiveRecord::Migration[6.1]
  def change
    create_table :species, id: false do |t|
      t.integer :species_id, null: false, primary_key: true
      t.string :accepted_name, null: false, limit: 100
      t.string :species_synonym, null: false, limit: 100
    end
  end
end
