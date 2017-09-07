class AddUniquePerformanceAndSpotForChallenge < ActiveRecord::Migration[5.0]
  def up
    add_index :challenges, [:performance_id, :spot_id], unique: true, name: 'index_challenges_on_performance_and_spot'
  end

  def down
    remove_index :challenges, 'index_challenges_on_performance_and_spot'
  end
end
