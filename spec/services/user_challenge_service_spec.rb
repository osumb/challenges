require 'rails_helper'

RSpec.describe UserChallengeService do
  describe '.update' do
    let(:challenge) { create(:normal_challenge) }
    let(:user_challenges) { challenge.user_challenges }
    let(:user_challenge_hashes) do
      [
        {
          'comments' => 'Comments for the first user_challenge',
          'place' => UserChallenge.places['first'].to_s,
          'id' => user_challenges.first.id
        },
        {
          'comments' => 'Comments for the second user_challenge',
          'place' => UserChallenge.places['second'].to_s,
          'id' => user_challenges.second.id
        }
      ]
    end

    it 'updates the user challenges', :aggregate_failures do
      described_class.update(user_challenge_hashes: user_challenge_hashes)

      user_challenges.each(&:reload)

      expect(user_challenges.first.comments).to eq('Comments for the first user_challenge')
      expect(user_challenges.second.comments).to eq('Comments for the second user_challenge')
    end
  end
end
