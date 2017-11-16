class RemoveDoneNeedsApprovalChallengeStage < ActiveRecord::Migration[5.0]
  def change
    Challenge.where(stage: :needs_approval).all do |challenge|
      challenge.update(stage: :done)
    end
  end
end
