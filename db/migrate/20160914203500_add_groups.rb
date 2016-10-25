class AddGroups < ActiveRecord::Migration
	def change
		create_table :group_states do |t|
			t.string :name, limit: 100, null: false
			t.timestamps
		end

		create_table :groups do |t|
			t.string :name, limit: 100, null: false
			t.text :message, limit: 500
			t.string :logo, limit: 255
			t.belongs_to :group_state, index: true
			t.timestamps
		end

		create_table :groups_users_states do |t|
			t.string :name, limit: 100, null: false
			t.timestamps
		end 

		create_table :groups_users do |t|
			t.belongs_to :group, index: true
			t.belongs_to :user, index: true
			t.belongs_to :groups_users_state, index: true
			t.boolean :is_admin, null: false
			t.timestamps
		end

		create_table :species_groups do |t|
			t.integer :species_id, index: true
			t.belongs_to :group, index: true
			t.timestamps
		end
	end
end
