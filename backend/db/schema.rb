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

ActiveRecord::Schema.define(version: 20160505103857) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "properties", force: :cascade do |t|
    t.string   "title"
    t.text     "description"
    t.string   "latitude"
    t.string   "longitude"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "property_images", force: :cascade do |t|
    t.text     "image"
    t.text     "description"
    t.integer  "property_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "property_images", ["property_id"], name: "index_property_images_on_property_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.boolean  "admin",           default: false
    t.string   "password_digest"
    t.string   "remember_digest"
    t.string   "access_token"
    t.string   "reset_digest"
    t.datetime "reset_sent_at"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
  end

  add_index "users", ["access_token"], name: "index_users_on_access_token", using: :btree
  add_index "users", ["email"], name: "index_users_on_email", using: :btree

  add_foreign_key "property_images", "properties"
end
