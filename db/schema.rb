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

ActiveRecord::Schema.define(version: 20170220035938) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

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

  create_table "users", force: :cascade do |t|
    t.string   "first_name",                                null: false
    t.string   "last_name",                                 null: false
    t.string   "email",                                     null: false
    t.string   "password_digest",                           null: false
    t.string   "buck_id",                                   null: false
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

end
