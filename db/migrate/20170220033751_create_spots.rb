class CreateSpots < ActiveRecord::Migration[5.0]
  def change
    create_table :spots do |t|
      t.column :row, :integer, null: false
      t.column :file, :integer, null: false
      t.timestamps
    end
  end
end
