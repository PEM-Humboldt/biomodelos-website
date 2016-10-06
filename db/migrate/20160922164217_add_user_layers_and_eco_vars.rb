class AddUserLayersAndEcoVars < ActiveRecord::Migration
  	def change
		create_table :eco_variables do |t|
			t.string :name, limit: 150, null: false
			t.timestamps
		end

		create_table :eco_variables_species do |t|
			t.belongs_to :eco_variable, index: true
			t.belongs_to :user, index: true
			t.integer :species_id, index: true
			t.timestamps
		end

		create_table :users_layers do |t|
			t.belongs_to :user, index: true
			t.integer :species_id, index: true
			t.string  :threshold
			t.boolean :newModel, default: false
			t.boolean :final, default: false 
			t.text :geoJSON, null: false
			t.timestamps
		end 
	end
end
