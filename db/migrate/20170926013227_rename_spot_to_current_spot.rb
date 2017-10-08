class RenameSpotToCurrentSpot < ActiveRecord::Migration[5.0]
  def change
    rename_column :users, :spot_id, :current_spot_id
  end
end
