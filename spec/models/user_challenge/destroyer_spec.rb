require 'rails_helper'

describe UserChallenge::Destroyer, type: :model do
  subject(:destroyer) { UserChallenge::Destroyer.new(id: user_challenge.id) }

  describe '#destroy' do
    context 'on a user_challenge that is part of an open spot challenge' do
      let!(:challenge) { create(:full_open_spot_challenge) }
      let(:user_challenge) { challenge.user_challenges.first }

      context 'when there is only one user_challenge' do
        let!(:challenge) { create(:open_spot_challenge) }

        it 'destroys the user challenge and the challenge' do
          challenge_count = Challenge.count
          user_challenge_count = UserChallenge.count

          destroyer.destroy

          expect(Challenge.count).to eq(challenge_count - 1)
          expect(UserChallenge.count).to eq(user_challenge_count - 1)
        end

        it 'returns a success' do
          expect(destroyer.destroy.success?).to be(true)
        end
      end

      context 'when there is more than one user_challenge' do
        it 'destroys only the user challenge' do
          challenge_count = Challenge.count
          user_challenge_count = UserChallenge.count

          destroyer.destroy

          expect(Challenge.count).to eq(challenge_count)
          expect(UserChallenge.count).to eq(user_challenge_count - 1)
        end

        it 'returns a success' do
          expect(destroyer.destroy.success?).to be(true)
        end
      end

      context 'and it is not able to destroy' do
        before do
          allow_any_instance_of(UserChallenge).to receive(:destroy).and_raise(StandardError)
          allow_any_instance_of(UserChallenge).to receive(:errors).and_return(['uh oh'])
        end

        it 'does not destroy the user challenge or challenge' do
          challenge_count = Challenge.count
          user_challenge_count = UserChallenge.count

          destroyer.destroy

          expect(Challenge.count).to eq(challenge_count)
          expect(UserChallenge.count).to eq(user_challenge_count)
        end

        it 'returns a failure' do
          expect(destroyer.destroy.failure?).to be(true)
        end
      end
    end

    context 'on a user_challenge that is not part of an open spot challenge' do
      let!(:challenge) { create(:open_spot_challenge) }
      let(:user_challenge) { challenge.user_challenges.first }

      context 'and it is able to destroy' do
        it 'destroys the challenge and user_challenges' do
          challenge_count = Challenge.count
          user_challenge_count = UserChallenge.count
          user_challenges_in_challenge = challenge.user_challenges.count

          destroyer.destroy

          expect(Challenge.count).to eq(challenge_count - 1)
          expect(UserChallenge.count).to eq(user_challenge_count - user_challenges_in_challenge)
        end

        it 'returns a success' do
          expect(destroyer.destroy.success?).to be(true)
        end
      end

      context 'and it is not able to destroy' do
        before do
          allow_any_instance_of(UserChallenge).to receive(:destroy).and_raise(StandardError)
          allow_any_instance_of(UserChallenge).to receive(:errors).and_return(['uh oh'])
        end

        it 'does not destroy the user challenge or challenge' do
          challenge_count = Challenge.count
          user_challenge_count = UserChallenge.count

          destroyer.destroy

          expect(Challenge.count).to eq(challenge_count)
          expect(UserChallenge.count).to eq(user_challenge_count)
        end

        it 'returns a failure' do
          expect(destroyer.destroy.failure?).to be(true)
        end
      end
    end
  end
end
