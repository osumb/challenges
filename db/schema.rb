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

ActiveRecord::Schema.define(version: 20170504003831) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  create_table "challenges", force: :cascade do |t|
    t.integer  "challenge_type",             null: false
    t.integer  "stage",          default: 0
    t.integer  "spot_id"
    t.integer  "performance_id"
    t.string   "winner_buck_id"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.index ["performance_id"], name: "index_challenges_on_performance_id", using: :btree
    t.index ["spot_id"], name: "index_challenges_on_spot_id", using: :btree
  end

  create_table "discipline_actions", force: :cascade do |t|
    t.string   "reason",                               null: false
    t.boolean  "open_spot",            default: false, null: false
    t.boolean  "allowed_to_challenge", default: false, null: false
    t.integer  "performance_id"
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.string   "user_buck_id"
    t.index ["performance_id"], name: "index_discipline_actions_on_performance_id", using: :btree
  end

  create_table "password_reset_requests", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.boolean  "used",         default: false
    t.datetime "expires",      default: -> { "(now() + '01:00:00'::interval)" }, null: false
    t.datetime "created_at",                                                     null: false
    t.datetime "updated_at",                                                     null: false
    t.string   "user_buck_id"
  end

  create_table "performances", force: :cascade do |t|
    t.string   "name",         null: false
    t.datetime "date",         null: false
    t.datetime "window_open",  null: false
    t.datetime "window_close", null: false
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  create_table "spots", force: :cascade do |t|
    t.integer  "row",        null: false
    t.integer  "file",       null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_challenges", force: :cascade do |t|
    t.integer "challenge_id"
    t.integer "spot_id"
    t.string  "comments"
    t.string  "user_buck_id"
    t.index ["challenge_id"], name: "index_user_challenges_on_challenge_id", using: :btree
    t.index ["spot_id"], name: "index_user_challenges_on_spot_id", using: :btree
  end

  create_table "users", primary_key: "buck_id", id: :string, force: :cascade do |t|
    t.string   "first_name",                                null: false
    t.string   "last_name",                                 null: false
    t.string   "email",                                     null: false
    t.string   "password_digest",                           null: false
    t.integer  "instrument",                                null: false
    t.integer  "part",                                      null: false
    t.integer  "role",                                      null: false
    t.datetime "password_updated", default: -> { "now()" }, null: false
    t.integer  "spot_id"
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
    t.index ["buck_id"], name: "index_users_on_buck_id", using: :btree
    t.index ["email"], name: "index_users_on_email", using: :btree
    t.index ["spot_id"], name: "index_users_on_spot_id", using: :btree
  end

  add_foreign_key "discipline_actions", "users", column: "user_buck_id", primary_key: "buck_id"
  add_foreign_key "password_reset_requests", "users", column: "user_buck_id", primary_key: "buck_id"
  add_foreign_key "user_challenges", "users", column: "user_buck_id", primary_key: "buck_id"
end
