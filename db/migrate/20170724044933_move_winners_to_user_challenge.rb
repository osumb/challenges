class MoveWinnersToUserChallenge < ActiveRecord::Migration[5.0]
  def up
    add_column :user_challenges, :place, :integer
    remove_column :challenges, :winner_buck_id
  end

  def down
    remove_column :user_challenges, :place
    add_column :challenges, :winner_buck_id, :string
    add_foreign_key :challenges, :users, column: :winner_buck_id, primary_key: 'buck_id'
  end
end
