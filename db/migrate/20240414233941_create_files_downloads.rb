class CreateFilesDownloads < ActiveRecord::Migration[6.1]
  def change
    create_table :files_downloads do |t|
      t.string :file, limit: 255
      t.string :path, limit: 255
      t.string :ip, limit: 255

      t.timestamps
    end
  end
end
