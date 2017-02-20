class CreatePerformances < ActiveRecord::Migration[5.0]
  def change
    create_table :performances do |t|
      t.string :name, null: false
      t.datetime :date, null: false, unique: true
      t.datetime :window_open, null: false, unique: true
      t.datetime :window_close, null: false, unique: true
      t.timestamps
    end
  end
end
