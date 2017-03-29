require 'test_helper'

class UserChallengeTest < ActiveSupport::TestCase
  test 'UserChallenge.can_user_remove_self_from_challenge? normal challenge' do
    performance = create(:performance)
    user = create(:user, :trumpet, :solo, :spot_a2)
    challenger = create(:alternate_user, :trumpet, :solo, :spot_a13)
    challenge = build(:normal_challenge, spot: user.spot, performance: performance)
    challenge.users << [user, challenger]
    assert UserChallenge.can_user_remove_self_from_challenge? challenger, challenge, challenge.user_challenges[1]
    refute UserChallenge.can_user_remove_self_from_challenge? user, challenge, challenge.user_challenges[0]
  end
end
