class CreateDisciplines < ActiveRecord::Migration[5.0]
  def change
    create_table :disciplines do |t|
      t.string :reason, null: false
      t.boolean :open_spot, default: false, null: false
      t.boolean :allowed_to_challenge, default: false, null: false
      t.belongs_to :performance
      t.belongs_to :user, index: true
      t.timestamps
    end
  end
end
