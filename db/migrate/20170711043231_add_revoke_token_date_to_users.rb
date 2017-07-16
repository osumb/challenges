class AddRevokeTokenDateToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :revoke_token_date, :datetime
  end
end
