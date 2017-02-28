class AddChallenges < ActiveRecord::Migration[5.0]
  def change
    create_table :challenges do |t|
      t.column :challenge_type, :integer, null: false
      t.column :stage, :integer, default: 0
      t.belongs_to :spot
      t.belongs_to :performance
      t.column :winner_id, :integer, foreign_key: true
      t.timestamps
    end

    create_table :user_challenges do |t|
      t.belongs_to :user, index: true
      t.belongs_to :challenge, index: true
      t.belongs_to :spot, index: true
      t.string :comments
    end
  end
end
