class AddDownloadInfo < ActiveRecord::Migration
  def change
  	create_table :model_uses do |t|
		t.string :description, null: false, limit: 300
    	t.timestamps
    end

    create_table :downloads do |t|
    	t.references :user, null: false
    	t.string :model_id, null: false, index: true
    	t.integer :species_id, null: false
    	t.references :model_use, null: false
    	t.timestamps
    end
  end
end
