class ChangeChallengeWinnerId < ActiveRecord::Migration[5.0]
  def change
    rename_column :challenges, :winner_id, :winner_buck_id
    change_column :challenges, :winner_buck_id, :string
  end
end
