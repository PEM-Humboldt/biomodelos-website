class CreateSpecies < ActiveRecord::Migration
  def change
    create_table :species do |t|
        t.string :sci_name
        t.timestamps
    end

    add_index :species, :sci_name, :unique => true
  end
end
