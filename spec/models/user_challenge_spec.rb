require 'rails_helper'

describe UserChallenge, type: :model do
  let(:performance) { create(:performance) }
  let(:challengee) { create(:user, :trumpet, :solo, :spot_a2) }
  let(:challenger) { create(:alternate_user, :trumpet, :solo, :spot_a13) }

  describe '.can_user_remove_self_from_challenge?' do
    context 'when the challenge is normal' do
      let(:challenge) { build(:normal_challenge, spot: challengee.spot, performance: performance) }

      before do
        challenge.users = [challengee, challenger]
      end

      it 'lets the challenger leave the challenge' do
        expect(
          described_class.can_user_remove_self_from_challenge?(challenger, challenge, challenge.user_challenges[1])
        ).to be(true)
      end

      it 'does not let the challengee leave the challenge' do
        expect(
          described_class.can_user_remove_self_from_challenge?(challengee, challenge, challenge.user_challenges[0])
        ).to be(false)
      end
    end
  end
end
