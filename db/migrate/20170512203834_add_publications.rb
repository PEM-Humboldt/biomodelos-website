class AddPublications < ActiveRecord::Migration
  def change
    create_table :publications do |t|
    	t.references :user, null: false
    	t.string :cc_license, null: false, limit: 10
    	t.string :records_vis, null: false, limit: 50
    	t.string :sib_contact, null: false, limit: 2
    	t.string :files, null: false
    	t.boolean :atlas_agreement, null: false
    	t.timestamps
    end
  end
end
