# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_04_14_233941) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "downloads", id: :serial, force: :cascade do |t|
    t.integer "user_id"
    t.string "model_id", null: false
    t.integer "species_id", null: false
    t.integer "model_use_id"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["model_id"], name: "index_downloads_on_model_id"
    t.index ["model_use_id"], name: "index_downloads_on_model_use_id"
    t.index ["user_id"], name: "index_downloads_on_user_id"
  end

  create_table "eco_variables", id: :serial, force: :cascade do |t|
    t.string "name", limit: 255, null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
  end

  create_table "eco_variables_species", id: :serial, force: :cascade do |t|
    t.integer "eco_variable_id"
    t.integer "user_id"
    t.integer "species_id"
    t.boolean "selected", default: true, null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["eco_variable_id"], name: "index_eco_variables_species_on_eco_variable_id"
    t.index ["user_id"], name: "index_eco_variables_species_on_user_id"
  end

  create_table "files_downloads", force: :cascade do |t|
    t.string "file", limit: 255
    t.string "path", limit: 255
    t.string "ip", limit: 255
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "group_states", id: :serial, force: :cascade do |t|
    t.string "name", limit: 100, null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
  end

  create_table "groups", id: :serial, force: :cascade do |t|
    t.string "name", limit: 100, null: false
    t.text "message"
    t.string "logo", limit: 255
    t.integer "group_state_id"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["group_state_id"], name: "index_groups_on_group_state_id"
  end

  create_table "groups_species", id: :serial, force: :cascade do |t|
    t.integer "species_id"
    t.integer "group_id"
    t.integer "groups_species_state_id"
    t.datetime "created_at", precision: nil, default: -> { "now()" }
    t.datetime "updated_at", precision: nil, default: -> { "now()" }
    t.index ["group_id"], name: "index_groups_species_on_group_id"
    t.index ["groups_species_state_id"], name: "index_groups_species_on_groups_species_state_id"
    t.index ["species_id"], name: "index_groups_species_on_species_id"
  end

  create_table "groups_species_states", id: :serial, force: :cascade do |t|
    t.string "name", limit: 100, null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
  end

  create_table "groups_users", id: :serial, force: :cascade do |t|
    t.integer "group_id"
    t.integer "user_id"
    t.integer "groups_users_state_id"
    t.boolean "is_admin", null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["group_id"], name: "index_groups_users_on_group_id"
    t.index ["groups_users_state_id"], name: "index_groups_users_on_groups_users_state_id"
    t.index ["user_id"], name: "index_groups_users_on_user_id"
  end

  create_table "groups_users_states", id: :serial, force: :cascade do |t|
    t.string "name", limit: 100, null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
  end

  create_table "model_uses", id: :serial, force: :cascade do |t|
    t.string "description", limit: 300, null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
  end

  create_table "publications", id: :serial, force: :cascade do |t|
    t.integer "user_id"
    t.string "cc_license", limit: 10, null: false
    t.string "records_vis", limit: 50, null: false
    t.string "sib_contact", limit: 2, null: false
    t.string "files", null: false
    t.boolean "atlas_agreement", null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["user_id"], name: "index_publications_on_user_id"
  end

  create_table "ratings", id: :serial, force: :cascade do |t|
    t.integer "user_id"
    t.string "model_id"
    t.integer "species_id"
    t.integer "score", default: 0
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["model_id"], name: "index_ratings_on_model_id"
    t.index ["species_id"], name: "index_ratings_on_species_id"
    t.index ["user_id"], name: "index_ratings_on_user_id"
  end

  create_table "species", id: false, force: :cascade do |t|
    t.integer "species_id"
    t.string "accepted_name", limit: 100
    t.string "species_synonym", limit: 100
  end

  create_table "task_states", id: :serial, force: :cascade do |t|
    t.string "name", limit: 100, null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
  end

  create_table "task_types", id: :serial, force: :cascade do |t|
    t.string "name", limit: 255, null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
  end

  create_table "tasks", id: :serial, force: :cascade do |t|
    t.integer "species_id"
    t.integer "user_id"
    t.integer "group_id"
    t.integer "task_type_id"
    t.integer "task_state_id"
    t.integer "created_by"
    t.integer "completed_by"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["group_id"], name: "index_tasks_on_group_id"
    t.index ["species_id"], name: "index_tasks_on_species_id"
    t.index ["task_state_id"], name: "index_tasks_on_task_state_id"
    t.index ["task_type_id"], name: "index_tasks_on_task_type_id"
    t.index ["user_id"], name: "index_tasks_on_user_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "name", limit: 100, null: false
    t.string "organization", limit: 100
    t.string "location", limit: 100
    t.string "expertise", limit: 200
    t.text "bio"
    t.string "avatarURL", limit: 255
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at", precision: nil
    t.datetime "remember_created_at", precision: nil
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at", precision: nil
    t.datetime "last_sign_in_at", precision: nil
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at", precision: nil
    t.datetime "confirmation_sent_at", precision: nil
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["name"], name: "index_users_on_name"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "users_layers", id: :serial, force: :cascade do |t|
    t.integer "user_id"
    t.integer "species_id"
    t.string "threshold", null: false
    t.boolean "newModel", default: false
    t.boolean "final", default: false
    t.text "geoJSON", null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["species_id"], name: "index_users_layers_on_species_id"
    t.index ["user_id"], name: "index_users_layers_on_user_id"
  end

  add_foreign_key "downloads", "model_uses", on_update: :restrict, on_delete: :restrict
  add_foreign_key "downloads", "users", on_update: :restrict, on_delete: :restrict
  add_foreign_key "eco_variables_species", "eco_variables", on_update: :restrict, on_delete: :restrict
  add_foreign_key "eco_variables_species", "users", on_update: :restrict, on_delete: :restrict
  add_foreign_key "groups", "group_states", on_update: :restrict, on_delete: :restrict
  add_foreign_key "groups_species", "groups", on_update: :restrict, on_delete: :restrict
  add_foreign_key "groups_species", "groups_species_states", on_update: :restrict, on_delete: :restrict
  add_foreign_key "groups_users", "groups", on_update: :restrict, on_delete: :restrict
  add_foreign_key "groups_users", "groups_users_states", on_update: :restrict, on_delete: :restrict
  add_foreign_key "groups_users", "users", on_update: :restrict, on_delete: :restrict
  add_foreign_key "publications", "users", on_update: :restrict, on_delete: :restrict
  add_foreign_key "ratings", "users", on_update: :restrict, on_delete: :restrict
  add_foreign_key "tasks", "groups", on_update: :restrict, on_delete: :restrict
  add_foreign_key "tasks", "task_states", on_update: :restrict, on_delete: :restrict
  add_foreign_key "tasks", "task_types", on_update: :restrict, on_delete: :restrict
  add_foreign_key "tasks", "users", on_update: :restrict, on_delete: :restrict
  add_foreign_key "users_layers", "users", on_update: :restrict, on_delete: :restrict
end
