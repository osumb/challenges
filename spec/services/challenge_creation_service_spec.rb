require 'rails_helper'

describe ChallengeCreationService do
  describe '.create_challenge' do
    let!(:performance) { create(:performance) }
    subject(:result) { described_class.create_challenge(challenger: challenger, performance: performance, spot: spot) }

    context 'Normal Challenge' do
      let!(:spot) { create(:spot, row: :a, file: 1) }
      let!(:challenger) { create(:user, :spot_a13, :trumpet, :solo) }
      let!(:challengee) { create(:user, :trumpet, :solo, current_spot: spot) }

      it 'creates a valid normal challenge', :aggregate_failures do
        expect { result }.to change { Challenge.count }.by(1)
        expect(result.success?).to be(true)
        expect(result.errors).to be_empty
      end
    end

    context 'Open Spot Challenge' do
      let!(:spot) { create(:spot, row: :a, file: 1) }
      let!(:challengee) { create(:user, :trumpet, :solo, current_spot: spot) }
      let!(:challenger) { create(:user, :spot_a13, :trumpet, :solo) }
      let!(:user_da) { create(:discipline_action, user: challengee, performance: performance) }

      context 'spot has not been challenged yet', :aggregate_failures do
        it 'creates a challenge' do
          expect { result }.to change { Challenge.count }.by(1)
          expect(result.success?).to be(true)
          expect(result.errors).to be_empty
        end
      end

      context 'spot has already been challenged' do
        let!(:first_challenger) { create(:user, :spot_x13, :trumpet, :solo) }
        let!(:challenger) { create(:user, :spot_a13, :trumpet, :solo) }
        let!(:challenge) do
          described_class.create_challenge(challenger: first_challenger, performance: performance, spot: spot)
          Challenge.last
        end

        it 'adds a second challenger to the challenge' do
          expect { result }.not_to change { Challenge.count } # rubocop:disable Lint/AmbiguousBlockAssociation

          challenge.reload
          expect(challenge.valid?).to be(true)
          expect(challenge.open_spot_challenge_type?).to be(true)
          expect(challenge.users.length).to eq(2)
        end
      end
    end

    context 'Tri Challenge' do
      let!(:spot) { create(:spot, row: :j, file: 1) }
      let!(:challengee) { create(:user, :percussion, :bass, current_spot: spot) }
      let!(:challenger) { create(:user, :spot_j13, :percussion, :bass) }
      let!(:other_challenger) { create(:user, :spot_j17, :percussion, :bass) }

      context 'with more than 3 performers of the same instrument' do
        let!(:extra_member) { create(:user, :spot_j2, :percussion, :bass) }

        it 'creates a valid tri challenge' do
          expect { result }.to change { Challenge.count }.by(1)

          challenge = Challenge.last

          expect(challenge.valid?).to be(true)
          expect(challenge.tri_challenge_type?).to be(true)
          expect(challenge.users).not_to include(extra_member)
        end
      end
    end
  end
end
