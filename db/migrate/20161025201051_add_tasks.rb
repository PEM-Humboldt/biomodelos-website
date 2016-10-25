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
			t.belongs_to :user, index: true
			t.belongs_to :group, index: true
			t.belongs_to :task_type, index: true
			t.integer :created_by, index: true
			t.integer :completed_by, index: true
			t.belongs_to :task_state, index: true, null: false
			t.timestamps
		end
  end
end
