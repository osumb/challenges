class ChangePasswordChangeRequestToPasswordResetRequest < ActiveRecord::Migration[5.0]
  def change
    rename_table :password_change_requests, :password_reset_requests
  end
end
