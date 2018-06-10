require 'rails_helper'

describe AdminChallengeService do
  describe '.find_options_for_user' do
    let!(:performance) { create(:performance, window_close: 2.days.from_now) }
    let!(:users_who_can_challenge) do
      [
        create(:alternate_user, :trumpet, :spot_a13),
        create(:alternate_user, :trombone, :spot_f14),
        create(:alternate_user, :mellophone, :spot_r13)
      ]
    end
    let!(:users_who_cannot_challenge) do
      [
        create(:alternate_user, :trumpet, :spot_a14),
        create(:alternate_user, :trombone, :spot_f13),
        create(:alternate_user, :mellophone, :spot_r14)
      ]
    end
    let!(:challengeable_users) do
      [
        create(:user, :trumpet, :spot_a2),
        create(:user, :trumpet, :spot_a3)
      ]
    end

    before(:each) do
      users_who_cannot_challenge.each do |user|
        create(
          :discipline_action,
          performance: performance,
          user: user,
          allowed_to_challenge: false
        )
      end
    end

    context 'when there is no upcoming performance' do
      let!(:performance) { create(:stale_performance) }

      it 'returns no users who can challenge' do
        result = described_class.find_options_for_user

        expect(result.users_who_can_challenge).to be_empty
      end

      it 'returns no challenge options' do
        result = described_class.find_options_for_user

        expect(result.challenge_options).to be_empty
      end

      it 'returns a nil for the next performance' do
        result = described_class.find_options_for_user

        expect(result.next_performance).to be_nil
      end
    end

    context 'when not passed a user' do
      it 'doesn\'t return challenge options' do
        result = described_class.find_options_for_user

        expect(result.challenge_options).to be_empty
      end
    end

    it 'returns users who can challenge' do
      result = described_class.find_options_for_user

      expect(result.users_who_can_challenge).to eq(users_who_can_challenge)
    end

    it 'returns challenge options for the user passed in' do
      result = described_class.find_options_for_user(user_buck_id: users_who_can_challenge.first.buck_id)

      expect(result.challenge_options.length).to eq(challengeable_users.length)
    end
  end
end
