class CreatePasswordResetRequests < ActiveRecord::Migration[5.0]
  def change
    create_table :password_reset_requests, id: :uuid do |t|
      t.boolean :used, default: false
      t.datetime :expires, null: false, default: -> { "now() + '1hr'"}
      t.timestamps
    end

    add_column :password_reset_requests, :user_buck_id, :string
    add_foreign_key :password_reset_requests, :users, column: :user_buck_id, primary_key: 'buck_id'
  end
end
