class CreatePasswordChangeRequest < ActiveRecord::Migration[5.0]
  def change
    create_table :password_change_requests, id: :uuid do |t|
      t.boolean :used, default: false
      t.datetime :expires, null: false, default: -> { "now() + '1hr'"}
      t.belongs_to :user
      t.timestamps
    end
  end
end
