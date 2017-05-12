class CreateDisciplineActions < ActiveRecord::Migration[5.0]
  def change
    create_table :discipline_actions do |t|
      t.string :reason, null: false
      t.boolean :open_spot, default: false, null: false
      t.boolean :allowed_to_challenge, default: false, null: false
      t.belongs_to :performance
      t.timestamps
    end

    add_column :discipline_actions, :user_buck_id, :string
    add_foreign_key :discipline_actions, :users, column: :user_buck_id, primary_key: 'buck_id'
  end
end
