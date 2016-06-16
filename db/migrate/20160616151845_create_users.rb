class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
    	t.string :name, limit: 100, null: false
    	t.string :organization, limit: 100
    	t.string :location, limit: 100
    	t.string :expertise, limit: 200
    	t.text :bio, limit: 600
    	t.string :avatarURL, limit: 255
    	t.timestamps
    end

    add_index "users", ["name"], :name => "index_users_on_name"
  end
end
