class AddUniqueRowFileForSpot < ActiveRecord::Migration[5.0]
  def up
    add_index :spots, [:row, :file], unique: true, name: 'index_spots_on_row_and_file'
  end

  def down
    remove_index :spots, 'index_spots_on_row_and_file'
  end
end
