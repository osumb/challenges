class AddOriginalSpotToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :original_spot_id, :integer, index: true
    add_foreign_key :users, :spots, column: :original_spot_id
  end
end
