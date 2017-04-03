class AddUserLayersAndEcoVars < ActiveRecord::Migration
  	def change
		create_table :eco_variables do |t|
			t.string :name, limit: 255, null: false
			t.timestamps
		end

		create_table :eco_variables_species do |t|
			t.belongs_to :eco_variable
			t.belongs_to :user
			t.integer :species_id
			t.boolean :selected, default: true, null: false
			t.timestamps
		end

		create_table :users_layers do |t|
			t.belongs_to :user
			t.integer :species_id, index: true
			t.string  :threshold, null: false
			t.boolean :newModel, default: false
			t.boolean :final, default: false 
			t.text :geoJSON, null: false
			t.timestamps
		end 
	end
end
