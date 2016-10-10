class AddRatings < ActiveRecord::Migration
  def change
  	create_table :ratings do |t|
      t.references :user
      t.integer :model_id
      t.integer :species_id
      t.integer :score, :default => 0
      t.timestamps
    end
  end
end
