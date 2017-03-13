class AddTasks < ActiveRecord::Migration
  def change
  		create_table :task_types do |t|
			t.string :name, limit: 255, null: false
			t.timestamps
		end

		create_table :task_states do |t|
			t.string :name, limit: 100, null: false
			t.timestamps
		end

		create_table :tasks do |t|
			t.integer :species_id, index: true
			t.belongs_to :user
			t.belongs_to :group
			t.belongs_to :task_type
			t.integer :created_by
			t.integer :completed_by
			t.belongs_to :task_state, null: false
			t.timestamps
		end
  end
end
