# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170523193938) do

  create_table "downloads", force: :cascade do |t|
    t.integer  "user_id",      null: false
    t.string   "model_id",     null: false
    t.integer  "species_id",   null: false
    t.integer  "model_use_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "downloads", ["model_id"], name: "index_downloads_on_model_id"

  create_table "eco_variables", force: :cascade do |t|
    t.string   "name",       limit: 255, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "eco_variables_species", force: :cascade do |t|
    t.integer  "eco_variable_id"
    t.integer  "user_id"
    t.integer  "species_id"
    t.boolean  "selected",        default: true, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "group_states", force: :cascade do |t|
    t.string   "name",       limit: 100, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groups", force: :cascade do |t|
    t.string   "name",           limit: 100, null: false
    t.text     "message",        limit: 500
    t.string   "logo",           limit: 255
    t.integer  "group_state_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groups_species", force: :cascade do |t|
    t.integer  "species_id"
    t.integer  "group_id"
    t.integer  "groups_species_state_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "groups_species", ["species_id"], name: "index_groups_species_on_species_id"

  create_table "groups_species_states", force: :cascade do |t|
    t.string   "name",       limit: 100, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groups_users", force: :cascade do |t|
    t.integer  "group_id"
    t.integer  "user_id"
    t.integer  "groups_users_state_id"
    t.boolean  "is_admin",              null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groups_users_states", force: :cascade do |t|
    t.string   "name",       limit: 100, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "model_uses", force: :cascade do |t|
    t.string   "description", limit: 300, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "publications", force: :cascade do |t|
    t.integer  "user_id",                    null: false
    t.string   "cc_license",      limit: 10, null: false
    t.string   "records_vis",     limit: 50, null: false
    t.string   "sib_contact",     limit: 2,  null: false
    t.string   "files",                      null: false
    t.boolean  "atlas_agreement",            null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "ratings", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "model_id"
    t.integer  "species_id"
    t.integer  "score",      default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "task_states", force: :cascade do |t|
    t.string   "name",       limit: 100, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "task_types", force: :cascade do |t|
    t.string   "name",       limit: 255, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tasks", force: :cascade do |t|
    t.integer  "species_id"
    t.integer  "user_id"
    t.integer  "group_id"
    t.integer  "task_type_id"
    t.integer  "created_by"
    t.integer  "completed_by"
    t.integer  "task_state_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tasks", ["species_id"], name: "index_tasks_on_species_id"

  create_table "users", force: :cascade do |t|
    t.string   "name",                   limit: 100,              null: false
    t.string   "organization",           limit: 100
    t.string   "location",               limit: 100
    t.string   "expertise",              limit: 200
    t.text     "bio",                    limit: 600
    t.string   "avatarURL",              limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "email",                              default: "", null: false
    t.string   "encrypted_password",                 default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                      default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["name"], name: "index_users_on_name"
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

  create_table "users_layers", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "species_id"
    t.string   "threshold",                  null: false
    t.boolean  "newModel",   default: false
    t.boolean  "final",      default: false
    t.text     "geoJSON",                    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users_layers", ["species_id"], name: "index_users_layers_on_species_id"

end
